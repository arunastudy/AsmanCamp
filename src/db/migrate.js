import postgres from 'postgres';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем DATABASE_URL из .env.local вручную
function loadEnv() {
  const envPath = path.join(__dirname, '..', '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('DATABASE_URL=')) {
        return line.split('=')[1].replace(/"/g, '').trim();
      }
    }
  }
  throw new Error('DATABASE_URL не найден в .env.local');
}

const databaseUrl = loadEnv();

// Подключение к базе данных
const sql = postgres(databaseUrl, {
  ssl: 'require',
});

async function runMigrations() {
  try {
    console.log('🚀 Начинаем выполнение миграций...\n');

    // Создаем таблицу для отслеживания миграций
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ Таблица миграций создана или уже существует\n');

    // Получаем список выполненных миграций
    const executedMigrations = await sql`
      SELECT name FROM migrations ORDER BY id
    `;
    const executedNames = executedMigrations.map(m => m.name);
    console.log(`📋 Выполнено миграций: ${executedNames.length}\n`);

    // Читаем файлы миграций из папки
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
      console.log('📁 Создана папка migrations\n');
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📂 Найдено файлов миграций: ${migrationFiles.length}\n`);

    // Выполняем новые миграции
    let newMigrationsCount = 0;
    for (const file of migrationFiles) {
      const migrationName = file.replace('.sql', '');
      
      if (!executedNames.includes(migrationName)) {
        console.log(`⏳ Выполняется: ${migrationName}`);
        const migrationPath = path.join(migrationsDir, file);
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Выполняем миграцию
        await sql.unsafe(migrationSQL);

        // Записываем в таблицу миграций
        await sql`
          INSERT INTO migrations (name) VALUES (${migrationName})
        `;

        console.log(`✅ Завершено: ${migrationName}\n`);
        newMigrationsCount++;
      }
    }

    if (newMigrationsCount === 0) {
      console.log('✨ Все миграции уже выполнены!\n');
    } else {
      console.log(`\n🎉 Успешно выполнено новых миграций: ${newMigrationsCount}\n`);
    }

    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка при выполнении миграций:', error);
    await sql.end();
    process.exit(1);
  }
}

runMigrations();
