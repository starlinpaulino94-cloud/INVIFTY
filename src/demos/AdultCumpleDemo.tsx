import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, Music, MapPin, Calendar, Clock, Gift, 
  CheckCircle2, Volume2, VolumeX, ArrowLeft, Send, 
  MessageSquare, Heart, ExternalLink, Copy, Check,
  Camera, X, Navigation, Globe, Award, GlassWater
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface AdultCumpleDemoProps {
  onBackToHome: () => void;
}

export default function AdultCumpleDemo({ onBackToHome }: AdultCumpleDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: December 5, 2026 20:00:00 AST
  const targetDate = new Date("2026-12-05T20:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // Wishes Wall state
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; text: string; date: string }>>([
    { id: "1", name: "Ing. Alejandro Sterling", text: "¡Felices 50 años estimado Roberto! Un brindis por décadas de amistad, éxitos y grandes vivencias.", date: "Hace 4 horas" },
    { id: "2", name: "Familia Vicini", text: "Listos para celebrar en la Marina este hito inolvidable.", date: "Ayer" }
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: "Cena de Gala & Cócteles Premium",
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

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
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

  const handleAddWish = (e: FormEvent) => {
    e.preventDefault();
    if (!newWishName.trim() || !newWishText.trim()) return;

    setWishes([
      {
        id: Date.now().toString(),
        name: newWishName.trim(),
        text: newWishText.trim(),
        date: "Justo ahora"
      },
      ...wishes
    ]);

    setNewWishName("");
    setNewWishText("");
    setWishPublished(true);
    setTimeout(() => setWishPublished(false), 4000);
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    const whatsappUrl = createRsvpWhatsAppUrl("50 Años Roberto Almanzar", rsvpData);
    setRsvpSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-[#E0E1DD] font-sans selection:bg-[#D4AF37]/30 relative">
      {/* Top Demo Bar */}
      <div className="bg-[#1C2541] text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] transition-colors"
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
          href={createDemoWatermarkWhatsAppUrl("50 Años Roberto")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors rounded-full"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Subnav */}
      <div className="bg-[#0B132B]/90 backdrop-blur-md border-b border-[#D4AF37]/30 sticky top-10 z-40 py-2.5 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#E0E1DD]">
          <button onClick={() => scrollToSection("evento")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Celebración" : "Celebration"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("lugar")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Ubicación" : "Location"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("muro")} className="hover:text-[#D4AF37] transition-colors">
            {language === "es" ? "Muro de Brindis" : "Toast Wall"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#D4AF37] text-black px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            RSVP
          </button>
        </div>
      </div>

      {/* HERO SECTION */}
      <section id="evento" className="pt-16 pb-20 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-[#D4AF37]/40">
          <Award className="w-4 h-4" />
          50 Años de Elegancia & Historia
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light text-white mb-3 leading-tight">
          Roberto Almánzar
        </h1>
        <p className="text-xs uppercase tracking-[0.4em] font-semibold text-[#D4AF37] mb-6">
          {language === "es" ? "Sábado, 5 de Diciembre de 2026 · 8:00 PM" : "Saturday, December 5, 2026 · 8:00 PM"}
        </p>

        <p className="text-base sm:text-lg text-gray-300 font-light max-w-xl mx-auto mb-8 leading-relaxed italic">
          {language === "es" 
            ? "«Medio siglo celebrando la vida, la familia y la verdadera amistad.» Acompáñanos a un brindis exclusivo en la Marina."
            : "Half a century celebrating life, family, and true friendship. Join us for an exclusive celebration at the Marina."}
        </p>

        {/* Countdown */}
        <div className="bg-[#1C2541] rounded-3xl p-8 border border-[#D4AF37]/30 shadow-2xl max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#0B132B] rounded-2xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t("boda.days")}</span>
            </div>
            <div className="p-2 bg-[#0B132B] rounded-2xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t("boda.hours")}</span>
            </div>
            <div className="p-2 bg-[#0B132B] rounded-2xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t("boda.minutes")}</span>
            </div>
            <div className="p-2 bg-[#0B132B] rounded-2xl border border-white/5">
              <span className="text-2xl font-bold text-[#D4AF37] block">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400">{t("boda.seconds")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & DRESS CODE */}
      <section id="lugar" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-[#1C2541] rounded-3xl p-8 sm:p-10 border border-[#D4AF37]/30 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-xs uppercase tracking-widest mb-2">
              <MapPin className="w-4 h-4" /> Marina Casa de Campo
            </div>
            <h3 className="font-serif text-2xl text-white mb-2">Plaza Portofino — Lounge Privado</h3>
            <p className="text-xs text-gray-300 mb-6">La Romana, República Dominicana.</p>

            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 bg-[#D4AF37] text-black text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-2 hover:bg-[#F2D06B] transition-colors"
            >
              <Navigation className="w-4 h-4" /> Google Maps GPS
            </a>
          </div>

          <div className="bg-[#0B132B] p-6 rounded-2xl border border-white/10 space-y-4 text-xs text-gray-300">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">{language === "es" ? "Código de Vestimenta" : "Dress Code"}</strong>
                {language === "es" ? "Cocktail Elegante / Guayabera de Lino" : "Cocktail Attire / Formal Linen Guayabera"}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GlassWater className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white font-semibold mb-0.5">{language === "es" ? "Barra Abierta & Cigar Lounge" : "Open Bar & Cigar Lounge"}</strong>
                {language === "es" ? "Cena bailable con maridaje de puros y ron añejo dominicano." : "Dinner and dancing with premium rum pairing and cigars."}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="py-16 px-4 max-w-xl mx-auto pb-24">
        <div className="bg-[#1C2541] p-8 rounded-3xl border-2 border-[#D4AF37] shadow-2xl text-center">
          <h3 className="font-serif text-3xl text-white mb-2">{language === "es" ? "Confirmar Asistencia" : "Confirm Attendance"}</h3>
          <p className="text-xs text-gray-300 mb-6">{language === "es" ? "Por favor confirma antes del 20 de Noviembre" : "Please confirm by November 20"}</p>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">{language === "es" ? "Nombre Completo *" : "Full Name *"}</label>
              <input
                type="text"
                value={rsvpData.fullName}
                onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                placeholder="Ej. Roberto & Isabel"
                required
                className="w-full px-4 py-3 bg-[#0B132B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-200 mb-1">{language === "es" ? "Asistencia" : "Attendance"}</label>
              <select
                value={rsvpData.attendance}
                onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                className="w-full px-4 py-3 bg-[#0B132B] border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Confirmado">{language === "es" ? "¡Ahí estaré para brindar!" : "I will be there to toast!"}</option>
                <option value="Declina">{language === "es" ? "No podré asistir" : "Regretfully cannot attend"}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F2D06B] transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <Send className="w-4 h-4" /> {language === "es" ? "Enviar Confirmación por WhatsApp" : "Send Confirmation via WhatsApp"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
