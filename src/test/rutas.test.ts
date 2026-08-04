import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PORTFOLIO_ITEMS } from "../data/portfolioData";
import { SEO_PAGE_INDEX } from "../data/seoPageIndex";
import { getIndexableRoutes } from "../services/seo";

const ROOT = process.cwd();
const appSource = readFileSync(join(ROOT, "src/App.tsx"), "utf8");

/** Rutas registradas en el mapa ROUTES de App.tsx. */
function registeredRoutes(): string[] {
  const routesBlock = appSource.slice(
    appSource.indexOf("const ROUTES"),
    appSource.indexOf("function normalizePath")
  );
  return [...routesBlock.matchAll(/"(\/[^"]*)":/g)].map((m) => m[1]);
}

describe("integridad de las rutas de demos", () => {
  const routes = registeredRoutes();

  it("registra en App.tsx todas las demos del portafolio", () => {
    // Una demo listada en el catálogo pero sin ruta lleva al 404.
    const missing = PORTFOLIO_ITEMS.map((item) => item.demoPath).filter(
      (path) => !routes.includes(path)
    );
    expect(missing, `sin ruta registrada: ${missing.join(", ")}`).toEqual([]);
  });

  it("no deja rutas de demo huérfanas fuera del catálogo", () => {
    // Una ruta sin ficha en el catálogo es una demo que nadie puede encontrar.
    const orphans = routes
      .filter((path) => path.startsWith("/muestra/"))
      .filter((path) => !PORTFOLIO_ITEMS.some((item) => item.demoPath === path));
    expect(orphans, `demos inalcanzables desde el catálogo: ${orphans.join(", ")}`).toEqual([]);
  });

  it("destaca en la home sólo ids que existen en el catálogo", () => {
    // DemoSelector ya no copia el contenido: sólo elige qué destacar por id.
    // Un id mal escrito haría desaparecer la tarjeta en silencio.
    const selectorSource = readFileSync(join(ROOT, "src/components/DemoSelector.tsx"), "utf8");
    const block = selectorSource.slice(
      selectorSource.indexOf("FEATURED_DEMO_IDS"),
      selectorSource.indexOf("] as const;")
    );
    const featuredIds = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

    expect(featuredIds.length, "el selector no destaca ninguna demo").toBeGreaterThan(0);

    const broken = featuredIds.filter((id) => !PORTFOLIO_ITEMS.some((item) => item.id === id));
    expect(broken, `ids destacados inexistentes: ${broken.join(", ")}`).toEqual([]);
  });

  it("apunta las páginas SEO a demos que existen", () => {
    const seoSource = readFileSync(join(ROOT, "src/data/seoPages.ts"), "utf8");
    const demoPaths = [...seoSource.matchAll(/demoPath:\s*"([^"]+)"/g)].map((m) => m[1]);

    const broken = demoPaths.filter(
      (path) => !PORTFOLIO_ITEMS.some((item) => item.demoPath === path)
    );
    expect(broken, `páginas SEO que enlazan a demos inexistentes: ${broken.join(", ")}`).toEqual([]);
  });

  it("no repite slugs entre demos", () => {
    const paths = PORTFOLIO_ITEMS.map((item) => item.demoPath);
    expect(new Set(paths).size).toBe(paths.length);
  });
});

describe("coherencia del sitemap", () => {
  // El sitemap ya no es un archivo estático: lo genera el plugin de
  // prerenderizado a partir de getIndexableRoutes(), así que no puede
  // desincronizarse. Estas pruebas verifican esa lista.

  it("anuncia exactamente las rutas que la aplicación sirve", () => {
    const routes = registeredRoutes();
    const servible = new Set([
      "/",
      ...routes,
      ...PORTFOLIO_ITEMS.map((item) => item.demoPath),
      ...SEO_PAGE_INDEX.map((page) => page.path),
    ]);

    const unknown = getIndexableRoutes().filter((path) => !servible.has(path));
    expect(unknown, `el sitemap anunciaría rutas inexistentes: ${unknown.join(", ")}`).toEqual([]);
  });

  it("incluye todas las páginas SEO y todas las demos", () => {
    const indexable = new Set(getIndexableRoutes());
    for (const page of SEO_PAGE_INDEX) {
      expect(indexable, `falta ${page.path}`).toContain(page.path);
    }
    for (const item of PORTFOLIO_ITEMS) {
      expect(indexable, `falta ${item.demoPath}`).toContain(item.demoPath);
    }
  });

  it("ya no depende de un sitemap.xml estático", () => {
    // Tenerlo en public/ además de generarlo crearía dos fuentes de verdad.
    expect(existsSync(join(ROOT, "public/sitemap.xml"))).toBe(false);
  });
});
