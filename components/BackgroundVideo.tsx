'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface BackgroundVideoProps {
  startAudio?: boolean;
}

declare global {
  interface Window {
    Vimeo?: any;
  }
}

export default function BackgroundVideo({ startAudio = false }: BackgroundVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initBgPlayer = () => {
      if (!window.Vimeo) return;
      const iframe = document.getElementById('vimeo-bg-iframe');
      if (iframe) {
        playerRef.current = new window.Vimeo.Player(iframe);
        playerRef.current.on('ended', () => {
          playerRef.current.play().catch(() => {});
        });
      }
    };

    if (!window.Vimeo) {
      const script = document.createElement('script');
      script.src = 'https://player.vimeo.com/api/player.js';
      script.onload = initBgPlayer;
      document.body.appendChild(script);
    } else {
      initBgPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy().catch(() => {});
      }
    };
  }, []);

  // Iniciar audio y video SOLAMENTE cuando startAudio se vuelve true
  useEffect(() => {
    if (startAudio && playerRef.current) {
      // Intentamos reproducir con volumen
      playerRef.current.setVolume(0.85);
      playerRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false); // ¡Éxito! Suena la música sin problemas
      }).catch((error: any) => {
        console.log("El navegador bloqueó el sonido automático. Iniciando Plan B...", error);
        // PLAN B: Si el celular bloquea el sonido, reproducimos el video silenciado 
        // para que la página no se quede congelada.
        playerRef.current.setVolume(0);
        playerRef.current.play().then(() => {
          setIsPlaying(true);
          setIsMuted(true); // Se queda en "Música pausada" para que el usuario le dé clic
        }).catch(() => {});
      });
    }
  }, [startAudio]);

  const toggleAudio = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.setVolume(0.85);
      playerRef.current.play();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      playerRef.current.setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* 1. Video de Fondo a Pantalla Completa (Completamente invisible hasta que startAudio sea true) */}
      <div className={`fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${startAudio ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] transform scale-[1.25]">
          <iframe
            id="vimeo-bg-iframe"
            // Cambiamos autoplay=1 a autoplay=0 para que espere nuestra orden
            src="https://player.vimeo.com/video/1234909133?api=1&controls=0&title=0&byline=0&portrait=0&autoplay=0&muted=0&loop=1&autopause=0&dnt=1"
            className="absolute top-0 left-0 w-full h-full filter contrast-[0.92] saturate-[0.88] brightness-[1.04]"
            allow="autoplay; fullscreen"
            style={{ border: 'none' }}
          />
        </div>

        {/* Capa de Superposición de Óleo */}
        <div className="absolute inset-0 bg-pastel-cream/50 backdrop-blur-sm" />
      </div>

      {/* 2. Botón Flotante Discreto de Música */}
      {startAudio && (
        <aside 
          aria-label="Control de música"
          className="fixed bottom-6 right-6 z-40 animate-fade-in pointer-events-auto"
        >
          <button
            onClick={toggleAudio}
            className="flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-pastel-yellow/60 text-pastel-charcoal shadow-oil hover:bg-white transition-all transform hover:scale-105"
            title={isMuted ? 'Activar música' : 'Silenciar música'}
          >
            <div className={`w-2 h-2 rounded-full ${isMuted ? 'bg-gray-400' : 'bg-pastel-blue-dark animate-pulse'}`} />
            <Music className={`w-3.5 h-3.5 ${!isMuted ? 'text-pastel-blue-dark' : 'text-gray-500'}`} />
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