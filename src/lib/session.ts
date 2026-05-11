import { getIronSession, IronSession } from 'iron-session';

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

// Función universal para obtener la sesión pasando req y res
export async function getSession(req: any, res: any): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, sessionOptions);
}
