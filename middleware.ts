import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from './lib/auth/session';
import type { Session } from './lib/db/types';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Получаем сессию
  const response = NextResponse.next();
  
  // Создаем cookie store для iron-session
  const cookieStore = {
    get: (name: string) => {
      const cookie = request.cookies.get(name);
      return cookie ? { name: cookie.name, value: cookie.value } : undefined;
    },
    getAll: () => {
      return request.cookies.getAll().map(cookie => ({ name: cookie.name, value: cookie.value }));
    },
    set: (name: string, value: string, cookie: any) => {
      response.cookies.set({ name, value, ...cookie });
    },
    delete: (name: string) => {
      response.cookies.delete(name);
    }
  };
  
  const session = await getIronSession<Session>(cookieStore, sessionOptions);

  const isAuthenticated = session.isAuthenticated && !!session.user;
  const isAdmin = isAuthenticated && session.user?.role === 'admin';
  const isUser = isAuthenticated && session.user?.role === 'user';

  // Админские роуты
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/admin/login', request.url));
    }
    
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    return response;
  }

  // Пользовательские роуты (когда они появятся)
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/profile')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    
    return response;
  }

  // Страницы входа - перенаправление авторизованных пользователей
  if (pathname.startsWith('/auth/admin/login') || pathname.startsWith('/auth/admin/verify')) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  if (pathname.startsWith('/auth/login')) {
    if (isUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return response;
  }

  // Лендинг доступен только неавторизованным
  if (pathname === '/') {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    if (isUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',
  ],
};
