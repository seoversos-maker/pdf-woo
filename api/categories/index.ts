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
  try {
    const session = await getIronSession(req, res, sessionOptions);
    
    if (!session.url || (!session.token && (!session.key || !session.secret))) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    let endpoint = `${session.url}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`;
    const headers: Record<string, string> = {};

    if (session.token) {
      endpoint = `${session.url.replace(/\/$/, '')}/wp-json/pdf-woo/v1/categories`;
      headers['X-PDF-Woo-Token'] = session.token;
    } else {
      const auth = Buffer.from(`${session.key}:${session.secret}`).toString('base64');
      headers['Authorization'] = `Basic ${auth}`;
    }

    const response = await fetch(endpoint, { headers });
    const data = await response.json();
    
    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    const categories = Array.isArray(data) ? data.map((c: any) => ({ id: c.id, name: c.name, count: c.count, parent: c.parent || 0 })) : [];
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error en categories:', error);
    return res.status(500).json({ error: 'Error de servidor: ' + error.message });
  }
}
