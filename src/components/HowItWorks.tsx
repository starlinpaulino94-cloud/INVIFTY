import { CheckCircle2, FileText, Send, Share2 } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Elige tu plan y estilo",
      description: "Selecciona el paquete que mejor se adapte a tu evento y cuéntanos tus preferencias de colores, música e imágenes.",
      icon: FileText,
      badge: "Paso 1"
    },
    {
      number: "02",
      title: "Envíanos los datos de tu evento",
      description: "A través de nuestro formulario rápido o directamente por WhatsApp, envíanos las fechas, lugar, fotos e itinerario.",
      icon: Send,
      badge: "Paso 2"
    },
    {
      number: "03",
      title: "Recibe tu invitación en 48 horas",
      description: "Te entregamos tu enlace personalizado listo para compartir al instante con todos tus invitados por WhatsApp.",
      icon: Share2,
      badge: "Paso 3"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-[#151515] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            Proceso Ágil & Exclusivo
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            ¿Cómo funciona <span className="italic font-light text-[#D4AF37]">Invifty</span>?
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-light italic">
            En solo 3 pasos tendrás una invitación web de categoría internacional lista para enviar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-12 right-12 h-[1px] bg-white/5 -translate-y-8 pointer-events-none"></div>

          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <div
                key={idx}
                className="bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/30 p-8 relative transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Step Header */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] border border-[#D4AF37]/30 px-3 py-1 bg-black/40">
                      {step.badge}
                    </span>
                    <span className="font-serif text-3xl font-light text-white/20 group-hover:text-[#D4AF37]/40 transition-colors">
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-none bg-[#151515] border border-white/10 flex items-center justify-center mb-6 group-hover:border-[#D4AF37] transition-colors">
                    <IconComponent className="w-5 h-5 text-[#D4AF37]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-xl font-normal text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light">
                    {step.description}
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
