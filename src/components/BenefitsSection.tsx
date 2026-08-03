import { Sparkles, MapPin, CalendarClock, CheckCircle2, Images, Share2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { Localized } from "../types";

/**
 * BENEFICIOS — traduce las funciones del producto en resultados para el
 * cliente. Posiciona a Invifty como la experiencia digital del evento
 * (diseño + información + confirmaciones en un solo enlace), no como
 * "una tarjeta bonita".
 */

interface Benefit {
  icon: typeof Sparkles;
  title: Localized;
  text: Localized;
}

const BENEFITS: Benefit[] = [
  {
    icon: Sparkles,
    title: { es: "Diseño que impresiona", en: "Design that impresses" },
    text: {
      es: "Tus invitados abren un enlace y encuentran una experiencia elegante hecha a la medida de tu evento, no una imagen reenviada.",
      en: "Your guests open a link and find an elegant experience tailored to your event — not a forwarded image.",
    },
  },
  {
    icon: MapPin,
    title: { es: "Nadie se pierde", en: "No one gets lost" },
    text: {
      es: "La dirección visible con enlace directo a Google Maps y Waze lleva a cada invitado hasta la puerta del lugar.",
      en: "A visible address with direct Google Maps and Waze links takes every guest right to the venue door.",
    },
  },
  {
    icon: CalendarClock,
    title: { es: "La fecha no se olvida", en: "The date isn't forgotten" },
    text: {
      es: "Cuenta regresiva en vivo y botón para guardar el evento en el calendario del teléfono de cada invitado.",
      en: "A live countdown plus a button to save the event to each guest's phone calendar.",
    },
  },
  {
    icon: CheckCircle2,
    title: { es: "Confirmaciones sin perseguir a nadie", en: "RSVPs without chasing anyone" },
    text: {
      es: "Tus invitados confirman asistencia desde la propia invitación y tú recibes las respuestas organizadas, sin llamadas una por una.",
      en: "Guests confirm right from the invitation and you receive organized responses — no one-by-one phone calls.",
    },
  },
  {
    icon: Images,
    title: { es: "Tu historia, con música y fotos", en: "Your story, with music and photos" },
    text: {
      es: "Galería, música ambiental e historia del evento para que la invitación emocione antes del gran día.",
      en: "Gallery, background music and your story so the invitation moves people before the big day.",
    },
  },
  {
    icon: Share2,
    title: { es: "Se comparte en segundos", en: "Shared in seconds" },
    text: {
      es: "Un solo enlace listo para WhatsApp, correo o redes: cualquier cambio de última hora se actualiza para todos al instante.",
      en: "One link ready for WhatsApp, email or social media — any last-minute change updates instantly for everyone.",
    },
  },
];

export default function BenefitsSection() {
  const { language, lx } = useLanguage();
  const isEs = language === "es";

  return (
    <section id="beneficios" className="py-24 bg-[#0F0F0F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            {isEs ? "Más que una tarjeta" : "More than a card"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "La experiencia digital de " : "The digital experience of "}
            <span className="italic font-light text-[#D4AF37]">
              {isEs ? "tu evento" : "your event"}
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            {isEs
              ? "Diseño, información, ubicación, confirmaciones y recuerdos: todo lo que tus invitados necesitan, reunido en un solo enlace."
              : "Design, information, location, confirmations and memories: everything your guests need, gathered in a single link."}
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BENEFITS.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-[#151515] border border-white/5 p-7 hover:border-[#D4AF37]/40 transition-colors"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-5">
                  <Icon className="w-5 h-5 text-[#D4AF37]" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-lg text-white font-normal mb-2">
                  {lx(benefit.title)}
                </h3>
                <p className="text-xs text-white/50 font-light leading-relaxed">
                  {lx(benefit.text)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
