'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

interface BackgroundVideoProps {
  startAudio?: boolean;
}

export default function BackgroundVideo({ startAudio = false }: BackgroundVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Iniciar audio y video cuando startAudio se vuelve true (al terminar el intro)
  useEffect(() => {
    if (startAudio && videoRef.current) {
      videoRef.current.muted = false; // Desmutear
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(e => console.log("Autoplay bloqueado:", e));
    }
  }, [startAudio]);

  const toggleAudio = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.play();
      setIsMuted(false);
      setIsPlaying(true);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* 1. Video de Fondo a Pantalla Completa usando HTML5 nativo */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          src="https://www.dropbox.com/scl/fi/7ajhyib3fjdgsovt19xfz/video-output-DE638A98-C81B-48BA-A2C7-F32A8570905F-2.mov?rlkey=fxb34wed8kv7jeif9imjium1r&st=zzsbwubn&raw=1"
          className="w-full h-full object-cover filter contrast-[0.92] saturate-[0.88] brightness-[1.04]"
          autoPlay // Inicia automáticamente (probablemente muteado por el navegador hasta que startAudio sea true)
          loop // Se repite infinitamente
          muted // Comienza muteado por defecto para permitir el autoplay en móviles
          playsInline // Evita que se abra en pantalla completa en iOS
        />

        {/* Capa de Superposición de Óleo (Modificada para dejar ver el video y leer el texto) */}
        <div className="absolute inset-0 bg-pastel-cream/50 backdrop-blur-sm" />
      </div>

      {/* 2. Botón Flotante Discreto de Música para el Invitado */}
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