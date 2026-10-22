import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;

  if (!path || path.length === 0) {
    return new NextResponse('Not found', { status: 404 });
  }

  const subPath = path.map(encodeURI).join('/');
  const search = request.nextUrl.search;
  const targetUrl = `https://app.votee.in/${subPath}${search}`;

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers: {
        'Accept': request.headers.get('accept') || '*/*',
        'User-Agent': request.headers.get('user-agent') || 'NextJS-Media-Proxy',
        'Referer': 'https://despearl.com',
        'Origin': 'https://despearl.com',
      },
    });

    if (!upstreamRes.ok) {
      return new NextResponse(null, { status: upstreamRes.status });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const cacheControl = upstreamRes.headers.get('cache-control') || 'public, max-age=31536000, stale-while-revalidate=86400';

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error(`Failed to proxy media from ${targetUrl}:`, error);
    return new NextResponse(null, { status: 502 });
  }
}
