import { Check, Clock, Eye, Sparkles } from "lucide-react";
import posterEditorial from "../assets/images/poster_editorial.svg";
import posterCelestial from "../assets/images/poster_celestial.svg";
import posterNeon from "../assets/images/poster_neon.svg";
import posterAurora from "../assets/images/poster_aurora.svg";
import { useLanguage } from "../context/LanguageContext";
import { Localized } from "../types";
import { trackEvent } from "../utils/analytics";

interface DemoSelectorProps {
  onNavigateDemo: (demoPath: string) => void;
}

interface DemoCard {
  id: string;
  eventType: string;
  demoPath: string;
  image: string;
  style: Localized;
  alt: string;
  features: Localized[];
  cta: Localized;
}

const DEMO_CARDS: DemoCard[] = [
  {
    id: "boda",
    eventType: "Boda",
    demoPath: "/muestra/boda-editorial-elena-gabriel",
    image: posterEditorial,
    style: { es: "Editorial clásico · Marfil, negro y oro", en: "Classic editorial · Ivory, black & gold" },
    alt: "Muestra de invitación digital de boda estilo editorial",
    features: [
      { es: "Apertura de sobre lacrado con sello dorado", en: "Sealed-envelope opening with gold wax seal" },
      { es: "Ceremonia y recepción con mapas directos", en: "Ceremony & reception with direct maps" },
      { es: "Confirmación RSVP integrada por WhatsApp", en: "Integrated WhatsApp RSVP" }
    ],
    cta: { es: "Ver boda", en: "View wedding" }
  },
  {
    id: "quince",
    eventType: "15 Años",
    demoPath: "/muestra/quince-celestial-amara",
    image: posterCelestial,
    style: { es: "Celestial · Azul noche y plata", en: "Celestial · Midnight blue & silver" },
    alt: "Muestra de invitación digital para 15 años estilo celestial",
    features: [
      { es: "Cielo nocturno con estrellas animadas", en: "Night sky with animated stars" },
      { es: "Itinerario de la noche paso a paso", en: "Step-by-step night itinerary" },
      { es: "Dress code con paleta azul noche y plata", en: "Midnight blue & silver dress code palette" }
    ],
    cta: { es: "Ver 15 años", en: "View quinceañera" }
  },
  {
    id: "cumpleanos",
    eventType: "Cumpleaños",
    demoPath: "/muestra/neon-party-marcos-40",
    image: posterNeon,
    style: { es: "Neón eléctrico · Magenta y cian", en: "Electric neon · Magenta & cyan" },
    alt: "Muestra de invitación digital de cumpleaños estilo neón",
    features: [
      { es: "Cuenta regresiva bicolor animada", en: "Animated two-tone countdown" },
      { es: "Line-up de la noche: open bar, DJ y karaoke", en: "Night line-up: open bar, DJ & karaoke" },
      { es: "Confirmación en un toque por WhatsApp", en: "One-tap WhatsApp confirmation" }
    ],
    cta: { es: "Ver cumpleaños", en: "View birthday" }
  },
  {
    id: "corporativo",
    eventType: "Corporativo",
    demoPath: "/muestra/summit-aurora-vitrexi",
    image: posterAurora,
    style: { es: "Minimal corporativo · Acento de marca", en: "Corporate minimal · Brand accent" },
    alt: "Muestra de invitación digital corporativa estilo minimal",
    features: [
      { es: "Agenda cronológica del evento", en: "Chronological event agenda" },
      { es: "Acceso con pase QR personal explicado", en: "Personal QR pass access explained" },
      { es: "Registro de asistentes por WhatsApp", en: "Attendee registration via WhatsApp" }
    ],
    cta: { es: "Ver corporativo", en: "View corporate" }
  }
];

export default function DemoSelector({ onNavigateDemo }: DemoSelectorProps) {
  const { language, lx } = useLanguage();
  const isEs = language === "es";

  return (
    <section id="demos" className="py-24 bg-[#0F0F0F] border-t border-white/5 relative scroll-mt-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEs ? "Prueba antes de pedir" : "Try before you order"}
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "Mira cómo se siente " : "See how your "}
            <span className="italic font-light text-[#D4AF37]">
              {isEs ? "tu invitación" : "invitation feels"}
            </span>
          </h2>

          <p className="text-white/50 text-sm sm:text-base font-light italic max-w-2xl mx-auto">
            {isEs
              ? "Cada tipo de evento tiene su propio estilo. Explora una muestra real y descubre qué incluye antes de decidir tu plan."
              : "Every event type has its own style. Explore a real sample and discover what's included before you pick a plan."}
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DEMO_CARDS.map((demo) => (
            <article
              key={demo.id}
              className="bg-[#121212] border border-white/10 hover:border-[#D4AF37] flex flex-col group rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-10px_rgba(212,175,55,0.25)]"
            >
              {/* Poster Image */}
              <div className="relative h-56 overflow-hidden bg-[#1A1A1A]">
                <img
                  src={demo.image}
                  alt={demo.alt}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent"></div>

                {/* Event type badge */}
                <span className="absolute top-4 left-4 bg-black/85 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase tracking-[0.18em] font-semibold px-3 py-1.5 border border-[#D4AF37]/40 rounded-full shadow-lg">
                  {demo.eventType}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.2em] font-medium mb-3">
                    {lx(demo.style)}
                  </p>

                  <ul className="space-y-2 mb-5">
                    {demo.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light leading-snug">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{lx(feature)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Clock className="w-3 h-3 text-[#D4AF37]" aria-hidden="true" />
                    {isEs ? "Exploración" : "Exploration"}: ~2 min
                  </p>

                  <button
                    onClick={() => {
                      trackEvent("select_demo_style", { event_type: demo.eventType, placement: "demo_selector" });
                      onNavigateDemo(demo.demoPath);
                    }}
                    className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#F2D06B] text-black font-bold text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-lg active:scale-98 touch-manipulation min-h-[44px]"
                  >
                    <Eye className="w-4 h-4 text-black" aria-hidden="true" />
                    {lx(demo.cta)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
