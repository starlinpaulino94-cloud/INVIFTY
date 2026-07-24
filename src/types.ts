/** Texto bilingüe: cada campo visible al público existe en español e inglés. */
export interface Localized {
  es: string;
  en: string;
}

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
  description: Localized;
  features: Localized[];
  ctaText: Localized;
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
  subtitle: string;
  image: string;
  features: Localized[];
  demoPath: string;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: Localized;
  location: string;
  comment: Localized;
  rating: number;
  date: string;
  /** true = historia ilustrativa (se etiqueta así en el sitio); false = testimonio real */
  isProvisionalNotice?: boolean;
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

export interface RsvpFormData {
  fullName: string;
  attendance: "Confirmado" | "No podré asistir";
  guestCount: number;
  menuPreference?: string;
  dietaryNotes?: string;
  songRequest?: string;
}
