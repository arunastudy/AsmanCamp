/**
 * Скрипт для запуска бота в режиме polling (для локальной разработки)
 * Запуск: npx tsx scripts/start-bot-polling.ts
 */

import { config } from "dotenv";

// Загружаем переменные окружения ПЕРЕД импортом бота
config({ path: ".env.local" });

async function startPolling() {
  try {
    // Динамический импорт после загрузки env переменных
    const { bot } = await import("../lib/telegram/bot");
    
    console.log("🤖 Запускаем бота в режиме polling...");
    
    // Получаем информацию о боте
    const me = await bot.api.getMe();
    console.log(`✅ Бот запущен: @${me.username}`);
    console.log("📱 Откройте бота в Telegram и отправьте /start\n");
    
    // Удаляем webhook если он установлен
    await bot.api.deleteWebhook();
    
    // Обработка завершения процесса
    process.once("SIGINT", () => {
      console.log("\n⏹️  Останавливаем бота...");
      bot.stop();
    });
    process.once("SIGTERM", () => {
      console.log("\n⏹️  Останавливаем бота...");
      bot.stop();
    });
    
    // Запускаем polling
    await bot.start({
      onStart: () => {
        console.log("🚀 Бот успешно запущен и ожидает сообщения...");
      },
    });
  } catch (error) {
    console.error("❌ Ошибка при запуске бота:", error);
    process.exit(1);
  }
}

startPolling();
