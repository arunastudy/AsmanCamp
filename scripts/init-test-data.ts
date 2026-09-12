/**
 * Скрипт для инициализации тестовых данных
 * 
 * Использование:
 * npm run init:test
 */

import { hashPassword } from '../lib/auth/password';
import { createUser, createSetting } from '../lib/db';

async function initTestData() {
  console.log('🚀 Инициализация тестовых данных...\n');

  try {
    // Создаем тестового админа
    const hashedPassword = await hashPassword('admin123');
    const admin = await createUser('admin@asman-camp.com', hashedPassword, 'admin');
    console.log('✅ Создан админ:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Пароль: admin123`);
    console.log(`   ID: ${admin.id}\n`);

    // Создаем тестового пользователя
    const userHashedPassword = await hashPassword('user123');
    const user = await createUser('user@example.com', userHashedPassword, 'user');
    console.log('✅ Создан пользователь:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Пароль: user123`);
    console.log(`   ID: ${user.id}\n`);

    // Создаем настройки
    // ВАЖНО: Замените значения на ваши реальные данные!
    const adminTelegramId = await createSetting(
      'ADMIN_TELEGRAM_USER_ID',
      'YOUR_TELEGRAM_USER_ID' // Замените на ваш Telegram ID
    );
    console.log('✅ Создана настройка:');
    console.log(`   Ключ: ${adminTelegramId.key}`);
    console.log(`   Значение: ${adminTelegramId.value}`);
    console.log('   ⚠️  ВАЖНО: Замените YOUR_TELEGRAM_USER_ID на ваш реальный Telegram ID!\n');

    const botToken = await createSetting(
      'ADMIN_TELEGRAM_BOT_TOKEN',
      process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN'
    );
    console.log('✅ Создана настройка:');
    console.log(`   Ключ: ${botToken.key}`);
    console.log(`   Значение: ${botToken.value.substring(0, 10)}...`);

    if (!process.env.TELEGRAM_BOT_TOKEN) {
      console.log('   ⚠️  ВАЖНО: Замените YOUR_BOT_TOKEN на токен вашего бота!\n');
    }

    console.log('\n✨ Тестовые данные успешно созданы!');
    console.log('\n📝 Следующие шаги:');
    console.log('1. Узнайте свой Telegram ID (напишите @userinfobot в Telegram)');
    console.log('2. Обновите настройку ADMIN_TELEGRAM_USER_ID в базе данных');
    console.log('3. Проверьте, что TELEGRAM_BOT_TOKEN указан в .env.local');
    console.log('4. Войдите как админ: admin@asman-camp.com / admin123\n');

  } catch (error) {
    console.error('❌ Ошибка при инициализации:', error);
    process.exit(1);
  }
}

initTestData();
