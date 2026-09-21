// API route: /api/place-photo?ref=PHOTO_REFERENCE&w=800
// Google Places photo proxy — APIキーをクライアントに露出させないためのプロキシ
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  const w   = req.nextUrl.searchParams.get('w') ?? '800';
  const key = process.env.GOOGLE_PLACES_API_KEY;

  if (!ref || !key) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${w}&photoreference=${encodeURIComponent(ref)}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) return NextResponse.json({ error: 'upstream error' }, { status: 502 });

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch {
    return NextResponse.json({ error: 'fetch failed' }, { status: 500 });
  }
}
