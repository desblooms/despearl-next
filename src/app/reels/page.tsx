import React from 'react';
import ReelsPageClient, { UnifiedReel } from '@/components/ReelsPageClient';
import { Metadata } from 'next';
import { extractYouTubeId } from '@/components/YouTubeSection';

export const metadata: Metadata = {
  title: 'Reels | Despearl Kerala – Furniture & Custom Sofa in Motion',
  description: 'Watch short video reels of custom sofas, teak wood cots, dining tables, and luxury living room furniture crafted by Despearl factory in Kerala.',
};

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://app.votee.in/api/ecommerce';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://despearl.com';

async function safeFetchJson(url: string): Promise<any> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Origin': SITE_URL }
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.error(`Error fetching ${url}:`, e);
  }
  return null;
}

async function fetchAllReels(): Promise<UnifiedReel[]> {
  const [reelsData, ytData] = await Promise.all([
    safeFetchJson(`${API_BASE}/reels.php`),
    safeFetchJson(`${API_BASE}/youtube_videos.php`)
  ]);

  const unified: UnifiedReel[] = [];

  // 1. YouTube Shorts / Videos
  if (ytData && ytData.status === 'success' && Array.isArray(ytData.data)) {
    for (const v of ytData.data) {
      if (v.is_active === undefined || Number(v.is_active) === 1) {
        const ytid = extractYouTubeId(v.youtube_url || '');
        if (ytid) {
          unified.push({
            id: `yt-${v.id}`,
            numericId: Number(v.id),
            type: 'youtube',
            title: v.title || 'Living Room Elegance',
            subtitle: v.subtitle || '',
            youtube_id: ytid,
            youtube_url: v.youtube_url,
            thumbnail_url: v.thumbnail_url || `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`,
            badge_text: v.badge_text || 'Reels',
            button_text: v.button_text || 'Explore Collection',
            button_link: v.button_link || '/categories'
          });
        }
      }
    }
  }

  // 2. Uploaded mp4 Reels
  if (reelsData && reelsData.status === 'success' && Array.isArray(reelsData.data)) {
    for (const r of reelsData.data) {
      if (r.video_url) {
        unified.push({
          id: `mp4-${r.id}`,
          numericId: Number(r.id),
          type: 'mp4',
          title: r.title || 'Featured Product',
          subtitle: r.subtitle || '',
          video_url: r.video_url,
          thumbnail_url: r.thumbnail_url,
          badge_text: 'Reels',
          button_text: 'View Product',
          button_link: r.link_url || ''
        });
      }
    }
  }

  return unified;
}

export default async function ReelsPage({
  searchParams
}: {
  searchParams?: Promise<{ id?: string; v?: string }>;
}) {
  const [reels, resolvedParams] = await Promise.all([
    fetchAllReels(),
    searchParams ? searchParams : Promise.resolve({} as { id?: string; v?: string })
  ]);

  const targetId = resolvedParams?.id || resolvedParams?.v;

  return (
    <div id="reels-page-root" className="w-full h-full min-h-screen bg-black">
      <ReelsPageClient initialReels={reels} initialTargetId={targetId} />
    </div>
  );
}
