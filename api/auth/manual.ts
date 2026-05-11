import { VercelRequest, VercelResponse } from '@vercel/node';
import { getSession } from '../../src/lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { url, key, secret, token } = req.body;

    if (!url || (!token && (!key || !secret))) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const session = await getSession(req, res);
    session.url = url;
    session.key = key || '';
    session.secret = secret || '';
    session.token = token || '';
    await session.save();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al guardar sesión' });
  }
}
