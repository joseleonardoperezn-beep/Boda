'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Guest } from '@/lib/types';
import IntroVideo from '@/components/IntroVideo';
import BackgroundVideo from '@/components/BackgroundVideo';
import EventDetails from '@/components/EventDetails';
import GiftRegistry from '@/components/GiftRegistry';
import RsvpSection from '@/components/RsvpSection';

export default function InvitationPage() {
  const params = useParams();
  const guestId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // IDs de los videos de YouTube seleccionados por Lis y Leo
  const INTRO_YOUTUBE_ID = 'DagcLaYABC0';
  const BACKGROUND_YOUTUBE_ID = 'p3sv-fDlD30';

  useEffect(() => {
    async function fetchGuest() {
      if (!guestId) return;
      try {
        const docRef = doc(db, 'guests', guestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setGuest(docSnap.data() as Guest);
        }
      } catch (err) {
        console.error('Error al cargar invitado:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGuest();
  }, [guestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-cream text-pastel-charcoal font-serif italic text-lg">
        Preparando la invitación de Lis y Leo...
      </div>
    );
  }

  if (!guest) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-pastel-cream text-pastel-charcoal p-6 text-center space-y-4">
        <h1 className="font-serif text-3xl">Invitación no encontrada</h1>
        <p className="font-sans text-sm text-pastel-charcoal/70 max-w-sm">
          Por favor verifica que el enlace sea el correcto o comunícate con Lis y Leo.
        </p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen oil-canvas-texture text-pastel-charcoal">
      {/* 1. Video Inicial Abrebocas (DagcLaYABC0) con fade-out al terminar o saltar */}
      {showIntro && (
        <IntroVideo
          videoId={INTRO_YOUTUBE_ID}
          onFinish={() => setShowIntro(false)}
        />
      )}

      {/* 2. Video de Fondo (p3sv-fDlD30) CON LA CANCIÓN ACTIVA */}
      {/* startAudio={!showIntro} inicia la música en cuanto se cierra el video inicial */}
      <BackgroundVideo
        videoId={BACKGROUND_YOUTUBE_ID}
        startAudio={!showIntro}
      />

      {/* 3. Contenido de la Invitación Principal */}
      <div className="relative z-10 max-w-xl mx-auto px-5 py-16 md:py-24 space-y-12">
        {/* Encabezado */}
        <header className="text-center space-y-4">
          <p className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium">
            Nuestra Boda
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-wide text-pastel-charcoal brush-stroke-accent inline-block pb-2">
            Lis & Leo
          </h1>
          <p className="font-serif italic text-xl text-pastel-charcoal/80 pt-2">
            07de Diciembre de 2026
          </p>
        </header>

        {/* Dedicatoria Personalizada extraída de Google Sheets / Firebase */}
        <section className="oil-card p-8 md:p-10 text-center space-y-5 border-pastel-yellow/30">
          <span className="text-[11px] uppercase tracking-widest text-pastel-yellow-dark font-sans font-medium">
            Especialmente para
          </span>
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-pastel-charcoal">
            {guest.name}
          </h2>
          <div className="w-12 h-0.5 bg-pastel-blue mx-auto rounded-full" />
          <p className="font-serif italic text-base md:text-lg text-pastel-charcoal/90 leading-relaxed font-light">
            "{guest.dedication}"
          </p>
        </section>

        {/* Detalles del Evento y Mapa de Pamplona */}
        <EventDetails />

        {/* Mesa de Regalos con actualización en tiempo real */}
        <GiftRegistry guestId={guest.id} guestName={guest.name} />

        {/* Confirmación RSVP Web + WhatsApp */}
        <RsvpSection guest={guest} weddingPhone="573001234567" />

        {/* Pie de página */}
        <footer className="text-center pt-8 pb-4 space-y-2 text-pastel-charcoal/60">
          <p className="font-serif italic text-sm">Con amor inmenso, Lis & Leo</p>
          <p className="font-sans text-[10px] uppercase tracking-widest">
            Pamplona, Colombia • 2026
          </p>
        </footer>
      </div>
    </main>
  );
}

