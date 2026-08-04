/** Texto bilingüe: cada campo visible al público existe en español e inglés. */
export interface Localized {
  es: string;
  en: string;
}

/**
 * Categoría de evento: identificador **estable y neutral al idioma**.
 *
 * El catálogo se filtraba antes comparando texto en español
 * (`eventType.includes("boda")`), lo que ataba el filtrado a la copia visible.
 * Estos ids también viajan en la analítica como `category`.
 */
export type DemoCategory =
  | "boda"
  | "quinceanera"
  | "cumpleanos"
  | "baby-shower"
  | "bautizo"
  | "bridal-shower"
  | "corporativo"
  | "apertura"
  | "otro";

export type EventType =
  | "Boda" 
  | "Boda Luxury" 
  | "15 Años & Quinceañera" 
  | "Cumpleaños" 
  | "Cumpleaños de Adultos"
  | "Corporativo & Galas" 
  | "Empresarial" 
  | "Baby Shower" 
  | "Bautizo & Comunión" 
  | "Bridal Shower" 
  | "Lanzamientos de Marca" 
  | "Otro";

export interface PricingPlan {
  id: string;
  name: Localized;
  priceUSD: number;
  priceDOP: number;
  badge?: Localized;
  isPopular?: boolean;
  /** true = opción "A medida" (se muestra como banda distinta, precio "Desde"). */
  isCustom?: boolean;
  /** Resultado principal que promete el plan, en una frase. */
  description: Localized;
  features: Localized[];
  /** Tiempo de entrega visible en la tarjeta (ej: "3 a 5 días hábiles"). */
  deliveryTime: Localized;
  /** Rondas de revisión incluidas en el precio. */
  revisions: number;
  /** Solo el plan recomendado: por qué es la opción sugerida. */
  whyRecommended?: Localized;
  ctaText: Localized;
}

/** Fila de la tabla de comparación completa de planes. */
export interface PlanComparisonRow {
  label: Localized;
  /** Un valor por plan, en el mismo orden que PRICING_PLANS: texto o ✓/—. */
  values: (Localized | boolean)[];
}

export interface PricingExtra {
  id: string;
  title: Localized;
  priceUSD: number;
  priceDOP: number;
  description: Localized;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  eventType: EventType;
  /** Categoría estable para filtrar y medir. No depende del idioma. */
  category: DemoCategory;
  subtitle: string;
  /** Estilo visual y paleta, en una frase. */
  style: Localized;
  image: string;
  features: Localized[];
  /**
   * Plan mínimo que reproduce lo que enseña la muestra.
   * Debe coincidir con un id de PRICING_PLANS.
   */
  minimumPlan?: string;
  demoPath: string;
}

export interface FAQItem {
  question: Localized;
  answer: Localized;
}

export interface InquiryFormData {
  name: string;
  eventType: string;
  eventDate: string;
  planInterest: string;
  phone: string;
  message?: string;
}

/**
 * Valores internos de asistencia. Son identificadores, no texto visible:
 * el texto que ve el invitado vive en las opciones del `<select>` de cada demo,
 * traducido por idioma. Antes convivían "Declina" y "No podré asistir" como
 * valores, lo que rompía el tipo; ahora hay un único valor canónico.
 */
export type RsvpAttendance = "Confirmado" | "Declina";

export interface RsvpFormData {
  fullName: string;
  attendance: RsvpAttendance;
  guestCount: number;
  menuPreference?: string;
  dietaryNotes?: string;
  songRequest?: string;
}
