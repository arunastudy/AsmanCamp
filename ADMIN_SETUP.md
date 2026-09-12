# Настройка админ-панели Asman Camp

## 🚀 Быстрый старт

### 1. Установка зависимостей

Все необходимые зависимости уже установлены:
- `bcryptjs` - хеширование паролей
- `iron-session` - безопасные сессии
- `jose` - работа с JWT токенами
- `grammy` - Telegram бот

### 2. Настройка переменных окружения

Убедитесь, что в файле `.env.local` указаны все необходимые переменные:

```env
TELEGRAM_BOT_TOKEN=ваш_токен_бота
SESSION_SECRET=минимум-32-символа-случайная-строка
```

⚠️ **ВАЖНО**: Для продакшена сгенерируйте надежный `SESSION_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Узнайте свой Telegram ID

Напишите боту [@userinfobot](https://t.me/userinfobot) в Telegram, чтобы узнать ваш Telegram ID.

### 4. Инициализация тестовых данных

Запустите скрипт для создания тестового админа и настроек:

```bash
npm run init:test
```

Это создаст:
- **Админ**: `admin@asman-camp.com` / `admin123`
- **Пользователь**: `user@example.com` / `user123`
- Настройки в таблице `settings`

### 5. Обновите настройки базы данных

После инициализации **обязательно** обновите следующие настройки:

```sql
-- Укажите ваш Telegram ID
UPDATE settings 
SET value = 'ВАШ_TELEGRAM_ID' 
WHERE key = 'ADMIN_TELEGRAM_USER_ID';

-- Проверьте токен бота (если нужно)
UPDATE settings 
SET value = 'ВАШ_ТОКЕН_БОТА' 
WHERE key = 'ADMIN_TELEGRAM_BOT_TOKEN';
```

### 6. Запуск приложения

```bash
npm run dev
```

Откройте [http://localhost:3000/auth/admin/login](http://localhost:3000/auth/admin/login)

---

## 🔐 Процесс входа

### Шаг 1: Ввод email и пароля
Администратор вводит свои учетные данные на странице `/auth/admin/login`.

### Шаг 2: Отправка кода в Telegram
После успешной проверки пароля система:
1. Генерирует 6-значный код
2. Отправляет его на Telegram ID администратора
3. Перенаправляет на страницу верификации

### Шаг 3: Ввод кода подтверждения
На странице `/auth/admin/verify` администратор вводит полученный код.

Код действителен **10 минут**.

### Шаг 4: Доступ к админ-панели
После успешной верификации администратор попадает в панель `/admin`.

---

## 🛡️ Система защиты

### Защита роутов (Middleware)

Middleware автоматически защищает страницы:

| Роут | Доступ | Перенаправление |
|------|--------|----------------|
| `/admin/*` | Только админы | → `/auth/admin/login` |
| `/dashboard/*` | Только пользователи | → `/auth/login` |
| `/auth/admin/login` | Неавторизованные | Админ → `/admin` |
| `/auth/login` | Неавторизованные | Пользователь → `/dashboard` |
| `/` (Лендинг) | Неавторизованные | Админ → `/admin`, Пользователь → `/dashboard` |

### Разделение ролей

- **Админ** (`role: 'admin'`) - доступ только к `/admin/*`
- **Пользователь** (`role: 'user'`) - доступ только к `/dashboard/*`
- Пользователи не могут получить доступ к админке
- Админы не могут попасть на страницы пользователей

---

## 📁 Структура файлов

```
app/
├── admin/                          # Админ-панель
│   └── page.tsx                    # Главная страница админки
├── auth/
│   └── admin/
│       ├── login/
│       │   └── page.tsx            # Страница входа админа
│       └── verify/
│           └── page.tsx            # Страница верификации кода
└── api/
    └── auth/
        ├── admin/
        │   ├── login/
        │   │   └── route.ts        # API: вход админа
        │   ├── logout/
        │   │   └── route.ts        # API: выход админа
        │   └── verify/
        │       └── route.ts        # API: верификация кода
        └── me/
            └── route.ts            # API: текущий пользователь

components/
└── admin/
    └── AdminDashboard.tsx          # Компонент админ-панели

lib/
├── auth/
│   ├── password.ts                 # Хеширование паролей, генерация кодов
│   └── session.ts                  # Управление сессиями
├── db/
│   ├── index.ts                    # Функции работы с БД
│   └── types.ts                    # TypeScript типы
└── telegram/
    └── send-code.ts                # Отправка кода в Telegram

middleware.ts                       # Защита роутов
```

---

## 🔄 Подключение реальной базы данных

Сейчас используется временное хранилище в памяти. Для продакшена:

### 1. Установите драйвер БД

```bash
npm install pg  # для PostgreSQL
# или
npm install mysql2  # для MySQL
```

### 2. Обновите `lib/db/index.ts`

Замените заглушки на реальные SQL запросы:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

export async function getSettingByKey(key: string): Promise<Setting | null> {
  const result = await pool.query(
    'SELECT * FROM settings WHERE key = $1',
    [key]
  );
  return result.rows[0] || null;
}
```

### 3. Создайте таблицы

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  telegram_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_settings_key ON settings(key);
```

### 4. Добавьте админа

```sql
-- Пароль: admin123 (замените на хеш вашего пароля)
INSERT INTO users (email, password, role) 
VALUES ('admin@asman-camp.com', '$2a$12$...хеш...', 'admin');

-- Настройки Telegram
INSERT INTO settings (key, value) 
VALUES ('ADMIN_TELEGRAM_USER_ID', 'ВАШ_TELEGRAM_ID');

INSERT INTO settings (key, value) 
VALUES ('ADMIN_TELEGRAM_BOT_TOKEN', 'ВАШ_ТОКЕН_БОТА');
```

---

## 🎨 Локализация

Все тексты можно легко заменить на другой язык. Основные места:

1. **Страницы**: `app/auth/admin/login/page.tsx`, `app/auth/admin/verify/page.tsx`
2. **Компоненты**: `components/admin/AdminDashboard.tsx`
3. **API сообщения**: `app/api/auth/admin/*/route.ts`
4. **Telegram сообщения**: `lib/telegram/send-code.ts`

Для мультиязычности рекомендуется использовать `next-intl` или `react-i18next`.

---

## 🐛 Отладка

### Проблема: Код не приходит в Telegram

1. Проверьте, что бот запущен и доступен
2. Убедитесь, что Telegram ID указан правильно
3. Проверьте логи в консоли
4. Попробуйте отправить сообщение боту вручную

### Проблема: Ошибка сессии

1. Убедитесь, что `SESSION_SECRET` установлен
2. Очистите cookies браузера
3. Перезапустите сервер разработки

### Проблема: Middleware не работает

1. Проверьте конфигурацию `matcher` в `middleware.ts`
2. Убедитесь, что путь в `matcher` совпадает с роутом
3. Очистите кеш Next.js: удалите папку `.next` и перезапустите

---

## 📚 Дополнительные материалы

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [iron-session документация](https://github.com/vvo/iron-session)
- [Grammy (Telegram Bot)](https://grammy.dev/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)

---

## ✅ Чек-лист перед продакшеном

- [ ] Смените `SESSION_SECRET` на надежный ключ
- [ ] Подключите реальную базу данных
- [ ] Смените тестовые пароли
- [ ] Включите HTTPS (для `secure` cookies)
- [ ] Настройте rate limiting для API
- [ ] Добавьте логирование попыток входа
- [ ] Настройте мониторинг ошибок
- [ ] Проверьте безопасность Telegram бота
- [ ] Добавьте резервное копирование БД
- [ ] Настройте окружение для production

---

## 💬 Поддержка

При возникновении вопросов обратитесь к документации Next.js или свяжитесь с разработчиком.
