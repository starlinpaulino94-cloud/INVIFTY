import { CONFIG, buildWhatsAppUrl } from "../config";
import { Sparkles, Instagram, MessageCircle, Heart } from "lucide-react";
import luxuryLogo from "../assets/images/invifty_luxury_logo.webp";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const scrollTo = (id: string) => {
    if (window.location.pathname !== "/" && onNavigate) {
      onNavigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-[#EAEAEA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={luxuryLogo}
                alt="Invifty Logo"
                className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/50 shadow-md"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-light uppercase tracking-[0.3em] text-white">
                  INVIFTY
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] font-medium text-[#D4AF37] block mt-0.5">
                  ESTUDIO DIGITAL DE EVENTOS
                </span>
              </div>
            </div>

            <p className="text-xs text-white/40 leading-relaxed font-light italic max-w-sm pt-1">
              {CONFIG.slogan}. Diseñamos experiencias digitales de lujo para bodas, 15 años y eventos corporativos a nivel internacional.
            </p>

            <div className="pt-2 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest flex items-center gap-2">
              <span>📍 {CONFIG.location}</span>
            </div>
          </div>

          {/* Quick Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-xs font-normal text-white uppercase tracking-[0.2em] mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
              <li>
                <button onClick={() => scrollTo("hero")} className="hover:text-[#D4AF37] transition-colors">
                  Inicio
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("como-funciona")} className="hover:text-[#D4AF37] transition-colors">
                  ¿Cómo funciona?
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("portafolio")} className="hover:text-[#D4AF37] transition-colors">
                  Invitaciones Demo
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("planes")} className="hover:text-[#D4AF37] transition-colors">
                  Planes & Precios
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("faq")} className="hover:text-[#D4AF37] transition-colors">
                  Preguntas Frecuentes
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo("contacto")} className="hover:text-[#D4AF37] transition-colors">
                  Formulario de Solicitud
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Contact (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-normal text-white uppercase tracking-[0.2em] mb-4">
              Síguenos & Contacto
            </h4>

            <div className="flex flex-col gap-3">
              <a
                href={CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-white/70 hover:text-[#D4AF37] bg-[#151515] p-3 border border-white/10 transition-colors"
              >
                <Instagram className="w-4 h-4 text-[#D4AF37]" />
                <span>{CONFIG.instagramUser}</span>
              </a>

              <a
                href={buildWhatsAppUrl("Hola Invifty, quiero comunicarme con ustedes.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-white/70 hover:text-[#D4AF37] bg-[#151515] p-3 border border-white/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>WhatsApp Oficial</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/30 font-light">
          <p>© {new Date().getFullYear()} {CONFIG.brandName} · Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 text-white/40">
            <span>Un producto de</span>
            <a
              href={CONFIG.parentCompanyUrl}
              className="text-[#D4AF37] hover:underline font-semibold"
            >
              {CONFIG.parentCompany}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
