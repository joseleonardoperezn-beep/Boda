import React from 'react';
import { Calendar, Clock, MapPin, Compass, Snowflake } from 'lucide-react';

export default function EventDetails() {
  return (
    <section className="my-14 space-y-8">
      {/* Título de la sección */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium">
          Conoce los
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-pastel-charcoal">
          Detalles de la Celebración
        </h2>
        <div className="w-16 h-0.5 bg-pastel-yellow mx-auto rounded-full" />
      </div>

      {/* Tarjetas de Fecha, Hora y Lugar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fecha */}
        <div className="oil-card p-6 text-center space-y-2">
          <Calendar className="w-7 h-7 mx-auto text-pastel-blue-dark stroke-1" />
          <h3 className="font-serif text-lg font-normal text-pastel-charcoal">Fecha</h3>
          <p className="font-sans text-sm text-pastel-charcoal/80 font-light">
            Lunes, 07 de Diciembre de 2026
          </p>
        </div>

        {/* Hora */}
        <div className="oil-card p-6 text-center space-y-2">
          <Clock className="w-7 h-7 mx-auto text-pastel-yellow-dark stroke-1" />
          <h3 className="font-serif text-lg font-normal text-pastel-charcoal">Hora</h3>
          <p className="font-sans text-sm text-pastel-charcoal/80 font-light">
            9:30 a.m. (Hora de Colombia)
          </p>
        </div>

        {/* Lugar */}
        <div className="oil-card p-6 text-center space-y-2">
          <MapPin className="w-7 h-7 mx-auto text-pastel-blue-dark stroke-1" />
          <h3 className="font-serif text-lg font-normal text-pastel-charcoal">Lugar</h3>
          <p className="font-sans text-sm text-pastel-charcoal/80 font-light">
            Casa de Retiros Nazareth<br />Pamplona, Norte de Santander
          </p>
        </div>
      </div>

      {/* Nota Clima Frío Pamplona */}
      <div className="oil-card p-5 border-l-4 border-pastel-blue bg-pastel-blue-light/30 flex items-start space-x-3">
        <Snowflake className="w-5 h-5 text-pastel-blue-dark mt-0.5 flex-shrink-0" />
        <p className="font-sans text-xs md:text-sm text-pastel-charcoal/90 leading-relaxed font-light">
          <span className="font-medium text-pastel-charcoal">Nota importante:</span> Pamplona es un lugar frío, por lo que recomendamos llevar ropa abrigada y elegante para disfrutar cómodamente de cada momento.
        </p>
      </div>

      {/* Mapa de Google */}
            <div className="oil-card overflow-hidden p-3 space-y-3">
              <div className="rounded-xl overflow-hidden h-64 md:h-80 w-full relative">
                <iframe
                  title="Ubicación Casa de Encuentros Nazareth"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.924725991393!2d-72.64779442467875!3d7.362334792646762!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e68813a071b163d%3A0x7b21776691dc4367!2sCasa%20de%20Encuentros%20Nazareth!5e0!3m2!1ses!2sco!4v1791734711306!5m2!1ses!2sco"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter saturate-[0.85] contrast-[1.05]"
                />
              </div>
              <div className="text-center pt-2 pb-1">
                <a
                  href="https://maps.app.goo.gl/B5tZkgDCahEjKodM7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-pastel-blue-dark hover:text-pastel-charcoal font-sans transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Abrir en Google Maps</span>
                </a>
              </div>
            </div>
          </section>
        );
      }