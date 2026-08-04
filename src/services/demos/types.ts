import { DemoCategory, Localized } from "../../types";

export type { DemoCategory };

/**
 * Orden en que se muestran los filtros del catálogo.
 *
 * Los ids son estables y neutrales al idioma: antes el catálogo filtraba
 * comparando texto en español (`eventType.includes("boda")`), lo que ataba el
 * filtrado a la copia visible y rompía el filtro en silencio al renombrar una
 * etiqueta. Estos ids viajan además en la analítica como `category`.
 */
export const DEMO_CATEGORIES: readonly DemoCategory[] = [
  "boda",
  "quinceanera",
  "cumpleanos",
  "baby-shower",
  "bautizo",
  "bridal-shower",
  "corporativo",
  "apertura",
  "otro",
] as const;

/** Etiqueta visible de cada categoría. */
export const DEMO_CATEGORY_LABELS: Record<DemoCategory, Localized> = {
  boda: { es: "Bodas", en: "Weddings" },
  quinceanera: { es: "15 Años & Quinceañeras", en: "Quinceañeras" },
  cumpleanos: { es: "Cumpleaños", en: "Birthdays" },
  "baby-shower": { es: "Baby Shower", en: "Baby Shower" },
  bautizo: { es: "Bautizos & Comuniones", en: "Baptisms & Communions" },
  "bridal-shower": { es: "Despedidas de Soltera", en: "Bridal Showers" },
  corporativo: { es: "Eventos Corporativos", en: "Corporate Events" },
  apertura: { es: "Aperturas & Lanzamientos", en: "Openings & Launches" },
  otro: { es: "Otros Eventos", en: "Other Events" },
};

/**
 * DEMO PÚBLICA
 * ============
 * Contrato que consumen los componentes del catálogo.
 *
 * Es deliberadamente independiente del formato de `portfolioData.ts`: hoy se
 * construye desde ese archivo estático, y el día que Invifty Studio publique
 * `GET /api/public/demos` bastará con escribir otro origen que devuelva este
 * mismo tipo. Ningún componente tendrá que cambiar.
 *
 * Ver docs/integracion-futura-studio.md §4.
 */
export interface PublicDemo {
  /** Identificador estable. Viaja en la analítica como `demo_id`. */
  id: string;
  slug: string;
  title: string;
  /** Categoría neutral al idioma, para filtrar y medir. */
  category: DemoCategory;
  /** Etiqueta visible del tipo de evento. */
  eventTypeLabel: Localized;
  /** Estilo visual y paleta, en una frase. */
  style: Localized;
  subtitle: string;
  coverImage: string;
  features: Localized[];
  /** Plan mínimo que reproduce lo que muestra la demo. */
  minimumPlan?: string;
  /** Ruta interna de la demo. */
  demoUrl: string;
  /** Las demos inactivas no se listan. */
  active: boolean;
}

/** Origen de demos. Hoy estático; mañana, la API de Studio. */
export interface DemoSource {
  readonly name: string;
  list(): PublicDemo[];
}
