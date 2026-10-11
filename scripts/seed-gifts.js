/**
 * Script opcional para precargar regalos de prueba en Firestore
 * Ejecución: node scripts/seed-gifts.js
 */
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Reemplaza con tus datos de Firebase o usa dotenv
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const INITIAL_GIFTS = [
  {
    title: "Juego de Vajilla Artesanal",
    description: "Juego de cerámica artesanal de 6 puestos para nuestra nueva mesa.",
    price_approx: 350000,
    is_group_gift: false,
    target_amount: 0,
    current_amount: 0,
    is_reserved: false
  },
  {
    title: "Cafetera Espresso",
    description: "Para compartir nuestras mañanas con un café recién preparado.",
    price_approx: 450000,
    is_group_gift: false,
    target_amount: 0,
    current_amount: 0,
    is_reserved: false
  },
  {
    title: "Fondo para Luna de Miel",
    description: "Aporte voluntario colectivo para nuestro viaje soñado juntos.",
    price_approx: 2500000,
    is_group_gift: true,
    target_amount: 2500000,
    current_amount: 0,
    is_reserved: false
  },
  {
    title: "Set de Sábanas de Lino 100%",
    description: "Juego de cama suave en tonos neutros para nuestro nuevo hogar.",
    price_approx: 300000,
    is_group_gift: false,
    target_amount: 0,
    current_amount: 0,
    is_reserved: false
  },
  {
    title: "Aspiradora Robot Inteligente",
    description: "Aporte grupal para ayudarnos a mantener limpio nuestro hogar.",
    price_approx: 950000,
    is_group_gift: true,
    target_amount: 950000,
    current_amount: 0,
    is_reserved: false
  }
];

async function seed() {
  console.log("Cargando regalos iniciales en Firestore...");
  for (const gift of INITIAL_GIFTS) {
    await addDoc(collection(db, "gifts"), gift);
    console.log(`✅ Regalo agregado: ${gift.title}`);
  }
  console.log("¡Listo! Regalos disponibles en la mesa de regalos.");
  process.exit(0);
}

seed().catch(console.error);

