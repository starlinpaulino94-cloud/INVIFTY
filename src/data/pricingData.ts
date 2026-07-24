import { PricingPlan, PricingExtra } from "../types";

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "esencial",
    name: "Esencial",
    priceUSD: 25,
    priceDOP: 1200,
    description: "La opción perfecta para quienes buscan elegancia, rapidez y sencillez.",
    features: [
      "Invitación digital elegante e interactiva",
      "Cuenta regresiva en vivo",
      "Ubicación con enlace directo a Waze y Google Maps",
      "Guía de código de vestimenta (Dress Code)",
      "Validez activa durante 3 meses"
    ],
    ctaText: "Solicitar Plan Esencial"
  },
  {
    id: "popular",
    name: "Popular",
    priceUSD: 49,
    priceDOP: 2500,
    badge: "El más elegido",
    isPopular: true,
    description: "Nuestra experiencia completa recomendada para bodas y 15 años.",
    features: [
      "Todo lo incluido en el plan Esencial",
      "Confirmación RSVP interactiva para invitados",
      "Música de fondo personalizada con reproductor",
      "Galería de hasta 15 fotografías de alta calidad",
      "Sección de Historia de la Pareja o Homenaje",
      "Validez activa durante 6 meses"
    ],
    ctaText: "Solicitar Plan Popular"
  },
  {
    id: "premium",
    name: "Premium",
    priceUSD: 79,
    priceDOP: 4000,
    badge: "VIP Eventos",
    description: "Diseñado para eventos exigentes que buscan control de acceso y cero límites.",
    features: [
      "Todo lo incluido en el plan Popular",
      "Código QR individual para control en puerta",
      "Galería de fotografías ilimitada",
      "Cronograma e itinerario interactivo del día",
      "Mesa de regalos con datos bancarios y Amazon",
      "Recordatorios de fecha vía WhatsApp",
      "Validez activa durante 9 meses"
    ],
    ctaText: "Solicitar Plan Premium"
  },
  {
    id: "luxury",
    name: "Luxury",
    priceUSD: 129,
    priceDOP: 6500,
    badge: "Exclusivo 100%",
    description: "Diseño 100% a la medida por un diseñador dedicado y dominio web propio.",
    features: [
      "Todo lo incluido en el plan Premium",
      "Diseño 100% personalizado por un diseñador",
      "Video de portada de alta definición en bucle",
      "Dominio web propio personalizado (ej: boda.com)",
      "Galería de fotos post-evento para invitados",
      "Validez activa durante 1 año completo"
    ],
    ctaText: "Solicitar Plan Luxury"
  }
];

export const PRICING_EXTRAS: PricingExtra[] = [
  {
    id: "bilingue",
    title: "Versión Bilingüe / Inglés",
    priceUSD: 15,
    priceDOP: 900,
    description: "Añade un selector de idioma para invitados internacionales (Español / English)."
  },
  {
    id: "dominio-propio",
    title: "Dominio Web Propio",
    priceUSD: 25,
    priceDOP: 1500,
    description: "Dirección web única y personalizada para tu evento (ejemplo: miboda.com)."
  },
  {
    id: "galeria-extra",
    title: "Galería Post-Evento",
    priceUSD: 15,
    priceDOP: 900,
    description: "Espacio para subir fotos y videos del evento para que los invitados las descarguen."
  }
];
