import { describe, expect, it } from "vitest";
import { PRICING_PLANS } from "../../data/pricingData";
import {
  DEMO_CATEGORIES,
  DEMO_CATEGORY_LABELS,
  DemoSource,
  PublicDemo,
  countByCategory,
  filterDemos,
  getDemoById,
  getDemoByUrl,
  getPublicDemos,
  getUsedCategories,
  setDemoSource,
} from "./index";
import { createStaticDemoSource } from "./staticSource";

const demos = getPublicDemos();

describe("adaptador del catálogo", () => {
  it("expone las 12 muestras con el contrato PublicDemo", () => {
    expect(demos).toHaveLength(12);
    for (const demo of demos) {
      expect(demo.id, "falta id").toBeTruthy();
      expect(demo.slug, `${demo.id}: falta slug`).toBeTruthy();
      expect(demo.title, `${demo.id}: falta título`).toBeTruthy();
      expect(demo.coverImage, `${demo.id}: falta imagen`).toBeTruthy();
      expect(demo.demoUrl, `${demo.id}: falta URL`).toMatch(/^\/muestra\//);
      expect(demo.features.length, `${demo.id}: sin capacidades`).toBeGreaterThan(0);
      expect(demo.active).toBe(true);
    }
  });

  it("traduce el tipo de evento a ambos idiomas", () => {
    for (const demo of demos) {
      expect(demo.eventTypeLabel.es, `${demo.id}: falta tipo en ES`).toBeTruthy();
      expect(demo.eventTypeLabel.en, `${demo.id}: falta tipo en EN`).toBeTruthy();
      expect(demo.style.es, `${demo.id}: falta estilo en ES`).toBeTruthy();
      expect(demo.style.en, `${demo.id}: falta estilo en EN`).toBeTruthy();
    }
  });

  it("asigna a cada muestra una categoría conocida", () => {
    for (const demo of demos) {
      expect(DEMO_CATEGORIES, `${demo.id}: categoría desconocida`).toContain(demo.category);
    }
  });

  it("etiqueta todas las categorías en ambos idiomas", () => {
    for (const category of DEMO_CATEGORIES) {
      expect(DEMO_CATEGORY_LABELS[category].es).toBeTruthy();
      expect(DEMO_CATEGORY_LABELS[category].en).toBeTruthy();
    }
  });

  it("no repite ids ni URLs", () => {
    expect(new Set(demos.map((d) => d.id)).size).toBe(demos.length);
    expect(new Set(demos.map((d) => d.demoUrl)).size).toBe(demos.length);
  });

  it("localiza una demo por id y por URL", () => {
    const first = demos[0];
    expect(getDemoById(first.id)?.id).toBe(first.id);
    expect(getDemoByUrl(first.demoUrl)?.id).toBe(first.id);
    expect(getDemoById("no-existe")).toBeUndefined();
  });
});

describe("plan mínimo declarado", () => {
  it("apunta siempre a un plan real del catálogo", () => {
    const planIds = new Set(PRICING_PLANS.map((p) => p.id));
    for (const demo of demos) {
      if (!demo.minimumPlan) continue;
      expect(planIds, `${demo.id}: plan "${demo.minimumPlan}" no existe`).toContain(
        demo.minimumPlan
      );
    }
  });

  it("exige Premium a las muestras que enseñan QR, cronograma o mesa de regalos", () => {
    // Esas tres capacidades entran en Premium según pricingData. Prometer que
    // una muestra con pases QR se consigue con el plan Popular sería vender algo
    // que ese plan no incluye.
    const planOrder = PRICING_PLANS.map((p) => p.id);
    const premiumIndex = planOrder.indexOf("premium");

    for (const demo of demos) {
      const showcasesPremium = demo.features.some((f) =>
        /\bQR\b|cronograma|itinerario|mesa de regalos/i.test(f.es)
      );
      if (!showcasesPremium) continue;

      expect(demo.minimumPlan, `${demo.id} enseña una función Premium sin declarar plan`).toBeDefined();
      expect(
        planOrder.indexOf(demo.minimumPlan!),
        `${demo.id} enseña una función Premium pero se ofrece desde "${demo.minimumPlan}"`
      ).toBeGreaterThanOrEqual(premiumIndex);
    }
  });

  it("no ofrece desde el plan Esencial ninguna muestra con RSVP", () => {
    // El RSVP empieza en Popular. Ver docs/catalogo-producto.md §4.1.
    for (const demo of demos) {
      const hasRsvp = demo.features.some((f) => /RSVP|confirmaci[óo]n/i.test(f.es));
      if (!hasRsvp) continue;
      expect(demo.minimumPlan, `${demo.id} ofrece RSVP desde Esencial`).not.toBe("esencial");
    }
  });
});

describe("filtrado del catálogo", () => {
  it("devuelve todas las muestras sin filtro", () => {
    expect(filterDemos({})).toHaveLength(12);
  });

  it("filtra por categoría usando el id estable, no el texto visible", () => {
    // Antes se comparaba `eventType.includes("boda")`: renombrar la etiqueta
    // rompía el filtro en silencio.
    const bodas = filterDemos({ category: "boda" });
    expect(bodas.length).toBeGreaterThan(0);
    expect(bodas.every((d) => d.category === "boda")).toBe(true);
  });

  it("cubre las categorías que el catálogo pide, incluida aperturas", () => {
    const used = getUsedCategories();
    for (const expected of ["boda", "quinceanera", "cumpleanos", "baby-shower", "bautizo", "corporativo", "apertura"] as const) {
      expect(used, `falta la categoría "${expected}"`).toContain(expected);
    }
  });

  it("busca por título, estilo y capacidades", () => {
    expect(filterDemos({ query: "Elena" }).length).toBeGreaterThan(0);
    expect(filterDemos({ query: "neón" }).length).toBeGreaterThan(0);
    expect(filterDemos({ query: "rsvp" }).length).toBeGreaterThan(0);
  });

  it("busca también en inglés", () => {
    expect(filterDemos({ query: "wedding", language: "en" }).length).toBeGreaterThan(0);
  });

  it("combina categoría y búsqueda", () => {
    const result = filterDemos({ category: "corporativo", query: "gala" });
    expect(result.every((d) => d.category === "corporativo")).toBe(true);
  });

  it("devuelve vacío si nada coincide, sin reventar", () => {
    expect(filterDemos({ query: "zzzznoexiste" })).toEqual([]);
  });

  it("cuenta correctamente por categoría", () => {
    const counts = countByCategory();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    expect(total).toBe(12);
  });
});

describe("origen intercambiable", () => {
  it("permite sustituir el catálogo estático por otro origen", () => {
    // Es la prueba de que los componentes no dependen del archivo estático:
    // el día que Studio sirva las demos, sólo cambia este origen.
    const fake: PublicDemo = {
      id: "studio-1",
      slug: "studio-1",
      title: "Desde Studio",
      category: "boda",
      eventTypeLabel: { es: "Boda", en: "Wedding" },
      style: { es: "Estilo", en: "Style" },
      subtitle: "—",
      coverImage: "/x.webp",
      features: [{ es: "RSVP", en: "RSVP" }],
      demoUrl: "/muestra/studio-1",
      active: true,
    };
    const remote: DemoSource = { name: "studio", list: () => [fake] };

    setDemoSource(remote);
    try {
      expect(getPublicDemos()).toHaveLength(1);
      expect(getPublicDemos()[0].title).toBe("Desde Studio");
    } finally {
      setDemoSource(createStaticDemoSource());
    }
    expect(getPublicDemos()).toHaveLength(12);
  });

  it("oculta las demos marcadas como inactivas", () => {
    const remote: DemoSource = {
      name: "studio",
      list: () => [
        { ...demos[0], id: "activa", active: true },
        { ...demos[1], id: "inactiva", active: false },
      ],
    };
    setDemoSource(remote);
    try {
      const listed = getPublicDemos();
      expect(listed).toHaveLength(1);
      expect(listed[0].id).toBe("activa");
    } finally {
      setDemoSource(createStaticDemoSource());
    }
  });
});
