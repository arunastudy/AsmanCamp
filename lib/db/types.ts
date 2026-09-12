export interface User {
  id: number;
  email: string;
  password: string;
  role: 'admin' | 'user';
  telegram_id?: string;
  created_at: Date;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
  created_at: Date;
}

export interface Session {
  user: {
    id: number;
    email: string;
    role: 'admin' | 'user';
  };
  isAuthenticated: boolean;
  isEmailVerified?: boolean;
  is2FAVerified?: boolean;
}
