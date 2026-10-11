# Plataforma de Invitaciones de Boda - Lis & Leo 💍

Plataforma web dinámica y personalizada para la boda de **Lis y Leo** (7 de diciembre de 2026, Casa de Retiros Nazareth, Pamplona).

## Características Principales:
1. **Rutas Dinámicas Únicas:** `/invitacion/[id_invitado]` para cada persona o familia con su saludo y dedicatoria personal.
2. **Video Abrebocas con Transición:** Video a pantalla completa (`DagcLaYABC0`) con botón de saltar y fade-out suave hacia la invitación.
3. **Video de Fondo con Canción Activa:** Video en bucle (`p3sv-fDlD30`) que arranca automáticamente con su canción apenas termina el video inicial, con botón flotante discreto de música.
4. **Mesa de Regalos en Tiempo Real:** Actualizaciones inmediatas en Firebase Firestore con regalos individuales y aportes grupales.
5. **Confirmación RSVP:** Vía Web y por WhatsApp con mensaje pre-redactado.
6. **Sincronización con Google Sheets:** Lis y Leo administran los invitados en una hoja de cálculo y sincronizan con 1 clic mediante Google Apps Script.
7. **Estética Minimalista y Óleo:** Tonos pastel (azul, amarillo, blanco, crema) con texturas de lienzo y tipografía elegante.

---

## Estructura de Carpetas

```text
├── app/
│   ├── api/sync-guests/route.ts  # Endpoint para Google Sheets
│   ├── invitacion/[id]/page.tsx  # Página dinámica del invitado
│   ├── globals.css               # Estilos y efecto óleo
│   ├── layout.tsx                # Fuentes y estructura HTML
│   └── page.tsx                  # Portada general
├── components/
│   ├── BackgroundVideo.tsx       # Video de fondo en bucle con música
│   ├── EventDetails.tsx          # Fecha, hora, mapa de Pamplona y nota de frío
│   ├── GiftRegistry.tsx          # Mesa de regalos en tiempo real
│   ├── IntroVideo.tsx            # Abrebocas con detección de fin y fade-out
│   └── RsvpSection.tsx           # Confirmación Web + WhatsApp
├── lib/
│   ├── firebase.ts               # Conexión a Firebase Firestore
│   └── types.ts                  # Tipos TypeScript
├── scripts/
│   ├── google-apps-script.js     # Código para Google Sheets
│   └── seed-gifts.js             # Precarga opcional de regalos
├── package.json
└── tailwind.config.ts
```

