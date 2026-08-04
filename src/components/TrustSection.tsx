import { CalendarClock, MessageCircle, RefreshCw, Users, Wallet } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { PRICING_PLANS } from "../data/pricingData";

/**
 * Compromisos verificables de Invifty.
 *
 * Sustituye a la antigua sección de testimonios, que atribuía opiniones a
 * personas con nombre, foto de iniciales, valoración de 5 estrellas, ciudad y
 * fecha, pese a no ser clientes reales ni contar con autorización. Una etiqueta
 * pequeña de "historia ilustrativa" no compensa una atribución inventada.
 *
 * Todo lo que se afirma aquí sale del catálogo de planes (`pricingData`) o de
 * condiciones que el negocio ya cumple, así que se mantiene cierto por
 * construcción: si cambia un plazo de entrega en el catálogo, cambia aquí.
 *
 * Cuando existan reseñas reales con permiso por escrito, este es el lugar donde
 * deben ir. Ver docs/catalogo-producto.md.
 */
export default function TrustSection() {
  const { language, lx } = useLanguage();
  const isEs = language === "es";

  const fastestDelivery = PRICING_PLANS.find((p) => !p.isCustom)?.deliveryTime;
  const maxRevisions = Math.max(...PRICING_PLANS.map((p) => p.revisions));

  const commitments = [
    {
      icon: CalendarClock,
      title: isEs ? "Entrega en días, no en semanas" : "Delivered in days, not weeks",
      body: isEs
        ? `Tu invitación queda lista en ${fastestDelivery ? lx(fastestDelivery) : "3–5 días hábiles"} desde que recibimos los datos y las fotos de tu evento.`
        : `Your invitation is ready in ${fastestDelivery ? lx(fastestDelivery) : "3–5 business days"} once we receive your event details and photos.`,
    },
    {
      icon: Users,
      title: isEs ? "Invitados ilimitados" : "Unlimited guests",
      body: isEs
        ? "No cobramos por invitado. Elige el plan por las funciones que necesitas, no por el tamaño de tu lista."
        : "We don't charge per guest. Choose your plan by the features you need, not the size of your list.",
    },
    {
      icon: Wallet,
      title: isEs ? "Un solo pago" : "A single payment",
      body: isEs
        ? "Pago único por evento, sin suscripciones mensuales ni costos ocultos después de publicar."
        : "One payment per event, with no monthly subscriptions or hidden costs after publishing.",
    },
    {
      icon: RefreshCw,
      title: isEs ? "Revisiones incluidas" : "Revisions included",
      body: isEs
        ? `Cada plan incluye rondas de revisión (hasta ${maxRevisions}) antes de publicar. Los cambios de hora, lugar o dress code son siempre gratuitos.`
        : `Every plan includes revision rounds (up to ${maxRevisions}) before publishing. Changes to time, venue or dress code are always free.`,
    },
    {
      icon: MessageCircle,
      title: isEs ? "Una sola persona al otro lado" : "One person on the other end",
      body: isEs
        ? "Coordinas todo por WhatsApp con el equipo que produce tu invitación. Sin tickets ni formularios de soporte."
        : "You coordinate everything on WhatsApp with the team producing your invitation. No tickets, no support forms.",
    },
  ];

  return (
    <section id="compromisos" className="py-24 bg-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
            {isEs ? "Cómo trabajamos" : "How we work"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Lo que puedes " : "What you can "}
            <span className="italic font-light text-gold">{isEs ? "esperar" : "expect"}</span>
          </h2>
          <p className="text-white/60 text-sm sm:text-base">
            {isEs
              ? "Condiciones concretas, no promesas genéricas. Esto es lo que incluye cada invitación Invifty."
              : "Concrete terms, not generic promises. This is what every Invifty invitation includes."}
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commitments.map((item) => (
            <li
              key={item.title}
              className="bg-surface-sunken border border-white/5 hover:border-gold/30 p-8 transition-colors duration-300"
            >
              <item.icon className="w-6 h-6 text-gold mb-5" aria-hidden="true" />
              <h3 className="font-serif text-lg font-normal text-white mb-2.5">{item.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{item.body}</p>
            </li>
          ))}
        </ul>

        {/* Declaración explícita: todavía no publicamos reseñas de clientes. */}
        <p className="text-center text-xs text-white/60 mt-12 max-w-2xl mx-auto leading-relaxed">
          {isEs
            ? "Aún no publicamos reseñas de clientes. Cuando tengamos opiniones reales, con permiso de quienes las escriban, aparecerán aquí con su nombre y su evento."
            : "We don't publish client reviews yet. Once we have real feedback, shared with the permission of those who write it, it will appear here with their name and event."}
        </p>
      </div>
    </section>
  );
}
