import { Localized } from "../types";

/**
 * ÍNDICE LIGERO DE LAS PÁGINAS SEO
 * ================================
 * Sólo lo que necesitan la home y el pie de página: la ruta, el título y la
 * descripción de cada página SEO.
 *
 * Existe por rendimiento. `seoPages.ts` pesa ~36 kB de texto (intros, secciones,
 * FAQ) y lo importaban directamente `App.tsx` (para registrar las rutas y los
 * metadatos) y `Footer.tsx` (para los enlaces internos). Al importarlo desde el
 * bundle inicial, **todo ese contenido viajaba en la primera carga** aunque el
 * componente que lo renderiza sí fuera diferido.
 *
 * Ahora el cuerpo extenso vive sólo en `seoPages.ts`, que importa únicamente
 * `SeoLandingPage` — un chunk aparte que se descarga al visitar una de estas
 * páginas.
 *
 * ⚠️ Los títulos y descripciones están aquí y en `seoPages.ts`. Una prueba
 * automática (`seoPages.test.ts`) verifica que no se desincronicen.
 */

export const SEO_HUB_PATH = "/invitaciones-digitales";

export interface SeoPageSummary {
  path: string;
  seoTitle: Localized;
  seoDescription: Localized;
  /** Etiqueta corta para los enlaces internos del pie. */
  navLabel: Localized;
}

export const SEO_PAGE_INDEX: SeoPageSummary[] = [
  {
    path: SEO_HUB_PATH,
    seoTitle: {
      es: "Invitaciones Digitales en República Dominicana | Invifty",
      en: "Digital Invitations in the Dominican Republic | Invifty",
    },
    seoDescription: {
      es: "Invitaciones digitales premium para bodas, 15 años, cumpleaños y eventos corporativos en República Dominicana. RSVP, ubicación, música y pases QR en un solo enlace elegante.",
      en: "Premium digital invitations for weddings, quinceañeras, birthdays and corporate events in the Dominican Republic. RSVP, venue, music and QR passes in one elegant link.",
    },
    navLabel: { es: "Todas las invitaciones", en: "All invitations" },
  },
  {
    path: "/invitaciones-digitales/bodas",
    seoTitle: {
      es: "Invitaciones Digitales para Bodas | Invifty",
      en: "Wedding Digital Invitations | Invifty",
    },
    seoDescription: {
      es: "Invitaciones de boda digitales y elegantes: RSVP por invitado, ceremonia y recepción con mapas, mesa de regalos e historia de la pareja en un solo enlace. Para bodas en República Dominicana.",
      en: "Elegant digital wedding invitations: per-guest RSVP, ceremony and reception maps, gift registry and couple's story in one link. For weddings in the Dominican Republic.",
    },
    navLabel: { es: "Bodas", en: "Weddings" },
  },
  {
    path: "/invitaciones-digitales/quinceaneras",
    seoTitle: {
      es: "Invitaciones Digitales para 15 Años y Quinceañeras | Invifty",
      en: "Digital Invitations for Quinceañeras | Invifty",
    },
    seoDescription: {
      es: "Invitaciones para 15 años y quinceañeras que impresionan: paletas celestiales y rose gold, itinerario, dress code, muro de felicitaciones y música en un enlace. Hechas en República Dominicana.",
      en: "Quinceañera invitations that impress: celestial and rose gold palettes, itinerary, dress code, well-wishes wall and music in one link. Made in the Dominican Republic.",
    },
    navLabel: { es: "15 Años & Quinceañeras", en: "Quinceañeras" },
  },
  {
    path: "/invitaciones-digitales/cumpleanos",
    seoTitle: {
      es: "Invitaciones Digitales para Cumpleaños | Invifty",
      en: "Birthday Digital Invitations | Invifty",
    },
    seoDescription: {
      es: "Invitaciones de cumpleaños digitales para todas las edades: 30, 40, 50, 60 y más. Cuenta regresiva, RSVP, dress code y música en un enlace elegante. En República Dominicana.",
      en: "Digital birthday invitations for every age: 30, 40, 50, 60 and beyond. Countdown, RSVP, dress code and music in an elegant link. In the Dominican Republic.",
    },
    navLabel: { es: "Cumpleaños", en: "Birthdays" },
  },
  {
    path: "/invitaciones-digitales/corporativos",
    seoTitle: {
      es: "Invitaciones Digitales Corporativas y para Galas | Invifty",
      en: "Corporate Digital Invitations and Galas | Invifty",
    },
    seoDescription: {
      es: "Invitaciones digitales para eventos corporativos: galas, lanzamientos y conferencias con agenda, pase QR de acceso y registro de asistentes. Imagen profesional para tu empresa.",
      en: "Digital invitations for corporate events: galas, launches and conferences with agenda, QR access passes and attendee registration. Professional image for your company.",
    },
    navLabel: { es: "Eventos Corporativos", en: "Corporate Events" },
  },
  {
    path: "/invitaciones-digitales/para-planners",
    seoTitle: {
      es: "Invitaciones Digitales para Event Planners y Organizadores | Invifty",
      en: "Digital Invitations for Event Planners | Invifty",
    },
    seoDescription: {
      es: "Para planners y organizadores de eventos: publica invitaciones digitales para tus clientes en 3 a 5 días, con revisiones, QR por evento y soporte. Planificación de eventos más ágil.",
      en: "For event planners: publish digital invitations for your clients in 3 to 5 days, with revisions, per-event QR and support. Faster event planning.",
    },
    navLabel: { es: "Para Planners", en: "For Planners" },
  },
];

/** Etiqueta corta de una página SEO, para los enlaces internos. */
export function seoNavLabel(path: string, isEs: boolean): string {
  const page = SEO_PAGE_INDEX.find((p) => p.path === path);
  if (!page) return path;
  return isEs ? page.navLabel.es : page.navLabel.en;
}
