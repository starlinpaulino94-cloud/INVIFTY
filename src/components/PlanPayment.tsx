import PayPalLinkButton from "./PayPalLinkButton";
import { useLanguage } from "../context/LanguageContext";
import { getPaymentLinkId } from "../services/payments/paypal";

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
  const linkId = getPaymentLinkId(planId);

  if (!linkId) return null;

  return (
    <>
      <PayPalLinkButton linkId={linkId} planId={planId} placement={placement} />
      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-white/40 mb-3" aria-hidden="true">
        {language === "es" ? "— o —" : "— or —"}
      </p>
    </>
  );
}
