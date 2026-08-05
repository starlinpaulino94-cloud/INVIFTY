import { CONFIG } from "../../config";
import { SEO_PAGE_INDEX } from "../../data/seoPageIndex";
import { getPublicDemos } from "../demos";

export type Language = "es" | "en";

/** Metadatos completos de una ruta. */
export interface RouteSeo {
  path: string;
  title: string;
  description: string;
  /** URL absoluta canónica de esta ruta. */
  canonical: string;
  /** Imagen social, URL absoluta. */
  ogImage: string;
  ogType: "website" | "article";
  /** `true` en rutas que no deben indexarse. */
  noindex: boolean;
  /** Idioma del contenido, para `<html lang>` y `og:locale`. */
  language: Language;
}

/**
 * Imagen social por defecto. Debe existir en `public/`.
 *
 * Las tarjetas de `public/og/` las genera `npm run og:images` y se versionan en
 * el repositorio: llevan la marca Invifty y el tipo de evento. Antes las 21
 * rutas compartían una única foto de boda sin logo, así que compartir la
 * muestra corporativa por WhatsApp enseñaba una novia.
 */
const DEFAULT_OG_IMAGE = "/og/default.jpg";

/** Tarjeta social por categoría de evento. Debe existir `public/og/<id>.jpg`. */
const OG_BY_CATEGORY: Record<string, string> = {
  boda: "/og/boda.jpg",
  quinceanera: "/og/quinceanera.jpg",
  cumpleanos: "/og/cumpleanos.jpg",
  "baby-shower": "/og/baby-shower.jpg",
  bautizo: "/og/bautizo.jpg",
  "bridal-shower": "/og/bridal-shower.jpg",
  corporativo: "/og/corporativo.jpg",
  apertura: "/og/apertura.jpg",
};

/**
 * Tarjeta de cada página SEO, por ruta.
 *
 * Se mapea a mano y no por el último segmento de la URL porque la ruta usa el
 * plural comercial (`/bodas`) y la categoría el singular (`boda`): derivarlo
 * fallaría en silencio y la página volvería a la tarjeta genérica.
 *
 * El hub y `/para-planners` no aparecen: cubren todos los tipos de evento, así
 * que les corresponde la tarjeta general.
 */
const OG_BY_SEO_PATH: Record<string, string> = {
  "/invitaciones-digitales/bodas": "/og/boda.jpg",
  "/invitaciones-digitales/quinceaneras": "/og/quinceanera.jpg",
  "/invitaciones-digitales/cumpleanos": "/og/cumpleanos.jpg",
  "/invitaciones-digitales/corporativos": "/og/corporativo.jpg",
};

function absolute(path: string): string {
  return `${CONFIG.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Normaliza una ruta: sin barra final, `/` para la raíz. */
export function normalizeRoute(path: string): string {
  const trimmed = (path || "/").replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

const HOME_SEO: Record<Language, { title: string; description: string }> = {
  es: {
    title: "Invifty — Invitaciones Digitales Premium",
    description:
      "Invitaciones digitales elegantes e interactivas para bodas, 15 años, cumpleaños y eventos corporativos. RSVP directo por WhatsApp, música, mapas y pases QR.",
  },
  en: {
    title: "Invifty — Premium Digital Invitations",
    description:
      "Elegant, interactive digital invitations for weddings, quinceañeras, birthdays and corporate events. WhatsApp RSVP, music, maps and QR passes.",
  },
};

const LEGAL_SEO: Record<string, Record<Language, { title: string; description: string }>> = {
  "/privacidad": {
    es: {
      title: "Política de Privacidad · Invifty",
      description:
        "Cómo Invifty trata tus datos: qué recopilamos, para qué se usa y cómo solicitar acceso, corrección o eliminación.",
    },
    en: {
      title: "Privacy Policy · Invifty",
      description:
        "How Invifty handles your data: what we collect, how it is used and how to request access, correction or deletion.",
    },
  },
  "/terminos": {
    es: {
      title: "Términos del Servicio · Invifty",
      description:
        "Condiciones del servicio de invitaciones digitales de Invifty: alcance, revisiones, entrega, pagos y propiedad intelectual.",
    },
    en: {
      title: "Terms of Service · Invifty",
      description:
        "Terms for Invifty's digital invitation service: scope, revisions, delivery, payments and intellectual property.",
    },
  },
};

/**
 * Metadatos de una ruta.
 *
 * **Fuente única**: los títulos de las demos salen del catálogo y los de las
 * páginas SEO de `seoPageIndex`. Nada se escribe dos veces.
 *
 * El `canonical` es la corrección más importante que introduce este módulo:
 * antes, `index.html` declaraba `canonical` fijo a la home para **todas** las
 * rutas. El sitemap pedía indexar 21 URLs y cada una respondía «soy un
 * duplicado de la portada», así que las páginas SEO no podían posicionar.
 */
export function getRouteSeo(rawPath: string, language: Language = "es"): RouteSeo {
  const path = normalizeRoute(rawPath);
  const isEs = language === "es";

  const base = {
    path,
    canonical: absolute(path),
    ogImage: absolute(DEFAULT_OG_IMAGE),
    language,
  };

  // Páginas legales: útiles para la persona, irrelevantes para el buscador.
  const legal = LEGAL_SEO[path];
  if (legal) {
    return { ...base, ...legal[language], ogType: "website", noindex: false };
  }

  const seoPage = SEO_PAGE_INDEX.find((page) => page.path === path);
  if (seoPage) {
    return {
      ...base,
      title: isEs ? seoPage.seoTitle.es : seoPage.seoTitle.en,
      description: isEs ? seoPage.seoDescription.es : seoPage.seoDescription.en,
      ogImage: absolute(OG_BY_SEO_PATH[path] ?? DEFAULT_OG_IMAGE),
      ogType: "article",
      noindex: false,
    };
  }

  const demo = getPublicDemos().find((item) => item.demoUrl === path);
  if (demo) {
    const style = isEs ? demo.style.es : demo.style.en;
    return {
      ...base,
      ogImage: absolute(OG_BY_CATEGORY[demo.category] ?? DEFAULT_OG_IMAGE),
      title: `${demo.title} — ${isEs ? "Muestra Interactiva" : "Interactive Sample"} · Invifty`,
      description: isEs
        ? `Muestra interactiva de invitación digital: ${demo.title}. ${style}. Explora el diseño, la ubicación, la galería y la confirmación de asistencia.`
        : `Interactive digital invitation sample: ${demo.title}. ${style}. Explore the design, venue, gallery and RSVP.`,
      ogType: "article",
      noindex: false,
    };
  }

  // Ruta desconocida (404): nunca debe indexarse.
  if (path !== "/") {
    return {
      ...base,
      ...HOME_SEO[language],
      canonical: absolute("/"),
      ogType: "website",
      noindex: true,
    };
  }

  return { ...base, ...HOME_SEO[language], ogType: "website", noindex: false };
}

/**
 * Todas las rutas que deben indexarse, en el orden del sitemap.
 *
 * Es la lista de la que debe salir `sitemap.xml`: si una ruta no está aquí, no
 * debe anunciarse.
 */
export function getIndexableRoutes(): string[] {
  return [
    "/",
    ...SEO_PAGE_INDEX.map((page) => page.path),
    ...getPublicDemos().map((demo) => demo.demoUrl),
    "/privacidad",
    "/terminos",
  ];
}
