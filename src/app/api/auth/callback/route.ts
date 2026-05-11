import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  // Log de depuración
  console.log('--- WC AUTH CALLBACK RECEIVED ---');
  
  try {
    const text = await req.text();
    console.log('Body recibido:', text);
    
    const data = JSON.parse(text);
    const { consumer_key, consumer_secret, store_url } = data;

    if (consumer_key && consumer_secret) {
      const session = await getSession();
      session.url = store_url;
      session.key = consumer_key;
      session.secret = consumer_secret;
      await session.save();
      console.log('Sesión guardada con éxito');
    }
  } catch (error) {
    console.error('Error procesando callback (pero mandamos 200 igual):', error);
  }

  // MANDAMOS 200 SIEMPRE PARA QUE WP NO SE QUEJE
  return new NextResponse(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function GET() {
  return NextResponse.json({ active: true });
}
