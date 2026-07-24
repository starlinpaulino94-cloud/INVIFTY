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
  name: string;
  priceRD: number;
  badge?: string;
  isPopular?: boolean;
  description: string;
  features: string[];
  ctaText: string;
}

export interface PricingExtra {
  id: string;
  title: string;
  priceRD: number;
  description: string;
}

export interface PortfolioItem {
  id: string;
  slug: string;
  title: string;
  eventType: EventType;
  subtitle: string;
  image: string;
  features: string[];
  demoPath: string;
  isRealClient?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  eventType: string;
  location: string;
  comment: string;
  avatar: string;
  rating: number;
  date: string;
  isProvisionalNotice?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
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
