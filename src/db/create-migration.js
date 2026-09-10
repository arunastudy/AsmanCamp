import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Получаем название миграции из аргументов командной строки
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Ошибка: укажите название миграции');
  console.log('📝 Использование: npm run migrate:create <название_миграции>');
  console.log('📝 Пример: npm run migrate:create create_users_table');
  process.exit(1);
}

// Создаем timestamp для уникальности
const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
const fileName = `${timestamp}_${migrationName}.sql`;

// Создаем папку migrations если её нет
const migrationsDir = path.join(__dirname, 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Создаем файл миграции с шаблоном
const template = `-- Migration: ${migrationName}
-- Created at: ${new Date().toISOString()}

-- Write your SQL migration here
-- Example:
-- CREATE TABLE example (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
`;

const filePath = path.join(migrationsDir, fileName);
fs.writeFileSync(filePath, template);

console.log(`\n✅ Миграция создана: ${fileName}`);
console.log(`📁 Путь: ${filePath}\n`);
