// Заглушка для работы с базой данных
// В реальном проекте здесь будет подключение к PostgreSQL через pg или другой драйвер

import type { User, Setting } from './types';

// Временное хранилище (в продакшене заменить на реальную БД)
const mockUsers: User[] = [];
const mockSettings: Setting[] = [];

export async function getUserByEmail(email: string): Promise<User | null> {
  // TODO: Заменить на реальный SQL запрос
  // SELECT * FROM users WHERE email = $1
  const user = mockUsers.find(u => u.email === email);
  return user || null;
}

export async function getSettingByKey(key: string): Promise<Setting | null> {
  // TODO: Заменить на реальный SQL запрос
  // SELECT * FROM settings WHERE key = $1
  const setting = mockSettings.find(s => s.key === key);
  return setting || null;
}

export async function updateUserTelegramId(userId: number, telegramId: string): Promise<void> {
  // TODO: Заменить на реальный SQL запрос
  // UPDATE users SET telegram_id = $1 WHERE id = $2
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.telegram_id = telegramId;
  }
}

// Функция для добавления пользователей (для тестирования)
export async function createUser(email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User> {
  const user: User = {
    id: mockUsers.length + 1,
    email,
    password,
    role,
    created_at: new Date(),
  };
  mockUsers.push(user);
  return user;
}

// Функция для добавления настроек (для тестирования)
export async function createSetting(key: string, value: string): Promise<Setting> {
  const setting: Setting = {
    id: mockSettings.length + 1,
    key,
    value,
    created_at: new Date(),
  };
  mockSettings.push(setting);
  return setting;
}
