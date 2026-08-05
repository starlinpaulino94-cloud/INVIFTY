/**
 * GENERADOR DE TARJETAS DE COMPARTIR (OPEN GRAPH)
 * ==============================================
 * Produce una imagen 1200×630 con la marca Invifty por cada tipo de evento, en
 * `public/og/`.
 *
 * POR QUÉ EXISTE
 * --------------
 * Las 21 rutas del sitio compartían una única `og-image.jpg`: una foto de boda
 * sin logo ni texto. Compartir la muestra corporativa o la del baby shower por
 * WhatsApp enseñaba una novia. Como WhatsApp es el canal principal de venta en
 * RD, esa tarjeta es, en la práctica, el anuncio.
 *
 * Uso (requiere red la primera vez, para las fotos de Unsplash):
 *   npm run og:images
 *
 * Las imágenes resultantes se versionan en el repositorio: el `build` NO las
 * regenera, así que un despliegue nunca depende de que Unsplash responda.
 */
import sharp from "sharp";
import path from "path";
import { mkdirSync, existsSync } from "fs";
import { readFile } from "fs/promises";

const ROOT = path.resolve(import.meta.dirname, "..");
const ASSETS = path.join(ROOT, "src/assets/images");
const OUT = path.join(ROOT, "public/og");

const WIDTH = 1200;
const HEIGHT = 630;

const GOLD = "#D4AF37";
const GOLD_SOFT = "#F2D06B";

/**
 * Una tarjeta por categoría de demo, más la portada.
 *
 * `source` es local (webp del propio sitio) o un id de foto de Unsplash, que se
 * descarga una sola vez. Los `poster_*.svg` no se usan como fondo: ya son
 * composiciones con su propio texto y quedarían ilegibles bajo otra capa.
 */
const CARDS = [
  {
    name: "default",
    source: { file: path.join(ROOT, "public/og-image.jpg") },
    // El nombre ya va arriba en la firma: repetirlo como título desperdicia la
    // línea más grande de la tarjeta.
    kicker: "República Dominicana",
    title: "Invitaciones que enamoran",
    subtitle: "Bodas · 15 Años · Corporativo · Celebraciones",
  },
  {
    name: "boda",
    source: { file: path.join(ASSETS, "wedding_couple_demo.webp") },
    kicker: "Invitaciones digitales",
    title: "Bodas",
    subtitle: "RSVP por invitado · Mapas · Mesa de regalos",
  },
  {
    name: "quinceanera",
    source: { file: path.join(ASSETS, "quince_valeria_demo.webp") },
    kicker: "Invitaciones digitales",
    title: "15 Años",
    subtitle: "Corte de honor · Galería · Confirmación en línea",
  },
  {
    name: "corporativo",
    // NO se usa `gala_corporate_demo.webp`, que es la portada de la muestra:
    // en su lado derecho aparece el cartel de un evento ajeno («Dominican
    // Business Excellence Awards 2024»). Recortarlo no servía —la foto es
    // 900×502, casi la misma proporción que la tarjeta— y enseñarlo insinuaría
    // una relación comercial que no existe.
    source: { unsplash: "photo-1540575467063-178a50c2df87" },
    kicker: "Invitaciones digitales",
    title: "Eventos Corporativos",
    subtitle: "Pases QR · Agenda · Registro de asistentes",
  },
  {
    name: "cumpleanos",
    source: { unsplash: "photo-1530103862676-de8c9debad1d" },
    kicker: "Invitaciones digitales",
    title: "Cumpleaños",
    subtitle: "Cuenta regresiva · Música · Galería",
  },
  {
    name: "baby-shower",
    source: { unsplash: "photo-1555252333-9f8e92e65df9" },
    kicker: "Invitaciones digitales",
    title: "Baby Shower",
    subtitle: "Confirmación de asistencia · Mesa de regalos",
  },
  {
    name: "bautizo",
    // No se usa la portada anterior del catálogo (`photo-1544717305…`): es una
    // mujer sosteniendo una caja naranja, sin relación con un bautizo.
    source: { unsplash: "photo-1529636798458-92182e662485" },
    kicker: "Invitaciones digitales",
    title: "Bautizos & Comuniones",
    subtitle: "Ceremonia y recepción · Padrinos · Galería",
  },
  {
    name: "bridal-shower",
    source: { unsplash: "photo-1527529482837-4698179dc6ce" },
    kicker: "Invitaciones digitales",
    title: "Despedidas de Soltera",
    subtitle: "Código de vestimenta · Juegos · Confirmación",
  },
  {
    name: "apertura",
    source: { unsplash: "photo-1511578314322-379afb476865" },
    kicker: "Invitaciones digitales",
    title: "Aperturas & Lanzamientos",
    subtitle: "Pases QR · Ubicación · Lista de invitados",
  },
];

/** Escapa lo que va dentro de un nodo de texto SVG. */
function esc(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Capa de texto y marco.
 *
 * Se usa una familia serif del sistema: el script se ejecuta a mano y su
 * resultado se versiona, así que no necesita las fuentes web del sitio.
 * El degradado inferior no es decorativo: sin él, un texto blanco sobre una
 * foto clara deja de leerse.
 */
function overlaySvg({ kicker, title, subtitle }) {
  const titleSize = title.length > 18 ? 62 : 78;

  return Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="45%"  stop-color="#000000" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.88"/>
    </linearGradient>
    <linearGradient id="goldline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="${GOLD_SOFT}"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#shade)"/>
  <rect x="28" y="28" width="${WIDTH - 56}" height="${HEIGHT - 56}"
        fill="none" stroke="${GOLD}" stroke-opacity="0.5" stroke-width="1.5"/>

  <text x="72" y="112" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" letter-spacing="11" fill="${GOLD}">INVIFTY</text>

  <text x="72" y="${HEIGHT - 186}" font-family="Georgia, 'Times New Roman', serif"
        font-size="25" letter-spacing="4" fill="#EAEAEA" fill-opacity="0.92">${esc(kicker)}</text>

  <text x="72" y="${HEIGHT - 104}" font-family="Georgia, 'Times New Roman', serif"
        font-size="${titleSize}" fill="#FFFFFF">${esc(title)}</text>

  <rect x="72" y="${HEIGHT - 74}" width="86" height="3" fill="url(#goldline)"/>

  <text x="72" y="${HEIGHT - 38}" font-family="Georgia, 'Times New Roman', serif"
        font-size="23" fill="#EAEAEA" fill-opacity="0.85">${esc(subtitle)}</text>
</svg>`);
}

async function loadSource(source) {
  if (source.file) {
    if (!existsSync(source.file)) throw new Error(`no existe ${source.file}`);
    return readFile(source.file);
  }
  const url = `https://images.unsplash.com/${source.unsplash}?auto=format&fit=crop&q=85&w=1600`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

mkdirSync(OUT, { recursive: true });

let ok = 0;
for (const card of CARDS) {
  try {
    const input = await loadSource(card.source);

    await sharp(input)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: card.position ?? "attention" })
      .composite([{ input: overlaySvg(card), top: 0, left: 0 }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT, `${card.name}.jpg`));

    ok += 1;
    console.log(`✓ og/${card.name}.jpg`);
  } catch (error) {
    console.error(`✗ ${card.name}: ${error.message}`);
  }
}

console.log(`\n${ok}/${CARDS.length} tarjetas generadas en public/og/`);
if (ok < CARDS.length) process.exitCode = 1;
