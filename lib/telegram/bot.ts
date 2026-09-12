import { Bot } from "grammy";

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN не найден в переменных окружения");
}

// Создаем экземпляр бота
export const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Команда /start
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Добро пожаловать в Asman Camp! 🏕️\n\n" +
    "Доступные команды:\n" +
    "/help - Показать помощь\n" +
    "/info - Информация о лагере"
  );
});

// Команда /help
bot.command("help", async (ctx) => {
  await ctx.reply(
    "Я бот лагеря Asman Camp! 🏕️\n\n" +
    "Я помогу вам с:\n" +
    "• Регистрацией в лагерь\n" +
    "• Информацией о программах\n" +
    "• Ответами на вопросы\n\n" +
    "Просто напишите мне, и я постараюсь помочь!"
  );
});

// Команда /info
bot.command("info", async (ctx) => {
  await ctx.reply(
    "📍 Asman Camp - летний лагерь для детей и подростков\n\n" +
    "🌟 Наши программы включают:\n" +
    "• Спортивные активности\n" +
    "• Творческие мастерские\n" +
    "• Образовательные занятия\n" +
    "• Походы и экскурсии"
  );
});

// Обработка текстовых сообщений
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  if (text.includes("привет") || text.includes("здравствуй")) {
    await ctx.reply("Привет! 👋 Чем могу помочь?");
  } else if (text.includes("цена") || text.includes("стоимость")) {
    await ctx.reply("Для уточнения цен и тарифов, пожалуйста, напишите /info");
  } else {
    await ctx.reply(
      "Спасибо за сообщение! 😊\n" +
      "Используйте /help чтобы узнать, чем я могу помочь."
    );
  }
});

// Обработка ошибок
bot.catch((err) => {
  console.error("Ошибка в боте:", err);
});
