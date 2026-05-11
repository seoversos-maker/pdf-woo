import { VercelRequest, VercelResponse } from '@vercel/node';
import { getIronSession } from 'iron-session';

const sessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'wc_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // Asegurar que el body esté parseado
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { url, key, secret, token } = body || {};

    if (!url || (!token && (!key || !secret))) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const session = await getIronSession(req, res, sessionOptions);
    session.url = url;
    session.key = key || '';
    session.secret = secret || '';
    session.token = token || '';
    await session.save();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error en manual auth:', error);
    return res.status(500).json({ error: 'Error al guardar sesión: ' + error.message });
  }
}
