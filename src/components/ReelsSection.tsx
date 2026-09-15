'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Play, ExternalLink } from 'lucide-react';
import { getOptimizedImageUrl } from '@/utils/image';

interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  link_url?: string;
}

interface ReelsSectionProps {
  reels: Reel[];
}

export default function ReelsSection({ reels }: ReelsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  // Store playing state per video id
  const [playingState, setPlayingState] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          const reelId = Number(video.dataset.reelid);

          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Autoplay might be blocked by browser policy, keep track of state
              setPlayingState((prev) => ({ ...prev, [reelId]: false }));
            });
            setPlayingState((prev) => ({ ...prev, [reelId]: true }));
          } else {
            video.pause();
            setPlayingState((prev) => ({ ...prev, [reelId]: false }));
          }
        });
      },
      { threshold: 0.6 } // Play when 60% of the video is visible
    );

    const videoElements = scrollRef.current.querySelectorAll('video');
    videoElements.forEach((video) => observer.observe(video));

    return () => {
      videoElements.forEach((video) => observer.unobserve(video));
    };
  }, [reels]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMuted(!muted);
  };

  const togglePlay = (videoRef: HTMLVideoElement | null, reelId: number, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!videoRef) return;

    if (videoRef.paused) {
      videoRef.play();
      setPlayingState((prev) => ({ ...prev, [reelId]: true }));
    } else {
      videoRef.pause();
      setPlayingState((prev) => ({ ...prev, [reelId]: false }));
    }
  };

  if (!reels || reels.length === 0) return null;

  return (
    <div className="w-full bg-brand-cream/30 py-10 mt-8 mb-4 border-y border-brand-cream/50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-black font-outfit text-gray-900 tracking-tight mb-0.5">
              Discover in Motion
            </h2>
            <p className="text-[11px] text-gray-700 font-medium">Watch our latest products in action</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {reels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              muted={muted}
              toggleMute={toggleMute}
              isPlaying={playingState[reel.id] || false}
              togglePlay={(video, e) => togglePlay(video, reel.id, e)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReelCard({
  reel,
  muted,
  toggleMute,
  isPlaying,
  togglePlay,
}: {
  reel: Reel;
  muted: boolean;
  toggleMute: (e: React.MouseEvent) => void;
  isPlaying: boolean;
  togglePlay: (video: HTMLVideoElement | null, e?: React.MouseEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const innerContent = (
    <div
      className="relative w-[240px] md:w-[280px] shrink-0 snap-center aspect-[9/16] rounded-2xl overflow-hidden bg-black group cursor-pointer"
      onClick={(e) => togglePlay(videoRef.current, e)}
    >
      <video
        ref={videoRef}
        data-reelid={reel.id}
        src={reel.video_url}
        poster={reel.thumbnail_url ? getOptimizedImageUrl(reel.thumbnail_url, 400, 80) : undefined}
        loop
        playsInline
        muted={muted}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-opacity duration-300"></div>

      {/* Play/Pause indicator overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white">
            <Play className="w-5 h-5 ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
        <button
          onClick={toggleMute}
          className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <h3 className="text-white font-bold text-base leading-tight drop-shadow-md mb-2 line-clamp-2">
          {reel.title}
        </h3>
        {reel.link_url && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white text-xs font-semibold hover:bg-white/30 transition-colors">
            Shop Now <ExternalLink className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );

  if (reel.link_url) {
    return (
      <Link href={reel.link_url} className="shrink-0 snap-center focus:outline-none">
        {innerContent}
      </Link>
    );
  }

  return (
    <div className="shrink-0 snap-center focus:outline-none">
      {innerContent}
    </div>
  );
}
