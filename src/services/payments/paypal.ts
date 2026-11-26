/**
 * PAGOS CON PAYPAL (enlaces de pago)
 * ==================================
 * Cada plan se paga con un "enlace de pago" creado en el panel de PayPal.
 * PayPal guarda allí el precio, la moneda y la página de retorno: esta web sólo
 * muestra un botón que abre esa página de pago en otra pestaña. No carga
 * ningún script de PayPal ni usa claves: el código del enlace es público.
 *
 * PARA CAMBIAR O AÑADIR EL PAGO DE UN PLAN
 * 1. En PayPal: Productos y servicios → Enlaces de pago → crear el enlace
 *    (moneda USD, precio igual al del plan en `pricingData.ts`).
 * 2. Copiar el código de su URL (paypal.com/ncp/payment/<código>) y ponerlo
 *    aquí abajo junto al `id` del plan.
 *
 * Un plan sin entrada en este mapa conserva su botón de WhatsApp y no muestra
 * ninguna opción de pago en línea: nunca se anuncia un cobro que no existe.
 */
export const PAYPAL_PAYMENT_LINKS: Readonly<Record<string, string>> = {
  esencial: "Q39565674TWKA",
  popular: "7CLS9XVM5SW7Q",
  premium: "S6Q3NJLBMEBTS",
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

/** ¿El plan se puede pagar en línea? */
export function hasOnlinePayment(planId: string): boolean {
  return getPaymentLinkId(planId) !== undefined;
}
