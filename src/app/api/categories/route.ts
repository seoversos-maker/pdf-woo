import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  
  if (!session.url || !session.key || !session.secret) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const auth = btoa(`${session.key}:${session.secret}`);
  const endpoint = `${session.url}/wp-json/wc/v3/products/categories?per_page=100&hide_empty=true`;

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    return NextResponse.json(data.map((c: any) => ({ id: c.id, name: c.name, count: c.count })));
  } catch (error) {
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}
