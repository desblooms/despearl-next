import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 1×1 transparent PNG — minimal valid image for dead-upstream fallback
const FALLBACK_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

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
  const targetUrl = `https://admin.despearl.com/${subPath}${search}`;

  try {
    // 8-second timeout so mobile browsers never wait indefinitely
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const upstreamRes = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        'Accept': request.headers.get('accept') || 'image/*,*/*',
        'User-Agent': 'DespEarl-Proxy/1.0',
      },
    });
    clearTimeout(timeout);

    if (!upstreamRes.ok) {
      return new NextResponse('Media not found', {
        status: 404,
        headers: {
          'Cache-Control': 'no-store',
        },
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    // Long-lived CDN cache for immutable media assets
    const cacheControl = 'public, max-age=31536000, stale-while-revalidate=86400, immutable';

    return new NextResponse(upstreamRes.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
        'Vary': 'Accept',
      },
    });
  } catch (error) {
    console.error(`Failed to proxy image from ${targetUrl}:`, error);
    return new NextResponse('Media proxy error', {
      status: 502,
      headers: {
        'Cache-Control': 'no-store',
      },
    });
  }
}
