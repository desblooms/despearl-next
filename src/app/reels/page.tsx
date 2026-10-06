import React from 'react';
import ReelsPageClient from '@/components/ReelsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reels | Discover our products in motion',
  description: 'Watch short videos of our premium furniture and products.',
};

export const dynamic = 'force-dynamic';

async function fetchReels() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/reels.php`, {
      cache: 'no-store',
      headers: { 'Origin': process.env.NEXT_PUBLIC_SITE_URL || '' }
    });
    const data = await res.json();
    return data.status === 'success' ? data.data : [];
  } catch (e) {
    return [];
  }
}

export default async function ReelsPage() {
  const reels = await fetchReels();

  return (
    <main className="w-full bg-black min-h-screen">
      <ReelsPageClient initialReels={reels} />
    </main>
  );
}
