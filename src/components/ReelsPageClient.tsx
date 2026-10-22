'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Share2, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Play, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  Check,
  Film
} from 'lucide-react';
import { resolveVideoUrl } from '@/utils/image';

export interface UnifiedReel {
  id: string;
  numericId?: number;
  type: 'youtube' | 'mp4';
  title: string;
  subtitle?: string;
  video_url?: string;
  youtube_id?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  badge_text?: string;
  button_text?: string;
  button_link?: string;
}

interface ReelsPageClientProps {
  initialReels: UnifiedReel[];
  initialTargetId?: string;
}

export default function ReelsPageClient({ initialReels, initialTargetId }: ReelsPageClientProps) {
  const router = useRouter();

  // If a specific target ID was requested in URL (?id=...), prioritize it as the first item
  const orderedReels = useMemo(() => {
    if (!initialTargetId || !initialReels.length) return initialReels;
    const targetIdx = initialReels.findIndex(
      (r) => 
        r.id === initialTargetId || 
        String(r.numericId) === String(initialTargetId) || 
        r.youtube_id === initialTargetId
    );
    if (targetIdx > 0) {
      const copy = [...initialReels];
      const [targetItem] = copy.splice(targetIdx, 1);
      return [targetItem, ...copy];
    }
    return initialReels;
  }, [initialReels, initialTargetId]);

  const [filterType, setFilterType] = useState<'all' | 'mp4' | 'youtube'>('all');

  const mp4Count = useMemo(() => orderedReels.filter((r) => r.type === 'mp4').length, [orderedReels]);
  const ytCount = useMemo(() => orderedReels.filter((r) => r.type === 'youtube').length, [orderedReels]);
  const hasBothTypes = mp4Count > 0 && ytCount > 0;

  const reels = useMemo(() => {
    if (filterType === 'mp4') return orderedReels.filter((r) => r.type === 'mp4');
    if (filterType === 'youtube') return orderedReels.filter((r) => r.type === 'youtube');
    return orderedReels;
  }, [orderedReels, filterType]);

  const [activeReelId, setActiveReelId] = useState<string>(reels[0]?.id || '');

  useEffect(() => {
    if (reels.length > 0 && !reels.some((r) => r.id === activeReelId)) {
      setActiveReelId(reels[0].id);
    }
  }, [reels, activeReelId]);
  const [muted, setMuted] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [likeAnimationId, setLikeAnimationId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize randomized like count baseline for realism
  useEffect(() => {
    const counts: Record<string, number> = {};
    reels.forEach((r, idx) => {
      counts[r.id] = 120 + ((idx * 47 + 13) % 280);
    });
    setLikeCountMap(counts);
  }, [reels]);

  // Handle back button navigation
  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  // Global Mute toggle
  const toggleGlobalMute = () => {
    setMuted((prev) => !prev);
  };

  // Like interaction
  const handleLike = (reelId: string) => {
    setLikedMap((prev) => {
      const wasLiked = !!prev[reelId];
      const nowLiked = !wasLiked;
      setLikeCountMap((counts) => ({
        ...counts,
        [reelId]: (counts[reelId] || 120) + (nowLiked ? 1 : -1)
      }));
      return { ...prev, [reelId]: nowLiked };
    });

    if (!likedMap[reelId]) {
      setLikeAnimationId(reelId);
      setTimeout(() => setLikeAnimationId(null), 900);
    }
  };

  const handleDoubleTap = (reelId: string) => {
    if (!likedMap[reelId]) {
      handleLike(reelId);
    } else {
      setLikeAnimationId(reelId);
      setTimeout(() => setLikeAnimationId(null), 900);
    }
  };

  // Share interaction
  const handleShare = async (reel: UnifiedReel) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://despearl.com/reels';
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${reel.title} | Despearl Kerala`,
          text: reel.subtitle || 'Discover premium furniture in motion at Despearl Kerala',
          url: shareUrl
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setToastMessage('Reel link copied to clipboard!');
        setTimeout(() => setToastMessage(null), 2500);
      } catch (err) {
        setToastMessage('Link ready to share');
        setTimeout(() => setToastMessage(null), 2000);
      }
    }
  };

  // Scroll Up / Down helpers for Desktop Navigation
  const scrollNext = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  const scrollPrev = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        scrollNext();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === 'm' || e.key === 'M') {
        toggleGlobalMute();
      } else if (e.key === 'Escape') {
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] bg-black text-white relative flex justify-center overflow-hidden select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-20 z-50 left-1/2 -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fadeIn pointer-events-none">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* DESKTOP SIDEBAR NAVIGATION CONTROLS (visible on lg screens) */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4">
        {/* Brand Link */}
        <Link 
          href="/" 
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/70 hover:text-white group"
          title="Return to Home Store"
        >
          <div className="w-10 h-10 rounded-full bg-brand-burgundy/80 flex items-center justify-center text-white font-black font-outfit text-sm shadow-md group-hover:scale-105 transition-transform">
            D
          </div>
          <span className="text-[10px] font-bold tracking-wider uppercase font-outfit text-white/60 group-hover:text-white">Store</span>
        </Link>

        {/* Previous Reel Arrow */}
        <button
          onClick={scrollPrev}
          className="w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/15 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Previous Reel"
          title="Previous Reel (Up Arrow)"
        >
          <ChevronUp className="w-6 h-6 text-white" />
        </button>

        {/* Next Reel Arrow */}
        <button
          onClick={scrollNext}
          className="w-12 h-12 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/15 text-white flex items-center justify-center transition-all shadow-xl hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Next Reel"
          title="Next Reel (Down Arrow)"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>

        {/* Keyboard Hints */}
        <div className="mt-2 text-center text-[10px] text-white/40 font-mono tracking-tight leading-relaxed max-w-[80px]">
          Use <kbd className="text-white/70 font-bold">↑</kbd> <kbd className="text-white/70 font-bold">↓</kbd> or Space
        </div>
      </div>

      {/* MAIN VERTICAL FEED CONTAINER */}
      <div
        ref={containerRef}
        id="reels-feed-container"
        className="w-full max-w-[440px] md:max-w-[460px] h-[100dvh] bg-black relative md:border-x md:border-white/10 overflow-y-scroll snap-y snap-mandatory no-scrollbar scroll-smooth"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {/* Floating Top Header Overlay */}
        <header className="absolute top-0 left-0 right-0 z-40 p-3 md:p-4 pb-4 flex flex-col gap-2.5 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 pointer-events-auto">
              <button
                onClick={handleBack}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/15 shadow-lg active:scale-90 transition-all cursor-pointer"
                aria-label="Back to Store"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center gap-2">
                <span className="text-white font-black font-outfit text-base md:text-lg tracking-tight drop-shadow-md">
                  Despearl Reels
                </span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Global Sound Button */}
              <button
                onClick={toggleGlobalMute}
                className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white border border-white/15 shadow-lg active:scale-90 transition-all cursor-pointer"
                aria-label={muted ? 'Unmute' : 'Mute'}
                title={muted ? 'Click to unmute sound' : 'Click to mute'}
              >
                {muted ? (
                  <VolumeX className="w-4.5 h-4.5 text-white" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5 text-white text-emerald-400" />
                )}
              </button>
            </div>
          </div>

          {/* Type Filter Pills (Direct Reels vs YouTube Shorts) */}
          {hasBothTypes && (
            <div className="flex items-center gap-1.5 pointer-events-auto overflow-x-auto no-scrollbar pt-1">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-white text-black shadow-md scale-105'
                    : 'bg-black/50 text-white/80 border border-white/15 hover:bg-black/70'
                }`}
              >
                All ({orderedReels.length})
              </button>
              <button
                onClick={() => setFilterType('mp4')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'mp4'
                    ? 'bg-brand-burgundy text-white shadow-md scale-105'
                    : 'bg-black/50 text-white/80 border border-white/15 hover:bg-black/70'
                }`}
              >
                Direct Reels ({mp4Count})
              </button>
              <button
                onClick={() => setFilterType('youtube')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filterType === 'youtube'
                    ? 'bg-red-600 text-white shadow-md scale-105'
                    : 'bg-black/50 text-white/80 border border-white/15 hover:bg-black/70'
                }`}
              >
                YouTube Shorts ({ytCount})
              </button>
            </div>
          )}
        </header>

        {/* Reels List */}
        {reels.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-4">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center text-white/50">
              <Film className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-1">No reels available right now</h2>
              <p className="text-xs text-white/50 max-w-xs">
                Check back soon for fresh videos and custom furniture in motion!
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-2.5 bg-brand-burgundy text-white text-xs font-bold rounded-xl shadow-lg hover:bg-brand-burgundy/90 transition"
            >
              Back to Store
            </Link>
          </div>
        ) : (
          reels.map((reel) => (
            <SingleReelItem
              key={reel.id}
              reel={reel}
              isActive={activeReelId === reel.id}
              setActiveReelId={setActiveReelId}
              isLiked={!!likedMap[reel.id]}
              likeCount={likeCountMap[reel.id] || 120}
              onLike={() => handleLike(reel.id)}
              onDoubleTap={() => handleDoubleTap(reel.id)}
              showLikeBurst={likeAnimationId === reel.id}
              onShare={() => handleShare(reel)}
              muted={muted}
              onToggleMute={toggleGlobalMute}
            />
          ))
        )}
      </div>

      {/* Heart Burst CSS Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customHeartBurst {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.35); opacity: 1; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.85); opacity: 0; }
        }
        .animate-heart-burst {
          animation: customHeartBurst 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SINGLE REEL ITEM COMPONENT
// ─────────────────────────────────────────────────────────────

interface SingleReelItemProps {
  reel: UnifiedReel;
  isActive: boolean;
  setActiveReelId: (id: string) => void;
  isLiked: boolean;
  likeCount: number;
  onLike: () => void;
  onDoubleTap: () => void;
  showLikeBurst: boolean;
  onShare: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

function SingleReelItem({
  reel,
  isActive,
  setActiveReelId,
  isLiked,
  likeCount,
  onLike,
  onDoubleTap,
  showLikeBurst,
  onShare,
  muted,
  onToggleMute
}: SingleReelItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [iframeReady, setIframeReady] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Helper to send postMessage command to YouTube iframe
  const sendYouTubeCommand = useCallback((func: string, args: any[] = []) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (e) {
        // Ignored
      }
    }
  }, []);

  // IntersectionObserver to determine active reel on vertical scroll snap
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          setActiveReelId(reel.id);
        }
      },
      { threshold: [0.5, 0.75] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reel.id, setActiveReelId]);

  // Handle Play/Pause when isActive changes
  useEffect(() => {
    if (reel.type === 'mp4') {
      const vid = videoRef.current;
      if (!vid) return;

      if (isActive) {
        vid.muted = muted;
        vid.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        vid.pause();
        vid.currentTime = 0;
        setIsPlaying(false);
      }
    } else if (reel.type === 'youtube') {
      if (isActive) {
        sendYouTubeCommand('playVideo');
        setIsPlaying(true);
      } else {
        sendYouTubeCommand('pauseVideo');
        sendYouTubeCommand('seekTo', [0, true]);
        setIsPlaying(false);
      }
    }
  }, [isActive, reel.type, sendYouTubeCommand, muted]);

  // Sync mute state dynamically
  useEffect(() => {
    if (reel.type === 'mp4') {
      if (videoRef.current) {
        videoRef.current.muted = muted;
      }
    } else if (reel.type === 'youtube') {
      if (muted) {
        sendYouTubeCommand('mute');
      } else {
        sendYouTubeCommand('unMute');
        sendYouTubeCommand('setVolume', [100]);
      }
    }
  }, [muted, reel.type, sendYouTubeCommand]);

  // Tap to Play/Pause with double-tap detection for Like
  const handlePlayerClick = (e: React.MouseEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_GAP = 280;

    if (now - lastTapRef.current < DOUBLE_TAP_GAP) {
      // Double tap triggered
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
      setTimeout(() => {
        if (lastTapRef.current === now) {
          // Single tap - toggle play/pause
          if (reel.type === 'mp4') {
            const vid = videoRef.current;
            if (vid) {
              if (isPlaying) {
                vid.pause();
                setIsPlaying(false);
              } else {
                vid.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }
          } else if (reel.type === 'youtube') {
            if (isPlaying) {
              sendYouTubeCommand('pauseVideo');
              setIsPlaying(false);
            } else {
              sendYouTubeCommand('playVideo');
              setIsPlaying(true);
            }
          }
          lastTapRef.current = 0;
        }
      }, DOUBLE_TAP_GAP);
    }
  };

  // YouTube embed URL configuration (Zero controls, loop, playsinline, HQ)
  const embedUrl = reel.youtube_id
    ? `https://www.youtube-nocookie.com/embed/${reel.youtube_id}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${reel.youtube_id}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&vq=hd1080&hd=1`
    : '';

  const posterUrl = reel.thumbnail_url || (reel.youtube_id ? `https://img.youtube.com/vi/${reel.youtube_id}/maxresdefault.jpg` : '');

  return (
    <div
      ref={containerRef}
      data-reel-id={reel.id}
      className="relative w-full h-[100dvh] snap-start snap-always bg-black flex items-center justify-center overflow-hidden"
    >
      {/* ── VIDEO / IFRAME PLAYER ── */}
      {reel.type === 'youtube' && reel.youtube_id ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black">
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={reel.title}
            onLoad={() => {
              setIframeReady(true);
              sendYouTubeCommand('setPlaybackQuality', ['hd1080']);
              sendYouTubeCommand('setPlaybackQualityRange', ['hd1080', 'highres']);
            }}
            className="w-full h-full object-cover pointer-events-none border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* Poster Cross-Fade for YouTube embed */}
          <div
            className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 ${
              iframeReady ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {posterUrl && (
              <img
                src={posterUrl}
                alt={reel.title}
                onError={(e) => {
                  if (reel.youtube_id) {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${reel.youtube_id}/hqdefault.jpg`;
                  }
                }}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin" />
            </div>
          </div>
        </div>
      ) : reel.type === 'mp4' && reel.video_url ? (
        <video
          ref={videoRef}
          src={resolveVideoUrl(reel.video_url)}
          loop
          playsInline
          muted={muted}
          preload="auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover pointer-events-none"
        />
      ) : null}

      {/* Transparent Click Overlay: handles Tap to Play/Pause & Double-Tap to Like */}
      <div
        onClick={handlePlayerClick}
        className="absolute inset-0 z-20 cursor-pointer"
        aria-label="Click to play or pause, double click to like"
      />

      {/* Visual Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-25 bg-black/25">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-2xl">
            <Play className="w-8 h-8 ml-1 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Double Tap Heart Burst Animation */}
      {showLikeBurst && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <Heart className="w-28 h-28 text-red-500 fill-red-500 animate-heart-burst drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
        </div>
      )}

      {/* Gradient Vignettes for clear text readability */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* ── OVERLAYS & CONTROLS ── */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-end justify-between z-30 pointer-events-none">
        
        {/* Left Side: Product Details & Action Button */}
        <div className="flex-1 pr-6 pointer-events-auto">
          {/* Badge & Brand */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 backdrop-blur-xs">
              <Sparkles className="w-3 h-3" /> {reel.badge_text || 'Despearl'}
            </span>
            <span className="text-xs font-bold text-white/90 drop-shadow-md">
              Despearl Kerala
            </span>
          </div>

          {/* Title */}
          <h2 className="text-white font-extrabold font-outfit text-base sm:text-lg leading-tight tracking-tight drop-shadow-md mb-2 line-clamp-2">
            {reel.title}
          </h2>

          {/* Subtitle / Description */}
          {reel.subtitle && (
            <p className="text-white/80 text-xs leading-relaxed line-clamp-2 mb-3 max-w-sm drop-shadow-sm font-medium">
              {reel.subtitle}
            </p>
          )}

          {/* Direct Product Link / Explore Button */}
          {reel.button_link && (
            <Link
              href={reel.button_link}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-xs font-bold rounded-xl shadow-lg border border-white/20 active:scale-95 transition-all group backdrop-blur-md"
            >
              <span>{reel.button_text || 'Explore Collection'}</span>
              <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Right Side: Action Rail (Like, Share, Mute) */}
        <div className="flex flex-col items-center gap-4 pointer-events-auto pb-1">
          {/* Like Button */}
          <button
            onClick={onLike}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <div className={`w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 transition-colors shadow-lg ${
              isLiked ? 'bg-red-500/20 text-red-500' : 'bg-black/40 text-white hover:bg-black/60'
            }`}>
              <Heart
                className={`w-6 h-6 transition-all duration-200 ${
                  isLiked ? 'fill-red-500 text-red-500 scale-110' : 'text-white group-hover:text-red-400'
                }`}
              />
            </div>
            <span className="text-white text-[11px] font-bold drop-shadow-md">
              {likeCount}
            </span>
          </button>

          {/* Share Button */}
          <button
            onClick={onShare}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
            aria-label="Share Reel"
            title="Share Reel link"
          >
            <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors shadow-lg">
              <Share2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-white text-[11px] font-bold drop-shadow-md">
              Share
            </span>
          </button>

          {/* Mute Button on Rail */}
          <button
            onClick={onToggleMute}
            className="flex flex-col items-center gap-1 group active:scale-90 transition-transform cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <div className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-colors shadow-lg">
              {muted ? (
                <VolumeX className="w-5 h-5 text-white/80" />
              ) : (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <span className="text-white text-[10px] font-bold drop-shadow-md uppercase tracking-wider">
              {muted ? 'Muted' : 'Sound'}
            </span>
          </button>
        </div>

      </div>

      {/* Top 2px Subtle Progress Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/15 z-30">
        <div className={`h-full bg-brand-burgundy transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
      </div>
    </div>
  );
}
