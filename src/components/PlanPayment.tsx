import PayPalButton from "./PayPalButton";
import PayPalLinkButton from "./PayPalLinkButton";
import { useLanguage } from "../context/LanguageContext";
import { getHostedButtonId, getPaymentLinkId } from "../services/payments/paypal";

interface PlanPaymentProps {
  planId: string;
  placement: string;
}

/**
 * Opción de pago en línea de un plan, seguida del separador "— o —" que lleva
 * al botón de WhatsApp. No pinta nada si el plan todavía no tiene pago
 * configurado: nunca se anuncia un cobro que no existe.
 */
export default function PlanPayment({ planId, placement }: PlanPaymentProps) {
  const { language } = useLanguage();
  const hostedButtonId = getHostedButtonId(planId);
  const linkId = getPaymentLinkId(planId);

  if (!hostedButtonId && !linkId) return null;

  return (
    <>
      {hostedButtonId ? (
        <PayPalButton hostedButtonId={hostedButtonId} planId={planId} placement={placement} />
      ) : (
        <PayPalLinkButton linkId={linkId!} planId={planId} placement={placement} />
      )}
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3" aria-hidden="true">
        {language === "es" ? "— o —" : "— or —"}
      </p>
    </>
  );
}
