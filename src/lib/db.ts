import postgres from 'postgres'

// Создаем подключение к Neon PostgreSQL
export const sql = postgres(process.env.DATABASE_URL!, {
  ssl: 'require',
})

// Функция для тестирования подключения
export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT version(), NOW() as current_time`
    return {
      connected: true,
      version: result[0].version,
      timestamp: result[0].current_time.toISOString(),
    }
  } catch (error) {
    console.error('Database connection error:', error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Функция для проверки существования таблицы users
export async function checkUsersTable() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      )
    `
    return { success: true, exists: result[0].exists }
  } catch (error) {
    console.error('Error checking table:', error)
    return {
      success: false,
      exists: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Пример функции для добавления пользователя
export async function addUser(name: string, email: string, passwordHash?: string) {
  try {
    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash || null})
      RETURNING id, name, email, created_at, updated_at
    `
    return { success: true, user: result[0] }
  } catch (error) {
    console.error('Error adding user:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// Пример функции для получения всех пользователей
export async function getUsers() {
  try {
    const users = await sql`SELECT * FROM users ORDER BY created_at DESC`
    return { success: true, users }
  } catch (error) {
    console.error('Error getting users:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
