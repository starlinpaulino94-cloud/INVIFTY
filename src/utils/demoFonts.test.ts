import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, expect, it } from "vitest";
import { loadDemoFonts } from "./demoFonts";

const DEMOS_DIR = join(process.cwd(), "src/demos");

/** Clases cuyas familias NO se cargan en `index.html`. */
const ON_DEMAND_FONT_CLASSES = ["font-serif-display", "font-cormorant", "font-script"];

beforeEach(() => {
  document.getElementById("invifty-demo-fonts")?.remove();
});

describe("carga bajo demanda de fuentes", () => {
  it("inserta la hoja de estilos al pedirla", () => {
    loadDemoFonts();
    const link = document.getElementById("invifty-demo-fonts") as HTMLLinkElement | null;
    expect(link).not.toBeNull();
    expect(link!.rel).toBe("stylesheet");
    expect(link!.href).toContain("Cinzel");
    expect(link!.href).toContain("Cormorant+Garamond");
    expect(link!.href).toContain("Alex+Brush");
    expect(link!.href).toContain("display=swap");
  });

  it("no duplica la petición si se llama varias veces", () => {
    // Cuatro demos pueden montarse a lo largo de una sesión.
    loadDemoFonts();
    loadDemoFonts();
    loadDemoFonts();
    expect(document.querySelectorAll("#invifty-demo-fonts")).toHaveLength(1);
  });
});

describe("coherencia entre demos y fuentes bajo demanda", () => {
  it("obliga a llamar a useDemoFonts() a toda demo que use esas familias", () => {
    // Si alguien añade `font-cormorant` a una demo nueva y olvida el hook, la
    // fuente no se descarga nunca y el texto cae al respaldo del sistema.
    const offenders: string[] = [];

    for (const file of readdirSync(DEMOS_DIR).filter((f) => f.endsWith(".tsx"))) {
      const source = readFileSync(join(DEMOS_DIR, file), "utf8");
      const usesOnDemandFont = ON_DEMAND_FONT_CLASSES.some((cls) =>
        new RegExp(`\\b${cls}\\b`).test(source)
      );
      if (usesOnDemandFont && !source.includes("useDemoFonts()")) {
        offenders.push(file);
      }
    }

    expect(
      offenders,
      `estas demos usan Cinzel/Cormorant/Alex Brush sin llamar a useDemoFonts(): ${offenders.join(", ")}`
    ).toEqual([]);
  });

  it("no deja el hook puesto en demos que ya no lo necesitan", () => {
    const useless: string[] = [];

    for (const file of readdirSync(DEMOS_DIR).filter((f) => f.endsWith(".tsx"))) {
      const source = readFileSync(join(DEMOS_DIR, file), "utf8");
      const usesOnDemandFont = ON_DEMAND_FONT_CLASSES.some((cls) =>
        new RegExp(`\\b${cls}\\b`).test(source)
      );
      if (!usesOnDemandFont && source.includes("useDemoFonts()")) {
        useless.push(file);
      }
    }

    expect(
      useless,
      `estas demos piden fuentes que ya no usan: ${useless.join(", ")}`
    ).toEqual([]);
  });
});

describe("las fuentes bajo demanda no se usan fuera de las demos", () => {
  it("mantiene la home libre de Cinzel, Cormorant y Alex Brush", () => {
    // Si una sección de la home usara estas clases, su fuente nunca se cargaría,
    // porque el hook sólo vive en las demos.
    const roots = ["src/components", "src/pages"];
    const offenders: string[] = [];

    const walk = (dir: string): void => {
      for (const entry of readdirSync(join(process.cwd(), dir), { withFileTypes: true })) {
        const rel = `${dir}/${entry.name}`;
        if (entry.isDirectory()) {
          walk(rel);
        } else if (entry.name.endsWith(".tsx") && !entry.name.endsWith(".test.tsx")) {
          const source = readFileSync(join(process.cwd(), rel), "utf8");
          if (ON_DEMAND_FONT_CLASSES.some((cls) => new RegExp(`\\b${cls}\\b`).test(source))) {
            offenders.push(rel);
          }
        }
      }
    };
    roots.forEach(walk);

    expect(offenders, `usan fuentes de demo fuera de las demos: ${offenders.join(", ")}`).toEqual(
      []
    );
  });
});
