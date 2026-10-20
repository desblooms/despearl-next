'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export interface YouTubeVideo {
  id: number;
  title: string;
  subtitle?: string;
  youtube_url: string;
  thumbnail_url?: string;
  button_text?: string;
  button_link?: string;
  badge_text?: string;
  is_active?: number;
  display_order?: number;
}

interface YouTubeSectionProps {
  videos: YouTubeVideo[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function YouTubeSection({
  videos,
  sectionTitle = "Experience in Motion",
  sectionSubtitle = "Immerse yourself in our cinematic showcase and stories"
}: YouTubeSectionProps) {
  // Filter active and valid videos
  const activeVideos = useMemo(() => {
    return (videos || []).filter((v) => {
      const active = v.is_active === undefined || Number(v.is_active) === 1;
      return active && !!extractYouTubeId(v.youtube_url);
    });
  }, [videos]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playlistScrollRef = useRef<HTMLDivElement>(null);

  const currentVideo = activeVideos[activeIndex] || null;
  const currentYouTubeId = currentVideo ? extractYouTubeId(currentVideo.youtube_url) : null;

  // Handle Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // PostMessage helpers for YouTube iframe API
  const sendYouTubeCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (err) {
        // Ignored
      }
    }
  };

  // Sync mute state to YouTube player
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (nextMuted) {
      sendYouTubeCommand('mute');
    } else {
      sendYouTubeCommand('unMute');
      sendYouTubeCommand('setVolume', [100]);
    }
  };

  // Toggle play/pause state
  const togglePlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextPlaying = !isPlaying;
    setIsPlaying(nextPlaying);
    if (nextPlaying) {
      sendYouTubeCommand('playVideo');
    } else {
      sendYouTubeCommand('pauseVideo');
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Switch active video
  const selectVideo = (index: number) => {
    if (index === activeIndex) return;
    setIsLoaded(false);
    setActiveIndex(index);
    setIsPlaying(true);
  };

  const nextVideo = () => {
    if (activeVideos.length <= 1) return;
    selectVideo((activeIndex + 1) % activeVideos.length);
  };

  const prevVideo = () => {
    if (activeVideos.length <= 1) return;
    selectVideo((activeIndex - 1 + activeVideos.length) % activeVideos.length);
  };

  // IntersectionObserver: Pause when out of view, Play when in view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sendYouTubeCommand('playVideo');
            setIsPlaying(true);
          } else {
            sendYouTubeCommand('pauseVideo');
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [currentYouTubeId]);

  if (!activeVideos || activeVideos.length === 0 || !currentVideo || !currentYouTubeId) {
    return null;
  }

  // Construct zero-branding embed URL:
  // autoplay=1, mute=1, controls=0, loop=1, modestbranding=1, rel=0, playsinline=1, enablejsapi=1
  const embedUrl = `https://www.youtube-nocookie.com/embed/${currentYouTubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${currentYouTubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0`;

  return (
    <section className="w-full py-8 md:py-12 mt-4 mb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        {/* Section Header - styled same as category/reels section */}
        <div className="flex items-end justify-between mb-5 border-b border-brand-cream/60 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-burgundy/10 text-brand-burgundy border border-brand-burgundy/20">
                <Sparkles className="w-3 h-3 text-brand-burgundy" /> Showcase
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-outfit text-gray-900 tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-[12px] md:text-sm text-gray-600 font-medium">
              {sectionSubtitle}
            </p>
          </div>

          {activeVideos.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevVideo}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 hover:text-gray-900 transition shadow-xs"
                aria-label="Previous video"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextVideo}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-700 hover:text-gray-900 transition shadow-xs"
                aria-label="Next video"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Cinematic Full Video Player Container */}
        <div
          ref={containerRef}
          className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl bg-black border border-gray-200/50 group select-none transition-all duration-300 ${
            isFullscreen ? 'rounded-none h-screen w-screen' : 'aspect-[16/9] md:aspect-[21/9] min-h-[320px] md:min-h-[460px]'
          }`}
        >
          {/* Scaled YouTube Iframe to eliminate YouTube chrome, title bar, and watermarks */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center bg-black">
            <iframe
              ref={iframeRef}
              key={currentYouTubeId}
              src={embedUrl}
              title={currentVideo.title || "Featured Video"}
              className={`w-[135%] h-[135%] md:w-[125%] md:h-[125%] object-cover pointer-events-none border-0 transition-opacity duration-700 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => {
                setIsLoaded(true);
                // Ensure initial mute policy
                if (muted) {
                  sendYouTubeCommand('mute');
                }
              }}
            />
          </div>

          {/* Loading Skeleton / Poster Image prior to iframe render */}
          {!isLoaded && (
            <div className="absolute inset-0 z-0 bg-gray-900 flex items-center justify-center">
              {currentVideo.thumbnail_url || currentYouTubeId ? (
                <img
                  src={
                    currentVideo.thumbnail_url ||
                    `https://img.youtube.com/vi/${currentYouTubeId}/maxresdefault.jpg`
                  }
                  alt={currentVideo.title || "Loading video..."}
                  className="w-full h-full object-cover opacity-60 filter blur-xs"
                />
              ) : null}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              </div>
            </div>
          )}

          {/* Cinematic Ambient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent pointer-events-none"></div>

          {/* Top Floating Controls Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            {/* Badge Tag */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm pointer-events-auto">
                {currentVideo.badge_text || "Featured Story"}
              </span>
              {activeVideos.length > 1 && (
                <span className="hidden sm:inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-white/90 border border-white/10">
                  {activeIndex + 1} / {activeVideos.length}
                </span>
              )}
            </div>

            {/* Interactive Control Buttons */}
            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-black/45 backdrop-blur-md hover:bg-black/70 border border-white/15 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" fill="currentColor" />}
              </button>

              {/* Sound Mute / Unmute Toggle Button */}
              <button
                onClick={toggleMute}
                className={`w-10 h-10 rounded-full backdrop-blur-md border border-white/15 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-md ${
                  muted 
                    ? 'bg-black/45 hover:bg-black/70 text-white' 
                    : 'bg-brand-burgundy hover:bg-brand-burgundy/90 text-white'
                }`}
                aria-label={muted ? 'Unmute video sound' : 'Mute video sound'}
                title={muted ? 'Click to Unmute' : 'Mute'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 animate-pulse" />
                )}
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="hidden sm:flex w-10 h-10 rounded-full bg-black/45 backdrop-blur-md hover:bg-black/70 border border-white/15 text-white items-center justify-center transition-all duration-200 active:scale-95 shadow-md"
                aria-label="Toggle Fullscreen"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom Video Info & Call To Action */}
          <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 z-20 pointer-events-none flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-xl">
              <h3 className="text-xl md:text-3xl font-black font-outfit text-white leading-tight drop-shadow-lg mb-2">
                {currentVideo.title}
              </h3>
              {currentVideo.subtitle && (
                <p className="text-xs md:text-sm text-white/85 font-medium leading-relaxed drop-shadow-md line-clamp-2 max-w-lg mb-3">
                  {currentVideo.subtitle}
                </p>
              )}
            </div>

            {/* CTA Button */}
            {currentVideo.button_text && (
              <div className="pointer-events-auto shrink-0">
                <Link
                  href={currentVideo.button_link || "/categories"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-xl bg-white text-gray-900 hover:bg-brand-burgundy hover:text-white font-bold text-xs md:text-sm shadow-xl transition-all duration-300 group/btn active:scale-95"
                >
                  <span>{currentVideo.button_text}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Multi-Video Thumbnail Playlist Carousel (same as video/reels section) */}
        {activeVideos.length > 1 && (
          <div className="mt-4 pt-2">
            <div
              ref={playlistScrollRef}
              className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
            >
              {activeVideos.map((video, idx) => {
                const ytid = extractYouTubeId(video.youtube_url);
                const thumb =
                  video.thumbnail_url ||
                  (ytid ? `https://img.youtube.com/vi/${ytid}/mqdefault.jpg` : '');
                const isSelected = idx === activeIndex;

                return (
                  <button
                    key={video.id || idx}
                    onClick={() => selectVideo(idx)}
                    className={`shrink-0 snap-start text-left rounded-xl overflow-hidden cursor-pointer transition-all duration-300 w-[180px] md:w-[240px] p-1.5 border ${
                      isSelected
                        ? 'bg-white border-brand-burgundy ring-2 ring-brand-burgundy/30 shadow-md scale-[1.02]'
                        : 'bg-white/70 border-gray-200/80 hover:bg-white hover:border-gray-300 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 mb-2">
                      <img
                        src={thumb}
                        alt={video.title || "Video thumbnail"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20"></div>
                      
                      {/* Playing Indicator */}
                      {isSelected ? (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-brand-burgundy text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                          Now Playing
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center">
                            <Play className="w-3 h-3 ml-0.5 fill-current" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="px-1 pb-1">
                      <h4
                        className={`text-xs font-bold truncate leading-snug ${
                          isSelected ? 'text-brand-burgundy' : 'text-gray-900'
                        }`}
                      >
                        {video.title || `Showcase ${idx + 1}`}
                      </h4>
                      {video.subtitle && (
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">
                          {video.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
