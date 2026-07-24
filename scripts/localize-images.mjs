/**
 * Descarga las imágenes de Unsplash que el sitio todavía referencia por URL
 * y las convierte a WebP locales en src/assets/images/.
 *
 * Uso (requiere red con acceso a images.unsplash.com):
 *   node scripts/localize-images.mjs
 *
 * Después de ejecutarlo, actualiza las referencias en:
 *   - src/data/portfolioData.ts  (5 tarjetas)
 *   - src/demos/BodaDemo.tsx     (galería)
 *   - src/demos/CumpleDemo.tsx   (galería)
 * cambiando cada URL por un import del .webp generado.
 */
import sharp from "sharp";
import path from "path";
import { mkdirSync } from "fs";

const OUT = path.resolve(import.meta.dirname, "../src/assets/images");
mkdirSync(OUT, { recursive: true });

const IMAGES = {
  baby_shower_demo: "photo-1519689680058-324335c77eba",
  bautizo_demo: "photo-1544717305-2782549b5136",
  adult_birthday_demo: "photo-1530103862676-de8c9debad1d",
  bridal_shower_demo: "photo-1527529482837-4698179dc6ce",
  grand_opening_demo: "photo-1511578314322-379afb476865",
  boda_gallery_1: "photo-1519741497674-611481863552",
  boda_gallery_2: "photo-1511285560929-80b456fea0bc",
  boda_gallery_3: "photo-1583939003579-730e3918a45a",
  boda_gallery_4: "photo-1520854221256-17451cc331bf",
  boda_gallery_5: "photo-1465495976277-4387d4b0b4c6",
  cumple_gallery_1: "photo-1519671482749-fd09be7ccebf",
  cumple_gallery_2: "photo-1511795409834-ef04bbd61622",
};

for (const [name, id] of Object.entries(IMAGES)) {
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=900`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`✗ ${name}: HTTP ${res.status}`);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  const out = path.join(OUT, `${name}.webp`);
  await sharp(buffer).resize({ width: 900, withoutEnlargement: true }).webp({ quality: 72 }).toFile(out);
  console.log(`✓ ${name}.webp`);
}
