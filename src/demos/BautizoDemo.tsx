import { useState, FormEvent } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  Church,
  Copy,
  Gift,
  Heart,
  MapPin,
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

interface BautizoDemoProps {
  onBackToHome: () => void;
}

/* Sacro sereno: verde bosque, oro viejo y marfil. */
const FOREST = "#1C2621";
const FOREST_DEEP = "#141B17";
const IVORY = "#FDFCF7";
const IVORY_SOFT = "#F3EFE4";
const GOLD = "#B89635";
const GOLD_LIGHT = "#D4B75C";

const PALETTE: DemoPalette = { accent: GOLD, onAccent: FOREST_DEEP, bar: FOREST };

const HERO =
  "https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&q=80&w=1600";

const GALLERY = [
  "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&q=80&w=900",
];

export default function BautizoDemo({ onBackToHome }: BautizoDemoProps) {
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);
  useSectionReveal();

  const targetDate = new Date("2026-11-22T10:30:00").getTime();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [copiedGift, setCopiedGift] = useState(false);

  const [blessings, setBlessings] = useState([
    { id: "1", name: "Padrino Carlos", text: "Un privilegio ser tu guía espiritual, mi niña amada. Que el Señor derrame infinitas bendiciones sobre tu vida.", date: lx("Hace 1 día", "1 day ago") },
    { id: "2", name: "Familia Rivas Santos", text: "Acompañándolos con todo el corazón en este sagrado sacramento.", date: lx("Hace 2 días", "2 days ago") },
    { id: "3", name: "Abuelos Gómez", text: "Sofía María, llegaste para llenar de luz esta familia. Te esperamos en la Catedral.", date: lx("Hace 3 días", "3 days ago") },
  ]);
  const [blessingName, setBlessingName] = useState("");
  const [blessingText, setBlessingText] = useState("");
  const [blessingPublished, setBlessingPublished] = useState(false);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 2,
    menuPreference: lx("Almuerzo familiar", "Family lunch"),
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
      osc.frequency.setValueAtTime(261.63, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
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
    window.open(createRsvpWhatsAppUrl("Bautizo Sofía María", rsvpData), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const handleAddBlessing = (e: FormEvent) => {
    e.preventDefault();
    if (!blessingName.trim() || !blessingText.trim()) return;
    setBlessings([{ id: String(Date.now()), name: blessingName.trim(), text: blessingText.trim(), date: lx("Justo ahora", "Just now") }, ...blessings]);
    setBlessingName("");
    setBlessingText("");
    setBlessingPublished(true);
    setTimeout(() => setBlessingPublished(false), 4000);
  };

  const copyGift = () => {
    navigator.clipboard?.writeText("Banco Popular · 703-55182-4 · Familia Almanzar Santos");
    setCopiedGift(true);
    setTimeout(() => setCopiedGift(false), 2500);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const addToCalendar = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "BEGIN:VEVENT",
      "DTSTART:20261122T143000Z",
      "DTEND:20261122T190000Z",
      "SUMMARY:Bautizo de Sofía María",
      "LOCATION:Catedral Primada de América, Santo Domingo",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bautizo-sofia-maria.ics";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const programme = [
    { time: "10:30 AM", icon: Church, es: "Santa misa y sacramento", en: "Holy mass and sacrament", d_es: "Catedral Primada de América, Zona Colonial.", d_en: "Catedral Primada de América, Colonial Zone." },
    { time: "11:45 AM", icon: Sparkles, es: "Fotografías familiares", en: "Family photographs", d_es: "En el atrio, con los padrinos y abuelos.", d_en: "In the atrium, with godparents and grandparents." },
    { time: "12:30 PM", icon: Utensils, es: "Almuerzo de celebración", en: "Celebration lunch", d_es: "Restaurante Pepperoni, salón privado.", d_en: "Pepperoni Restaurant, private room." },
    { time: "2:30 PM", icon: Heart, es: "Brindis y palabras", en: "Toast and words", d_es: "Agradecimiento de los padres y padrinos.", d_en: "Words of thanks from parents and godparents." },
  ];

  const field = "w-full px-4 py-3 rounded-xl text-sm focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const fieldStyle = { background: IVORY, border: `1px solid ${GOLD}55`, color: FOREST };

  const navItems = [
    { id: "sacramento", label: lx("El Sacramento", "The Sacrament") },
    { id: "programa", label: lx("Programa", "Programme") },
    { id: "padrinos", label: lx("Padrinos", "Godparents") },
    { id: "lugares", label: lx("Ubicación", "Venues") },
    { id: "galeria", label: lx("Galería", "Gallery") },
    { id: "regalos", label: lx("Detalles", "Gifts") },
    { id: "muro", label: lx("Bendiciones", "Blessings") },
  ];

  return (
    <div className="min-h-screen font-sans relative" style={{ background: IVORY, color: FOREST }}>
      <div className="fixed bottom-6 left-6 z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <DemoMusicToggle
          isPlaying={isPlayingMusic}
          onToggle={toggleMusic}
          isEs={isEs}
          labelOn={lx("Música sacra", "Sacred music")}
          labelOff={lx("Reproducir melodía", "Play melody")}
          className={`p-3.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all duration-300 border ${
            isPlayingMusic ? "text-white" : "hover:opacity-80"
          }`}
        />
      </div>

      <DemoTopBar onBackToHome={onBackToHome} sampleName="Bautizo Sofía María" isEs={isEs} setLanguage={setLanguage} palette={PALETTE} />
      <DemoSubNav
        items={navItems}
        ctaId="rsvp"
        ctaLabel="RSVP"
        onNavigate={scrollToSection}
        palette={PALETTE}
        background={`${IVORY}F2`}
        ariaLabel={lx("Secciones de la invitación", "Invitation sections")}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <header id="sacramento" className="relative min-h-[92vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.28 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${IVORY}E6, ${IVORY}D9 45%, ${IVORY})` }} />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: `${GOLD}80` }}>
              <Church className="w-8 h-8" style={{ color: GOLD }} aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.3em] uppercase mb-7 border"
              style={{ color: GOLD, borderColor: `${GOLD}66`, background: "#FFFFFFCC" }}
            >
              {lx("Santo Sacramento del Bautismo", "Holy Sacrament of Baptism")}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <h1 className="font-serif text-5xl sm:text-7xl font-light mb-4 leading-[1.05]" style={{ color: FOREST }}>
              Sofía
              <span className="block italic" style={{ color: GOLD }}>
                María
              </span>
            </h1>
          </Reveal>

          <Reveal delay={260}>
            <DemoDivider accent={GOLD} />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.35em] font-semibold my-6" style={{ color: GOLD }}>
              {lx("Domingo 22 de Noviembre, 2026 · 10:30 AM", "Sunday, November 22, 2026 · 10:30 AM")}
              <span className="block mt-2 opacity-60 tracking-[0.2em]">Catedral Primada de América</span>
            </p>
          </Reveal>

          <Reveal delay={340}>
            <p className="font-serif text-lg sm:text-2xl font-light italic max-w-xl mx-auto mb-10 leading-relaxed opacity-80">
              {lx(
                "«Dejen que los niños vengan a mí, porque de ellos es el Reino de los Cielos.»",
                "«Let the little children come to me, for the kingdom of heaven belongs to such as these.»"
              )}
            </p>
          </Reveal>

          <Reveal delay={420}>
            <DemoCountdown
              target={targetDate}
              accent={GOLD}
              cell="#FFFFFFCC"
              labels={{ days: lx("Días", "Days"), hours: lx("Horas", "Hours"), minutes: lx("Min", "Min"), seconds: lx("Seg", "Sec") }}
            />
          </Reveal>

          <Reveal delay={500}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
              <button
                onClick={() => scrollToSection("rsvp")}
                className="px-8 py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: FOREST }}
              >
                {lx("Confirmar asistencia", "Confirm attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={addToCalendar}
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white"
                style={{ borderColor: GOLD, color: GOLD }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Guardar la fecha", "Save the date")}
              </button>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ----------------------------------------------------------- PROGRAMA */}
      <section id="programa" className="py-24 px-5" style={{ background: IVORY_SOFT }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("El día", "The day")} title={lx("Programa de la celebración", "Celebration programme")} accent={GOLD} titleColor={FOREST} />
          </Reveal>

          <ol className="space-y-4">
            {programme.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: `${GOLD}33` }}>
                    <div className="w-12 h-12 shrink-0 rounded-full border flex items-center justify-center" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: GOLD }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif text-xl mb-1" style={{ color: FOREST }}>
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

      {/* ----------------------------------------------------------- PADRINOS */}
      <section id="padrinos" className="py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Sus guías", "Her guides")}
              title={lx("Padrinos de bautismo", "Baptism godparents")}
              accent={GOLD}
              titleColor={FOREST}
              subtitle={lx(
                "Quienes acompañarán a Sofía María en su camino de fe.",
                "Those who will walk with Sofía María on her path of faith."
              )}
            />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { role: lx("Padrino", "Godfather"), name: "Carlos Manuel Rivas" },
              { role: lx("Madrina", "Godmother"), name: "Isabella Santos Gómez" },
            ].map((p, idx) => (
              <Reveal key={p.name} delay={idx * 100}>
                <div className="p-8 rounded-3xl border bg-white text-center" style={{ borderColor: `${GOLD}33` }}>
                  <Heart className="w-7 h-7 mx-auto mb-4" style={{ color: GOLD }} aria-hidden="true" />
                  <span className="block text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: GOLD }}>
                    {p.role}
                  </span>
                  <p className="font-serif text-xl" style={{ color: FOREST }}>
                    {p.name}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- LUGARES */}
      <section id="lugares" className="py-24 px-5" style={{ background: IVORY_SOFT }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Dónde", "Where")} title={lx("Ceremonia y almuerzo", "Ceremony and lunch")} accent={GOLD} titleColor={FOREST} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[320px]" style={{ borderColor: `${GOLD}33` }}>
                <iframe
                  title={lx("Mapa de la Catedral Primada de América", "Map of Catedral Primada de América")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5!2d-69.88!3d18.47!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sCatedral%20Primada%20de%20America!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[320px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                {[
                  {
                    icon: Church,
                    tag: lx("Ceremonia · 10:30 AM", "Ceremony · 10:30 AM"),
                    name: "Catedral Primada de América",
                    detail: lx("Calle Isabel la Católica, Zona Colonial", "Isabel la Católica St., Colonial Zone"),
                    query: "Catedral+Primada+de+America+Santo+Domingo",
                  },
                  {
                    icon: Utensils,
                    tag: lx("Almuerzo · 12:30 PM", "Lunch · 12:30 PM"),
                    name: "Restaurante Pepperoni",
                    detail: lx("Salón privado · Santo Domingo", "Private room · Santo Domingo"),
                    query: "Pepperoni+Santo+Domingo",
                  },
                ].map((place) => (
                  <div key={place.name} className="p-7 rounded-3xl border bg-white" style={{ borderColor: `${GOLD}33` }}>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                      <place.icon className="w-4 h-4" aria-hidden="true" /> {place.tag}
                    </div>
                    <h3 className="font-serif text-xl mb-1.5" style={{ color: FOREST }}>
                      {place.name}
                    </h3>
                    <p className="text-sm opacity-65 mb-5">{place.detail}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${place.query}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-5 py-3 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[44px]"
                        style={{ background: FOREST }}
                      >
                        <Navigation className="w-4 h-4" aria-hidden="true" /> Maps
                      </a>
                      <a
                        href={`https://waze.com/ul?q=${place.query}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 px-5 py-3 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[44px] hover:bg-[#F3EFE4] transition-colors"
                        style={{ borderColor: GOLD, color: GOLD }}
                      >
                        <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                      </a>
                    </div>
                  </div>
                ))}

                <div className="p-7 rounded-3xl border bg-white" style={{ borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Código de vestimenta", "Dress code")}
                  </div>
                  <h3 className="font-serif text-lg mb-3" style={{ color: FOREST }}>
                    {lx("Formal claro", "Light formal")}
                  </h3>
                  <div className="flex items-center gap-3">
                    {[
                      { n: lx("Marfil", "Ivory"), c: IVORY_SOFT },
                      { n: lx("Verde", "Green"), c: FOREST },
                      { n: lx("Oro", "Gold"), c: GOLD },
                      { n: lx("Beige", "Beige"), c: "#DCCDB4" },
                    ].map((c) => (
                      <div key={c.n} className="text-center">
                        <span className="block w-11 h-11 rounded-full border mb-1.5" style={{ background: c.c, borderColor: `${GOLD}55` }} aria-hidden="true" />
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

      {/* ------------------------------------------------------------ GALERÍA */}
      <section id="galeria" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Sus primeros meses", "Her first months")} title={lx("Galería de Sofía", "Sofía's gallery")} accent={GOLD} titleColor={FOREST} />
          </Reveal>
          <Reveal delay={80}>
            <DemoGallery images={GALLERY} accent={GOLD} isEs={isEs} columnsClassName="grid-cols-2 md:grid-cols-4" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ REGALOS */}
      <section id="regalos" className="py-24 px-5" style={{ background: IVORY_SOFT }}>
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <DemoSectionTitle
              eyebrow={lx("Un detalle", "A gift")}
              title={lx("Ahorro para su futuro", "Savings for her future")}
              accent={GOLD}
              titleColor={FOREST}
              subtitle={lx(
                "Tu presencia y tus oraciones son el mejor regalo. Si deseas tener un detalle, los padres abrieron una cuenta de ahorros a nombre de Sofía.",
                "Your presence and prayers are the best gift. If you'd like to give something, her parents opened a savings account in Sofía's name."
              )}
            />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-8 rounded-3xl border bg-white" style={{ borderColor: `${GOLD}33` }}>
              <Gift className="w-9 h-9 mx-auto mb-4" style={{ color: GOLD }} aria-hidden="true" />
              <button
                onClick={copyGift}
                className="px-7 py-3.5 border text-[11px] font-semibold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] transition-colors hover:bg-[#F3EFE4]"
                style={{ borderColor: GOLD, color: copiedGift ? GOLD_LIGHT : GOLD }}
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
            <DemoSectionTitle eyebrow={lx("Para Sofía", "For Sofía")} title={lx("Muro de bendiciones", "Wall of blessings")} accent={GOLD} titleColor={FOREST} />
          </Reveal>

          <Reveal>
            <form onSubmit={handleAddBlessing} className="p-6 sm:p-8 rounded-3xl border bg-white mb-8 space-y-4" style={{ borderColor: `${GOLD}33` }}>
              <div>
                <label htmlFor="bautizo-nombre" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu nombre", "Your name")}
                </label>
                <input id="bautizo-nombre" type="text" value={blessingName} onChange={(e) => setBlessingName(e.target.value)} placeholder={lx("Ej. Familia Rivas", "E.g. The Rivas family")} className={field} style={fieldStyle} />
              </div>
              <div>
                <label htmlFor="bautizo-mensaje" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                  {lx("Tu bendición", "Your blessing")}
                </label>
                <textarea id="bautizo-mensaje" rows={3} value={blessingText} onChange={(e) => setBlessingText(e.target.value)} placeholder={lx("Escribe unas palabras para Sofía María...", "Write a few words for Sofía María...")} className={`${field} resize-none`} style={fieldStyle} />
              </div>
              <button type="submit" className="w-full py-3.5 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]" style={{ background: FOREST }}>
                <Send className="w-4 h-4" aria-hidden="true" /> {lx("Publicar bendición", "Post blessing")}
              </button>
              {blessingPublished && (
                <p role="status" aria-live="polite" className="text-xs text-center" style={{ color: GOLD }}>
                  {lx(
                    "Tu bendición aparece abajo. En una invitación real quedaría guardada para la familia.",
                    "Your blessing appears below. In a real invitation it would be saved for the family."
                  )}
                </p>
              )}
            </form>
          </Reveal>

          <div className="space-y-4">
            {blessings.map((b, idx) => (
              <Reveal key={b.id} delay={idx * 60}>
                <article className="p-6 rounded-2xl border bg-white relative" style={{ borderColor: `${GOLD}26` }}>
                  <Quote className="w-7 h-7 absolute top-5 right-5" style={{ color: `${GOLD}33` }} aria-hidden="true" />
                  <p className="font-serif text-base sm:text-lg italic leading-relaxed mb-4 pr-8" style={{ color: FOREST }}>
                    “{b.text}”
                  </p>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
                    <span className="font-semibold" style={{ color: GOLD }}>
                      {b.name}
                    </span>
                    <span className="opacity-45">{b.date}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- RSVP */}
      <section id="rsvp" className="py-24 px-5 pb-32" style={{ background: IVORY_SOFT }}>
        <div className="max-w-xl mx-auto">
          <Reveal>
            <DemoSectionTitle eyebrow={lx("Te esperamos", "We're expecting you")} title={lx("Confirma tu asistencia", "Confirm your attendance")} accent={GOLD} titleColor={FOREST} />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-xl bg-white" style={{ borderColor: FOREST }}>
              <p className="text-xs opacity-60 text-center mb-7">
                {lx("Agradecemos confirmar antes del 10 de noviembre", "Please confirm before November 10")}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="bautizo-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input id="bautizo-name" type="text" required value={rsvpData.fullName} onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })} placeholder={lx("Ej. Familia Almanzar Santos", "E.g. The Almanzar Santos family")} className={field} style={fieldStyle} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="bautizo-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select id="bautizo-attendance" value={rsvpData.attendance} onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })} className={field} style={fieldStyle}>
                      <option value="Confirmado">{lx("Ahí estaremos", "We'll be there")}</option>
                      <option value="Declina">{lx("No podremos asistir", "We can't make it")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bautizo-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                      {lx("Nº de personas", "Number of guests")}
                    </label>
                    <select id="bautizo-guests" value={rsvpData.guestCount} onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })} className={field} style={fieldStyle}>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="bautizo-menu" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Preferencia de menú", "Menu preference")}
                  </label>
                  <select id="bautizo-menu" value={rsvpData.menuPreference} onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })} className={field} style={fieldStyle}>
                    <option>{lx("Almuerzo familiar", "Family lunch")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                    <option>{lx("Menú infantil", "Children's menu")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bautizo-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold opacity-70 mb-2">
                    {lx("Alergias o notas (opcional)", "Allergies or notes (optional)")}
                  </label>
                  <input id="bautizo-notes" type="text" value={rsvpData.dietaryNotes} onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })} placeholder={lx("Ej. Sin lactosa", "E.g. Lactose free")} className={field} style={fieldStyle} />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-white font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: FOREST }}
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
              <MapPin className="w-3.5 h-3.5" style={{ color: GOLD }} aria-hidden="true" />
              {lx("Con amor, la familia Almanzar Santos", "With love, the Almanzar Santos family")}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
