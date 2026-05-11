import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(req: NextRequest) {
  const session = await getSession();
  const { searchParams } = new URL(req.url);
  const categoryIds = searchParams.get('category');

  if (!session.url || (!session.token && (!session.key || !session.secret))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  let endpoint = `${session.url}/wp-json/wc/v3/products?per_page=100&status=publish`;
  const headers: Record<string, string> = {};

  if (session.token) {
    endpoint = `${session.url}/wp-json/pdf-woo/v1/products`;
    headers['X-PDF-Woo-Token'] = session.token;
  } else {
    const auth = btoa(`${session.key}:${session.secret}`);
    headers['Authorization'] = `Basic ${auth}`;
  }

  if (categoryIds) {
    endpoint += (endpoint.includes('?') ? '&' : '?') + `category=${categoryIds}`;
  }

  try {
    const response = await fetch(endpoint, { headers });
    const data = await response.json();
    return NextResponse.json(data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      sku: item.sku,
      imageUrl: item.images?.[0]?.src || '',
      category: item.categories?.[0]?.name || 'General',
      stockStatus: item.stock_status === 'instock' ? 'Disponible' : 'Agotado',
    })));
  } catch (error) {
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}
