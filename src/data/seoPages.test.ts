import { describe, expect, it } from "vitest";
import { SEO_PAGE_INDEX, SEO_HUB_PATH, seoNavLabel } from "./seoPageIndex";
import { SEO_PAGES } from "./seoPages";

/**
 * El índice ligero (`seoPageIndex.ts`) y el contenido completo (`seoPages.ts`)
 * están separados por rendimiento: el cuerpo extenso no debe entrar en el bundle
 * inicial. El precio de esa separación es que el título y la descripción viven
 * en dos sitios. Estas pruebas impiden que se desincronicen.
 */
describe("índice SEO vs contenido completo", () => {
  it("tiene las mismas rutas en el mismo orden", () => {
    expect(SEO_PAGE_INDEX.map((p) => p.path)).toEqual(SEO_PAGES.map((p) => p.path));
  });

  it("repite exactamente el mismo título en ambos archivos", () => {
    for (const summary of SEO_PAGE_INDEX) {
      const full = SEO_PAGES.find((p) => p.path === summary.path);
      expect(full, `falta contenido para ${summary.path}`).toBeDefined();
      expect(summary.seoTitle.es, `título ES de ${summary.path}`).toBe(full!.seoTitle.es);
      expect(summary.seoTitle.en, `título EN de ${summary.path}`).toBe(full!.seoTitle.en);
    }
  });

  it("repite exactamente la misma descripción en ambos archivos", () => {
    for (const summary of SEO_PAGE_INDEX) {
      const full = SEO_PAGES.find((p) => p.path === summary.path)!;
      expect(summary.seoDescription.es, `descripción ES de ${summary.path}`).toBe(
        full.seoDescription.es
      );
      expect(summary.seoDescription.en, `descripción EN de ${summary.path}`).toBe(
        full.seoDescription.en
      );
    }
  });
});

describe("metadatos SEO", () => {
  it("no repite títulos entre páginas", () => {
    // Dos páginas con el mismo <title> compiten entre sí en el buscador.
    const titles = SEO_PAGE_INDEX.map((p) => p.seoTitle.es);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("no repite descripciones entre páginas", () => {
    const descriptions = SEO_PAGE_INDEX.map((p) => p.seoDescription.es);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("mantiene los títulos y descripciones en longitudes razonables", () => {
    for (const page of SEO_PAGE_INDEX) {
      // Google recorta alrededor de 60 y 160 caracteres respectivamente.
      expect(page.seoTitle.es.length, `título de ${page.path}`).toBeLessThanOrEqual(70);
      expect(page.seoDescription.es.length, `descripción de ${page.path}`).toBeGreaterThan(70);
      expect(page.seoDescription.es.length, `descripción de ${page.path}`).toBeLessThanOrEqual(200);
    }
  });

  it("da a cada página una etiqueta de navegación en ambos idiomas", () => {
    for (const page of SEO_PAGE_INDEX) {
      expect(seoNavLabel(page.path, true)).toBe(page.navLabel.es);
      expect(seoNavLabel(page.path, false)).toBe(page.navLabel.en);
    }
  });

  it("devuelve la propia ruta si no conoce la página", () => {
    expect(seoNavLabel("/no-existe", true)).toBe("/no-existe");
  });

  it("incluye el hub y lo enlaza desde las demás páginas", () => {
    expect(SEO_PAGE_INDEX.some((p) => p.path === SEO_HUB_PATH)).toBe(true);
    for (const page of SEO_PAGES) {
      if (page.path === SEO_HUB_PATH) continue;
      expect(page.related, `${page.path} no enlaza al hub`).toContain(SEO_HUB_PATH);
    }
  });

  it("enlaza sólo a rutas que existen", () => {
    const known = new Set(SEO_PAGE_INDEX.map((p) => p.path));
    for (const page of SEO_PAGES) {
      for (const related of page.related) {
        expect(known.has(related), `${page.path} enlaza a ${related}, que no existe`).toBe(true);
      }
    }
  });
});
