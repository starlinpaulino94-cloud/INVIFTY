/**
 * Optimizador de imágenes de Invifty.
 *
 * Uso: coloca los originales (JPG/PNG) en src/assets/originals/ y ejecuta:
 *   npm run optimize:images
 *
 * Genera versiones WebP redimensionadas en src/assets/images/.
 * Reglas: fondos de pantalla completa a 1600px, tarjetas/demos a 900px,
 * logos/avatares a 160px. Calidad WebP ~72.
 */
import sharp from "sharp";
import { existsSync, mkdirSync, readdirSync } from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const IN_DIR = path.join(ROOT, "src/assets/originals");
const OUT_DIR = path.join(ROOT, "src/assets/images");

if (!existsSync(IN_DIR)) {
  console.log(`No existe ${IN_DIR} — crea la carpeta y coloca ahí los originales.`);
  process.exit(0);
}
mkdirSync(OUT_DIR, { recursive: true });

const widthFor = (name) => {
  if (/logo|avatar/i.test(name)) return 160;
  if (/hero|bg|fondo/i.test(name)) return 1600;
  return 900;
};

for (const file of readdirSync(IN_DIR)) {
  if (!/\.(jpe?g|png)$/i.test(file)) continue;
  const base = file.replace(/\.(jpe?g|png)$/i, "");
  const out = path.join(OUT_DIR, `${base}.webp`);
  await sharp(path.join(IN_DIR, file))
    .resize({ width: widthFor(base), withoutEnlargement: true })
    .webp({ quality: 72 })
    .toFile(out);
  console.log(`✓ ${file} → ${path.relative(ROOT, out)}`);
}
