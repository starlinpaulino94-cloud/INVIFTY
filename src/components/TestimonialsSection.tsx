import { TESTIMONIALS } from "../data/testimonialsData";
import { Quote, MapPin } from "lucide-react";

// Golden initials medallion instead of stock photos of real people
function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .replace(/^(Dra?\.|Lic\.|Ing\.|Sr\.|Sra\.)\s+/i, "")
    .split(/\s+|&/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  return (
    <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
      <span className="font-serif text-sm text-[#D4AF37] tracking-wider">{initials}</span>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-[#0F0F0F] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
            La Experiencia Invifty
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-4">
            Historias que <span className="italic font-light text-[#D4AF37]">marcaron la diferencia</span>
          </h2>
          <p className="text-white/50 text-sm font-light italic">
            Así se vive una celebración con una invitación digital Invifty.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="bg-[#0A0A0A] border border-white/5 hover:border-[#D4AF37]/30 p-8 flex flex-col justify-between transition-all duration-300 relative group"
            >
              <Quote className="w-8 h-8 text-[#D4AF37]/20 absolute top-6 right-6" />

              <div>
                {/* Honest editorial tag: illustrative until real testimonials replace them */}
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#D4AF37] block mb-4">
                  {item.isProvisionalNotice ? "◆ Historia Ilustrativa" : "◆ Cliente Invifty"}
                </span>

                {/* Comment */}
                <p className="text-xs text-white/70 italic font-light leading-relaxed mb-6 font-serif">
                  "{item.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <InitialsAvatar name={item.name} />
                <div>
                  <h4 className="font-serif text-sm font-normal text-white">{item.name}</h4>
                  <p className="text-[10px] text-[#D4AF37] flex items-center gap-1 uppercase tracking-wider font-medium">
                    <MapPin className="w-3 h-3" />
                    {item.eventType} · {item.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency note while testimonials are illustrative */}
        {TESTIMONIALS.some((item) => item.isProvisionalNotice) && (
          <p className="text-center text-[10px] text-white/30 italic font-light mt-10 max-w-xl mx-auto">
            * Las historias ilustrativas representan la experiencia típica de uso de nuestras
            invitaciones. Pronto compartiremos aquí las opiniones de nuestros primeros clientes.
          </p>
        )}

      </div>
    </section>
  );
}
