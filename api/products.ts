import { VercelRequest, VercelResponse } from '@vercel/node';
import { getIronSession } from '../src/lib/session';
import { sessionOptions } from '../src/lib/session';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await getIronSession(req, res, sessionOptions);
  const categoryIds = req.query.category;

  if (!session.url || (!session.token && (!session.key || !session.secret))) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  let endpoint = `${session.url}/wp-json/wc/v3/products?per_page=100&status=publish`;
  const headers: Record<string, string> = {};

  if (session.token) {
    endpoint = `${session.url}/wp-json/pdf-woo/v1/products`;
    headers['X-PDF-Woo-Token'] = session.token;
  } else {
    const auth = Buffer.from(`${session.key}:${session.secret}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  if (categoryIds) {
    endpoint += (endpoint.includes('?') ? '&' : '?') + `category=${categoryIds}`;
  }

  try {
    const response = await fetch(endpoint, { headers });
    const data = await response.json();

    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    const products = Array.isArray(data) ? data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      sku: item.sku,
      imageUrl: item.images?.[0]?.src || '',
      category: item.categories?.[0]?.name || 'General',
      stockStatus: item.stock_status === 'instock' ? 'Disponible' : 'Agotado',
    })) : [];

    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error de servidor al traer productos' });
  }
}
