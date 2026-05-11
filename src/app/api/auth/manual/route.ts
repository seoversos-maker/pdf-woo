import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const { url, key, secret, token } = await req.json();

    if (!url || (!token && (!key || !secret))) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const session = await getSession();
    session.url = url;
    session.key = key || '';
    session.secret = secret || '';
    session.token = token || '';
    await session.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error al guardar sesión' }, { status: 500 });
  }
}
