import { CONFIG, buildWhatsAppUrl } from "../config";
import { Instagram, MessageCircle } from "lucide-react";
import LogoInvifty from "./LogoInvifty";
import { useLanguage } from "../context/LanguageContext";

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

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

  const goTo = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  const navLinks: { labelEs: string; labelEn: string; target: string }[] = [
    { labelEs: "Inicio", labelEn: "Home", target: "hero" },
    { labelEs: "¿Cómo funciona?", labelEn: "How it works", target: "como-funciona" },
    { labelEs: "Invitaciones Demo", labelEn: "Demo Invitations", target: "portafolio" },
    { labelEs: "Planes & Precios", labelEn: "Plans & Pricing", target: "planes" },
    { labelEs: "Preguntas Frecuentes", labelEn: "FAQ", target: "faq" },
    { labelEs: "Formulario de Solicitud", labelEn: "Request Form", target: "contacto" },
  ];

  return (
    <footer className="bg-[#050505] border-t border-white/10 text-[#EAEAEA] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <LogoInvifty
                idSufijo="pie"
                className="w-10 h-auto drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)]"
              />
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-light uppercase tracking-[0.3em] text-white">
                  INVIFTY
                </span>
                <span className="text-[8px] uppercase tracking-[0.35em] font-medium text-[#D4AF37] block mt-0.5">
                  {isEs ? "ESTUDIO DIGITAL DE EVENTOS" : "DIGITAL EVENT STUDIO"}
                </span>
              </div>
            </div>

            <p className="text-xs text-white/40 leading-relaxed font-light italic max-w-sm pt-1">
              {isEs
                ? `${CONFIG.slogan}. Diseñamos experiencias digitales de lujo para bodas, 15 años y eventos corporativos a nivel internacional.`
                : "Digital invitations that captivate from the very first message. We design luxury digital experiences for weddings, quinceañeras and corporate events worldwide."}
            </p>

            <div className="pt-2 text-[10px] text-[#D4AF37] font-semibold uppercase tracking-widest flex items-center gap-2">
              <span>📍 {isEs ? CONFIG.location : "Available for events worldwide"}</span>
            </div>
          </div>

          {/* Quick Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif text-xs font-normal text-white uppercase tracking-[0.2em] mb-4">
              {isEs ? "Navegación" : "Navigation"}
            </h4>
            <ul className="space-y-2.5 text-[10px] uppercase tracking-[0.2em] text-white/50 font-medium">
              {navLinks.map((link) => (
                <li key={link.target}>
                  <button onClick={() => scrollTo(link.target)} className="hover:text-[#D4AF37] transition-colors">
                    {isEs ? link.labelEs : link.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-xs font-normal text-white uppercase tracking-[0.2em] mb-4">
              {isEs ? "Síguenos & Contacto" : "Follow Us & Contact"}
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
                href={buildWhatsAppUrl(isEs ? "Hola Invifty, quiero comunicarme con ustedes." : "Hello Invifty, I would like to get in touch.")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-[10px] uppercase tracking-widest text-white/70 hover:text-[#D4AF37] bg-[#151515] p-3 border border-white/10 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                <span>{isEs ? "WhatsApp Oficial" : "Official WhatsApp"}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-white/30 font-light">
          <p>© {new Date().getFullYear()} {CONFIG.brandName} · {isEs ? "Todos los derechos reservados." : "All rights reserved."}</p>

          <div className="flex items-center gap-4">
            <button onClick={() => goTo("/privacidad")} className="hover:text-[#D4AF37] transition-colors underline-offset-2">
              {isEs ? "Privacidad" : "Privacy"}
            </button>
            <button onClick={() => goTo("/terminos")} className="hover:text-[#D4AF37] transition-colors underline-offset-2">
              {isEs ? "Términos" : "Terms"}
            </button>
            <div className="flex items-center gap-1.5 text-white/40">
              <span>{isEs ? "Un producto de" : "A product of"}</span>
              <span className="text-[#D4AF37] font-semibold">{CONFIG.parentCompany}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
