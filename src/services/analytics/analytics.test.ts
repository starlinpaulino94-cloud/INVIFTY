import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  AnalyticsEventName,
  AnalyticsProps,
  AnalyticsProvider,
  initAnalytics,
  resetOnceGuards,
  trackEvent,
  trackEventOnce,
  __resetAnalyticsForTests,
} from "./index";
import { parseUtm, captureUtm, getStoredUtm, utmToProps } from "./utm";

interface Recorded {
  event: AnalyticsEventName;
  props: AnalyticsProps;
}

function createSpyProvider(): { provider: AnalyticsProvider; events: Recorded[] } {
  const events: Recorded[] = [];
  return {
    events,
    provider: {
      name: "spy",
      init: () => {},
      track: (event, props) => events.push({ event, props }),
    },
  };
}

beforeEach(() => {
  __resetAnalyticsForTests();
  sessionStorage.clear();
});

describe("capa de analítica", () => {
  it("envía los eventos a todos los proveedores registrados", () => {
    const a = createSpyProvider();
    const b = createSpyProvider();
    initAnalytics([a.provider, b.provider]);

    trackEvent("select_plan", { plan_id: "popular" });

    expect(a.events).toHaveLength(1);
    expect(b.events).toHaveLength(1);
    expect(a.events[0].event).toBe("select_plan");
    expect(a.events[0].props.plan_id).toBe("popular");
  });

  it("no falla si no hay ningún proveedor", () => {
    expect(() => trackEvent("page_view")).not.toThrow();
  });

  it("añade page_path automáticamente", () => {
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);
    trackEvent("view_pricing");
    expect(spy.events[0].props.page_path).toBe(window.location.pathname);
  });

  it("deja que el componente sobrescriba page_path", () => {
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);
    trackEvent("view_demo", { page_path: "/muestra/boda" });
    expect(spy.events[0].props.page_path).toBe("/muestra/boda");
  });
});

describe("deduplicación de eventos", () => {
  it("registra una sola vez los eventos de impresión", () => {
    // view_pricing se dispara con IntersectionObserver: sin la guarda, subir y
    // bajar la página inflaría la métrica.
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);

    trackEventOnce("view_pricing", {}, "planes");
    trackEventOnce("view_pricing", {}, "planes");
    trackEventOnce("view_pricing", {}, "planes");

    expect(spy.events).toHaveLength(1);
  });

  it("distingue instancias por clave", () => {
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);

    trackEventOnce("view_demo", { demo_id: "boda" }, "boda");
    trackEventOnce("view_demo", { demo_id: "quince" }, "quince");

    expect(spy.events).toHaveLength(2);
  });

  it("vuelve a permitir el evento tras cambiar de ruta", () => {
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);

    trackEventOnce("view_pricing", {}, "planes");
    resetOnceGuards();
    trackEventOnce("view_pricing", {}, "planes");

    expect(spy.events).toHaveLength(2);
  });
});

describe("captura de UTM", () => {
  it("lee los parámetros de campaña de la URL", () => {
    const utm = parseUtm("?utm_source=instagram&utm_medium=bio&utm_campaign=bodas2026");
    expect(utm).toEqual({ source: "instagram", medium: "bio", campaign: "bodas2026" });
  });

  it("ignora parámetros que no son UTM", () => {
    expect(parseUtm("?foo=bar")).toEqual({});
  });

  it("conserva los UTM durante la sesión", () => {
    // El visitante llega por un anuncio y envía el formulario varias vistas
    // después, cuando la URL ya no lleva los parámetros.
    captureUtm("?utm_source=meta&utm_campaign=quince");
    expect(getStoredUtm()).toEqual({ source: "meta", campaign: "quince" });

    captureUtm("");
    expect(getStoredUtm().source).toBe("meta");
  });

  it("adjunta los UTM a cada evento", () => {
    captureUtm("?utm_source=whatsapp&utm_medium=estado");
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);

    trackEvent("submit_lead_form", { plan_id: "premium" });

    expect(spy.events[0].props.utm_source).toBe("whatsapp");
    expect(spy.events[0].props.utm_medium).toBe("estado");
    expect(spy.events[0].props.plan_id).toBe("premium");
  });

  it("convierte los UTM guardados en propiedades con prefijo", () => {
    expect(utmToProps({ source: "google", term: "invitaciones" })).toEqual({
      utm_source: "google",
      utm_term: "invitaciones",
    });
  });

  it("sobrevive a un sessionStorage inaccesible", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("modo privado");
    });
    expect(() => captureUtm("?utm_source=x")).not.toThrow();
  });
});

describe("privacidad de los eventos", () => {
  it("no expone datos personales en las propiedades enviadas", () => {
    const spy = createSpyProvider();
    initAnalytics([spy.provider]);

    trackEvent("submit_lead_form", {
      plan_id: "popular",
      event_type: "Boda / Matrimonio",
      lead_submission_mode: "whatsapp",
    });

    const props = spy.events[0].props;
    const serialized = JSON.stringify(props);
    // El tipo AnalyticsProps ya impide estos campos; esta prueba lo fija
    // también en tiempo de ejecución.
    expect(serialized).not.toMatch(/name|phone|email|"message"/i);
  });
});
