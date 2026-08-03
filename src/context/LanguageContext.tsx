import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Localized } from "../types";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  /** Resuelve un texto bilingüe {es, en} al idioma activo. */
  lx: (value: Localized) => string;
}

const translations: Record<Language, Record<string, string>> = {
  es: {
    // Navbar
    "nav.home": "Inicio",
    "nav.howItWorks": "Cómo funciona",
    "nav.portfolio": "Colección Muestra",
    "nav.pricing": "Planes & Precios",
    "nav.faq": "Preguntas",
    "nav.contact": "Contacto",
    "nav.requestInvite": "Solicitar Invitación",
    "nav.tagline": "ESTUDIO DIGITAL DE EVENTOS",

    // Hero
    "hero.badge": "INVITACIONES DIGITALES PREMIUM",
    "hero.title1": "Tu evento comienza",
    "hero.title2": "antes de la fecha",
    "hero.subtitle": "Crea una invitación digital elegante, interactiva y fácil de compartir: ubicación, cuenta regresiva, confirmación de asistencia y todos los detalles de tu evento en un solo enlace.",
    "hero.btnPrimary": "Ver invitaciones de ejemplo",
    "hero.btnSecondary": "Comparar planes",
    "hero.microcopy": "Sin descargar aplicaciones · Lista para WhatsApp · Compatible con móviles",
    "hero.stat1": "Confirmación RSVP",
    "hero.stat1Sub": "En tiempo real por WhatsApp",
    "hero.stat2": "Soporte Bilingüe",
    "hero.stat2Sub": "Español e Inglés para invitados internacionales",
    "hero.stat3": "Garantía de Entrega",
    "hero.stat3Sub": "En menos de 48 horas laborales",

    // Boda demo
    "boda.back": "Volver a Invifty",
    "boda.watermark": "◆ Muestra de Exhibición — Cotizar este diseño",
    "boda.story": "Historia",
    "boda.venues": "Ceremonia & Recepción",
    "boda.schedule": "Cronograma",
    "boda.court": "Corte de Honor",
    "boda.location": "Dress Code & Ubicación",
    "boda.gifts": "Mesa de Regalos",
    "boda.gallery": "Galería",
    "boda.guestbook": "Muro",
    "boda.rsvp": "Confirmar RSVP",
    "boda.gettingMarried": "Nos Casamos",
    "boda.countdownTitle": "Cuenta Regresiva para el Gran Día",
    "boda.days": "Días",
    "boda.hours": "Horas",
    "boda.minutes": "Minutos",
    "boda.seconds": "Segundos",
    "boda.addToCal": "Agregar a Google Calendar",
    "boda.rsvpHeading": "Confirmación de Asistencia (RSVP)",
    "boda.rsvpSub": "Favor confirmar antes del 15 de Octubre de 2026",

    // General
    "lang.spanish": "Español",
    "lang.english": "Inglés",
    "lang.selectLanguage": "Idioma / Language",
  },
  en: {
    // Navbar
    "nav.home": "Home",
    "nav.howItWorks": "How it works",
    "nav.portfolio": "Sample Collection",
    "nav.pricing": "Plans & Pricing",
    "nav.faq": "FAQ",
    "nav.contact": "Contact",
    "nav.requestInvite": "Request Invitation",
    "nav.tagline": "DIGITAL EVENT STUDIO",

    // Hero
    "hero.badge": "PREMIUM DIGITAL INVITATIONS",
    "hero.title1": "Your event begins",
    "hero.title2": "before the date",
    "hero.subtitle": "Create an elegant, interactive digital invitation that's easy to share: venue location, countdown, RSVP and every detail of your event in a single link.",
    "hero.btnPrimary": "See sample invitations",
    "hero.btnSecondary": "Compare plans",
    "hero.microcopy": "No app downloads · WhatsApp-ready · Works on every phone",
    "hero.stat1": "RSVP Confirmation",
    "hero.stat1Sub": "Real-time via WhatsApp",
    "hero.stat2": "Bilingual Support",
    "hero.stat2Sub": "Spanish & English for international guests",
    "hero.stat3": "Turnaround Guarantee",
    "hero.stat3Sub": "In less than 48 business hours",

    // Boda demo
    "boda.back": "Back to Invifty",
    "boda.watermark": "◆ Live Showcase Sample — Request Quote",
    "boda.story": "Our Story",
    "boda.venues": "Ceremony & Reception",
    "boda.schedule": "Schedule",
    "boda.court": "Bridal Party",
    "boda.location": "Dress Code & Location",
    "boda.gifts": "Gift Registry",
    "boda.gallery": "Gallery",
    "boda.guestbook": "Guestbook",
    "boda.rsvp": "Confirm RSVP",
    "boda.gettingMarried": "We're Getting Married",
    "boda.countdownTitle": "Countdown to the Big Day",
    "boda.days": "Days",
    "boda.hours": "Hours",
    "boda.minutes": "Minutes",
    "boda.seconds": "Seconds",
    "boda.addToCal": "Add to Google Calendar",
    "boda.rsvpHeading": "RSVP Confirmation",
    "boda.rsvpSub": "Please confirm by October 15, 2026",

    // General
    "lang.spanish": "Spanish",
    "lang.english": "English",
    "lang.selectLanguage": "Language / Idioma",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("invifty_lang");
    if (saved === "en" || saved === "es") return saved;
    if (typeof navigator !== "undefined" && navigator.language && navigator.language.startsWith("en")) {
      return "en";
    }
    return "es";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("invifty_lang", lang);
  };

  // Keep <html lang="..."> in sync for screen readers and SEO
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || translations["es"][key] || key;
  };

  const lx = (value: Localized): string => value[language] ?? value.es;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, lx }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
