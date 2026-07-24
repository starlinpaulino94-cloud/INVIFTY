import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, Music, MapPin, Calendar, Clock, Gift, 
  CheckCircle2, Volume2, VolumeX, ArrowLeft, Send, 
  Heart, ExternalLink, Copy, Check, Navigation, Globe, Wine
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface BridalShowerDemoProps {
  onBackToHome: () => void;
}

export default function BridalShowerDemo({ onBackToHome }: BridalShowerDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: October 24, 2026 17:00:00 AST
  const targetDate = new Date("2026-10-24T17:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: "Champagne & Tapas Gourmet",
    dietaryNotes: "",
    songRequest: ""
  });
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

  const toggleMusic = () => {
    if (isPlayingMusic) {
      if (audioCtx) {
        audioCtx.close();
        setAudioCtx(null);
      }
      setIsPlayingMusic(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.02, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        setAudioCtx(ctx);
        setIsPlayingMusic(true);
      } catch (err) {
        console.error("Audio error", err);
      }
    }
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const whatsappUrl = createRsvpWhatsAppUrl("Bridal Shower Isabella", rsvpData);
    setRsvpSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#262626] font-sans selection:bg-[#E5D4C0]/30 relative">
      {/* Top Demo Bar */}
      <div className="bg-[#1A1A1A] text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-white/10 border border-white/20 rounded-full p-1 text-[10px] font-semibold">
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
          href={createDemoWatermarkWhatsAppUrl("Bridal Shower Isabella")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors rounded-full"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Subnav */}
      <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-10 z-40 py-2.5 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#262626]">
          <button onClick={() => scrollToSection("fiesta")} className="hover:text-[#C5A059] transition-colors">
            {language === "es" ? "Fiesta Blanca" : "White Party"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("lugar")} className="hover:text-[#C5A059] transition-colors">
            {language === "es" ? "Ubicación" : "Location"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#1A1A1A] text-[#D4AF37] px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            RSVP
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="fiesta" className="pt-16 pb-20 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#F2E8DC] text-[#9E783B] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-[#E5D4C0]">
          <Wine className="w-4 h-4" />
          {language === "es" ? "Fiesta Blanca · Bridal Shower" : "White Party · Bridal Shower"}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1A1A1A] mb-3 leading-tight">
          Isabella
        </h1>
        <p className="text-xs uppercase tracking-[0.4em] font-semibold text-[#9E783B] mb-6">
          {language === "es" ? "Sábado, 24 de Octubre de 2026 · 5:00 PM" : "Saturday, October 24, 2026 · 5:00 PM"}
        </p>

        <p className="text-base sm:text-lg text-gray-600 font-light max-w-xl mx-auto mb-8 leading-relaxed italic">
          {language === "es" 
            ? "«Un brindar de copas y alegría antes del gran sí.» Acompáñame a celebrar una tarde inolvidable entre amigas."
            : "Join us for a afternoon of champagne, laughter, and celebration before the wedding day."}
        </p>

        {/* Countdown */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#FAFAFA] rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold text-[#1A1A1A] block">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#9E783B]">{t("boda.days")}</span>
            </div>
            <div className="p-2 bg-[#FAFAFA] rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold text-[#1A1A1A] block">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#9E783B]">{t("boda.hours")}</span>
            </div>
            <div className="p-2 bg-[#FAFAFA] rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold text-[#1A1A1A] block">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#9E783B]">{t("boda.minutes")}</span>
            </div>
            <div className="p-2 bg-[#FAFAFA] rounded-2xl border border-gray-100">
              <span className="text-2xl font-bold text-[#1A1A1A] block">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#9E783B]">{t("boda.seconds")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & DRESS CODE */}
      <section id="lugar" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-[#9E783B] font-semibold text-xs uppercase tracking-widest mb-2">
              <MapPin className="w-4 h-4" /> Punta Cana Resort & Club
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-2">Playa & Pool Lounge</h3>
            <p className="text-xs text-gray-500 mb-6">Punta Cana.</p>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 hover:bg-black transition-colors"
            >
              <Navigation className="w-4 h-4" /> {language === "es" ? "Ver Ubicación GPS" : "View Location Map"}
            </a>
          </div>

          <div className="bg-[#FAFAFA] p-6 rounded-2xl border border-gray-200 space-y-4 text-xs text-gray-700">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#9E783B] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A] font-semibold mb-0.5">{language === "es" ? "Código de Vestimenta" : "Dress Code"}</strong>
                {language === "es" ? "Total White / Vestido Blanco Chic" : "Total White / Chic White Dress"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-16 px-4 max-w-xl mx-auto pb-24">
        <div className="bg-white p-8 rounded-3xl border-2 border-[#1A1A1A] shadow-2xl text-center">
          <h3 className="font-serif text-3xl text-[#1A1A1A] mb-2">{language === "es" ? "Confirmar Asistencia" : "Confirm Attendance"}</h3>
          <p className="text-xs text-gray-500 mb-6">{language === "es" ? "Favor confirmar antes del 10 de Octubre" : "Please confirm by October 10"}</p>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#1A1A1A] mb-1">{language === "es" ? "Nombre Completo *" : "Full Name *"}</label>
              <input
                type="text"
                value={rsvpData.fullName}
                onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                placeholder="Ej. Sofía & Laura"
                required
                className="w-full px-4 py-3 bg-[#FAFAFA] border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1A1A1A] text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <Send className="w-4 h-4" /> {language === "es" ? "Confirmar por WhatsApp" : "Confirm via WhatsApp"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
