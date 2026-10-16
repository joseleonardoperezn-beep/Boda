'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, SkipForward, Play, Smartphone } from 'lucide-react';

interface IntroVideoProps {
  onFinish: () => void;
}

declare global {
  interface Window {
    Vimeo?: any;
  }
}

export default function IntroVideo({ onFinish }: IntroVideoProps) {
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
    const initPlayer = () => {
      if (!window.Vimeo) return;
      const iframe = document.getElementById('vimeo-intro-iframe');
      if (iframe) {
        playerRef.current = new window.Vimeo.Player(iframe);
        // Desactivar subtítulos automáticos de Vimeo al cargar y reproducir
        playerRef.current.ready().then(() => {
          playerRef.current.disableTextTrack().catch(() => {});
        });
        playerRef.current.on('play', () => {
          playerRef.current.disableTextTrack().catch(() => {});
        });
        playerRef.current.on('ended', () => {
          handleFinish();
        });
      }
    };

    if (!window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = initPlayer;
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy().catch(() => {});
      }
    };
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    if (playerRef.current) {
      playerRef.current.disableTextTrack().catch(() => {});
      playerRef.current.setVolume(1);
      playerRef.current.play().catch((e: any) => console.log("Autoplay bloqueado:", e));
    }
  };

  const toggleSound = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.setVolume(1);
        setIsMuted(false);
      } else {
        playerRef.current.setVolume(0);
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
      <div className="absolute top-6 right-6 z-30 flex items-center space-x-3 pointer-events-auto">
        {hasStarted && (
          <button
            onClick={toggleSound}
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

      {/* Pantalla previa para el celular (Botón de inicio) */}
      {!hasStarted && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-pastel-cream/95 backdrop-blur-sm text-center px-6 pointer-events-auto">
          <p className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium mb-2">
            Nuestra Historia
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-pastel-charcoal mb-4">
            Lis & Leo
          </h1>
          <div className="flex flex-col items-center space-y-4 mb-6 text-center px-4">
            <p className="font-serif text-sm md:text-base text-pastel-charcoal/80 tracking-wide">
              1 Juan 4, 19: "Nosotros amamos, porque Él nos amó primero."
            </p>
            <p className="font-serif italic text-lg md:text-xl text-pastel-charcoal max-w-lg mx-auto leading-relaxed">
              "Gracias por acompañarnos todo este tiempo en nuestro camino, queremos que sigas siendo parte de nuestra historia"
            </p>
          </div>

          {/* Recomendación de rotación horizontal para celulares */}
          <div className="md:hidden flex items-center space-x-2.5 px-4 py-2.5 mb-7 rounded-2xl bg-white/60 border border-pastel-blue/40 text-pastel-charcoal/80 max-w-xs shadow-sm">
            <Smartphone className="w-5 h-5 text-pastel-blue-dark -rotate-90 flex-shrink-0 animate-pulse" />
            <p className="font-sans text-[11px] leading-snug text-left">
              Si nos ves desde tu celular, te recomendamos <span className="font-medium text-pastel-charcoal">girarlo en horizontal</span> para disfrutar mejor el video.
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

      {/* Contenedor del IFrame de Vimeo con escalado para ocultar bordes negros */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden flex items-center justify-center bg-black">
        <div className="w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] relative transform scale-[1.15]">
          <iframe
            id="vimeo-intro-iframe"
            src="https://player.vimeo.com/video/1234909134?api=1&controls=0&title=0&byline=0&portrait=0&autopause=0&dnt=1&texttrack=false"
            className="absolute top-0 left-0 w-full h-full opacity-90"
            allow="autoplay; fullscreen; picture-in-picture"
            style={{ border: 'none' }}
          />
        </div>
      </div>
    </div>
  );
}