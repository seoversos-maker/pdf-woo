import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { consumer_key, consumer_secret, store_url } = data;

    const session = await getSession();
    session.url = store_url;
    session.key = consumer_key;
    session.secret = consumer_secret;
    await session.save();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process auth' }, { status: 400 });
  }
}
