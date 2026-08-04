/**
 * CARGA BAJO DEMANDA DE LAS FUENTES DE LAS DEMOS
 * ==============================================
 * Cinzel, Cormorant Garamond y Alex Brush sólo las usan cuatro demos
 * (`BodaDemo`, `CorporateDemo`, `EditorialBodaDemo`, `QuinceCelestialDemo`).
 *
 * Antes se cargaban en `index.html` junto con las fuentes de marca, en una
 * única petición que **bloquea el renderizado de todas las páginas**, incluida
 * la home — que es la página que decide el LCP y la que ve la mayoría de
 * visitantes, sin llegar nunca a abrir una demo.
 *
 * Ahora se piden sólo cuando se monta una demo que las necesita. El `preconnect`
 * a Google Fonts sigue en `index.html`, así que la conexión ya está abierta y la
 * descarga empieza de inmediato.
 */

const DEMO_FONTS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Alex+Brush" +
  "&family=Cinzel:wght@400;500;600;700;800" +
  "&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,400" +
  "&display=swap";

const LINK_ID = "invifty-demo-fonts";

/**
 * Inserta la hoja de estilos de las fuentes de demo una sola vez.
 * Es idempotente: llamarla desde varias demos no duplica la petición.
 */
export function loadDemoFonts(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(LINK_ID)) return;

  const link = document.createElement("link");
  link.id = LINK_ID;
  link.rel = "stylesheet";
  link.href = DEMO_FONTS_HREF;
  document.head.appendChild(link);
}
