import { beforeEach, describe, expect, it } from "vitest";
import { SEO_PAGE_INDEX } from "../../data/seoPageIndex";
import { getPublicDemos } from "../demos";
import { applyRouteSeo } from "./applyRouteSeo";
import { getIndexableRoutes, getRouteSeo, normalizeRoute } from "./routeSeo";

const SITE = "https://invifty.com";

describe("normalización de rutas", () => {
  it("trata la raíz y las barras finales como la misma ruta", () => {
    expect(normalizeRoute("/")).toBe("/");
    expect(normalizeRoute("")).toBe("/");
    expect(normalizeRoute("/terminos/")).toBe("/terminos");
    expect(normalizeRoute("/muestra/boda-camila-y-lucas//")).toBe("/muestra/boda-camila-y-lucas");
  });
});

describe("canonical por ruta", () => {
  it("da a cada ruta indexable su propio canonical absoluto", () => {
    // El fallo que corrige este módulo: index.html declaraba canonical fijo a
    // la portada, así que las 21 URLs del sitemap se anunciaban como duplicados
    // de la home y las páginas SEO no podían posicionar.
    for (const route of getIndexableRoutes()) {
      const seo = getRouteSeo(route);
      expect(seo.canonical, `canonical incorrecto en ${route}`).toBe(`${SITE}${route === "/" ? "/" : route}`);
    }
  });

  it("no repite canonical entre rutas", () => {
    const canonicals = getIndexableRoutes().map((route) => getRouteSeo(route).canonical);
    expect(new Set(canonicals).size).toBe(canonicals.length);
  });

  it("usa siempre URLs absolutas", () => {
    for (const route of getIndexableRoutes()) {
      const seo = getRouteSeo(route);
      expect(seo.canonical.startsWith("https://"), `${route}: canonical relativo`).toBe(true);
      expect(seo.ogImage.startsWith("https://"), `${route}: og:image relativo`).toBe(true);
    }
  });
});

describe("títulos y descripciones", () => {
  const routes = getIndexableRoutes();

  it("da título y descripción propios a cada ruta", () => {
    for (const route of routes) {
      const seo = getRouteSeo(route);
      expect(seo.title, `${route}: sin título`).toBeTruthy();
      expect(seo.description, `${route}: sin descripción`).toBeTruthy();
    }
  });

  it("no repite títulos", () => {
    const titles = routes.map((route) => getRouteSeo(route).title);
    expect(new Set(titles).size, "hay títulos duplicados").toBe(titles.length);
  });

  it("no repite descripciones", () => {
    const descriptions = routes.map((route) => getRouteSeo(route).description);
    expect(new Set(descriptions).size, "hay descripciones duplicadas").toBe(descriptions.length);
  });

  it("mantiene las descripciones en una longitud aprovechable", () => {
    for (const route of routes) {
      const { description } = getRouteSeo(route);
      expect(description.length, `${route}: descripción demasiado corta`).toBeGreaterThan(70);
      expect(description.length, `${route}: descripción demasiado larga`).toBeLessThanOrEqual(320);
    }
  });

  it("traduce los metadatos al cambiar de idioma", () => {
    const es = getRouteSeo("/", "es");
    const en = getRouteSeo("/", "en");
    expect(es.title).not.toBe(en.title);
    expect(es.description).not.toBe(en.description);
  });
});

describe("rutas indexables", () => {
  it("incluye la portada, las páginas SEO, las demos y las legales", () => {
    const routes = getIndexableRoutes();
    expect(routes).toContain("/");
    for (const page of SEO_PAGE_INDEX) expect(routes).toContain(page.path);
    for (const demo of getPublicDemos()) expect(routes).toContain(demo.demoUrl);
    expect(routes).toContain("/privacidad");
    expect(routes).toContain("/terminos");
  });

  it("no repite rutas", () => {
    const routes = getIndexableRoutes();
    expect(new Set(routes).size).toBe(routes.length);
  });

  it("marca noindex sólo en rutas desconocidas", () => {
    for (const route of getIndexableRoutes()) {
      expect(getRouteSeo(route).noindex, `${route} no debería llevar noindex`).toBe(false);
    }
    // Una ruta inexistente no debe indexarse y apunta a la portada.
    const unknown = getRouteSeo("/no-existe-esta-ruta");
    expect(unknown.noindex).toBe(true);
    expect(unknown.canonical).toBe(`${SITE}/`);
  });

  it("clasifica el contenido editorial como article y la portada como website", () => {
    expect(getRouteSeo("/").ogType).toBe("website");
    expect(getRouteSeo(SEO_PAGE_INDEX[0].path).ogType).toBe("article");
    expect(getRouteSeo(getPublicDemos()[0].demoUrl).ogType).toBe("article");
  });
});

describe("aplicación de metadatos en el DOM", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    document.title = "";
  });

  it("escribe título, canonical y Open Graph", () => {
    applyRouteSeo(getRouteSeo("/muestra/boda-camila-y-lucas"));

    expect(document.title).toContain("Camila");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${SITE}/muestra/boda-camila-y-lucas`
    );
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(
      `${SITE}/muestra/boda-camila-y-lucas`
    );
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute("content")).toContain(
      "Camila"
    );
    expect(document.querySelector('meta[name="twitter:image"]')).not.toBeNull();
  });

  it("no duplica etiquetas al navegar entre rutas", () => {
    applyRouteSeo(getRouteSeo("/"));
    applyRouteSeo(getRouteSeo("/terminos"));
    applyRouteSeo(getRouteSeo("/privacidad"));

    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:title"]')).toHaveLength(1);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(
      `${SITE}/privacidad`
    );
  });

  it("retira el noindex al salir de una ruta desconocida", () => {
    // Sin esto, pasar por un 404 dejaría toda la sesión marcada como noindex.
    applyRouteSeo(getRouteSeo("/no-existe"));
    expect(document.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain(
      "noindex"
    );

    applyRouteSeo(getRouteSeo("/"));
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("sincroniza el idioma del documento", () => {
    applyRouteSeo(getRouteSeo("/", "en"));
    expect(document.documentElement.lang).toBe("en-US");
    applyRouteSeo(getRouteSeo("/", "es"));
    expect(document.documentElement.lang).toBe("es-DO");
  });
});
