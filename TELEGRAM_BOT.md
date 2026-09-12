# Telegram Bot - Инструкция по использованию

## 🤖 Настройка бота

Ваш бот: **@asman_camp_bot**

### Первичная настройка

1. Убедитесь, что токен бота в файле `.env.local`:
```env
TELEGRAM_BOT_TOKEN=ваш_токен
```

2. Установите команды бота:
```bash
npm run bot:setup
```

## 🚀 Запуск бота

### Для локальной разработки (Режим Polling)

Этот режим идеален для разработки и тестирования:

```bash
npm run bot:dev
```

После запуска:
1. Откройте Telegram
2. Найдите `@asman_camp_bot`
3. Отправьте команду `/start`

### Для продакшена (Режим Webhook)

Когда приложение развернуто на сервере:

1. Добавьте URL вашего приложения в `.env.local`:
```env
NEXT_PUBLIC_APP_URL=https://ваш-домен.com
```

2. Установите webhook через API:
```
GET https://ваш-домен.com/api/telegram/setup
```

Или используйте curl:
```bash
curl https://ваш-домен.com/api/telegram/setup
```

## 📝 Доступные команды бота

- `/start` - Начать работу с ботом
- `/help` - Показать помощь
- `/info` - Информация о лагере

## 🛠️ Структура файлов

```
lib/telegram/
  └── bot.ts                           # Основная логика бота

app/api/telegram/
  ├── webhook/route.ts                 # Обработчик webhook
  └── setup/route.ts                   # Установка webhook

scripts/
  ├── setup-telegram.ts                # Скрипт настройки
  └── start-bot-polling.ts             # Запуск в режиме polling
```

## 🔧 Разработка

### Добавление новых команд

Откройте `lib/telegram/bot.ts` и добавьте новую команду:

```typescript
bot.command("новая_команда", async (ctx) => {
  await ctx.reply("Ответ бота");
});
```

### Обработка текстовых сообщений

В `lib/telegram/bot.ts` найдите секцию `bot.on("message:text")` и добавьте свою логику.

### Обработка других типов сообщений

```typescript
// Фото
bot.on("message:photo", async (ctx) => {
  await ctx.reply("Получил фото!");
});

// Документы
bot.on("message:document", async (ctx) => {
  await ctx.reply("Получил документ!");
});

// Локация
bot.on("message:location", async (ctx) => {
  await ctx.reply("Получил локацию!");
});
```

## 📚 Документация

- [Grammy (библиотека бота)](https://grammy.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🐛 Решение проблем

### Бот не отвечает

1. Проверьте, что токен правильный
2. Убедитесь, что бот запущен (`npm run bot:dev`)
3. Проверьте логи в консоли

### Webhook не работает

1. Убедитесь, что `NEXT_PUBLIC_APP_URL` правильный
2. URL должен быть HTTPS (не HTTP)
3. Проверьте, что сервер доступен из интернета

### "TELEGRAM_BOT_TOKEN не найден"

Проверьте, что файл `.env.local` существует и содержит токен.

## 💡 Советы

1. **Режим Polling** - для локальной разработки
2. **Режим Webhook** - для продакшена (быстрее и эффективнее)
3. Не коммитьте `.env.local` в Git (он уже в `.gitignore`)
4. Тестируйте команды перед деплоем
