import { PricingPlan, PricingExtra } from "../types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "esencial",
    name: { es: "Esencial", en: "Essential" },
    priceUSD: 25,
    priceDOP: 1200,
    description: {
      es: "La opción perfecta para quienes buscan elegancia, rapidez y sencillez.",
      en: "The perfect option for those seeking elegance, speed and simplicity."
    },
    features: [
      { es: "Invitación digital elegante e interactiva", en: "Elegant, interactive digital invitation" },
      { es: "Cuenta regresiva en vivo", en: "Live countdown" },
      { es: "Ubicación con enlace directo a Waze y Google Maps", en: "Venue location with direct Waze & Google Maps links" },
      { es: "Guía de código de vestimenta (Dress Code)", en: "Dress code guide" },
      { es: "Validez activa durante 3 meses", en: "Active for 3 months" }
    ],
    ctaText: { es: "Solicitar Plan Esencial", en: "Request Essential Plan" }
  },
  {
    id: "popular",
    name: { es: "Popular", en: "Popular" },
    priceUSD: 49,
    priceDOP: 2500,
    badge: { es: "El más elegido", en: "Most popular" },
    isPopular: true,
    description: {
      es: "Nuestra experiencia completa recomendada para bodas y 15 años.",
      en: "Our complete experience, recommended for weddings and quinceañeras."
    },
    features: [
      { es: "Todo lo incluido en el plan Esencial", en: "Everything in the Essential plan" },
      { es: "Confirmación RSVP interactiva para invitados", en: "Interactive RSVP confirmation for guests" },
      { es: "Música de fondo personalizada con reproductor", en: "Custom background music with player" },
      { es: "Galería de hasta 15 fotografías de alta calidad", en: "Gallery of up to 15 high-quality photos" },
      { es: "Sección de Historia de la Pareja o Homenaje", en: "Couple's Story or Tribute section" },
      { es: "Validez activa durante 6 meses", en: "Active for 6 months" }
    ],
    ctaText: { es: "Solicitar Plan Popular", en: "Request Popular Plan" }
  },
  {
    id: "premium",
    name: { es: "Premium", en: "Premium" },
    priceUSD: 79,
    priceDOP: 4000,
    badge: { es: "VIP Eventos", en: "VIP Events" },
    description: {
      es: "Diseñado para eventos exigentes que buscan control de acceso y cero límites.",
      en: "Designed for demanding events that need access control and zero limits."
    },
    features: [
      { es: "Todo lo incluido en el plan Popular", en: "Everything in the Popular plan" },
      { es: "Código QR individual para control en puerta", en: "Individual QR code for door check-in" },
      { es: "Galería de fotografías ilimitada", en: "Unlimited photo gallery" },
      { es: "Cronograma e itinerario interactivo del día", en: "Interactive day-of schedule & itinerary" },
      { es: "Mesa de regalos con datos bancarios y Amazon", en: "Gift registry with bank details and Amazon" },
      { es: "Recordatorios de fecha vía WhatsApp", en: "Date reminders via WhatsApp" },
      { es: "Validez activa durante 9 meses", en: "Active for 9 months" }
    ],
    ctaText: { es: "Solicitar Plan Premium", en: "Request Premium Plan" }
  },
  {
    id: "luxury",
    name: { es: "Luxury", en: "Luxury" },
    priceUSD: 129,
    priceDOP: 6500,
    badge: { es: "Exclusivo 100%", en: "100% Exclusive" },
    description: {
      es: "Diseño 100% a la medida por un diseñador dedicado y dominio web propio.",
      en: "100% bespoke design by a dedicated designer, plus your own web domain."
    },
    features: [
      { es: "Todo lo incluido en el plan Premium", en: "Everything in the Premium plan" },
      { es: "Diseño 100% personalizado por un diseñador", en: "100% custom design by a dedicated designer" },
      { es: "Video de portada de alta definición en bucle", en: "HD looping cover video" },
      { es: "Dominio web propio personalizado (ej: boda.com)", en: "Your own custom web domain (e.g. wedding.com)" },
      { es: "Galería de fotos post-evento para invitados", en: "Post-event photo gallery for guests" },
      { es: "Validez activa durante 1 año completo", en: "Active for a full year" }
    ],
    ctaText: { es: "Solicitar Plan Luxury", en: "Request Luxury Plan" }
  }
];

export const PRICING_EXTRAS: PricingExtra[] = [
  {
    id: "bilingue",
    title: { es: "Versión Bilingüe / Inglés", en: "Bilingual / English Version" },
    priceUSD: 15,
    priceDOP: 900,
    description: {
      es: "Añade un selector de idioma para invitados internacionales (Español / English).",
      en: "Add a language selector for international guests (Spanish / English)."
    }
  },
  {
    id: "dominio-propio",
    title: { es: "Dominio Web Propio", en: "Custom Web Domain" },
    priceUSD: 25,
    priceDOP: 1500,
    description: {
      es: "Dirección web única y personalizada para tu evento (ejemplo: miboda.com).",
      en: "A unique, personalized web address for your event (e.g. mywedding.com)."
    }
  },
  {
    id: "galeria-extra",
    title: { es: "Galería Post-Evento", en: "Post-Event Gallery" },
    priceUSD: 15,
    priceDOP: 900,
    description: {
      es: "Espacio para subir fotos y videos del evento para que los invitados las descarguen.",
      en: "A space to upload event photos and videos for your guests to download."
    }
  }
];
