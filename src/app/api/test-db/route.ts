import { NextResponse } from 'next/server'
import { testDatabaseConnection, checkUsersTable, getUsers } from '@/lib/db'

export async function GET() {
  try {
    // Тестируем подключение
    const connectionTest = await testDatabaseConnection()
    
    if (!connectionTest.connected) {
      return NextResponse.json(
        { error: 'Database connection failed', details: connectionTest.error },
        { status: 500 }
      )
    }

    // Проверяем существование таблицы users
    const tableCheck = await checkUsersTable()

    // Получаем пользователей
    const usersResult = await getUsers()

    return NextResponse.json({
      message: 'Database connection successful',
      connection: connectionTest,
      tableExists: tableCheck.exists,
      users: usersResult.success ? usersResult.users : [],
      usersCount: usersResult.success ? usersResult.users.length : 0,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
