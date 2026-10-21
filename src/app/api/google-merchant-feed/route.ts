import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'https://app.votee.in/api/ecommerce';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://despearl.com';

    // Forward query params (format=xml, format=tsv, download=1, token, etc.)
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const targetUrl = `${apiBase}/google_merchant_feed.php${queryString ? '?' + queryString : ''}`;

    const res = await fetch(targetUrl, {
      cache: 'no-store',
      headers: {
        Origin: siteUrl,
      },
    });

    const body = await res.text();
    const contentType = res.headers.get('content-type') || 'application/xml; charset=utf-8';

    return new NextResponse(body, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error: any) {
    return new NextResponse(`Google Merchant Feed Proxy Error: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
