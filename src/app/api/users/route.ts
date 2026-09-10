import { NextResponse } from 'next/server'
import { getUsers, addUser } from '@/lib/db'

// GET /api/users - получить всех пользователей
export async function GET() {
  try {
    const result = await getUsers()
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch users', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      users: result.users,
      count: result.users.length,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/users - создать нового пользователя
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email } = body

    // Валидация
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Проверка email формата
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const result = await addUser(name, email)
    
    if (!result.success) {
      // Проверка на дубликат email
      if (result.error?.includes('unique') || result.error?.includes('duplicate')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to create user', details: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: result.user,
    }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
