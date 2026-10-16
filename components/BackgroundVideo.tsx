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
  const isUnlocked = useRef(false);

  useEffect(() => {
    const initBgPlayer = () => {
      if (!window.Vimeo) return;
      const iframe = document.getElementById('vimeo-bg-iframe');
      if (iframe) {
        playerRef.current = new window.Vimeo.Player(iframe);
        playerRef.current.ready().then(() => {
          playerRef.current.disableTextTrack().catch(() => {});
          // En Chrome móvil, iniciamos el video silenciado en segundo plano apenas carga
          if (!startAudio) {
            playerRef.current.setMuted(true).catch(() => {});
            playerRef.current.setVolume(0).catch(() => {});
            playerRef.current.play().catch(() => {});
          }
        });
        playerRef.current.on('play', () => {
          playerRef.current.disableTextTrack().catch(() => {});
        });
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

  // Desbloqueo con el primer toque/clic del usuario en la pantalla
  useEffect(() => {
    const unlockPlayer = () => {
      if (playerRef.current && !isUnlocked.current) {
        isUnlocked.current = true;
        playerRef.current.disableTextTrack().catch(() => {});
        playerRef.current.setMuted(true).catch(() => {});
        playerRef.current.setVolume(0).catch(() => {});
        playerRef.current.play().catch(() => {});
      }
    };

    window.addEventListener('click', unlockPlayer, { passive: true });
    window.addEventListener('touchstart', unlockPlayer, { passive: true });

    return () => {
      window.removeEventListener('click', unlockPlayer);
      window.removeEventListener('touchstart', unlockPlayer);
    };
  }, []);

  // Cuando termina la introducción (startAudio = true)
  useEffect(() => {
    if (startAudio && playerRef.current) {
      const startBackgroundPlayback = async () => {
        try {
          await playerRef.current.disableTextTrack().catch(() => {});
          await playerRef.current.setCurrentTime(0).catch(() => {});
          // Primero aseguramos que el video esté reproduciéndose (Chrome pausa iframes con opacity-0)
          await playerRef.current.play();
          setIsPlaying(true);

          // Luego intentamos activar el sonido
          await playerRef.current.setMuted(false);
          await playerRef.current.setVolume(0.85);
          setIsMuted(false);
        } catch (error) {
          // Si Chrome móvil bloquea el cambio de audio sin un nuevo toque,
          // forzamos que el video SÍ o SÍ se reproduzca visualmente en silencio
          console.log('Reproduciendo en modo silencioso por política de Chrome móvil:', error);
          try {
            await playerRef.current.setMuted(true);
            await playerRef.current.setVolume(0);
            await playerRef.current.play();
            setIsPlaying(true);
            setIsMuted(true);
          } catch (e) {
            console.log('Error secundario en play:', e);
          }
        }
      };

      startBackgroundPlayback();
    }
  }, [startAudio]);

  // Si en Chrome quedó silenciado al pasar la intro, el primer toque o scroll en la invitación activa la música
  useEffect(() => {
    if (!startAudio || !isMuted) return;

    const resumeAudioOnTouch = () => {
      if (playerRef.current && isMuted) {
        playerRef.current.setMuted(false).catch(() => {});
        playerRef.current.setVolume(0.85).catch(() => {});
        playerRef.current.play().catch(() => {});
        setIsMuted(false);
        setIsPlaying(true);
      }
    };

    window.addEventListener('touchstart', resumeAudioOnTouch, { once: true, passive: true });
    window.addEventListener('click', resumeAudioOnTouch, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', resumeAudioOnTouch);
      window.removeEventListener('click', resumeAudioOnTouch);
    };
  }, [startAudio, isMuted]);

  const toggleAudio = () => {
    if (!playerRef.current) return;

    if (isMuted) {
      playerRef.current.setMuted(false).catch(() => {});
      playerRef.current.setVolume(0.85).catch(() => {});
      playerRef.current.play().catch(() => {});
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      playerRef.current.setMuted(true).catch(() => {});
      playerRef.current.setVolume(0).catch(() => {});
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* 1. Video de Fondo a Pantalla Completa */}
      {/* Usamos opacity-[0.01] en lugar de opacity-0 cuando está detrás del intro para que Chrome Android no lo congele */}
      <div className={`fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${startAudio ? 'opacity-100' : 'opacity-[0.01]'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] transform scale-[1.25]">
          <iframe
            id="vimeo-bg-iframe"
            // autoplay=1, muted=1, playsinline=1 y texttrack=false garantizan reproducción automática en Chrome móvil sin subtítulos
            src="https://player.vimeo.com/video/1234909133?api=1&controls=0&title=0&byline=0&portrait=0&autoplay=1&muted=1&loop=1&autopause=0&playsinline=1&dnt=1&texttrack=false"
            className="absolute top-0 left-0 w-full h-full filter contrast-[0.92] saturate-[0.88] brightness-[1.04]"
            allow="autoplay; fullscreen; picture-in-picture"
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