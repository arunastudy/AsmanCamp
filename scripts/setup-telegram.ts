/**
 * Скрипт для настройки Telegram бота
 * Запуск: npx tsx scripts/setup-telegram.ts
 */

import { config } from "dotenv";
import { Bot } from "grammy";

// Загружаем переменные окружения
config({ path: ".env.local" });

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error("❌ TELEGRAM_BOT_TOKEN не найден в переменных окружения");
  process.exit(1);
}

const bot = new Bot(token);

async function setup() {
  try {
    console.log("🔄 Проверяем подключение к боту...");
    
    // Получаем информацию о боте
    const me = await bot.api.getMe();
    console.log(`✅ Бот подключен: @${me.username} (${me.first_name})`);
    
    // Устанавливаем команды бота
    console.log("\n🔄 Устанавливаем команды бота...");
    await bot.api.setMyCommands([
      { command: "start", description: "Начать работу с ботом" },
      { command: "help", description: "Показать помощь" },
      { command: "info", description: "Информация о лагере" },
    ]);
    console.log("✅ Команды установлены");
    
    // Проверяем текущий webhook
    const webhookInfo = await bot.api.getWebhookInfo();
    console.log("\n📡 Текущий webhook:", webhookInfo.url || "не установлен");
    
    if (webhookInfo.url) {
      console.log("⚠️  Для локальной разработки используйте polling режим");
      console.log("   Или удалите webhook командой: await bot.api.deleteWebhook()");
    }
    
    console.log("\n✨ Настройка завершена!");
    console.log("\n📝 Следующие шаги:");
    console.log("1. Для локальной разработки: npm run dev");
    console.log("2. Откройте бота в Telegram: @" + me.username);
    console.log("3. Отправьте команду /start");
    
  } catch (error) {
    console.error("❌ Ошибка:", error);
    process.exit(1);
  }
}

setup();
