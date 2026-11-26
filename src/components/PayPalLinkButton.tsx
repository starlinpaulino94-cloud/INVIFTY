import { ShieldCheck } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../services/analytics";
import { buildPaymentLinkUrl } from "../services/payments/paypal";

interface PayPalLinkButtonProps {
  /** Código del enlace de pago creado en el panel de PayPal. */
  linkId: string;
  /** Plan al que pertenece, sólo para medir (nunca datos personales). */
  planId: string;
  /** Dónde está colocado, para la analítica. */
  placement: string;
}

/**
 * Pago con PayPal mediante un "enlace de pago".
 *
 * A diferencia del botón alojado no carga ningún script de terceros: es un
 * formulario que abre la página de pago de PayPal en otra pestaña, así que no
 * hay nada que se pueda bloquear ni que cargar de antemano. PayPal sólo recibe
 * al visitante cuando pulsa el botón.
 */
export default function PayPalLinkButton({ linkId, planId, placement }: PayPalLinkButtonProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className="mb-4">
      <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/60 font-semibold mb-2">
        <ShieldCheck className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
        {isEs ? "Pago seguro con PayPal" : "Secure payment with PayPal"}
      </p>

      <form
        action={buildPaymentLinkUrl(linkId)}
        method="post"
        target="_blank"
        rel="noopener noreferrer"
        onSubmit={() => trackEvent("click_payment_link", { plan_id: planId, placement })}
        className="rounded-xl bg-[#F5EFE3] px-3 py-4"
      >
        <button
          type="submit"
          className="w-full min-h-[44px] rounded bg-[#FFD140] hover:bg-[#F2C230] text-black font-bold text-base transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#101713]"
        >
          {isEs ? "Pagar ahora" : "Pay now"}
          <span className="sr-only">{isEs ? " (se abre en una pestaña nueva)" : " (opens in a new tab)"}</span>
        </button>
      </form>

      <p className="text-[10px] text-white/50 leading-snug mt-2">
        {isEs
          ? "Al pagar, escríbenos por WhatsApp con los datos de tu evento para empezar tu invitación."
          : "Once paid, message us on WhatsApp with your event details so we can start your invitation."}
      </p>
    </div>
  );
}
