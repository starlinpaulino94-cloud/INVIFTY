import { FileText, Send, CheckCheck, Share2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function HowItWorks() {
  const { language, lx } = useLanguage();
  const isEs = language === "es";

  const steps = [
    {
      number: "01",
      title: { es: "Elige tu plan y estilo", en: "Choose your plan and style" },
      description: {
        es: "Selecciona el paquete que mejor se adapte a tu evento y cuéntanos tus preferencias de colores, música e imágenes.",
        en: "Pick the package that best fits your event and tell us your preferences for colors, music and images."
      },
      icon: FileText,
      badge: { es: "Paso 1", en: "Step 1" }
    },
    {
      number: "02",
      title: { es: "Envíanos los datos de tu evento", en: "Send us your event details" },
      description: {
        es: "A través de nuestro formulario rápido o directamente por WhatsApp, envíanos las fechas, lugar, fotos e itinerario.",
        en: "Through our quick form or directly on WhatsApp, send us the dates, venue, photos and itinerary."
      },
      icon: Send,
      badge: { es: "Paso 2", en: "Step 2" }
    },
    {
      number: "03",
      title: { es: "Revisa y aprueba tu diseño", en: "Review and approve your design" },
      description: {
        es: "Recibes tu propuesta, agrupas tus comentarios en las rondas de revisión incluidas y aprobamos juntos la versión final.",
        en: "You receive your draft, group your feedback into the included revision rounds, and we approve the final version together."
      },
      icon: CheckCheck,
      badge: { es: "Paso 3", en: "Step 3" }
    },
    {
      number: "04",
      title: { es: "Recibe tu enlace y compártelo", en: "Get your link and share it" },
      description: {
        es: "Te entregamos tu enlace personalizado listo para compartir al instante con todos tus invitados por WhatsApp.",
        en: "We deliver your personalized link, ready to share instantly with all your guests on WhatsApp."
      },
      icon: Share2,
      badge: { es: "Paso 4", en: "Step 4" }
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-surface-raised border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
            {isEs ? "Proceso Ágil & Exclusivo" : "Fast & Exclusive Process"}
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            {isEs ? "¿Cómo funciona " : "How does "}
            <span className="italic font-light text-gold">Invifty</span>
            {isEs ? "?" : " work?"}
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            {isEs
              ? "En solo 4 pasos tendrás una invitación web de categoría internacional lista para enviar."
              : "In just 4 steps you'll have a world-class web invitation ready to send."}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-[1px] bg-white/5 -translate-y-8 pointer-events-none"></div>

          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="bg-surface-sunken border border-white/5 hover:border-gold/30 p-8 relative transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold border border-gold/30 px-3 py-1 bg-black/40">
                      {lx(step.badge)}
                    </span>
                    <span className="font-serif text-3xl font-light text-white/40 group-hover:text-gold/60 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-none bg-surface-raised border border-white/10 flex items-center justify-center mb-6 group-hover:border-gold transition-colors">
                    <IconComponent className="w-5 h-5 text-gold" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl font-normal text-white mb-3">
                    {lx(step.title)}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    {lx(step.description)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
