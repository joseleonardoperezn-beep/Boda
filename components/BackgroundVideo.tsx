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
          // Lo mantenemos pausado en el segundo 0 mientras está el video de introducción
          if (!startAudio) {
            playerRef.current.pause().catch(() => {});
            playerRef.current.setCurrentTime(0).catch(() => {});
          }
        });
        playerRef.current.on('play', () => {
          playerRef.current.disableTextTrack().catch(() => {});
        });
        playerRef.current.on('ended', () => {
          playerRef.current.setCurrentTime(0).catch(() => {});
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

  // TRUCO DE DESBLOQUEO DE AUDIO PARA CHROME Y SAFARI:
  // Cuando el invitado toca "Camina con nosotros" o "Saltar", aprovechamos ese clic exacto
  // para desbloquear el canal de audio CON SONIDO (no silenciado) por un instante y pausarlo en 0:00.
  useEffect(() => {
    const unlockAudioWithGesture = () => {
      if (playerRef.current && !isUnlocked.current && !startAudio) {
        isUnlocked.current = true;
        playerRef.current.disableTextTrack().catch(() => {});
        // Desbloqueamos el elemento de audio del iframe con sonido mínimo y lo pausamos de inmediato en 0:00
        playerRef.current.setMuted(false).catch(() => {});
        playerRef.current.setVolume(0.01).catch(() => {});
        playerRef.current
          .play()
          .then(() => {
            setTimeout(() => {
              if (!startAudio && playerRef.current) {
                playerRef.current.pause().catch(() => {});
                playerRef.current.setCurrentTime(0).catch(() => {});
              }
            }, 150);
          })
          .catch(() => {});
      }
    };

    window.addEventListener('click', unlockAudioWithGesture, { passive: true });
    window.addEventListener('touchstart', unlockAudioWithGesture, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudioWithGesture);
      window.removeEventListener('touchstart', unlockAudioWithGesture);
    };
  }, [startAudio]);

  // Apenas termina o se salta el video de introducción (startAudio = true):
  // Ponemos el video en el segundo 0:00, activamos la música al 85% y le damos Play.
  useEffect(() => {
    if (startAudio && playerRef.current) {
      const startFromBeginningWithMusic = async () => {
        try {
          await playerRef.current.disableTextTrack().catch(() => {});
          // 1. Forzamos a que empiece exactamente desde el inicio (0:00)
          await playerRef.current.setCurrentTime(0).catch(() => {});
          // 2. Activamos el audio y el volumen de la canción
          await playerRef.current.setMuted(false).catch(() => {});
          await playerRef.current.setVolume(0.85).catch(() => {});
          // 3. Reproducimos video + música sincronizados desde el segundo 0
          await playerRef.current.play();
          setIsPlaying(true);
          setIsMuted(false);
        } catch (error) {
          console.log('Reintentando reproducción en Chrome:', error);
          // Si por alguna razón el navegador restringió el audio automático tras 1:15 min,
          // iniciamos en 0:00 y en el primer roce de pantalla se activa el volumen
          try {
            await playerRef.current.setCurrentTime(0).catch(() => {});
            await playerRef.current.setMuted(true).catch(() => {});
            await playerRef.current.play();
            setIsPlaying(true);
            setIsMuted(true);
          } catch (e) {
            console.log('Error secundario:', e);
          }
        }
      };

      startFromBeginningWithMusic();
    }
  }, [startAudio]);

  // Respaldo para Chrome: si al terminar el minuto y 15 segundos de intro Chrome pide un toque para el sonido
  useEffect(() => {
    if (!startAudio || !isMuted) return;

    const enableSoundOnFirstInteraction = () => {
      if (playerRef.current) {
        playerRef.current.setMuted(false).catch(() => {});
        playerRef.current.setVolume(0.85).catch(() => {});
        playerRef.current.play().catch(() => {});
        setIsMuted(false);
        setIsPlaying(true);
      }
    };

    window.addEventListener('touchstart', enableSoundOnFirstInteraction, { once: true, passive: true });
    window.addEventListener('scroll', enableSoundOnFirstInteraction, { once: true, passive: true });
    window.addEventListener('click', enableSoundOnFirstInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener('touchstart', enableSoundOnFirstInteraction);
      window.removeEventListener('scroll', enableSoundOnFirstInteraction);
      window.removeEventListener('click', enableSoundOnFirstInteraction);
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
      <div className={`fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none transition-opacity duration-1000 ease-in-out ${startAudio ? 'opacity-100' : 'opacity-[0.01]'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] min-w-[177.78vh] min-h-[56.25vw] transform scale-[1.25]">
          <iframe
            id="vimeo-bg-iframe"
            // autoplay=0 y sin muted=1 para que no avance solo a mitad de video ni bloquee la pista de audio de Vimeo
            src="https://player.vimeo.com/video/1234909133?api=1&controls=0&title=0&byline=0&portrait=0&autoplay=0&loop=1&autopause=0&playsinline=1&dnt=1&texttrack=false"
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