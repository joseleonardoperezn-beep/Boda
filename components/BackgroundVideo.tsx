'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface BackgroundVideoProps {
  videoId?: string;
  startAudio?: boolean;
}

export default function BackgroundVideo({
  videoId = 'p3sv-fDlD30',
  startAudio = false,
}: BackgroundVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initBgPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player('youtube-bg-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: any) => {
            if (startAudio) {
              event.target.unMute();
              event.target.setVolume(85);
              event.target.playVideo();
              setIsPlaying(true);
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.ENDED === 0 -> Bucle continuo
            if (event.data === 0) {
              event.target.seekTo(0);
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initBgPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initBgPlayer();
      };
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  // Al terminar o saltar el video de abrebocas, iniciar la canción automáticamente
  useEffect(() => {
    if (startAudio && playerRef.current && playerRef.current.playVideo) {
      playerRef.current.unMute();
      playerRef.current.setVolume(85);
      playerRef.current.playVideo();
      setIsPlaying(true);
      setIsMuted(false);
    }
  }, [startAudio]);

  const toggleAudio = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* 1. Video de Fondo a Pantalla Completa */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] transform scale-125">
          <div id="youtube-bg-player" className="w-full h-full filter contrast-[0.92] saturate-[0.88] brightness-[1.04]" />
        </div>

        {/* Capa de Superposición de Óleo (Modificada para dejar ver el video y leer el texto) */}
        <div className="absolute inset-0 bg-pastel-cream/50 backdrop-blur-sm" />
      </div>

      {/* 2. Botón Flotante Discreto de Música para el Invitado */}
      {startAudio && (
        <aside 
          aria-label="Control de música"
          className="fixed bottom-6 right-6 z-40 animate-fade-in"
        >
          <button
            onClick={toggleAudio}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-pastel-yellow/60 text-pastel-charcoal shadow-oil hover:bg-white transition-all transform hover:scale-105"
            title={isMuted ? 'Activar música' : 'Silenciar música'}
          >
            <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-gray-400' : 'bg-pastel-blue-dark animate-pulse'}`} />
            <Music className={`w-3.5 h-3.5 ${!isMuted && 'text-pastel-blue-dark'}`} />
            <span className="font-serif italic text-xs tracking-wide">
              {isMuted ? 'Música pausada' : 'Nuestra canción'}
            </span>
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-gray-500 ml-1" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-pastel-blue-dark ml-1" />
            )}
          </button>
        </aside>
      )}
    </>
  );
}
