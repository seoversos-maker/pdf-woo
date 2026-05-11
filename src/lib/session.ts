import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  url: string;
  key?: string;
  secret?: string;
  token?: string;
}

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'wc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions);
}
