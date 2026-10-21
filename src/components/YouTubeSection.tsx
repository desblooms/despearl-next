'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ExternalLink,
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
  sectionTitle = "Watch Our Stories",
  sectionSubtitle = "Explore curated collections and designs in motion"
}: YouTubeSectionProps) {
  // Filter active and valid videos
  const activeVideos = useMemo(() => {
    return (videos || []).filter((v) => {
      const active = v.is_active === undefined || Number(v.is_active) === 1;
      return active && !!extractYouTubeId(v.youtube_url);
    });
  }, [videos]);

  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Track mute state per video
  const [mutedMap, setMutedMap] = useState<Record<number, boolean>>({});
  // Track active playing state per video
  const [playingMap, setPlayingMap] = useState<Record<number, boolean>>({});
  // Track which videos have loaded and are ready (to fade out poster cleanly)
  const [videoReadyMap, setVideoReadyMap] = useState<Record<number, boolean>>({});
  // Active video for fullscreen modal
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  // Modal loading state
  const [modalReady, setModalReady] = useState(false);

  // References to iframes for postMessage control
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});

  // Helper to send postMessage command to an iframe
  const sendIframeCommand = useCallback((videoId: number, func: string, args: any[] = []) => {
    const iframe = iframeRefs.current[videoId];
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

  // Initialize mute state (all muted by default for autoplay compliance)
  useEffect(() => {
    const initialMuted: Record<number, boolean> = {};
    activeVideos.forEach((v) => {
      initialMuted[v.id] = true;
    });
    setMutedMap(initialMuted);
  }, [activeVideos]);

  // Reset modal ready state when selected video changes
  useEffect(() => {
    setModalReady(false);
  }, [selectedVideo]);

  // Handle iframe postMessages from YouTube API (listening for playback start and quality)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        // When YouTube player state becomes 1 (PLAYING)
        if (data.event === 'onStateChange' && data.info === 1) {
          // Identify which video started playing
          Object.entries(iframeRefs.current).forEach(([vidIdStr, iframe]) => {
            if (iframe && iframe.contentWindow === event.source) {
              const vidId = Number(vidIdStr);
              setVideoReadyMap((prev) => ({ ...prev, [vidId]: true }));
              // Force 1080p high quality playback
              sendIframeCommand(vidId, 'setPlaybackQuality', ['hd1080']);
              sendIframeCommand(vidId, 'setPlaybackQualityRange', ['hd1080', 'highres']);
            }
          });
        }
      } catch (e) {
        // Not a JSON message or non-YouTube postMessage
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendIframeCommand]);

  // IntersectionObserver to only autoplay videos when in viewport
  useEffect(() => {
    if (!carouselRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardEl = entry.target as HTMLElement;
          const vidId = Number(cardEl.dataset.videoid);
          if (!vidId) return;

          if (entry.isIntersecting) {
            sendIframeCommand(vidId, 'playVideo');
            sendIframeCommand(vidId, 'setPlaybackQuality', ['hd1080']);
            sendIframeCommand(vidId, 'setPlaybackQualityRange', ['hd1080', 'highres']);
            setPlayingMap((prev) => ({ ...prev, [vidId]: true }));
          } else {
            sendIframeCommand(vidId, 'pauseVideo');
            setPlayingMap((prev) => ({ ...prev, [vidId]: false }));
          }
        });
      },
      { threshold: 0.35 }
    );

    const cards = carouselRef.current.querySelectorAll('[data-videoid]');
    cards.forEach((card) => observer.observe(card));

    return () => {
      cards.forEach((card) => observer.unobserve(card));
    };
  }, [activeVideos, sendIframeCommand]);

  // Handle iframe initial load event
  const handleIframeLoad = (videoId: number) => {
    sendIframeCommand(videoId, 'setPlaybackQuality', ['hd1080']);
    sendIframeCommand(videoId, 'setPlaybackQualityRange', ['hd1080', 'highres']);
    // Fallback: fade out poster after slight buffer
    setTimeout(() => {
      setVideoReadyMap((prev) => ({ ...prev, [videoId]: true }));
    }, 600);
  };

  // Toggle Mute for a specific card
  const toggleCardMute = (e: React.MouseEvent, videoId: number) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyMuted = mutedMap[videoId] !== false;
    const nextMuted = !isCurrentlyMuted;

    setMutedMap((prev) => ({ ...prev, [videoId]: nextMuted }));

    if (nextMuted) {
      sendIframeCommand(videoId, 'mute');
    } else {
      sendIframeCommand(videoId, 'unMute');
      sendIframeCommand(videoId, 'setVolume', [100]);
    }
  };

  // Carousel navigation
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Handle card click
  const handleCardClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  if (!activeVideos || activeVideos.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 md:py-12 mt-4 mb-8">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 w-full">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 pb-3 border-b border-brand-cream/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-burgundy/10 text-brand-burgundy border border-brand-burgundy/20">
                <Sparkles className="w-3 h-3 text-brand-burgundy" /> Watch &amp; Explore
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black font-outfit text-gray-900 tracking-tight">
              {sectionTitle}
            </h2>
            <p className="text-[12px] md:text-sm text-gray-600 font-medium">
              {sectionSubtitle}
            </p>
          </div>

          {/* Left/Right Controls */}
          {activeVideos.length > 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-900 transition shadow-sm"
                aria-label="Previous videos"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-700 hover:text-gray-900 transition shadow-sm"
                aria-label="Next videos"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Video Carousel Cards */}
        <div
          ref={carouselRef}
          className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 scroll-smooth"
        >
          {activeVideos.map((video) => {
            const youtubeId = extractYouTubeId(video.youtube_url);
            if (!youtubeId) return null;

            const isMuted = mutedMap[video.id] !== false;
            const isReady = !!videoReadyMap[video.id];

            // HQ YouTube Embed with 1080p high quality enforcement
            const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&vq=hd1080&hd=1`;
            
            // Ultra HQ Maxres Poster
            const posterUrl = video.thumbnail_url || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;

            return (
              <div
                key={video.id}
                data-videoid={video.id}
                onClick={() => handleCardClick(video)}
                className="relative w-[240px] sm:w-[260px] md:w-[280px] shrink-0 snap-start aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden bg-black group cursor-pointer block select-none shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              >
                {/* Scaled YouTube Iframe (fills vertical 9:16 frame cleanly in HD) */}
                <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center bg-black pointer-events-none">
                  <iframe
                    ref={(el) => {
                      iframeRefs.current[video.id] = el;
                    }}
                    src={embedUrl}
                    title={video.title || "Video"}
                    onLoad={() => handleIframeLoad(video.id)}
                    className="w-[325%] h-full max-w-none object-cover pointer-events-none border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>

                {/* HQ Poster Image with Smooth Cross-Fade */}
                <div 
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 pointer-events-none ${
                    isReady ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <img
                    src={posterUrl}
                    alt={video.title}
                    onError={(e) => {
                      // Fallback to hqdefault if maxresdefault doesn't exist
                      (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
                    }}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Luxury Loading Ring Indicator */}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-white/20 flex items-center justify-center shadow-lg">
                      <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-[#D4AF37] border-r-[#D4AF37] animate-spin" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] drop-shadow-sm">
                      HD 1080P
                    </span>
                  </div>
                </div>

                {/* Dark Gradient Overlay for optimal text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20 pointer-events-none transition-opacity duration-300"></div>

                {/* Top-Right Mute Icon */}
                <div className="absolute top-4 right-4 z-20">
                  <button
                    onClick={(e) => toggleCardMute(e, video.id)}
                    className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-md pointer-events-auto"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                    title={isMuted ? "Click to unmute" : "Click to mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>

                {/* Bottom Overlay: Title & "Watch Reels ▶" Button */}
                <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-snug drop-shadow-md mb-2 line-clamp-2">
                    {video.title}
                  </h3>

                  {video.button_link ? (
                    <Link
                      href={video.button_link}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 hover:bg-black text-white text-xs font-semibold rounded-lg border border-white/10 shadow-md backdrop-blur-md transition-all group-hover:scale-105 pointer-events-auto"
                    >
                      <span>{video.button_text || "Watch Reels"}</span>
                      <Play className="w-3 h-3 fill-white text-white" />
                    </Link>
                  ) : (
                    <div 
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 hover:bg-black text-white text-xs font-semibold rounded-lg border border-white/10 shadow-md backdrop-blur-md transition-all group-hover:scale-105 pointer-events-auto"
                    >
                      <span>{video.button_text || "Watch Reels"}</span>
                      <Play className="w-3 h-3 fill-white text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Video Modal Lightbox (True 1080p HQ Playback) */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 animate-fadeIn"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-lg md:max-w-2xl bg-neutral-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-black/40">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    Full HD 1080p
                  </span>
                </div>
                <h3 className="text-white font-bold text-base md:text-lg truncate">
                  {selectedVideo.title}
                </h3>
                {selectedVideo.subtitle && (
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {selectedVideo.subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative aspect-[9/16] max-h-[70vh] md:max-h-[75vh] w-full bg-black mx-auto overflow-hidden">
              {(() => {
                const ytid = extractYouTubeId(selectedVideo.youtube_url);
                const modalPoster = selectedVideo.thumbnail_url || `https://img.youtube.com/vi/${ytid}/maxresdefault.jpg`;

                return (
                  <>
                    {/* Modal High Quality Loading Spinner */}
                    {!modalReady && (
                      <div className="absolute inset-0 bg-neutral-950 z-10 flex flex-col items-center justify-center">
                        <img
                          src={modalPoster}
                          alt=""
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`;
                          }}
                          className="absolute inset-0 w-full h-full object-cover opacity-30 blur-xs"
                        />
                        <div className="relative z-20 flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37]/30 border-t-[#D4AF37] animate-spin shadow-lg" />
                          <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-[#D4AF37]">
                            Loading in Full HD
                          </span>
                        </div>
                      </div>
                    )}

                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytid}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1&vq=hd1080&hd=1&enablejsapi=1`}
                      title={selectedVideo.title}
                      onLoad={() => setModalReady(true)}
                      className="w-full h-full object-contain border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </>
                );
              })()}
            </div>

            {/* Modal Footer */}
            {selectedVideo.button_link && (
              <div className="px-5 py-3.5 bg-black/60 border-t border-white/10 flex items-center justify-end">
                <Link
                  href={selectedVideo.button_link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-burgundy hover:bg-brand-burgundy/90 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  {selectedVideo.button_text || "Explore Collection"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
