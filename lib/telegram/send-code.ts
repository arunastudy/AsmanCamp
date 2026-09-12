import { Bot } from 'grammy';

export async function sendVerificationCode(botToken: string, telegramId: string, code: string): Promise<boolean> {
  try {
    const bot = new Bot(botToken);
    await bot.api.sendMessage(
      telegramId,
      `🔐 <b>Код подтверждения входа в админ-панель Asman Camp</b>\n\n` +
      `Ваш код: <code>${code}</code>\n\n` +
      `Введите этот код на сайте для завершения входа.\n` +
      `Код действителен 10 минут.\n\n` +
      `Если вы не пытались войти в систему, проигнорируйте это сообщение.`,
      { parse_mode: 'HTML' }
    );
    return true;
  } catch (error) {
    console.error('Ошибка отправки кода в Telegram:', error);
    return false;
  }
}
