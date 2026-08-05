import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Baby,
  Calendar,
  Check,
  Copy,
  Gift,
  Heart,
  MapPin,
  Music,
  Navigation,
  Quote,
  Send,
  Sparkles,
  Utensils,
} from "lucide-react";
import DemoMusicToggle from "../components/common/DemoMusicToggle";
import DemoRsvpNotice from "../components/common/DemoRsvpNotice";
import Reveal from "../components/common/Reveal";
import {
  DemoCountdown,
  DemoDivider,
  DemoGallery,
  DemoPalette,
  DemoSectionTitle,
  DemoSubNav,
  DemoTopBar,
} from "../components/demo/DemoKit";
import { useLanguage } from "../context/LanguageContext";
import { useSectionReveal } from "../hooks/useSectionReveal";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface BabyShowerDemoProps {
  onBackToHome: () => void;
}

/* Terracota suave: nude, cacao y arena. */
const COCOA = "#3D302F";
const CREAM = "#FDFAF6";
const CREAM_SOFT = "#F5EDE4";
const TERRACOTTA = "#C88A72";
const TERRACOTTA_LIGHT = "#E8C5B0";

const PALETTE: DemoPalette = { accent: TERRACOTTA, onAccent: "#FFFFFF", bar: COCOA };

const HERO =
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=1600";

// Comprobadas una a una: aquí había un estetoscopio y una pagoda japonesa en
// la galería de un baby shower. Unsplash devuelve HTTP 200 con la foto que sea,
// así que un enlace «vivo» no garantiza que la imagen tenga sentido.
const GALLERY = [
  "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=900",
];

export default function BabyShowerDemo({ onBackToHome }: BabyShowerDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2026-10-10T16:00:00").getTime();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedGift, setCopiedGift] = useState(false);
  const [predictions, setPredictions] = useState({ weight: "", date: "", name: "" });
  const [predictionSent, setPredictionSent] = useState(false);

  const [wishes, setWishes] = useState([
    { id: "1", name: "Abuela Beatriz", text: "Esperando con los brazos abiertos a nuestro amado Mateo. ¡Dios te bendiga siempre!", date: lx("Hace 1 hora", "1 hour ago") },
    { id: "2", name: "Tía Claudia", text: "Ya tengo listo el cuento que le leeré cada noche. No puedo esperar a conocerte.", date: lx("Ayer", "Yesterday") },
    { id: "3", name: "Los vecinos Fernández", text: "Que llegue con salud y llene esa casa de risas. ¡Enhorabuena!", date: lx("Hace 2 días", "2 days ago") },
  ]);
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [wishPublished, setWishPublished] = useState(false);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: lx("Merienda dulce y salada", "Sweet and savoury tea"),
    dietaryNotes: "",
    songRequest: "",
  });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      audioCtx?.close();
      setAudioCtx(null);
      setIsPlayingMusic(false);
      return;
    }
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(392, ctx.currentTime);
      gain.gain.setValueAtTime(0.012, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setAudioCtx(ctx);
      setIsPlayingMusic(true);
    } catch (err) {
      console.error("Audio error", err);
    }
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;
    window.open(createRsvpWhatsAppUrl("Baby Shower Mateo", rsvpData), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const handleAddWish = (e: FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;
    setWishes([{ id: String(Date.now()), name: wishName.trim(), text: wishText.trim(), date: lx("Justo ahora", "Just now") }, ...wishes]);
    setWishName("");
    setWishText("");
    setWishPublished(true);
    setTimeout(() => setWishPublished(false), 4000);
  };

  const handlePrediction = (e: FormEvent) => {
    e.preventDefault();
    if (!predictions.weight.trim() && !predictions.date.trim()) return;
    setPredictionSent(true);
    setTimeout(() => setPredictionSent(false), 5000);
  };

  const copyGift = () => {
    navigator.clipboard?.writeText("Banco Popular · 655-73218-1 · Familia Guzmán Peña");
    setCopiedGift(true);
    setTimeout(() => setCopiedGift(false), 2500);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261010T200000Z",
      "DTEND:20261010T230000Z",
      "SUMMARY:Baby Shower de Mateo",
      "LOCATION:Terraza Las Verandas, Casa de Campo",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "baby-shower-mateo.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const programme = [
    { time: "4:00 PM", icon: Heart, es: "Recepción y merienda", en: "Reception & tea", d_es: "Bienvenida en la terraza, entre flores y globos.", d_en: "Welcome on the terrace, among flowers and balloons." },
    { time: "4:45 PM", icon: Sparkles, es: "Juegos para invitados", en: "Guest games", d_es: "«Adivina el biberón» y el clásico de los pañales.", d_en: "'Guess the bottle' and the classic diaper game." },
    { time: "5:30 PM", icon: Gift, es: "Apertura de regalos", en: "Gift opening", d_es: "Con la mamá en el sillón de honor.", d_en: "With mum in the seat of honour." },
    { time: "6:15 PM", icon: Utensils, es: "Corte del pastel", en: "Cake cutting", d_es: "Pastel de dos pisos en tonos nude.", d_en: "Two-tier cake in nude tones." },
    { time: "7:00 PM", icon: Music, es: "Brindis de despedida", en: "Farewell toast", d_es: "Con mocktails para todos.", d_en: "With mocktails for everyone." },
  ];

  const field = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: CREAM, border: `1px solid ${TERRACOTTA}55`, color: COCOA };

  const navItems = [
    { id: "llegada", label: lx("Bienvenida", "Welcome") },
    { id: "programa", label: lx("Programa", "Programme") },
    { id: "detalles", label: lx("Ubicación", "Venue") },
    { id: "prediccion", label: lx("Adivina", "Guess") },
    { id: "galeria", label: lx("Galería", "Gallery") },
    { id: "regalos", label: lx("Mesa de Regalos", "Registry") },
    { id: "muro", label: lx("Muro de Amor", "Love Wall") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: CREAM, color: COCOA }}>
      <div className="fixed bottom-6 left-6 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <DemoMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          isEs={isEs}
          labelOn={lx("Nana sonando", "Lullaby playing")}
          labelOff={lx("Reproducir nana", "Play lullaby")}
          className={`p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
            isPlayingMusic ? "text-white" : "hover:opacity-80"
          }`}
        />
      </div>

      <DemoTopBar onBackToHome={onBackToHome} sampleName="Baby Shower Mateo" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="rsvp"
        ctaLabel="RSVP"
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${CREAM}F2`}
        ariaLabel={lx("Secciones de la invitación", "Invitation sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="llegada" className="relative min-h-[92vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.3 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${CREAM}E6, ${CREAM}D9 45%, ${CREAM})` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${TERRACOTTA}80`, background: "#FFFFFFAA" }}>
              <Baby className="w-8 h-8" style={{ color: TERRACOTTA }} aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase mb-7 border"
              style={{ color: TERRACOTTA, borderColor: `${TERRACOTTA}66`, background: "#FFFFFFCC" }}
            >
              {lx("Baby Shower especial", "Special Baby Shower")}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <h1 className="font-serif text-5xl sm:text-7xl font-light mb-4 leading-[1.05]" style={{ color: COCOA }}>
              {lx("Bienvenido,", "Welcome,")}
              <span className="block italic" style={{ color: TERRACOTTA }}>
                Mateo
              </span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <DemoDivider accent={TERRACOTTA} />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] font-semibold my-6" style={{ color: TERRACOTTA }}>
              {lx("Sábado 10 de Octubre, 2026 · 4:00 PM", "Saturday, October 10, 2026 · 4:00 PM")}
              <span className="block mt-2 opacity-60 tracking-[0.2em]">Terraza Privada · Casa de Campo</span>
            </p>
          </Reveal>

          <Reveal delay={340}>
            <p className="font-serif text-lg sm:text-2xl font-light italic max-w-xl mx-auto mb-10 leading-relaxed opacity-80">
              {lx(
                "«Un pequeño gran milagro está en camino.»",
                "«A sweet little miracle is on his way.»"
              )}
            </p>
          </Reveal>

          <Reveal delay={420}>
            <DemoCountdown
              target={targetDate}
              accent={TERRACOTTA}
              cell="#FFFFFFCC"
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: TERRACOTTA }}
              >
                {lx("Confirmar asistencia", "Confirm attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={addToCalendar}
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white"
                style={{ borderColor: TERRACOTTA, color: TERRACOTTA }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Guardar la fecha", "Save the date")}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ----------------------------------------------------------- PROGRAMA */}
      <section id="programa" className="py-24 px-5" style={{ background: CREAM_SOFT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("La tarde", "The afternoon")} title={lx("Programa de la merienda", "Afternoon programme")} accent={TERRACOTTA} titleColor={COCOA} />
          </Reveal>

          <ol className="space-y-4">
            {programme.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: `${TERRACOTTA}33` }}>
                    <div className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center" style={{ borderColor: `${TERRACOTTA}66`, background: `${TERRACOTTA}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: TERRACOTTA }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: TERRACOTTA }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif text-xl mb-1" style={{ color: COCOA }}>
                        {lx(item.es, item.en)}
                      </h3>
                      <p className="text-xs opacity-65 leading-relaxed">{lx(item.d_es, item.d_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ DETALLES */}
      <section id="detalles" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Dónde", "Where")} title={lx("Terraza Las Verandas", "Las Verandas Terrace")} accent={TERRACOTTA} titleColor={COCOA} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${TERRACOTTA}33` }}>
                <iframe
                  title={lx("Mapa de Casa de Campo", "Map of Casa de Campo")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3776.5!2d-68.91!3d18.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCasa%20de%20Campo%20La%20Romana!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                <div className="p-7 rounded-3xl border bg-white" style={{ borderColor: `${TERRACOTTA}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: TERRACOTTA }}>
                    <MapPin className="w-4 h-4" aria-hidden="true" /> {lx("Lugar", "Venue")}
                  </div>
                  <h3 className="font-serif text-2xl mb-1.5" style={{ color: COCOA }}>
                    Terraza Las Verandas
                  </h3>
                  <p className="text-sm opacity-65 mb-6">{lx("Casa de Campo · La Romana", "Casa de Campo · La Romana")}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=Casa+de+Campo+La+Romana"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                      style={{ background: TERRACOTTA }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?q=Casa%20de%20Campo%20La%20Romana"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-[#F5EDE4] transition-colors"
                      style={{ borderColor: TERRACOTTA, color: TERRACOTTA }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                    </a>
                  </div>
                </div>

                <div className="p-7 rounded-3xl border bg-white" style={{ borderColor: `${TERRACOTTA}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: TERRACOTTA }}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Código de vestimenta", "Dress code")}
                  </div>
                  <h3 className="font-serif text-lg mb-3" style={{ color: COCOA }}>
                    {lx("Tonos tierra y nude", "Earth and nude tones")}
                  </h3>
                  <div className="flex items-center gap-3">
                    {[
                      { n: lx("Nude", "Nude"), c: TERRACOTTA_LIGHT },
                      { n: lx("Terracota", "Terracotta"), c: TERRACOTTA },
                      { n: lx("Cacao", "Cocoa"), c: COCOA },
                      { n: lx("Arena", "Sand"), c: "#E5D7C6" },
                    ].map((c) => (
                      <div key={c.n} className="text-center">
                        <span className="block w-11 h-11 rounded-full border mb-1.5" style={{ background: c.c, borderColor: `${TERRACOTTA}55` }} aria-hidden="true" />
                        <span className="text-[9px] opacity-60 uppercase tracking-wider">{c.n}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- PREDICCIÓN */}
      <section id="prediccion" className="py-24 px-5" style={{ background: CREAM_SOFT }}>
        <div className="max-w-2xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Juego", "Game")}
              title={lx("Adivina y gana", "Guess and win")}
              accent={TERRACOTTA}
              titleColor={COCOA}
              subtitle={lx(
                "¿Cuánto pesará Mateo y qué día llegará? Quien más se acerque se lleva un detalle.",
                "How much will Mateo weigh and what day will he arrive? Whoever gets closest wins a prize."
              )}
            />
          </Reveal>

          <Reveal delay={100}>
            <form onSubmit={handlePrediction} className="p-7 rounded-3xl border bg-white space-y-5" style={{ borderColor: `${TERRACOTTA}33` }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="baby-peso" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Peso (libras)", "Weight (pounds)")}
                  </label>
                  <input id="baby-peso" type="text" value={predictions.weight} onChange={(e) => setPredictions({ ...predictions, weight: e.target.value })} placeholder="7.5" className={field} style={fieldStyle} />
                </div>
                <div>
                  <label htmlFor="baby-fecha" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Fecha de nacimiento", "Birth date")}
                  </label>
                  <input id="baby-fecha" type="date" value={predictions.date} onChange={(e) => setPredictions({ ...predictions, date: e.target.value })} className={field} style={fieldStyle} />
                </div>
              </div>
              <div>
                <label htmlFor="baby-quien" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input id="baby-quien" type="text" value={predictions.name} onChange={(e) => setPredictions({ ...predictions, name: e.target.value })} placeholder={lx("Ej. Tía Claudia", "E.g. Aunt Claudia")} className={field} style={fieldStyle} />
              </div>
              <button type="submit" className="w-full py-3.5 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]" style={{ background: TERRACOTTA }}>
                <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Enviar mi predicción", "Send my guess")}
              </button>
              {predictionSent && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: TERRACOTTA }}>
                  {lx(
                    "¡Anotada! En una invitación real tu predicción quedaría guardada para el sorteo.",
                    "Noted! In a real invitation your guess would be saved for the draw."
                  )}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ GALERÍA */}
      <section id="galeria" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("La espera", "The wait")} title={lx("Camino a conocerte", "On our way to meet you")} accent={TERRACOTTA} titleColor={COCOA} />
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={TERRACOTTA} isEs={isEs} columnsClassName="grid-cols-1 sm:grid-cols-3" heightClassName="h-56" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ REGALOS */}
      <section id="regalos" className="py-24 px-5" style={{ background: CREAM_SOFT }}>
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Para Mateo", "For Mateo")}
              title={lx("Mesa de regalos", "Gift registry")}
              accent={TERRACOTTA}
              titleColor={COCOA}
              subtitle={lx(
                "Tu presencia es nuestro mayor regalo. Si deseas obsequiar algo, aquí tienes los datos.",
                "Your presence is our best gift. If you'd like to give something, here are the details."
              )}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-8 rounded-3xl border bg-white" style={{ borderColor: `${TERRACOTTA}33` }}>
              <Gift className="w-9 h-9 mx-auto mb-4" style={{ color: TERRACOTTA }} aria-hidden="true" />
              <p className="text-sm opacity-70 mb-6">{lx("Artículos preparados para el cuarto de Mateo", "Items prepared for Mateo's nursery")}</p>
              <button
                onClick={copyGift}
                className="px-7 py-3.5 border text-[11px] font-semibold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] transition-colors hover:bg-[#F5EDE4]"
                style={{ borderColor: TERRACOTTA, color: copiedGift ? TERRACOTTA_LIGHT : TERRACOTTA }}
              >
                {copiedGift ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                {copiedGift ? lx("¡Copiado!", "Copied!") : lx("Copiar datos bancarios", "Copy bank details")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------------- MURO */}
      <section id="muro" className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Para Mateo", "For Mateo")} title={lx("Muro de amor", "Wall of love")} accent={TERRACOTTA} titleColor={COCOA} />
          </Reveal>

          <Reveal>
            <form onSubmit={handleAddWish} className="p-6 sm:p-8 rounded-3xl border bg-white mb-8 space-y-4" style={{ borderColor: `${TERRACOTTA}33` }}>
              <div>
                <label htmlFor="baby-nombre" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input id="baby-nombre" type="text" value={wishName} onChange={(e) => setWishName(e.target.value)} placeholder={lx("Ej. Abuela Beatriz", "E.g. Grandma Beatriz")} className={field} style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="baby-mensaje" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu mensaje", "Your message")}
                </label>
                <textarea id="baby-mensaje" rows={3} value={wishText} onChange={(e) => setWishText(e.target.value)} placeholder={lx("Escribe unas palabras para Mateo...", "Write a few words for Mateo...")} className={`${field} resize-none`} style={fieldStyle} />
              </div>
              <button type="submit" className="w-full py-3.5 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]" style={{ background: TERRACOTTA }}>
                <Send className="w-4 h-4" aria-hidden="true" /> {lx("Publicar mensaje", "Post message")}
              </button>
              {wishPublished && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: TERRACOTTA }}>
                  {lx(
                    "Tu mensaje aparece abajo. En una invitación real quedaría guardado para los papás.",
                    "Your message appears below. In a real invitation it would be saved for the parents."
                  )}
                </p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4">
            {wishes.map((w, idx) => (
              <Reveal key={w.id} delay={idx * 60}>
                <article className="p-6 rounded-2xl border bg-white relative" style={{ borderColor: `${TERRACOTTA}26` }}>
                  <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: `${TERRACOTTA}33` }} aria-hidden="true" />
                  <p className="font-serif text-base sm:text-lg italic leading-relaxed mb-4 pr-8" style={{ color: COCOA }}>
                    “{w.text}”
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                    <span className="font-semibold" style={{ color: TERRACOTTA }}>
                      {w.name}
                    </span>
                    <span className="opacity-45">{w.date}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- RSVP */}
      <section id="rsvp" className="py-24 px-5 pb-32" style={{ background: CREAM_SOFT }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Te esperamos", "We're expecting you")} title={lx("Confirma tu asistencia", "Confirm your attendance")} accent={TERRACOTTA} titleColor={COCOA} />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-xl bg-white" style={{ borderColor: TERRACOTTA }}>
              <p className="text-xs opacity-60 text-center mb-7">
                {lx("Agradecemos confirmar antes del 1 de octubre", "Please confirm before October 1")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="baby-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="baby-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Claudia Peña", "E.g. Claudia Peña")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="baby-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="baby-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("¡Ahí estaré!", "I'll be there!")}</option>
                      <option value="Declina">{lx("No podré asistir", "I can't make it")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="baby-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Nº de personas", "Number of guests")}
                    </label>
                    <select id="baby-guests" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })} className={field} style={fieldStyle}>
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="baby-menu" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Preferencia de merienda", "Tea preference")}
                  </label>
                  <select id="baby-menu" value={rsvpData.menuPreference} onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })} className={field} style={fieldStyle}>
                    <option>{lx("Merienda dulce y salada", "Sweet and savoury tea")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                    <option>{lx("Opción sin gluten", "Gluten-free option")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="baby-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Alergias o notas (opcional)", "Allergies or notes (optional)")}
                  </label>
                  <input id="baby-notes" type="text" value={rsvpData.dietaryNotes} onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })} placeholder={lx("Ej. Sin lactosa", "E.g. Lactose free")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: TERRACOTTA }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar confirmación por WhatsApp", "Send confirmation via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && <DemoRsvpNotice isEs={isEs} tone="light" />}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-center text-xs opacity-50 mt-10 flex items-center gap-2 justify-center">
              <Heart className="w-3.5 h-3.5" style={{ color: TERRACOTTA }} aria-hidden="true" />
              {lx("Con amor, la familia Guzmán Peña", "With love, the Guzmán Peña family")}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
