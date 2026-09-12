import { getIronSession, IronSessionData, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { Session } from '@/lib/db/types';

// Расширяем тип сессии для iron-session
declare module 'iron-session' {
  interface IronSessionData extends Session {}
}

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET не найден в переменных окружения');
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'asman_camp_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<Session>(cookieStore, sessionOptions);
}
