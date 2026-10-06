'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { Heart, MessageCircle, Share2, ArrowLeft, Volume2, VolumeX, Play, ExternalLink, MoreVertical } from 'lucide-react';
import { getOptimizedImageUrl, resolveVideoUrl } from '@/utils/image';
import { useRouter } from 'next/navigation';

interface Reel {
  id: number;
  title: string;
  video_url: string;
  thumbnail_url?: string;
  link_url?: string;
}

interface ReelsPageClientProps {
  initialReels: Reel[];
}

export default function ReelsPageClient({ initialReels }: ReelsPageClientProps) {
  const safeReels = initialReels || [];
  const [reels] = useState<Reel[]>(safeReels);
  const [activeReelId, setActiveReelId] = useState<number | null>(safeReels[0]?.id || null);
  const [likedReels, setLikedReels] = useState<Record<number, boolean>>({});
  const [muted, setMuted] = useState(true);
  const [likeAnimation, setLikeAnimation] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleLike = (reelId: number) => {
    setLikedReels(prev => ({
      ...prev,
      [reelId]: !prev[reelId]
    }));
    
    if (!likedReels[reelId]) {
      setLikeAnimation(reelId);
      setTimeout(() => setLikeAnimation(null), 1000);
    }
  };

  const handleDoubleTap = (reelId: number) => {
    if (!likedReels[reelId]) {
      handleLike(reelId);
    } else {
      setLikeAnimation(reelId);
      setTimeout(() => setLikeAnimation(null), 1000);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex justify-center w-full h-[100dvh]">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white transition-transform active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-white font-bold text-lg drop-shadow-md tracking-wide">Reels</h1>
        </div>
      </div>

      {/* Main Reels Container */}
      <div 
        ref={containerRef}
        className="w-full h-full max-w-[500px] overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black"
        style={{ scrollBehavior: 'smooth' }}
      >
        {reels.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/50">
            <Play className="w-12 h-12 mb-4 opacity-20" />
            <p>No reels available</p>
          </div>
        ) : (
          reels.map((reel) => (
            <ReelItem
              key={reel.id}
              reel={reel}
              isActive={activeReelId === reel.id}
              setActiveReelId={setActiveReelId}
              isLiked={likedReels[reel.id] || false}
              handleLike={() => handleLike(reel.id)}
              handleDoubleTap={() => handleDoubleTap(reel.id)}
              showLikeAnimation={likeAnimation === reel.id}
              muted={muted}
              toggleMute={toggleMute}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ReelItemProps {
  reel: Reel;
  isActive: boolean;
  setActiveReelId: (id: number) => void;
  isLiked: boolean;
  handleLike: () => void;
  handleDoubleTap: () => void;
  showLikeAnimation: boolean;
  muted: boolean;
  toggleMute: () => void;
}

function ReelItem({ 
  reel, 
  isActive, 
  setActiveReelId, 
  isLiked, 
  handleLike, 
  handleDoubleTap, 
  showLikeAnimation,
  muted,
  toggleMute
}: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const lastTapRef = useRef<number>(0);

  // Handle visibility and playing state
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveReelId(reel.id);
        }
      },
      { threshold: 0.6 } // When 60% of the video is visible
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [reel.id, setActiveReelId]);

  useEffect(() => {
    if (isActive) {
      videoRef.current?.play().catch(e => console.log('Autoplay prevented', e));
      setIsPlaying(true);
    } else {
      videoRef.current?.pause();
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
    }
  }, [isActive]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  const togglePlay = (e: React.MouseEvent) => {
    // Implement double tap logic
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      handleDoubleTap();
      lastTapRef.current = 0;
    } else {
      // Single tap - toggle play/pause after a short delay to ensure it's not a double tap
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          if (videoRef.current) {
            if (isPlaying) {
              videoRef.current.pause();
              setIsPlaying(false);
            } else {
              videoRef.current.play();
              setIsPlaying(true);
            }
          }
          lastTapRef.current = 0;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[100dvh] snap-start bg-black flex items-center justify-center overflow-hidden"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={resolveVideoUrl(reel.video_url)}
        poster={reel.thumbnail_url ? getOptimizedImageUrl(reel.thumbnail_url, 600, 80) : undefined}
        loop
        playsInline
        muted={muted}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover cursor-pointer"
        onClick={togglePlay}
      />

      {/* Play/Pause Indicator overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/10">
          <div className="w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90">
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Double Tap Like Animation Overlay */}
      {showLikeAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <Heart 
            className="w-32 h-32 text-red-500 fill-red-500 animate-scale-up-down drop-shadow-2xl" 
          />
        </div>
      )}

      {/* Dark overlay at bottom for readability */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* Top right controls */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleMute}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white transition-transform active:scale-90"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* UI Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-end justify-between z-20">
        {/* Left side: Info */}
        <div className="flex-1 pr-12 pb-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-burgundy to-orange-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-black overflow-hidden border border-black">
                 {/* Replace with brand avatar if available */}
                 <div className="w-full h-full bg-brand-cream flex items-center justify-center text-brand-burgundy font-bold text-sm">
                   B
                 </div>
              </div>
            </div>
            <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">Billgix</span>
            <button className="px-3 py-1 rounded-full border border-white/40 text-white text-[10px] font-bold backdrop-blur-sm ml-2">
              Follow
            </button>
          </div>
          
          <h2 className="text-white font-medium text-[15px] leading-snug drop-shadow-md mb-2">
            {reel.title}
          </h2>
          
          {reel.link_url && (
            <Link 
              href={reel.link_url}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold hover:bg-white/30 transition-colors active:scale-95 shadow-lg"
            >
              View Product <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex flex-col items-center gap-5 pb-2">
          <button 
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform"
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${isLiked ? 'bg-black/20' : 'bg-black/20'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white group-hover:text-red-400'}`} />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow-md">
              {isLiked ? '1.2k' : 'Like'}
            </span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
            <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white group-hover:text-gray-200" />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow-md">
              128
            </span>
          </button>

          <button className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
            <div className="w-11 h-11 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white group-hover:text-gray-200" />
            </div>
            <span className="text-white text-[11px] font-semibold drop-shadow-md">
              Share
            </span>
          </button>
          
          <button className="flex flex-col items-center gap-1 group active:scale-90 transition-transform mt-2">
            <MoreVertical className="w-5 h-5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <div 
          className="h-full bg-brand-burgundy rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
