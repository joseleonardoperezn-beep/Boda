'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Guest } from '@/lib/types';

interface RsvpSectionProps {
  guest: Guest;
}

export default function RsvpSection({ guest }: RsvpSectionProps) {
  const whatsappMessage = encodeURIComponent(
    `Hola Lis y Leo. Confirmo con mucha alegria mi asistencia a su boda el 7 de diciembre en Pamplona.\n\n` +
      `Nombre o Familia: ${guest.name}\n` +
      `Nos vemos muy pronto.`
  );

  const whatsappUrl = `https://wa.me/573108726049?text=${whatsappMessage}`;

  return (
    <section className="my-16 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium">
          Confirmación
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-pastel-charcoal">
          Acompáñanos
        </h2>
        <p className="font-serif italic text-base md:text-lg text-pastel-charcoal/80 max-w-md mx-auto">
          "Por favor, confirma tu asistencia lo antes posible o máximo hasta el 01 de noviembre."
        </p>
        <div className="w-16 h-0.5 bg-pastel-yellow mx-auto rounded-full" />
      </div>

      <div className="oil-card p-6 md:p-8 max-w-lg mx-auto space-y-5">
        
        {/* Mensaje de Invitación Intransferible */}
        <div className="mb-4 text-center bg-white/40 border border-pastel-blue/30 rounded-lg p-3 shadow-sm">
          <p className="font-serif italic text-sm text-pastel-charcoal/90">
            * Esta invitación es estrictamente personal e intransferible, válida únicamente para la(s) persona(s) que indica la tarjeta.
          </p>
        </div>

        {/* Botón Único de WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-full bg-[#25D366] text-white hover:bg-[#128C7E] font-sans text-xs uppercase tracking-widest transition-all shadow-oil-subtle flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Confirmar por WhatsApp</span>
        </a>
      </div>
    </section>
  );
}