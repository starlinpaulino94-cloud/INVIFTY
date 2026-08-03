import { PricingPlan, PricingExtra, PlanComparisonRow } from "../types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "esencial",
    name: { es: "Esencial", en: "Essential" },
    priceUSD: 25,
    priceDOP: 1200,
    description: {
      es: "Toda la información de tu evento en un enlace elegante.",
      en: "All your event's information in one elegant link."
    },
    features: [
      { es: "Invitación digital elegante e interactiva", en: "Elegant, interactive digital invitation" },
      { es: "Cuenta regresiva en vivo", en: "Live countdown" },
      { es: "Ubicación con enlace directo a Waze y Google Maps", en: "Venue location with direct Waze & Google Maps links" },
      { es: "Guía de código de vestimenta (Dress Code)", en: "Dress code guide" },
      { es: "Validez activa durante 3 meses", en: "Active for 3 months" }
    ],
    deliveryTime: { es: "24–48 horas", en: "24–48 hours" },
    revisions: 1,
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
      es: "La invitación completa, con confirmaciones de tus invitados.",
      en: "The complete invitation, with guest confirmations."
    },
    features: [
      { es: "Todo lo incluido en el plan Esencial", en: "Everything in the Essential plan" },
      { es: "Confirmación RSVP interactiva para invitados", en: "Interactive RSVP confirmation for guests" },
      { es: "Música de fondo personalizada con reproductor", en: "Custom background music with player" },
      { es: "Galería de hasta 15 fotografías de alta calidad", en: "Gallery of up to 15 high-quality photos" },
      { es: "Sección de Historia de la Pareja o Homenaje", en: "Couple's Story or Tribute section" },
      { es: "Validez activa durante 6 meses", en: "Active for 6 months" }
    ],
    deliveryTime: { es: "48 horas", en: "48 hours" },
    revisions: 2,
    whyRecommended: {
      es: "La más elegida para bodas y 15 años: incluye RSVP, música, galería e historia sin pagar por funciones de control avanzado.",
      en: "The top choice for weddings and quinceañeras: RSVP, music, gallery and story included, without paying for advanced access control."
    },
    ctaText: { es: "Solicitar Plan Popular", en: "Request Popular Plan" }
  },
  {
    id: "premium",
    name: { es: "Premium", en: "Premium" },
    priceUSD: 79,
    priceDOP: 4000,
    badge: { es: "VIP Eventos", en: "VIP Events" },
    description: {
      es: "Control de acceso y gestión personalizada de tus invitados.",
      en: "Access control and personalized guest management."
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
    deliveryTime: { es: "48–72 horas", en: "48–72 hours" },
    revisions: 3,
    ctaText: { es: "Solicitar Plan Premium", en: "Request Premium Plan" }
  },
  {
    id: "luxury",
    name: { es: "Luxury", en: "Luxury" },
    priceUSD: 129,
    priceDOP: 6500,
    badge: { es: "Exclusivo 100%", en: "100% Exclusive" },
    description: {
      es: "Un diseño único creado desde cero para tu evento.",
      en: "A one-of-a-kind design created from scratch for your event."
    },
    features: [
      { es: "Todo lo incluido en el plan Premium", en: "Everything in the Premium plan" },
      { es: "Diseño 100% personalizado por un diseñador", en: "100% custom design by a dedicated designer" },
      { es: "Video de portada de alta definición en bucle", en: "HD looping cover video" },
      { es: "Dominio web propio personalizado (ej: boda.com)", en: "Your own custom web domain (e.g. wedding.com)" },
      { es: "Galería de fotos post-evento para invitados", en: "Post-event photo gallery for guests" },
      { es: "Validez activa durante 1 año completo", en: "Active for a full year" }
    ],
    deliveryTime: { es: "3–5 días hábiles", en: "3–5 business days" },
    revisions: 4,
    ctaText: { es: "Solicitar Plan Luxury", en: "Request Luxury Plan" }
  }
];

/**
 * Tabla de comparación completa (desplegable bajo las tarjetas).
 * Cada fila trae un valor por plan en el orden de PRICING_PLANS.
 */
export const PLAN_COMPARISON: PlanComparisonRow[] = [
  {
    label: { es: "Entrega estimada", en: "Estimated delivery" },
    values: [
      { es: "24–48 h", en: "24–48 h" },
      { es: "48 h", en: "48 h" },
      { es: "48–72 h", en: "48–72 h" },
      { es: "3–5 días", en: "3–5 days" }
    ]
  },
  {
    label: { es: "Rondas de revisión incluidas", en: "Included revision rounds" },
    values: [
      { es: "1", en: "1" },
      { es: "2", en: "2" },
      { es: "3", en: "3" },
      { es: "4", en: "4" }
    ]
  },
  {
    label: { es: "Tiempo activa en línea", en: "Time active online" },
    values: [
      { es: "3 meses", en: "3 months" },
      { es: "6 meses", en: "6 months" },
      { es: "9 meses", en: "9 months" },
      { es: "12 meses", en: "12 months" }
    ]
  },
  {
    label: { es: "Cuenta regresiva, Maps/Waze y dress code", en: "Countdown, Maps/Waze & dress code" },
    values: [true, true, true, true]
  },
  {
    label: { es: "Confirmación de asistencia (RSVP)", en: "RSVP confirmation" },
    values: [false, true, true, true]
  },
  {
    label: { es: "Música de fondo con reproductor", en: "Background music with player" },
    values: [false, true, true, true]
  },
  {
    label: { es: "Galería de fotografías", en: "Photo gallery" },
    values: [
      false,
      { es: "Hasta 15 fotos", en: "Up to 15 photos" },
      { es: "Ilimitada", en: "Unlimited" },
      { es: "Ilimitada", en: "Unlimited" }
    ]
  },
  {
    label: { es: "Historia de la pareja u homenaje", en: "Couple's story or tribute" },
    values: [false, true, true, true]
  },
  {
    label: { es: "Código QR individual para control en puerta", en: "Individual QR code for door check-in" },
    values: [false, false, true, true]
  },
  {
    label: { es: "Cronograma e itinerario del día", en: "Day-of schedule & itinerary" },
    values: [false, false, true, true]
  },
  {
    label: { es: "Mesa de regalos", en: "Gift registry" },
    values: [false, false, true, true]
  },
  {
    label: { es: "Recordatorios de fecha vía WhatsApp", en: "Date reminders via WhatsApp" },
    values: [false, false, true, true]
  },
  {
    label: { es: "Diseño 100% personalizado desde cero", en: "100% custom design from scratch" },
    values: [false, false, false, true]
  },
  {
    label: { es: "Video de portada en alta definición", en: "HD cover video" },
    values: [false, false, false, true]
  },
  {
    label: { es: "Dominio web propio", en: "Custom web domain" },
    values: [
      { es: "Extra", en: "Add-on" },
      { es: "Extra", en: "Add-on" },
      { es: "Extra", en: "Add-on" },
      true
    ]
  },
  {
    label: { es: "Galería post-evento", en: "Post-event gallery" },
    values: [
      { es: "Extra", en: "Add-on" },
      { es: "Extra", en: "Add-on" },
      { es: "Extra", en: "Add-on" },
      true
    ]
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
