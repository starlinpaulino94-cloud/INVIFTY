import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, MapPin, Calendar, Clock, Award, CheckCircle2, 
  ArrowLeft, Send, Building, Users, ExternalLink, QrCode, 
  Car, Navigation, X, ShieldCheck, Globe
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface GrandOpeningDemoProps {
  onBackToHome: () => void;
}

export default function GrandOpeningDemo({ onBackToHome }: GrandOpeningDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: December 1, 2026 19:00:00 AST
  const targetDate = new Date("2026-12-01T19:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQrModal, setShowQrModal] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: "Coctel VIP de Bienvenida",
    dietaryNotes: "",
    songRequest: ""
  });
  const [companyName, setCompanyName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const fullData: RsvpFormData = {
      ...rsvpData,
      dietaryNotes: `Empresa: ${companyName || 'N/A'} | Cargo: ${positionTitle || 'N/A'}`
    };

    const whatsappUrl = createRsvpWhatsAppUrl("Grand Opening Boutique L'Elite", fullData);
    setRsvpSubmitted(true);
    setShowQrModal(true);
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#EAEAEA] font-sans selection:bg-[#D4AF37]/30 relative">
      {/* Top Fixed Demo Bar */}
      <div className="bg-[#181818] text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md border-b border-white/10">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-white/10 border border-[#D4AF37]/40 rounded-full p-1 text-[10px] font-semibold">
          <Globe className="w-3.5 h-3.5 text-[#D4AF37] ml-1 mr-0.5" />
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "es" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            ES
          </button>
          <span className="text-gray-500 text-[9px]">|</span>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "en" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("Grand Opening Boutique L'Elite")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Subnav */}
      <div className="bg-[#121212]/90 backdrop-blur-md border-b border-white/10 sticky top-10 z-40 py-2 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap">
          <button onClick={() => scrollToSection("inicio")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Inauguración" : "Grand Opening"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("agenda")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Programa VIP" : "VIP Agenda"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("ubicacion")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Lugar & Valet" : "Venue & Valet"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("acreditacion")} className="bg-[#D4AF37] text-black px-3.5 py-1 rounded-full text-[10px] font-bold">
            {language === "es" ? "Acreditación VIP" : "VIP Accreditation"}
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="inicio" className="pt-20 pb-20 px-4 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 text-[#D4AF37] px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.3em] font-semibold mb-6 border border-[#D4AF37]/30">
          <Sparkles className="w-4 h-4" />
          {language === "es" ? "Inauguración Oficial VIP" : "Official VIP Launch"}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-white mb-2 leading-tight">
          Boutique L'Élite
        </h1>
        <p className="text-sm font-light text-[#D4AF37] uppercase tracking-[0.3em] mb-8">
          Grand Opening & Fashion Showcase 2026
        </p>

        {/* Countdown */}
        <div className="bg-[#181818] rounded-2xl p-6 border border-white/10 shadow-2xl max-w-md mx-auto mb-10">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.days}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.days")}</span>
            </div>
            <div className="p-2 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.hours")}</span>
            </div>
            <div className="p-2 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.minutes")}</span>
            </div>
            <div className="p-2 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase text-gray-400">{t("boda.seconds")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section id="agenda" className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-[#181818] p-8 rounded-2xl border border-white/10 shadow-lg">
          <h3 className="font-serif text-2xl text-white mb-6 text-center">{language === "es" ? "Programa de la Noche" : "Evening Program"}</h3>
          <div className="space-y-4 text-xs">
            <div className="flex gap-4 p-3 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-[#D4AF37] font-mono font-bold">7:00 PM</span>
              <span>{language === "es" ? "Recepción Red Carpet & Coctel de Bienvenida" : "Red Carpet & Welcome Cocktails"}</span>
            </div>
            <div className="flex gap-4 p-3 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-[#D4AF37] font-mono font-bold">7:45 PM</span>
              <span>{language === "es" ? "Corte de Cinta & Palabras de Inauguración" : "Ribbon Cutting & Inaugural Speech"}</span>
            </div>
            <div className="flex gap-4 p-3 bg-[#0F0F0F] rounded-xl border border-white/5">
              <span className="text-[#D4AF37] font-mono font-bold">8:15 PM</span>
              <span>{language === "es" ? "Exclusive Fashion Runway Show" : "Exclusive Fashion Runway Show"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP / ACREDITACION */}
      <section id="acreditacion" className="py-16 px-4 max-w-xl mx-auto pb-24">
        <div className="bg-[#181818] p-8 rounded-2xl border border-[#D4AF37] shadow-2xl">
          <h3 className="font-serif text-2xl text-white mb-2 text-center">{language === "es" ? "Acreditación VIP de Acceso" : "VIP Access Accreditation"}</h3>
          <p className="text-xs text-gray-400 text-center mb-6">{language === "es" ? "Confirme su asistencia para generar su Pase QR de entrada." : "Confirm your attendance to generate your entry QR code pass."}</p>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">{language === "es" ? "Nombre Completo *" : "Full Name *"}</label>
              <input
                type="text"
                value={rsvpData.fullName}
                onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                placeholder="Ej. Sra. Patricia de la Cruz"
                required
                className="w-full px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">{language === "es" ? "Empresa o Medio" : "Company / Press"}</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ej. Revista Estilos"
                className="w-full px-4 py-3 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F2D06B] transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <QrCode className="w-4 h-4" /> {language === "es" ? "Generar Pase QR por WhatsApp" : "Generate Pass via WhatsApp"}
            </button>
          </form>
        </div>
      </section>

      {/* QR MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#181818] border border-[#D4AF37] p-8 rounded-2xl max-w-sm w-full text-center relative">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <QrCode className="w-24 h-24 text-[#D4AF37] mx-auto mb-4" />
            <h4 className="font-serif text-xl text-white mb-1">Pase VIP Generado</h4>
            <p className="text-xs text-gray-400 mb-4">Presente esta pantalla o el mensaje de WhatsApp en la recepción.</p>
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 bg-[#D4AF37] text-black text-xs font-bold uppercase rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
