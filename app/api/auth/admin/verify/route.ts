import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Необходимо указать код' },
        { status: 400 }
      );
    }

    const session = await getSession();

    // Проверяем, что есть незавершенная аутентификация
    if (!session.user || !session.isEmailVerified || session.is2FAVerified) {
      return NextResponse.json(
        { error: 'Сессия не найдена или уже завершена' },
        { status: 400 }
      );
    }

    const savedCode = (session as any).verificationCode;
    const codeExpiry = (session as any).verificationCodeExpiry;

    // Проверяем наличие кода
    if (!savedCode || !codeExpiry) {
      return NextResponse.json(
        { error: 'Код не найден. Пожалуйста, войдите снова' },
        { status: 400 }
      );
    }

    // Проверяем срок действия кода
    if (Date.now() > codeExpiry) {
      return NextResponse.json(
        { error: 'Код истек. Пожалуйста, войдите снова' },
        { status: 400 }
      );
    }

    // Проверяем код
    if (code !== savedCode) {
      return NextResponse.json(
        { error: 'Неверный код' },
        { status: 401 }
      );
    }

    // Успешная верификация - завершаем аутентификацию
    session.is2FAVerified = true;
    session.isAuthenticated = true;
    
    // Удаляем временные данные
    delete (session as any).verificationCode;
    delete (session as any).verificationCodeExpiry;
    
    await session.save();

    return NextResponse.json({
      success: true,
      message: 'Успешный вход',
      user: session.user,
    });

  } catch (error) {
    console.error('Ошибка при верификации:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
