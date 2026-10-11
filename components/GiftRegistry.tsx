'use client';

import React from 'react';
import { Mail, Heart } from 'lucide-react';

// 1. Definimos la interfaz con los datos que recibe el componente
interface GiftRegistryProps {
  guestId: string;
  guestName: string;
}

// 2. Le indicamos a la función que acepte esas propiedades
export default function GiftRegistry({ guestId, guestName }: GiftRegistryProps) {
  return (
    <section className="my-20 space-y-8 text-center px-4">
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium">
          Muestras de Cariño
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-pastel-charcoal">
          Lluvia de Sobres
        </h2>
        <div className="w-16 h-0.5 bg-pastel-yellow mx-auto rounded-full mt-4" />
      </div>

      <div className="oil-card p-8 md:p-10 max-w-2xl mx-auto space-y-6 relative overflow-hidden">
        {/* Elemento decorativo de fondo */}
        <div className="absolute -top-10 -right-10 text-pastel-cream-dark/30 transform rotate-12 pointer-events-none">
          <Mail className="w-40 h-40" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mx-auto shadow-sm border border-pastel-yellow/30">
            <Mail className="w-7 h-7 text-pastel-blue-dark" />
          </div>
          
          <p className="font-serif italic text-base md:text-lg text-pastel-charcoal/90 leading-relaxed max-w-lg mx-auto">
            "Para nosotros lo más importante es tu presencia. Sin embargo, si deseas tener un detalle adicional con nosotros, en el lugar de la recepción contaremos con un buzón para lluvia de sobres."
          </p>
          
          <div className="flex justify-center pt-2">
            <Heart className="w-5 h-5 text-pastel-yellow/80" />
          </div>
        </div>
      </div>
    </section>
  );
}