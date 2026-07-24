import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, Music, MapPin, Calendar, Clock, Gift, 
  CheckCircle2, Volume2, VolumeX, ArrowLeft, Send, 
  MessageSquare, Heart, ExternalLink, Copy, Check,
  Camera, X, Navigation, Globe, Baby
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface BabyShowerDemoProps {
  onBackToHome: () => void;
}

export default function BabyShowerDemo({ onBackToHome }: BabyShowerDemoProps) {
  const { language, setLanguage, t } = useLanguage();

  // Target date: October 10, 2026 16:00:00 AST
  const targetDate = new Date("2026-10-10T16:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Wishes Wall state
  const [wishes, setWishes] = useState<Array<{ id: string; name: string; text: string; date: string }>>([
    { id: "1", name: "Abuela Beatriz", text: "Esperando con los brazos abiertos a nuestro amado Mateo. ¡Dios te bendiga siempre!", date: "Hace 1 hora" },
    { id: "2", name: "Tía Laura & Tío Daniel", text: "¡Súper emocionado por la llegada del nuevo integrante! Ya tenemos listos los regalos.", date: "Hace 3 horas" }
  ]);
  const [newWishName, setNewWishName] = useState("");
  const [newWishText, setNewWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  // RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: "Merienda & Dulces",
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
        osc.frequency.setValueAtTime(329.63, ctx.currentTime); // E4 lullaby tone
        gain.gain.setValueAtTime(0.04, ctx.currentTime);

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

    const whatsappUrl = createRsvpWhatsAppUrl("Baby Shower Mateo", rsvpData);
    setRsvpSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#4A3E3D] font-sans selection:bg-[#E8C5B0]/30 relative">
      {/* Top Fixed Demo Bar */}
      <div className="bg-[#3D302F] text-white py-2 px-4 flex items-center justify-between text-xs font-medium sticky top-0 z-50 shadow-md">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#E8C5B0] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("boda.back")}
        </button>

        {/* Language selector */}
        <div className="flex items-center gap-1 bg-white/10 border border-[#E8C5B0]/40 rounded-full p-1 text-[10px] font-semibold">
          <Globe className="w-3.5 h-3.5 text-[#E8C5B0] ml-1 mr-0.5" />
          <button
            onClick={() => setLanguage("es")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "es" ? "bg-[#E8C5B0] text-[#3D302F] font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            ES
          </button>
          <span className="text-gray-500 text-[9px]">|</span>
          <button
            onClick={() => setLanguage("en")}
            className={`px-2 py-0.5 rounded-full transition-all ${
              language === "en" ? "bg-[#E8C5B0] text-[#3D302F] font-bold" : "text-gray-300 hover:text-white"
            }`}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("Baby Shower Mateo")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex bg-[#E8C5B0] text-[#3D302F] font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 hover:bg-[#F2D06B] transition-colors rounded-full"
        >
          {t("boda.watermark")}
        </a>
      </div>

      {/* Subnav */}
      <div className="bg-white/90 backdrop-blur-md border-b border-[#E8C5B0] sticky top-10 z-40 py-2.5 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#5C4D4A]">
          <button onClick={() => scrollToSection("llegada")} className="hover:text-[#C88A72] transition-colors">
            {language === "es" ? "Bienvenida" : "Welcome"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("detalles")} className="hover:text-[#C88A72] transition-colors">
            {language === "es" ? "Detalles" : "Details"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("regalos")} className="hover:text-[#C88A72] transition-colors">
            {language === "es" ? "Mesa de Regalos" : "Wishlist"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("muro")} className="hover:text-[#C88A72] transition-colors">
            {language === "es" ? "Muro de Amor" : "Wishes"}
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("rsvp")} className="bg-[#C88A72] text-white px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
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
              ? "bg-[#C88A72] text-white border-[#C88A72] scale-105 animate-pulse" 
              : "bg-white text-[#5C4D4A] border-[#E8C5B0] hover:bg-[#FAF6F0]"
          }`}
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden md:inline">{isPlayingMusic ? (language === "es" ? "Música Suave" : "Soft Music") : (language === "es" ? "Reproducir Nana" : "Play Music")}</span>
        </button>
      </div>

      {/* HERO SECTION */}
      <section id="llegada" className="pt-16 pb-20 px-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-[#E8C5B0]/30 text-[#8C5A48] px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-6 border border-[#E8C5B0]/50">
          <Baby className="w-4 h-4" />
          {language === "es" ? "Baby Shower Especial" : "Special Baby Shower"}
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#3D302F] mb-4 leading-tight">
          {language === "es" ? "Bienvenido, Mateo" : "Welcome, Baby Mateo"}
        </h1>

        <p className="text-base sm:text-lg text-[#6E5A56] font-light max-w-xl mx-auto mb-8 leading-relaxed">
          {language === "es" 
            ? "Un pequeño gran milagro está en camino. Queremos celebrar la dulzura de su llegada junto a nuestros seres más queridos."
            : "A sweet little miracle is on his way! We invite you to celebrate Mateo's upcoming arrival with us."}
        </p>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E8C5B0] shadow-xl max-w-lg mx-auto">
          <div className="text-sm font-semibold uppercase tracking-widest text-[#8C5A48] mb-2">
            {language === "es" ? "Sábado, 10 de Octubre de 2026" : "Saturday, October 10, 2026"}
          </div>
          <div className="text-2xl font-serif text-[#3D302F] mb-6">4:00 PM — Terraza Privada, Casa de Campo</div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-2 pt-6 border-t border-[#E8C5B0]/50 text-center">
            <div className="p-2 bg-[#FAF6F0] rounded-2xl">
              <span className="text-2xl font-bold text-[#3D302F] block">{timeLeft.days}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C5A48]">{t("boda.days")}</span>
            </div>
            <div className="p-2 bg-[#FAF6F0] rounded-2xl">
              <span className="text-2xl font-bold text-[#3D302F] block">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C5A48]">{t("boda.hours")}</span>
            </div>
            <div className="p-2 bg-[#FAF6F0] rounded-2xl">
              <span className="text-2xl font-bold text-[#3D302F] block">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C5A48]">{t("boda.minutes")}</span>
            </div>
            <div className="p-2 bg-[#FAF6F0] rounded-2xl">
              <span className="text-2xl font-bold text-[#3D302F] block">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase tracking-wider text-[#8C5A48]">{t("boda.seconds")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION & DETAILS */}
      <section id="detalles" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E8C5B0] shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center gap-2 text-[#C88A72] font-semibold text-xs uppercase tracking-widest mb-2">
              <MapPin className="w-4 h-4" /> {language === "es" ? "Lugar de la Celebración" : "Event Venue"}
            </div>
            <h3 className="font-serif text-2xl text-[#3D302F] mb-2">Terraza Las Verandas</h3>
            <p className="text-sm text-[#6E5A56] mb-6">
              Casa de Campo Resort & Villas, La Romana.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#C88A72] text-white text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-[#B37862] transition-colors"
              >
                <Navigation className="w-4 h-4" /> Google Maps
              </a>
              <a
                href="https://waze.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 bg-[#3D302F] text-white text-xs font-semibold rounded-xl flex items-center gap-2 hover:bg-black transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Waze GPS
              </a>
            </div>
          </div>

          <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E8C5B0]/60 space-y-4 text-sm text-[#5C4D4A]">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#C88A72] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#3D302F] font-semibold">{language === "es" ? "Código de Vestimenta" : "Dress Code"}</strong>
                {language === "es" ? "Casual Elegante / Tonos Pasteles & Crema" : "Smart Casual / Pastels & Neutral Tones"}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Gift className="w-5 h-5 text-[#C88A72] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#3D302F] font-semibold">{language === "es" ? "Rifa de Pañales" : "Diaper Raffle"}</strong>
                {language === "es" ? "Trae un paquete de pañales (Talla 1, 2 o 3) y participa por una sorpresa." : "Bring a pack of diapers (Size 1, 2 or 3) to enter a fun raffle prize!"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WISHLIST & REGISTRY */}
      <section id="regalos" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-[#3D302F] mb-2">{language === "es" ? "Mesa de Regalos & Obsequios" : "Gift Registry & Baby Wishlist"}</h2>
          <p className="text-sm text-[#6E5A56] max-w-md mx-auto">
            {language === "es" ? "Tu presencia es nuestro mayor regalo. Si deseas obsequiar algo a Mateo, te dejamos algunas opciones sugeridas:" : "Your presence is our best gift. If you wish to bless Mateo, here are our registry options:"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8C5B0] shadow-sm">
            <h4 className="font-semibold text-[#3D302F] mb-1">{language === "es" ? "Wishlist de Amazon / BB&B" : "Amazon / Store Wishlist"}</h4>
            <p className="text-xs text-[#6E5A56] mb-4">{language === "es" ? "Selección de artículos preparados especialmente para el cuarto de Mateo." : "Selected items prepared for Mateo's nursery."}</p>
            <a
              href="https://amazon.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#C88A72] hover:underline"
            >
              {language === "es" ? "Ver Lista en Amazon Baby" : "View Amazon Baby Registry"} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8C5B0] shadow-sm">
            <h4 className="font-semibold text-[#3D302F] mb-1">{language === "es" ? "Aporte Bancario Directo" : "Direct Bank Transfer"}</h4>
            <p className="text-xs text-[#6E5A56] mb-3">Banco Popular Dominicano · Cta Ahorros</p>
            <div className="flex items-center justify-between bg-[#FAF6F0] p-3 rounded-xl border border-[#E8C5B0]/50 text-xs font-mono">
              <span>960-128475-2</span>
              <button
                onClick={() => handleCopy("960-128475-2", "bank")}
                className="text-[#C88A72] hover:text-[#3D302F] flex items-center gap-1 font-sans font-semibold"
              >
                {copiedAccount === "bank" ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                {copiedAccount === "bank" ? (language === "es" ? "¡Copiado!" : "Copied!") : (language === "es" ? "Copiar" : "Copy")}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WISHES WALL */}
      <section id="muro" className="py-16 px-4 max-w-3xl mx-auto">
        <div className="bg-white p-8 rounded-3xl border border-[#E8C5B0] shadow-lg">
          <h3 className="font-serif text-2xl text-[#3D302F] mb-2 text-center">{language === "es" ? "Muro de Buenos Deseos" : "Wishes Wall for Mateo"}</h3>
          <p className="text-xs text-center text-[#6E5A56] mb-6">{language === "es" ? "Escribe unas bendiciones para los futuros padres y el bebé." : "Leave your sweet blessings for baby Mateo and parents."}</p>

          <form onSubmit={handleAddWish} className="space-y-4 mb-8">
            <input
              type="text"
              placeholder={language === "es" ? "Tu Nombre o Familia" : "Your Name / Family"}
              value={newWishName}
              onChange={(e) => setNewWishName(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6F0] rounded-xl border border-[#E8C5B0] text-xs focus:outline-none focus:border-[#C88A72]"
              required
            />
            <textarea
              placeholder={language === "es" ? "Escribe tu mensaje para Mateo..." : "Write your blessing for Mateo..."}
              value={newWishText}
              onChange={(e) => setNewWishText(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-[#FAF6F0] rounded-xl border border-[#E8C5B0] text-xs focus:outline-none focus:border-[#C88A72]"
              required
            ></textarea>
            <button
              type="submit"
              className="w-full py-3 bg-[#C88A72] text-white font-semibold text-xs rounded-xl hover:bg-[#B37862] transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {language === "es" ? "Publicar Bendición" : "Post Wish"}
            </button>
            {wishPublished && (
              <p className="text-xs text-green-600 text-center font-medium">¡Mensaje publicado con éxito!</p>
            )}
          </form>

          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {wishes.map((w) => (
              <div key={w.id} className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8C5B0]/50 text-xs">
                <div className="flex justify-between items-center mb-1 font-semibold text-[#3D302F]">
                  <span>{w.name}</span>
                  <span className="text-[10px] text-gray-400 font-normal">{w.date}</span>
                </div>
                <p className="text-[#5C4D4A] italic">"{w.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RSVP FORM */}
      <section id="rsvp" className="py-16 px-4 max-w-xl mx-auto pb-24">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#C88A72] shadow-2xl text-center">
          <h3 className="font-serif text-3xl text-[#3D302F] mb-2">{language === "es" ? "Confirmar Asistencia" : "Confirm RSVP"}</h3>
          <p className="text-xs text-[#6E5A56] mb-6">{language === "es" ? "Por favor confirma antes del 25 de Septiembre" : "Please confirm by September 25"}</p>

          <form onSubmit={handleRsvpSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[#3D302F] mb-1">{language === "es" ? "Nombre Completo *" : "Full Name *"}</label>
              <input
                type="text"
                value={rsvpData.fullName}
                onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                placeholder="Ej. Carmen & Roberto"
                required
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8C5B0] rounded-xl text-xs focus:outline-none focus:border-[#C88A72]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D302F] mb-1">{language === "es" ? "Asistencia" : "Attendance"}</label>
              <select
                value={rsvpData.attendance}
                onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value })}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8C5B0] rounded-xl text-xs focus:outline-none focus:border-[#C88A72]"
              >
                <option value="Confirmado">{language === "es" ? "¡Sí, asistiré con mucho gusto!" : "Yes, I will attend!"}</option>
                <option value="Declina">{language === "es" ? "Lamentablemente no podré asistir" : "Regretfully cannot attend"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D302F] mb-1">{language === "es" ? "Cantidad de Acompañantes" : "Number of Guests"}</label>
              <input
                type="number"
                min="1"
                max="4"
                value={rsvpData.guestCount}
                onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E8C5B0] rounded-xl text-xs focus:outline-none focus:border-[#C88A72]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#C88A72] text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#B37862] transition-colors shadow-lg flex items-center justify-center gap-2 mt-6"
            >
              <Send className="w-4 h-4" /> {language === "es" ? "Enviar por WhatsApp" : "Send via WhatsApp"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
