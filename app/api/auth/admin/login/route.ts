import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, getSettingByKey } from '@/lib/db';
import { verifyPassword, generateVerificationCode } from '@/lib/auth/password';
import { sendVerificationCode } from '@/lib/telegram/send-code';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Необходимо указать email и пароль' },
        { status: 400 }
      );
    }

    // Получаем пользователя из БД
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Проверяем, что пользователь - админ
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    // Проверяем пароль
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      );
    }

    // Получаем Telegram ID админа из settings
    const adminTelegramSetting = await getSettingByKey('ADMIN_TELEGRAM_USER_ID');
    
    if (!adminTelegramSetting) {
      return NextResponse.json(
        { error: 'Настройки Telegram не найдены' },
        { status: 500 }
      );
    }

    // Получаем токен бота
    const botTokenSetting = await getSettingByKey('ADMIN_TELEGRAM_BOT_TOKEN');
    
    if (!botTokenSetting) {
      return NextResponse.json(
        { error: 'Токен бота не найден' },
        { status: 500 }
      );
    }

    // Генерируем 6-значный код
    const code = generateVerificationCode();
    
    // Сохраняем код в сессии с временной меткой
    const session = await getSession();
    session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    session.isEmailVerified = true;
    session.is2FAVerified = false;
    session.isAuthenticated = false;
    
    // Сохраняем код и время истечения во временном хранилище
    // В продакшене можно использовать Redis или базу данных
    (session as any).verificationCode = code;
    (session as any).verificationCodeExpiry = Date.now() + 10 * 60 * 1000; // 10 минут
    
    await session.save();

    // Отправляем код в Telegram
    const sent = await sendVerificationCode(
      botTokenSetting.value,
      adminTelegramSetting.value,
      code
    );

    if (!sent) {
      return NextResponse.json(
        { error: 'Не удалось отправить код в Telegram' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Код подтверждения отправлен в Telegram',
      requiresVerification: true,
    });

  } catch (error) {
    console.error('Ошибка при входе:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
