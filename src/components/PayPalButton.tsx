import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, ShieldCheck, RotateCcw } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../services/analytics";
import { loadPayPalSdk } from "../services/payments/paypal";

interface PayPalButtonProps {
  /** Identificador del botón alojado creado en el panel de PayPal. */
  hostedButtonId: string;
  /** Plan al que pertenece, sólo para medir (nunca datos personales). */
  planId: string;
  /** Dónde está colocado, para la analítica. */
  placement: string;
}

type Estado = "reposo" | "cargando" | "listo" | "error";

/**
 * Botón de pago con PayPal para un plan.
 *
 * - No toca la red hasta que la tarjeta está a punto de verse en pantalla.
 * - El botón alojado de PayPal pinta texto oscuro, por eso vive en un panel
 *   claro: sobre el fondo negro de la tarjeta sería ilegible.
 * - Si PayPal no carga (sin conexión, bloqueador de anuncios) se avisa y se
 *   ofrece reintentar; el botón de WhatsApp del plan sigue disponible debajo.
 */
export default function PayPalButton({ hostedButtonId, planId, placement }: PayPalButtonProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [estado, setEstado] = useState<Estado>("reposo");
  const [visible, setVisible] = useState(false);
  const [intento, setIntento] = useState(0);
  const envolturaRef = useRef<HTMLDivElement | null>(null);
  const contenedorRef = useRef<HTMLDivElement | null>(null);

  const contenedorId = `paypal-container-${hostedButtonId}`;

  // Espera a que la tarjeta esté cerca de la pantalla antes de pedir el SDK.
  useEffect(() => {
    const envoltura = envolturaRef.current;
    if (!envoltura) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    observer.observe(envoltura);
    return () => observer.disconnect();
  }, []);

  // Carga el SDK y dibuja el botón en su contenedor.
  useEffect(() => {
    if (!visible) return;
    let cancelado = false;
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    setEstado("cargando");

    loadPayPalSdk()
      .then((paypal) => {
        if (cancelado) return;
        // Evita pintar dos veces (React en desarrollo monta los efectos dos veces).
        contenedor.innerHTML = "";
        return paypal.HostedButtons({ hostedButtonId }).render(`#${contenedorId}`);
      })
      .then(() => {
        if (cancelado) return;
        setEstado("listo");
        trackEvent("view_payment_option", { plan_id: planId, placement });
      })
      .catch(() => {
        if (cancelado) return;
        setEstado("error");
        trackEvent("payment_option_error", { plan_id: planId, placement });
      });

    return () => {
      cancelado = true;
      contenedor.innerHTML = "";
    };
  }, [visible, intento, hostedButtonId, contenedorId, planId, placement]);

  const reintentar = useCallback(() => setIntento((n) => n + 1), []);

  return (
    <div ref={envolturaRef} className="mb-4">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
        {isEs ? "Pago seguro con PayPal" : "Secure payment with PayPal"}
      </p>

      <div className="rounded-xl bg-[#F5EFE3] px-3 py-3 min-h-[150px] flex flex-col justify-center">
        {estado === "cargando" && (
          <p
            role="status"
            className="flex items-center justify-center gap-2 text-xs text-[#2E2A24]/70"
          >
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            {isEs ? "Cargando pago seguro…" : "Loading secure payment…"}
          </p>
        )}

        {estado === "error" && (
          <div role="alert" className="text-center">
            <p className="text-xs text-[#2E2A24] leading-snug mb-3">
              {isEs
                ? "No pudimos cargar PayPal. Revisa tu conexión o desactiva el bloqueador de anuncios, o solicita el plan por WhatsApp."
                : "We couldn't load PayPal. Check your connection or disable your ad blocker, or request the plan via WhatsApp."}
            </p>
            <button
              type="button"
              onClick={reintentar}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#101713] border border-[#101713]/30 rounded-lg px-4 py-2.5 min-h-[44px] hover:bg-[#101713]/5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              {isEs ? "Reintentar" : "Try again"}
            </button>
          </div>
        )}

        {/* PayPal dibuja aquí su botón. Siempre visible (PayPal mide el contenedor al
            pintar, así que `display:none` lo rompería); vacío no ocupa altura. */}
        <div id={contenedorId} ref={contenedorRef} />
      </div>

      <p className="text-[10px] text-white/50 leading-snug mt-2">
        {isEs
          ? "Al pagar, escríbenos por WhatsApp con los datos de tu evento para empezar tu invitación."
          : "Once paid, message us on WhatsApp with your event details so we can start your invitation."}
      </p>
    </div>
  );
}
