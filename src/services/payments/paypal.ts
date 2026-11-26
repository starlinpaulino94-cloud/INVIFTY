import { ENV } from "../../config/env";

/**
 * PAGOS CON PAYPAL (botones alojados)
 * ===================================
 * Cada plan que se puede pagar en línea tiene un "botón alojado" creado en el
 * panel de PayPal. PayPal guarda allí el precio, la moneda y la página de
 * retorno: esta web sólo dibuja el botón por su identificador.
 *
 * PARA ACTIVAR EL PAGO DE UN PLAN
 * 1. En PayPal: Productos y servicios → Botones de pago → crear el botón
 *    (moneda USD, precio igual al del plan en `pricingData.ts`).
 * 2. Copiar su `hostedButtonId` (la parte Q39565674TWKA del código que da
 *    PayPal) y añadirlo aquí abajo con el `id` del plan.
 *
 * Un plan sin entrada en este mapa conserva su botón de WhatsApp y no muestra
 * ninguna opción de pago en línea: nunca se anuncia un cobro que no existe.
 */
export const PAYPAL_HOSTED_BUTTONS: Readonly<Record<string, string>> = {
  esencial: "Q39565674TWKA",
  popular: "7CLS9XVM5SW7Q",
  premium: "S6Q3NJLBMEBTS",
  // "a-medida": "",
};

/**
 * ENLACES DE PAGO (alternativa a los botones alojados)
 * PayPal también permite crear un "enlace de pago": no necesita script, el
 * botón es un formulario que abre la página de pago de PayPal en otra pestaña.
 * Se configura igual: `id` del plan -> código de la URL
 * (paypal.com/ncp/payment/<código>). Un plan no debe estar en los dos mapas.
 */
export const PAYPAL_PAYMENT_LINKS: Readonly<Record<string, string>> = {
  "a-medida": "DJJ8H2NDVZJNN",
};

/** Enlace de pago configurado para un plan, o `undefined` si no tiene. */
export function getPaymentLinkId(planId: string): string | undefined {
  const id = PAYPAL_PAYMENT_LINKS[planId];
  return id && id.trim() !== "" ? id : undefined;
}

/** Dirección de la página de pago de PayPal para un enlace de pago. */
export function buildPaymentLinkUrl(linkId: string): string {
  return `https://www.paypal.com/ncp/payment/${encodeURIComponent(linkId)}`;
}

/** ¿El plan se puede pagar en línea (botón alojado o enlace de pago)? */
export function hasOnlinePayment(planId: string): boolean {
  return Boolean(getHostedButtonId(planId) ?? getPaymentLinkId(planId));
}

/** Botón de pago configurado para un plan, o `undefined` si todavía no tiene. */
export function getHostedButtonId(planId: string): string | undefined {
  const id = PAYPAL_HOSTED_BUTTONS[planId];
  return id && id.trim() !== "" ? id : undefined;
}

/** Subconjunto de la API de PayPal que usa el sitio. */
export interface PayPalNamespace {
  HostedButtons: (options: { hostedButtonId: string }) => {
    render: (container: string | HTMLElement) => Promise<void>;
  };
}

declare global {
  interface Window {
    paypal?: PayPalNamespace;
  }
}

/** Dirección del SDK: sólo el componente de botones alojados, en dólares. */
export function buildSdkUrl(clientId: string): string {
  const params = new URLSearchParams({
    "client-id": clientId,
    components: "hosted-buttons",
    "disable-funding": "venmo",
    currency: "USD",
  });
  return `https://www.paypal.com/sdk/js?${params.toString()}`;
}

let sdkPromise: Promise<PayPalNamespace> | null = null;

/**
 * Carga el SDK de PayPal una sola vez por página, aunque varios botones lo
 * pidan a la vez. Se invoca bajo demanda —cuando la sección de planes está a
 * punto de verse— y no en cada visita, para no cargar un script de terceros a
 * quien nunca llega a los precios.
 *
 * Si la carga falla (red caída, bloqueador de anuncios), la promesa se
 * descarta para que un reintento posterior pueda volver a intentarlo.
 */
export function loadPayPalSdk(clientId: string = ENV.paypalClientId): Promise<PayPalNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("PayPal sólo puede cargarse en el navegador."));
  }
  if (window.paypal?.HostedButtons) return Promise.resolve(window.paypal);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<PayPalNamespace>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = buildSdkUrl(clientId);
    script.async = true;

    script.onload = () => {
      if (window.paypal?.HostedButtons) resolve(window.paypal);
      else {
        script.remove();
        reject(new Error("El SDK de PayPal cargó sin botones alojados."));
      }
    };
    script.onerror = () => {
      script.remove();
      reject(new Error("No se pudo cargar el SDK de PayPal."));
    };

    document.head.appendChild(script);
  }).catch((error) => {
    sdkPromise = null;
    throw error;
  });

  return sdkPromise;
}

/** Sólo para pruebas: olvida la carga en curso. */
export function resetPayPalSdkForTests(): void {
  sdkPromise = null;
}
