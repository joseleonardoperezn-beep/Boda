import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen oil-canvas-texture flex flex-col items-center justify-center p-6 text-center">
      <div className="oil-card p-10 max-w-md w-full space-y-6">
        <p className="text-xs uppercase tracking-widest text-pastel-blue-dark font-sans font-medium">
          Nuestra Boda
        </p>
        <h1 className="font-serif text-5xl font-light text-pastel-charcoal brush-stroke-accent inline-block pb-2">
          Lis & Leo
        </h1>
        <p className="font-serif italic text-lg text-pastel-charcoal/80">
          7 de Diciembre de 2026 • Pamplona, Colombia
        </p>
        <div className="w-12 h-0.5 bg-pastel-yellow mx-auto rounded-full" />
        <p className="font-sans text-xs text-pastel-charcoal/70 leading-relaxed font-light">
          Para ver tu invitación personalizada, por favor abre el enlace único que te enviamos por WhatsApp.
        </p>
      </div>
    </main>
  );
}

