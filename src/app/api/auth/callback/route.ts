import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    // Intentamos leer como JSON, si falla probamos otros métodos
    const data = await req.json().catch(() => null);
    
    if (!data) {
      console.error('No se pudieron parsear los datos de WooCommerce');
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const { consumer_key, consumer_secret, store_url } = data;

    if (!consumer_key || !consumer_secret) {
      console.error('Faltan llaves en la respuesta:', data);
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const session = await getSession();
    session.url = store_url;
    session.key = consumer_key;
    session.secret = consumer_secret;
    await session.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error crítico en callback:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// También habilitamos GET por si acaso WC hace alguna redirección rara
export async function GET() {
  return NextResponse.json({ message: 'Callback is active' });
}
