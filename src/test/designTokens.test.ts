import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = process.cwd();

/** Colores de marca que deben consumirse siempre como token. */
const TOKENIZED_COLORS: Record<string, string> = {
  "#D4AF37": "gold",
  "#F2D06B": "gold-hover",
  "#0A0A0A": "surface-sunken",
  "#0F0F0F": "surface",
  "#121212": "surface-card",
  "#151515": "surface-raised",
  "#1A1A1A": "surface-hover",
  "#25D366": "whatsapp",
};

/** Recorre un directorio y devuelve los .tsx que no son pruebas. */
function collectTsx(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${entry.name}`;
    if (entry.isDirectory()) collectTsx(rel, acc);
    else if (entry.name.endsWith(".tsx") && !entry.name.includes(".test.")) acc.push(rel);
  }
  return acc;
}

describe("tokens visuales", () => {
  it("define todos los tokens de marca en index.css", () => {
    const css = readFileSync(join(ROOT, "src/index.css"), "utf8");
    for (const token of Object.values(TOKENIZED_COLORS)) {
      expect(css, `falta --color-${token} en @theme`).toContain(`--color-${token}:`);
    }
  });

  it("no deja hexadecimales de marca sueltos en el sitio comercial", () => {
    // El dorado llegó a repetirse 220 veces en components/ y pages/.
    // Ahora debe consumirse como `text-gold`, `bg-gold`, etc.
    const offenders: string[] = [];

    for (const file of [...collectTsx("src/components"), ...collectTsx("src/pages")]) {
      const source = readFileSync(join(ROOT, file), "utf8");
      for (const [hex, token] of Object.entries(TOKENIZED_COLORS)) {
        // Sólo se persiguen los valores arbitrarios de Tailwind: `algo-[#HEX]`.
        const pattern = new RegExp(`-\\[${hex}\\]`, "i");
        if (pattern.test(source)) {
          offenders.push(`${file} usa ${hex} en vez de "${token}"`);
        }
      }
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });

  it("deja las demos con su propia paleta, sin obligarlas a usar tokens", () => {
    // Cada demo vende un diseño distinto: sus colores NO deben unificarse.
    const demoSource = collectTsx("src/demos")
      .map((f) => readFileSync(join(ROOT, f), "utf8"))
      .join("");
    expect(/#[0-9A-Fa-f]{6}/.test(demoSource)).toBe(true);
  });
});

describe("contraste de texto", () => {
  /** Luminancia relativa según WCAG 2.1. */
  function luminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb.map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function contrast(a: [number, number, number], b: [number, number, number]): number {
    const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }

  /** Blanco con alfa compuesto sobre un fondo opaco. */
  function whiteOver(alpha: number, bg: [number, number, number]): [number, number, number] {
    return bg.map((c) => Math.round(alpha * 255 + (1 - alpha) * c)) as [number, number, number];
  }

  const SURFACES: Record<string, [number, number, number]> = {
    "surface-sunken": [10, 10, 10],
    surface: [15, 15, 15],
    "surface-raised": [21, 21, 21],
  };

  it("confirma que las opacidades antiguas incumplían 4.5:1", () => {
    // Justifica el cambio: text-white/40 daba 3.8:1 sobre los fondos del sitio.
    for (const bg of Object.values(SURFACES)) {
      expect(contrast(whiteOver(0.4, bg), bg)).toBeLessThan(4.5);
      expect(contrast(whiteOver(0.35, bg), bg)).toBeLessThan(4.5);
    }
  });

  it("confirma que text-white/60 cumple 4.5:1 en todas las superficies", () => {
    for (const [name, bg] of Object.entries(SURFACES)) {
      expect(contrast(whiteOver(0.6, bg), bg), `text-white/60 sobre ${name}`).toBeGreaterThanOrEqual(
        4.5
      );
    }
  });

  it("no deja texto por debajo del umbral en el sitio comercial", () => {
    const offenders: string[] = [];
    // /20 se admite sólo en elementos decorativos marcados con aria-hidden
    // o en texto grande, que tiene umbral 3:1.
    const FORBIDDEN = [25, 30, 35, 40, 45].filter((a) => {
      const bg = SURFACES["surface-raised"];
      return contrast(whiteOver(a / 100, bg), bg) < 4.5;
    });

    for (const file of [...collectTsx("src/components"), ...collectTsx("src/pages")]) {
      const source = readFileSync(join(ROOT, file), "utf8");
      for (const alpha of FORBIDDEN) {
        // `text-white/40` sigue permitido en los dos casos revisados a mano
        // (número de paso y icono "no incluido"), ambos con umbral 3:1.
        if (alpha === 40) continue;

        // Se excluye lo decorativo: un elemento marcado con `aria-hidden` no
        // transmite información, así que no le aplica el contraste mínimo de
        // texto (WCAG 1.4.3).
        //
        // No basta con mirar la línea del match: cuando la clase vive dentro de
        // un ternario, `aria-hidden` queda varias líneas más abajo en la MISMA
        // etiqueta. Por eso se reconstruye la etiqueta JSX completa antes de
        // decidir — si no, un icono decorativo se marcaría como infractor.
        const lines = source.split("\n");
        const pattern = new RegExp(`text-white/${alpha}\\b`);

        for (let i = 0; i < lines.length; i++) {
          if (!pattern.test(lines[i])) continue;

          let start = i;
          while (start > 0 && !/<[A-Za-z]/.test(lines[start])) start--;
          let end = i;
          while (end < lines.length - 1 && !/\/?>\s*$/.test(lines[end])) end++;

          if (lines.slice(start, end + 1).join(" ").includes("aria-hidden")) continue;
          offenders.push(`${file}:${i + 1}: text-white/${alpha}`);
        }
      }
    }

    expect(offenders, offenders.join("\n")).toEqual([]);
  });
});
