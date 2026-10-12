'use client';

import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, SkipForward, Play } from 'lucide-react';

interface IntroVideoProps {
  onFinish: () => void;
}

export default function IntroVideo({ onFinish }: IntroVideoProps) {
  const [isFading, setIsFading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFinish = () => {
    setIsFading(true);
    setTimeout(() => {
      onFinish();
    }, 1000);
  };

  const handleStart = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Autoplay bloqueado:", e));
    }
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
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

      {/* Reproductor Nativo HTML5 */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          ref={videoRef}
          src="https://www.dropbox.com/scl/fi/xnu9ss9z0a71bmkyudagp/video-output-506CCBEA-08FE-472C-95CA-970FC80E2BE2-1.mov?rlkey=7pqug3h3r9ifi83ezuoq644fz&st=pd9jjodc&raw=1" 
          className="w-full h-full object-cover opacity-90"
          playsInline
          onEnded={handleFinish}
        />
      </div>
    </div>
  );
}