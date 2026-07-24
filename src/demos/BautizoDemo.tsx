import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Church, MapPin, Calendar, Clock, Gift, 
  CheckCircle2, Volume2, VolumeX, ArrowLeft, Send, 
  Heart, ExternalLink, Copy, Check, Navigation, Globe, Sparkles, Utensils
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface BautizoDemoProps {
  onBackToHome: () => void;
}

export default function BautizoDemo({ onBackToHome }: BautizoDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: November 22, 2026 10:30:00 AST
  const targetDate = new Date("2026-11-22T10:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Wishes Wall state
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; text: string; date: string }>>([
    { id: "1", name: "Padrino Carlos", text: "Un privilegio ser tu guía spiritual mi niña amada. Que el Señor derrame infinitas bendiciones sobre tu vida.", date: "Hace 1 día" },
    { id: "2", name: "Familia Rivas Santos", text: "Acompañándolos con todo el corazón en este sagrado sacramento.", date: "Hace 2 días" }
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: "Almuerzo de Celebración",
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

        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);

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

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
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

    const whatsappUrl = createRsvpWhatsAppUrl("Bautizo Sofía María", rsvpData);
    setRsvpSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-[#2C3531] font-sans selection:bg-[#D4AF37]/30 relative">
      {/* Top Demo Bar */}
      <div className="bg-[#1C2621] text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md">
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
          href={createDemoWatermarkWhatsAppUrl("Bautizo Sofía María")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors rounded-full"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Subnav */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E8D3C5] sticky top-10 z-40 py-2.5 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#2C3531]">
          <button onClick={() => scrollToSection("ceremonia")} className="hover:text-[#B89635] transition-colors">
            {language === "es" ? "Ceremonia & Almuerzo" : "Ceremony & Reception"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("padrinos")} className="hover:text-[#B89635] transition-colors">
            {language === "es" ? "Padrinos" : "Godparents"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("muro")} className="hover:text-[#B89635] transition-colors">
            {language === "es" ? "Muro de Bendiciones" : "Blessings"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#1C2621] text-[#D4AF37] px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            RSVP
          </button>
        </div>
      </div>

      {/* Music Toggle Floating Widget */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={toggleMusic}
          className={`p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
            isPlayingMusic 
              ? "bg-[#D4AF37] text-black border-[#D4AF37] scale-105" 
              : "bg-white text-[#2C3531] border-[#E8D3C5] hover:bg-[#FDFCF7]"
          }`}
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{isPlayingMusic ? (language === "es" ? "Música Sacra" : "Sacred Music") : (language === "es" ? "Reproducir Melodía" : "Play Music")}</span>
        </button>
      </div>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 text-[#B89635] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-[#D4AF37]/30">
          <Church className="w-4 h-4" />
          {language === "es" ? "Santo Sacramento del Bautismo" : "Holy Sacrament of Baptism"}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C2621] mb-3 leading-tight">
          Sofía María
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] font-semibold text-[#B89635] mb-6">
          {language === "es" ? "22 de Noviembre de 2026 · Santo Domingo" : "November 22, 2026 · Santo Domingo"}
        </p>

        <p className="text-base sm:text-lg text-[#526059] font-light max-w-xl mx-auto mb-8 leading-relaxed italic">
          {language === "es" 
            ? "«Dejen que los niños vengan a mí, porque de ellos es el Reino de los Cielos.» Te invitamos a acompañarnos a recibir la luz divina."
            : "We invite you to join us as our daughter receives the holy blessing of Baptism."}
        </p>

        {/* Countdown */}
        <div className="bg-white rounded-3xl p-8 border border-[#E8D3C5] shadow-xl max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2 bg-[#FDFCF7] rounded-2xl">
              <span className="text-2xl font-bold text-[#1C2621] block">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#B89635]">{t("boda.days")}</span>
            </div>
            <div className="p-2 bg-[#FDFCF7] rounded-2xl">
              <span className="text-2xl font-bold text-[#1C2621] block">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#B89635]">{t("boda.hours")}</span>
            </div>
            <div className="p-2 bg-[#FDFCF7] rounded-2xl">
              <span className="text-2xl font-bold text-[#1C2621] block">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#B89635]">{t("boda.minutes")}</span>
            </div>
            <div className="p-2 bg-[#FDFCF7] rounded-2xl">
              <span className="text-2xl font-bold text-[#1C2621] block">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#B89635]">{t("boda.seconds")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* VENUE & GODPARENTS */}
      <section id="ceremonia" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#1C2621] text-[#D4AF37] flex items-center justify-center mb-4">
                <Church className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B89635] block mb-1">
                {language === "es" ? "Ceremonia Religiosa" : "Religious Ceremony"}
              </span>
              <h3 className="font-serif text-2xl text-[#1C2621] mb-2">Catedral Primada de América</h3>
              <p className="text-xs text-[#526059] mb-4">10:30 AM · Zona Colonial, Santo Domingo</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#1C2621] text-[#D4AF37] font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <Navigation className="w-4 h-4" /> {language === "es" ? "Ver en Mapa GPS" : "View Map GPS"}
            </a>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-md flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/20 text-[#B89635] flex items-center justify-center mb-4">
                <Utensils className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B89635] block mb-1">
                {language === "es" ? "Almuerzo de Celebración" : "Celebration Lunch"}
              </span>
              <h3 className="font-serif text-2xl text-[#1C2621] mb-2">Restaurante Pepperoni</h3>
              <p className="text-xs text-[#526059] mb-4">1:00 PM · Av. Sarasota #25, Santo Domingo</p>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 bg-[#D4AF37] text-black font-semibold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-[#F2D06B] transition-colors"
            >
              <Navigation className="w-4 h-4" /> {language === "es" ? "Ver Ubicación Almuerzo" : "View Reception Map"}
            </a>
          </div>
        </div>
      </section>

      {/* GODPARENTS SECTION */}
      <section id="padrinos" className="py-12 px-4 max-w-3xl mx-auto text-center">
        <div className="bg-white p-8 rounded-3xl border border-[#E8D3C5] shadow-sm">
          <h3 className="font-serif text-2xl text-[#1C2621] mb-4">{language === "es" ? "Padrinos de Bautismo" : "Godparents"}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm font-semibold text-[#1C2621]">
            <div className="p-4 bg-[#FDFCF7] rounded-2xl border border-[#E8D3C5]/50">
              <span className="block text-[10px] uppercase text-[#B89635] font-bold">{language === "es" ? "Padrino" : "Godfather"}</span>
              Carlos Manuel Rivas
            </div>
            <div className="p-4 bg-[#FDFCF7] rounded-2xl border border-[#E8D3C5]/50">
              <span className="block text-[10px] uppercase text-[#B89635] font-bold">{language === "es" ? "Madrina" : "Godmother"}</span>
              Isabella Santos Gómez
            </div>
          </div>
        </div>
      </section>

      {/* WISHES & RSVP */}
      <section id="rsvp" className="py-16 px-4 max-w-xl mx-auto pb-24">
        <div className="bg-white p-8 rounded-3xl border-2 border-[#1C2621] shadow-2xl text-center">
          <h3 className="font-serif text-3xl text-[#1C2621] mb-2">{language === "es" ? "Confirmación de Asistencia" : "Confirm RSVP"}</h3>
          <p className="text-xs text-[#526059] mb-6">{language === "es" ? "Agradecemos confirmar antes del 10 de Noviembre" : "Please confirm by November 10"}</p>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#1C2621] mb-1">{language === "es" ? "Nombre Completo *" : "Full Name *"}</label>
              <input
                type="text"
                value={rsvpData.fullName}
                onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                placeholder="Ej. Familia Almanzar Santos"
                required
                className="w-full px-4 py-3 bg-[#FDFCF7] border border-[#E8D3C5] rounded-xl text-xs focus:outline-none focus:border-[#1C2621]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C2621] mb-1">{language === "es" ? "Asistencia" : "Attendance"}</label>
              <select
                value={rsvpData.attendance}
                onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                className="w-full px-4 py-3 bg-[#FDFCF7] border border-[#E8D3C5] rounded-xl text-xs focus:outline-none focus:border-[#1C2621]"
              >
                <option value="Confirmado">{language === "es" ? "¡Confirmado! Asistiremos" : "Confirmed! We will attend"}</option>
                <option value="Declina">{language === "es" ? "No podremos asistir" : "Regretfully cannot attend"}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1C2621] text-[#D4AF37] font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <Send className="w-4 h-4" /> {language === "es" ? "Confirmar Asistencia por WhatsApp" : "Confirm via WhatsApp"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
