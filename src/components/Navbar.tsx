import { useState, useEffect } from "react";
import { CONFIG, buildWhatsAppUrl } from "../config";
import { Menu, X, MessageCircle, Globe } from "lucide-react";
import LogoInvifty from "./LogoInvifty";
import { useLanguage } from "../context/LanguageContext";

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export default function Navbar({ currentPath = "/", onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const isEs = language === "es";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (targetId: string) => {
    setMobileMenuOpen(false);
    
    // If we are on a sample page, navigate back to home first then scroll
    if (currentPath !== "/" && onNavigate) {
      onNavigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: t("nav.home"), target: "hero" },
    { name: t("nav.howItWorks"), target: "como-funciona" },
    { name: t("nav.portfolio"), target: "portafolio" },
    { name: t("nav.pricing"), target: "planes" },
    { name: t("nav.faq"), target: "faq" },
    { name: t("nav.contact"), target: "contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            if (onNavigate) onNavigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="flex items-center gap-3.5 group text-left"
        >
          <LogoInvifty
            idSufijo="nav"
            className="w-10 h-auto drop-shadow-[0_2px_6px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform duration-300"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-serif tracking-[0.3em] font-light uppercase text-white group-hover:text-[#D4AF37] transition-colors leading-none">
              INVIFTY
            </span>
            <span className="text-[8px] uppercase tracking-[0.35em] font-medium text-[#D4AF37] block mt-1">
              {t("nav.tagline")}
            </span>
          </div>
        </button>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em] font-medium text-white/60">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => handleNavClick(link.target)}
              className="hover:text-[#D4AF37] transition-colors relative group py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full"></span>
            </button>
          ))}
        </nav>

        {/* Actions & Language Selector */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Switcher Pill */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/15 rounded-full p-1 text-[10px] font-semibold tracking-wider backdrop-blur-sm">
            <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1 mr-0.5" />
            <button
              onClick={() => setLanguage("es")}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 ${
                language === "es"
                  ? "bg-[#D4AF37] text-black font-bold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="Español"
            >
              ES
            </button>
            <span className="text-white/20 text-[9px]">|</span>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 rounded-full transition-all duration-300 ${
                language === "en"
                  ? "bg-[#D4AF37] text-black font-bold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <a
            href={buildWhatsAppUrl(isEs ? "Hola Invifty, quisiera solicitar información para una invitación digital." : "Hello Invifty, I would like information about a digital invitation.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-[#D4AF37]/60 text-[#D4AF37] text-[10px] uppercase tracking-[0.2em] font-semibold hover:bg-[#D4AF37] hover:text-black transition-all duration-300 flex items-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            {t("nav.requestInvite")}
          </a>
        </div>

        {/* Mobile Hamburger & Small Language Switcher */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="sm:hidden flex items-center gap-0.5 bg-white/5 border border-white/15 rounded-full p-1 text-[9px] font-semibold">
            <button
              onClick={() => setLanguage("es")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === "es" ? "bg-[#D4AF37] text-black font-bold" : "text-white/70"
              }`}
            >
              ES
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2 py-0.5 rounded-full transition-all ${
                language === "en" ? "bg-[#D4AF37] text-black font-bold" : "text-white/70"
              }`}
            >
              EN
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white/80 p-2 rounded hover:bg-white/5 transition-colors"
            aria-label={mobileMenuOpen ? (isEs ? "Cerrar menú" : "Close menu") : (isEs ? "Abrir menú" : "Open menu")}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-[#D4AF37]" /> : <Menu className="w-6 h-6 text-[#D4AF37]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#151515] border-b border-white/10 px-6 pt-5 pb-8 mt-3 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-4">
            {/* Language Selection Bar in Mobile Menu */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2 text-white/70 font-medium uppercase tracking-wider text-[11px]">
                <Globe className="w-4 h-4 text-[#D4AF37]" />
                <span>{t("lang.selectLanguage")}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/5 border border-white/15 rounded-full p-1 text-xs">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-3 py-1 rounded-full transition-all font-semibold ${
                    language === "es"
                      ? "bg-[#D4AF37] text-black shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  ES (Español)
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1 rounded-full transition-all font-semibold ${
                    language === "en"
                      ? "bg-[#D4AF37] text-black shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  EN (English)
                </button>
              </div>
            </div>

            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavClick(link.target)}
                className="text-left text-xs uppercase tracking-[0.2em] text-white/80 hover:text-[#D4AF37] py-2 border-b border-white/5 font-medium"
              >
                {link.name}
              </button>
            ))}
            <a
              href={buildWhatsAppUrl(isEs ? "Hola Invifty, me gustaría solicitar una invitación digital." : "Hello Invifty, I would like to request a digital invitation.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest py-3 px-4 mt-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t("nav.requestInvite")}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

