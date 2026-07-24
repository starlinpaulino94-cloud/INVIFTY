import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
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
    "hero.badge": "INVITACIONES DIGITALES INTERACTIVAS DE ALTA GAMA",
    "hero.title1": "Invitaciones Web de Lujo para",
    "hero.title2": "Bodas y Eventos Inolvidables",
    "hero.subtitle": "Diseños interactivos personalizados para bodas, cumpleaños y galas. Confirmación RSVP directa por WhatsApp, mapas interactivos, mesa de regalos, música y pases con código QR.",
    "hero.btnPrimary": "Ver Diseños Interactivos",
    "hero.btnSecondary": "Solicitar Cotización Personalizada",
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
    "hero.badge": "LUXURY INTERACTIVE DIGITAL INVITATIONS",
    "hero.title1": "Luxury Web Invitations for",
    "hero.title2": "Unforgettable Weddings & Events",
    "hero.subtitle": "Custom interactive designs for weddings, birthdays, and corporate galas. Direct WhatsApp RSVP, interactive maps, gift registry, background music, and QR passcodes.",
    "hero.btnPrimary": "View Interactive Designs",
    "hero.btnSecondary": "Request Custom Quote",
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

  const t = (key: string): string => {
    return translations[language][key] || translations["es"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
