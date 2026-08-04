import { RouteSeo } from "./routeSeo";

/** Crea o actualiza una `<meta>` por nombre o propiedad. */
function setMeta(attr: "name" | "property", key: string, content: string): void {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setLink(rel: string, href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

function removeMeta(attr: "name" | "property", key: string): void {
  document.head.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

/**
 * Vuelca los metadatos de la ruta activa en el `<head>`.
 *
 * ⚠️ **Limitación conocida.** Esto ocurre después de que React monte, así que
 * sólo lo aprovechan los rastreadores que ejecutan JavaScript (Google sí). Los
 * generadores de vista previa de WhatsApp, Facebook y Twitter leen el HTML
 * inicial y **no** ven estos cambios.
 *
 * La solución real es el HTML por ruta que genera el plugin de prerenderizado
 * en `vite.config.ts`: esta función mantiene el `<head>` coherente durante la
 * navegación dentro de la aplicación, y aquel resuelve la primera carga.
 * Ver docs/seo-tecnico.md.
 */
export function applyRouteSeo(seo: RouteSeo): void {
  if (typeof document === "undefined") return;

  document.title = seo.title;
  document.documentElement.lang = seo.language === "es" ? "es-DO" : "en-US";

  setMeta("name", "description", seo.description);
  setLink("canonical", seo.canonical);

  setMeta("property", "og:title", seo.title);
  setMeta("property", "og:description", seo.description);
  setMeta("property", "og:url", seo.canonical);
  setMeta("property", "og:image", seo.ogImage);
  setMeta("property", "og:type", seo.ogType);
  setMeta("property", "og:locale", seo.language === "es" ? "es_DO" : "en_US");

  setMeta("name", "twitter:title", seo.title);
  setMeta("name", "twitter:description", seo.description);
  setMeta("name", "twitter:image", seo.ogImage);

  // Sólo las rutas desconocidas llevan noindex; el resto NO debe conservarlo
  // al navegar, o una visita al 404 dejaría marcada toda la sesión.
  if (seo.noindex) {
    setMeta("name", "robots", "noindex, follow");
  } else {
    removeMeta("name", "robots");
  }
}
