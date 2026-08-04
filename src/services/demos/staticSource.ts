import { EVENT_TYPE_LABELS, PORTFOLIO_ITEMS } from "../../data/portfolioData";
import { PortfolioItem } from "../../types";
import { DemoSource, PublicDemo } from "./types";

/**
 * Traduce el formato del archivo estático `portfolioData.ts` al contrato
 * `PublicDemo` que consumen los componentes.
 *
 * Esta función es toda la superficie que conoce el formato del archivo. Cuando
 * las demos vengan de Studio, se escribe otro origen que devuelva `PublicDemo[]`
 * y ningún componente cambia. Ver docs/integracion-futura-studio.md §4.
 */
export function toPublicDemo(item: PortfolioItem): PublicDemo {
  const label = EVENT_TYPE_LABELS[item.eventType];

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    // Si falta traducción de la etiqueta, se usa el valor crudo en ambos
    // idiomas: es preferible mostrar el tipo en español que dejar el hueco.
    eventTypeLabel: label ?? { es: item.eventType, en: item.eventType },
    style: item.style,
    subtitle: item.subtitle,
    coverImage: item.image,
    features: item.features,
    minimumPlan: item.minimumPlan,
    demoUrl: item.demoPath,
    // El archivo estático no marca demos inactivas: todo lo que está listado
    // se publica. El campo existe para cuando Studio pueda despublicar una.
    active: true,
  };
}

/** Origen actual: el catálogo estático del repositorio. */
export function createStaticDemoSource(): DemoSource {
  return {
    name: "static",
    list: () => PORTFOLIO_ITEMS.map(toPublicDemo),
  };
}
