'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SkipForward, Play } from 'lucide-react';

interface IntroVideoProps {
  onFinish: () => void;
  videoId?: string;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export default function IntroVideo({
  onFinish,
  videoId = 'DagcLaYABC0',
}: IntroVideoProps) {
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const playerRef = useRef<any>(null);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      onFinish();
    }, 1000);
  };

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player('youtube-intro-player', {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          cc_load_policy: 0,
          iv_load_policy: 3,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === 0) {
              handleFinish();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const handleStart = () => {
    setHasStarted(true);
    if (playerRef.current && playerRef.current.playVideo) {
      playerRef.current.unMute();
      playerRef.current.playVideo();
    }
  };

  const toggleSound = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-pastel-cream overflow-hidden transition-opacity duration-1000 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Botones Flotantes Superiores */}
      <div className="absolute top-6 right-6 z-30 flex items-center space-x-3">
        {hasStarted && (
          <button
            onClick={toggleSound}
            aria-label="Silenciar o activar sonido"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-pastel-charcoal hover:bg-white transition-all shadow-sm"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        <button
          onClick={handleFinish}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-xs font-serif tracking-widest uppercase text-pastel-charcoal hover:bg-white transition-all shadow-sm"
        >
          <span>Saltar</span>
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pantalla previa para garantizar audio en celulares */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-pastel-cream/95 backdrop-blur-sm text-center px-6">
          <p className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium mb-2">
            Nuestra Historia
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-pastel-charcoal mb-4">
            Lis & Leo
          </h1>
          <div className="flex flex-col items-center space-y-4 mb-10 text-center px-4">
            <p className="font-serif text-sm md:text-base text-pastel-charcoal/80 tracking-wide">
              1 Juan 4, 19: "Nosotros amamos, porque Él nos amó primero."
            </p>
            <p className="font-serif italic text-lg md:text-xl text-pastel-charcoal max-w-lg mx-auto leading-relaxed">
              "Gracias por acompañarnos todo este tiempo en nuestro camino, queremos que sigas siendo parte de nuestra historia"
            </p>
          </div>

          <button
            onClick={handleStart}
            className="inline-flex items-center space-x-3 px-7 py-3.5 rounded-full bg-pastel-blue text-white font-sans text-xs tracking-widest uppercase shadow-oil hover:bg-pastel-blue-dark transition-all transform hover:scale-105"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Camina con nosotros</span>
          </button>
        </div>
      )}

      {/* Contenedor del IFrame de YouTube con escalado para ocultar barras de YouTube */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] relative transform scale-110">
          <div id="youtube-intro-player" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

