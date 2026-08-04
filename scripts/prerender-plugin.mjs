import { build as esbuild } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

/**
 * PRERENDERIZADO DE METADATOS POR RUTA
 * ====================================
 * Genera un `index.html` por ruta indexable con sus propios `<title>`,
 * `description`, `canonical`, Open Graph y Twitter Card.
 *
 * ¿Por qué hace falta? La aplicación actualiza el `<head>` desde React, después
 * de montar. Google ejecuta JavaScript y lo ve, pero **los generadores de vista
 * previa de WhatsApp, Facebook y Twitter leen el HTML inicial y no ejecutan
 * scripts**. Sin esto, compartir cualquier demo o página SEO mostraba la
 * tarjeta de la portada.
 *
 * Esto NO es renderizado en servidor: no se genera el contenido de la página,
 * sólo sus metadatos. El HTML sigue siendo la misma cáscara y React monta
 * igual. Es el arreglo que cabe dentro de Vite sin cambiar de framework.
 *
 * Los metadatos salen de `src/services/seo/routeSeo.ts`, **el mismo módulo que
 * usa la aplicación en tiempo de ejecución**: no hay una segunda copia que
 * pueda divergir. Se compila con esbuild porque ese módulo importa datos que a
 * su vez importan imágenes, que Node no sabe leer.
 */

const ASSET_RE = /\.(webp|avif|png|jpe?g|svg|gif|mp3|mp4)$/;

/** Compila el módulo de SEO a algo que Node pueda importar. */
async function loadSeoModule(root, siteUrl) {
  const outfile = path.join(root, "node_modules/.cache/invifty/route-seo.mjs");
  await mkdir(path.dirname(outfile), { recursive: true });

  await esbuild({
    entryPoints: [path.join(root, "src/services/seo/routeSeo.ts")],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
    // `import.meta.env` no existe en Node: se sustituye por los valores reales
    // del build para que la URL del sitio y los flags sean los correctos.
    define: {
      "import.meta.env": JSON.stringify({
        VITE_SITE_URL: siteUrl,
        DEV: false,
        PROD: true,
      }),
    },
    plugins: [
      {
        // Las imágenes sólo aportan una ruta; para los metadatos da igual cuál.
        name: "stub-assets",
        setup(build) {
          build.onResolve({ filter: ASSET_RE }, (args) => ({
            path: args.path,
            namespace: "asset-stub",
          }));
          build.onLoad({ filter: /.*/, namespace: "asset-stub" }, (args) => ({
            contents: `export default ${JSON.stringify(args.path)};`,
            loader: "js",
          }));
        },
      },
    ],
  });

  // Cache-busting: Node cachea los módulos ya importados entre builds.
  return import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);
}

/** Escapa lo que va dentro de un atributo HTML. */
function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Sustituye una etiqueta `<meta>` existente, o la añade si no está. */
function replaceMeta(html, attr, key, content) {
  const pattern = new RegExp(`<meta\\s+${attr}="${key}"[^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(content)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function applySeoToHtml(html, seo) {
  let out = html;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeAttr(seo.title)}</title>`);
  out = out.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(seo.canonical)}" />`
  );
  out = out.replace(
    /<html\s+lang="[^"]*"/i,
    `<html lang="${seo.language === "es" ? "es-DO" : "en-US"}"`
  );

  out = replaceMeta(out, "name", "description", seo.description);
  out = replaceMeta(out, "property", "og:title", seo.title);
  out = replaceMeta(out, "property", "og:description", seo.description);
  out = replaceMeta(out, "property", "og:url", seo.canonical);
  out = replaceMeta(out, "property", "og:image", seo.ogImage);
  out = replaceMeta(out, "property", "og:type", seo.ogType);
  out = replaceMeta(out, "name", "twitter:title", seo.title);
  out = replaceMeta(out, "name", "twitter:description", seo.description);
  out = replaceMeta(out, "name", "twitter:image", seo.ogImage);

  if (seo.noindex) {
    out = replaceMeta(out, "name", "robots", "noindex, follow");
  }

  return out;
}

export function prerenderRouteMetadata({ siteUrl = "https://invifty.com" } = {}) {
  let outDir = "dist";
  let root = process.cwd();

  return {
    name: "invifty-prerender-route-metadata",
    apply: "build",

    configResolved(config) {
      outDir = config.build.outDir;
      root = config.root;
    },

    async closeBundle() {
      const indexPath = path.join(root, outDir, "index.html");
      if (!existsSync(indexPath)) return;

      let seoModule;
      try {
        seoModule = await loadSeoModule(root, siteUrl);
      } catch (error) {
        // Si esto falla, el sitio sigue funcionando: sólo se queda sin
        // metadatos por ruta en la primera carga. Mejor avisar que romper.
        this.warn(`[invifty] No se pudo prerenderizar los metadatos: ${error.message}`);
        return;
      }

      const { getIndexableRoutes, getRouteSeo } = seoModule;
      const template = await readFile(indexPath, "utf8");
      const routes = getIndexableRoutes();
      let written = 0;

      for (const route of routes) {
        const seo = getRouteSeo(route, "es");
        const html = applySeoToHtml(template, seo);

        if (route === "/") {
          // La portada sobrescribe el index.html raíz.
          await writeFile(indexPath, html, "utf8");
        } else {
          const dir = path.join(root, outDir, route.replace(/^\//, ""));
          await mkdir(dir, { recursive: true });
          await writeFile(path.join(dir, "index.html"), html, "utf8");
        }
        written++;
      }

      // El sitemap se genera de la MISMA lista de rutas indexables, así que no
      // puede anunciar una URL inexistente ni olvidarse de una nueva.
      const urls = routes
        .map((route) => {
          const { canonical } = getRouteSeo(route, "es");
          const priority = route === "/" ? "1.0" : route.startsWith("/muestra/") ? "0.8" : "0.9";
          const changefreq = route === "/" ? "weekly" : "monthly";
          return `  <url>\n    <loc>${canonical}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
        })
        .join("\n");

      const sitemap =
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        `${urls}\n` +
        "</urlset>\n";

      await writeFile(path.join(root, outDir, "sitemap.xml"), sitemap, "utf8");

      console.log(
        `\n[invifty] Metadatos prerenderizados en ${written} rutas. sitemap.xml regenerado.`
      );
    },
  };
}
