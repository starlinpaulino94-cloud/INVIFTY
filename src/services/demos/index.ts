import { createStaticDemoSource } from "./staticSource";
import { DemoCategory, DemoSource, PublicDemo } from "./types";

export * from "./types";
export { toPublicDemo } from "./staticSource";

/**
 * Origen de demos en uso.
 *
 * Hoy es siempre el catálogo estático. Cuando Studio publique
 * `GET /api/public/demos`, aquí se elige entre uno y otro según el feature
 * flag, igual que hace `services/leads`.
 */
let source: DemoSource = createStaticDemoSource();

/** Sustituye el origen. Pensado para pruebas y para la futura conexión con Studio. */
export function setDemoSource(next: DemoSource): void {
  source = next;
}

/** Todas las demos publicadas, en el orden del catálogo. */
export function getPublicDemos(): PublicDemo[] {
  return source.list().filter((demo) => demo.active);
}

export function getDemoById(id: string): PublicDemo | undefined {
  return getPublicDemos().find((demo) => demo.id === id);
}

export function getDemoByUrl(demoUrl: string): PublicDemo | undefined {
  return getPublicDemos().find((demo) => demo.demoUrl === demoUrl);
}

/** Categorías que tienen al menos una demo, en el orden de `DEMO_CATEGORIES`. */
export function getUsedCategories(demos: PublicDemo[] = getPublicDemos()): DemoCategory[] {
  const used = new Set(demos.map((demo) => demo.category));
  return (["boda", "quinceanera", "cumpleanos", "baby-shower", "bautizo", "bridal-shower", "corporativo", "apertura", "otro"] as DemoCategory[])
    .filter((category) => used.has(category));
}

export interface DemoFilter {
  /** `undefined` = todas las categorías. */
  category?: DemoCategory;
  /** Búsqueda libre sobre título, tipo, estilo, subtítulo y capacidades. */
  query?: string;
  language?: "es" | "en";
}

/**
 * Filtra el catálogo.
 *
 * El filtrado por categoría usa el id estable, no el texto visible: antes se
 * comparaba `eventType.includes("boda")`, que se rompía al renombrar una
 * etiqueta y no funcionaba igual en inglés.
 */
export function filterDemos(
  { category, query, language = "es" }: DemoFilter,
  demos: PublicDemo[] = getPublicDemos()
): PublicDemo[] {
  const needle = query?.trim().toLowerCase() ?? "";

  return demos.filter((demo) => {
    if (category && demo.category !== category) return false;
    if (!needle) return true;

    const haystack = [
      demo.title,
      demo.subtitle,
      demo.eventTypeLabel[language],
      demo.style[language],
      ...demo.features.map((feature) => feature[language]),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(needle);
  });
}

/** Cuántas demos hay por categoría, para las etiquetas de los filtros. */
export function countByCategory(
  demos: PublicDemo[] = getPublicDemos()
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const demo of demos) {
    counts[demo.category] = (counts[demo.category] ?? 0) + 1;
  }
  return counts;
}
