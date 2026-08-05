import { useState, useEffect, FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Calendar,
  Car,
  CheckCircle2,
  Globe,
  Mic,
  Navigation,
  QrCode,
  ShieldCheck,
  Send,
  Sparkles,
  Users,
  Utensils,
  X,
} from "lucide-react";
import corporateImg from "../assets/images/gala_corporate_demo.webp";
import Reveal from "../components/common/Reveal";
import VipPassModal from "../components/VipPassModal";
import { useDemoFonts } from "../hooks/useDemoFonts";
import { useLanguage } from "../context/LanguageContext";
import { RsvpFormData } from "../types";
import { parseAttendance } from "../utils/rsvp";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";

interface CorporateDemoProps {
  onBackToHome: () => void;
}

/* Paleta ejecutiva: azul noche corporativo, oro y gris acero. */
const NAVY_DEEP = "#070B19";
const NAVY = "#0B132B";
const NAVY_SOFT = "#1C2541";
const GOLD = "#D4AF37";

const GALLERY = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=900",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=900",
];

function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-2" aria-hidden="true">
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to right, transparent, ${GOLD}80)` }} />
      <span className="rotate-45 block w-1.5 h-1.5" style={{ background: GOLD }} />
      <span className="h-px w-16 sm:w-24" style={{ background: `linear-gradient(to left, transparent, ${GOLD}80)` }} />
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <span className="text-[10px] uppercase tracking-[0.45em] font-semibold block mb-3" style={{ color: GOLD }}>
        {eyebrow}
      </span>
      <h2 className="font-serif-display text-3xl sm:text-5xl font-bold text-white mb-4">{title}</h2>
      <Divider />
    </div>
  );
}

export default function CorporateDemo({ onBackToHome }: CorporateDemoProps) {
  useDemoFonts();
  const { language, setLanguage } = useLanguage();
  const isEs = language === "es";
  const lx = (es: string, en: string) => (isEs ? es : en);

  const targetDate = new Date("2026-10-28T19:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showVipPassModal, setShowVipPassModal] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: isEs ? "Cena ejecutiva de tres tiempos" : "Three-course executive dinner",
    dietaryNotes: "",
    songRequest: "",
  });
  const [companyName, setCompanyName] = useState("");
  const [positionTitle, setPositionTitle] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = targetDate - Date.now();
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / 86400000),
          hours: Math.floor((diff % 86400000) / 3600000),
          minutes: Math.floor((diff % 3600000) / 60000),
          seconds: Math.floor((diff % 60000) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    if (!activePhoto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActivePhoto(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activePhoto]);

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpData.fullName.trim()) return;

    // La empresa y el cargo viajan en las notas: son los datos que la
    // organización necesita para la acreditación en puerta.
    const payload: RsvpFormData = {
      ...rsvpData,
      dietaryNotes: [
        `${lx("Empresa", "Company")}: ${companyName || "—"}`,
        `${lx("Cargo", "Role")}: ${positionTitle || "—"}`,
        rsvpData.dietaryNotes ? `${lx("Notas", "Notes")}: ${rsvpData.dietaryNotes}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    };

    window.open(createRsvpWhatsAppUrl("Gala Anual de Innovación 2026", payload), "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const calendarUrl = () => {
    const p = new URLSearchParams({
      action: "TEMPLATE",
      text: "Gala Anual de Innovación 2026",
      dates: "20261028T233000Z/20261029T040000Z",
      details: "Gala Anual de Innovación 2026 — El Embajador, A Royal Hideaway Hotel.",
      location: "El Embajador, A Royal Hideaway Hotel, Santo Domingo",
    });
    return `https://calendar.google.com/calendar/render?${p.toString()}`;
  };

  const agenda = [
    { time: "7:30 PM", icon: Users, es: "Recepción y acreditación", en: "Reception & accreditation", d_es: "Cóctel de bienvenida y entrega de credenciales.", d_en: "Welcome cocktail and badge pickup." },
    { time: "8:15 PM", icon: Mic, es: "Palabras de apertura", en: "Opening remarks", d_es: "Presidencia del Consejo de Innovación.", d_en: "Chair of the Innovation Council." },
    { time: "8:45 PM", icon: Sparkles, es: "Panel: Transformación digital", en: "Panel: Digital transformation", d_es: "Tres ponentes, cuarenta minutos, preguntas abiertas.", d_en: "Three speakers, forty minutes, open Q&A." },
    { time: "9:30 PM", icon: Utensils, es: "Cena ejecutiva", en: "Executive dinner", d_es: "Menú de tres tiempos servido en mesa.", d_en: "Three-course plated menu." },
    { time: "10:45 PM", icon: CheckCircle2, es: "Premios a la excelencia", en: "Excellence awards", d_es: "Reconocimiento a las empresas del año.", d_en: "Recognition of the year's companies." },
    { time: "11:30 PM", icon: Building, es: "Networking y cierre", en: "Networking & close", d_es: "Terraza abierta hasta la medianoche.", d_en: "Terrace open until midnight." },
  ];

  const speakers = [
    {
      name: "Ing. Guillermo Henríquez",
      role_es: "Presidente del Consejo de Innovación",
      role_en: "Chair of the Innovation Council",
      topic_es: "Transformación digital e inteligencia artificial en R.D.",
      topic_en: "Digital transformation and AI in the D.R.",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=500",
    },
    {
      name: "Dra. Elena Vásquez",
      role_es: "Directora de Inteligencia de Negocios",
      role_en: "Director of Business Intelligence",
      topic_es: "El futuro del liderazgo ejecutivo hacia 2030",
      topic_en: "The future of executive leadership toward 2030",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=500",
    },
    {
      name: "Lic. Marcos De la Cruz",
      role_es: "Vicepresidente de Alianzas Estratégicas",
      role_en: "VP of Strategic Partnerships",
      topic_es: "Sostenibilidad y acceso a mercados globales",
      topic_en: "Sustainability and access to global markets",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=500",
    },
  ];

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/35 focus:outline-none focus-visible:ring-2 transition-colors min-h-[48px]";
  const inputStyle = { background: NAVY_DEEP, border: `1px solid ${GOLD}33` };

  const navItems = [
    { id: "gala", es: "La Gala", en: "The Gala" },
    { id: "agenda", es: "Agenda", en: "Agenda" },
    { id: "ponentes", es: "Ponentes", en: "Speakers" },
    { id: "pase", es: "Pase de Acceso", en: "Access Pass" },
    { id: "ubicacion", es: "Ubicación", en: "Venue" },
    { id: "galeria", es: "Ediciones", en: "Past Editions" },
  ];

  return (
    <div className="min-h-screen font-sans-clean selection:bg-[#D4AF37]/30 relative" style={{ background: NAVY, color: "#E0E6ED" }}>
      {/* Barra de demostración */}
      <div
        className="py-2.5 px-4 sticky top-0 z-50 shadow-md border-b flex items-center justify-between gap-3 text-xs"
        style={{ background: NAVY_DEEP, borderColor: `${GOLD}4D` }}
      >
        <button onClick={onBackToHome} className="flex items-center gap-1.5 text-white/70 hover:text-[#D4AF37] font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> {lx("Volver a Invifty", "Back to Invifty")}
        </button>

        {/* Selector de idioma: era la única muestra sin él, y un evento
            corporativo es justo donde más hace falta. */}
        <div className="flex items-center gap-1 bg-white/10 border rounded-full p-1 text-[10px] font-semibold" style={{ borderColor: `${GOLD}66` }}>
          <Globe className="w-3.5 h-3.5 ml-1 mr-0.5" style={{ color: GOLD }} aria-hidden="true" />
          <button
            onClick={() => setLanguage("es")}
            aria-pressed={isEs}
            className={`px-2 py-0.5 rounded-full transition-all ${isEs ? "text-black font-bold" : "text-white/70 hover:text-white"}`}
            style={isEs ? { background: GOLD } : undefined}
          >
            ES
          </button>
          <span className="text-white/30 text-[9px]" aria-hidden="true">|</span>
          <button
            onClick={() => setLanguage("en")}
            aria-pressed={!isEs}
            className={`px-2 py-0.5 rounded-full transition-all ${!isEs ? "text-black font-bold" : "text-white/70 hover:text-white"}`}
            style={!isEs ? { background: GOLD } : undefined}
          >
            EN
          </button>
        </div>

        <a
          href={createDemoWatermarkWhatsAppUrl("Gala Empresarial")}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest items-center gap-1.5 rounded-full"
          style={{ background: GOLD }}
        >
          ◆ {lx("Cotizar este diseño", "Quote this design")}
        </a>
      </div>

      {/* Navegación interna */}
      <nav
        className="backdrop-blur-md border-b sticky top-10 z-40 py-2.5 px-4 overflow-x-auto no-scrollbar"
        style={{ background: `${NAVY_SOFT}E6`, borderColor: `${GOLD}4D` }}
        aria-label={lx("Secciones del evento", "Event sections")}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-3 sm:gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)} className="hover:text-white transition-colors" style={{ color: GOLD }}>
              {lx(item.es, item.en)}
            </button>
          ))}
          <button
            onClick={() => scrollToSection("registro")}
            className="px-3.5 py-1 rounded-full text-[10px] font-bold"
            style={{ background: GOLD, color: NAVY }}
          >
            {lx("Registro", "Register")}
          </button>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- HERO */}
      <header id="gala" className="relative min-h-[90vh] flex items-center justify-center text-center px-5 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={corporateImg}
            alt=""
            aria-hidden="true"
            width={900}
            height={502}
            className="w-full h-full object-cover object-center scale-105"
            style={{ opacity: 0.22 }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${NAVY_DEEP}E6, ${NAVY}CC 50%, ${NAVY})` }} />
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] h-[400px] rounded-full blur-3xl pointer-events-none"
            style={{ background: `${GOLD}1A` }}
          />
        </div>

        <div className="relative z-10 max-w-3xl py-20">
          <Reveal from="none">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-7 border"
              style={{ color: GOLD, borderColor: `${GOLD}66`, background: `${GOLD}14` }}
            >
              <Building className="w-3.5 h-3.5" aria-hidden="true" />
              {lx("Evento corporativo exclusivo", "Exclusive corporate event")}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-serif-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.08] mb-2">
              {lx("Gala Anual de", "Annual Gala of")}
              <span className="block">{lx("Innovación", "Innovation")}</span>
              <span className="block italic font-normal mt-2" style={{ color: GOLD }}>
                2026
              </span>
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <Divider />
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.3em] font-semibold my-6 text-white/80">
              {lx("Miércoles 28 de Octubre, 2026 · 7:30 PM", "Wednesday, October 28, 2026 · 7:30 PM")}
              <span className="block mt-2 text-white/45 tracking-[0.18em]">El Embajador, A Royal Hideaway Hotel</span>
            </p>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-base sm:text-lg text-white/70 font-light max-w-xl mx-auto mb-10 leading-relaxed">
              {lx(
                "Una noche dedicada a reconocer la excelencia empresarial, el liderazgo transformador y la innovación tecnológica.",
                "An evening devoted to recognising business excellence, transformative leadership and technological innovation."
              )}
            </p>
          </Reveal>

          <Reveal delay={380}>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-md mx-auto mb-10">
              {[
                { v: timeLeft.days, l: lx("Días", "Days") },
                { v: timeLeft.hours, l: lx("Horas", "Hours") },
                { v: timeLeft.minutes, l: lx("Min", "Min") },
                { v: timeLeft.seconds, l: lx("Seg", "Sec") },
              ].map((u) => (
                <div key={u.l} className="py-4 rounded-2xl border backdrop-blur-sm" style={{ background: `${NAVY_SOFT}CC`, borderColor: `${GOLD}33` }}>
                  <span className="font-serif-display text-3xl sm:text-4xl font-bold block" style={{ color: GOLD }}>
                    {String(u.v).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/60">{u.l}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={460}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => scrollToSection("registro")}
                className="px-8 py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg transition-transform active:scale-95 min-h-[48px] inline-flex items-center justify-center gap-2"
                style={{ background: GOLD, color: NAVY }}
              >
                {lx("Registrar mi asistencia", "Register my attendance")}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <a
                href={calendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border font-semibold text-[11px] uppercase tracking-[0.2em] rounded-xl transition-colors min-h-[48px] inline-flex items-center justify-center gap-2 hover:bg-white/5"
                style={{ borderColor: `${GOLD}80`, color: GOLD }}
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {lx("Añadir al calendario", "Add to calendar")}
              </a>
            </div>
          </Reveal>
        </div>
      </header>

      {/* -------------------------------------------------------------- AGENDA */}
      <section id="agenda" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Programa oficial", "Official programme")} title={lx("Agenda ejecutiva", "Executive agenda")} />
          </Reveal>

          <ol className="space-y-4">
            {agenda.map((item, idx) => (
              <li key={item.time}>
                <Reveal delay={idx * 70}>
                  <div
                    className="flex items-start gap-5 p-5 sm:p-6 rounded-2xl border transition-colors hover:border-[#D4AF37]/50"
                    style={{ background: NAVY_SOFT, borderColor: `${GOLD}26` }}
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl border flex items-center justify-center" style={{ borderColor: `${GOLD}66`, background: `${GOLD}0F` }}>
                      <item.icon className="w-5 h-5" style={{ color: GOLD }} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase tracking-[0.25em] font-bold block mb-1" style={{ color: GOLD }}>
                        {item.time}
                      </span>
                      <h3 className="font-serif-display text-xl font-bold text-white mb-1">{lx(item.es, item.en)}</h3>
                      <p className="text-xs text-white/60 leading-relaxed">{lx(item.d_es, item.d_en)}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------------ PONENTES */}
      <section id="ponentes" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Quiénes hablan", "Who speaks")} title={lx("Ponentes principales", "Featured speakers")} />
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {speakers.map((sp, idx) => (
              <Reveal key={sp.name} delay={idx * 100}>
                <article className="rounded-3xl border overflow-hidden h-full flex flex-col" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={sp.photo}
                      alt={sp.name}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${NAVY_SOFT}, transparent 60%)` }} />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-serif-display text-lg font-bold text-white mb-1">{sp.name}</h3>
                    <p className="text-[10px] uppercase tracking-[0.18em] font-semibold mb-4" style={{ color: GOLD }}>
                      {lx(sp.role_es, sp.role_en)}
                    </p>
                    <p className="text-xs text-white/65 leading-relaxed mt-auto">“{lx(sp.topic_es, sp.topic_en)}”</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- PASE QR */}
      <section id="pase" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Control de acceso", "Access control")} title={lx("Tu pase personal", "Your personal pass")} />
          </Reveal>

          <Reveal delay={100}>
            <div className="rounded-3xl border p-8 sm:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{ background: NAVY_SOFT, borderColor: `${GOLD}4D` }}>
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-white mb-3">
                  {lx("Acreditación en segundos", "Accreditation in seconds")}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed mb-6">
                  {lx(
                    "Cada invitado confirmado recibe un código QR único con su nombre y su mesa. En la entrada se escanea y queda registrada la llegada, sin listas impresas ni colas.",
                    "Every confirmed guest receives a unique QR code with their name and table. At the door it is scanned and the arrival is logged — no printed lists, no queues."
                  )}
                </p>

                <ul className="space-y-2.5 mb-7">
                  {[
                    { es: "Código único e intransferible por invitado", en: "Unique, non-transferable code per guest" },
                    { es: "Mesa asignada visible en el pase", en: "Assigned table shown on the pass" },
                    { es: "Se guarda en el teléfono o se comparte", en: "Save to phone or share it" },
                  ].map((f) => (
                    <li key={f.es} className="flex items-start gap-2.5 text-xs text-white/75">
                      <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: GOLD }} aria-hidden="true" />
                      {lx(f.es, f.en)}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => setShowVipPassModal(true)}
                  className="px-7 py-3.5 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl inline-flex items-center gap-2 min-h-[48px] transition-transform active:scale-95"
                  style={{ background: GOLD, color: NAVY }}
                >
                  <QrCode className="w-4 h-4" aria-hidden="true" />
                  {lx("Ver mi pase de ejemplo", "See a sample pass")}
                </button>
              </div>

              {/* Representación del pase */}
              <div className="rounded-2xl border p-7 text-center" style={{ background: NAVY_DEEP, borderColor: `${GOLD}33` }}>
                <QrCode className="w-24 h-24 mx-auto mb-4" style={{ color: GOLD }} aria-hidden="true" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-1" style={{ color: GOLD }}>
                  {lx("Pase ejecutivo", "Executive pass")}
                </p>
                <p className="text-xs text-white/50">{lx("Mesa asignada · Acceso VIP", "Assigned table · VIP access")}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- UBICACIÓN */}
      <section id="ubicacion" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Dónde", "Where")} title={lx("Sede del evento", "Event venue")} />
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Reveal from="left">
              <div className="rounded-3xl overflow-hidden border h-full min-h-[340px]" style={{ borderColor: `${GOLD}33` }}>
                <iframe
                  title={lx("Mapa de El Embajador", "Map of El Embajador")}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7431289154627!2d-69.93284562398285!3d18.45032828262846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea5620fc12b32f9%3A0x6b45a90e38604d55!2sEl%20Embajador%2C%20a%20Royal%20Hideaway%20Hotel!5e0!3m2!1ses!2sdo!4v1700000000000"
                  className="w-full h-full min-h-[340px] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={100}>
              <div className="space-y-5">
                <div className="p-7 rounded-3xl border" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <h3 className="font-serif-display text-2xl font-bold text-white mb-1.5">El Embajador</h3>
                  <p className="text-sm text-white/60 mb-6">
                    {lx("A Royal Hideaway Hotel · Salón Embajador · Santo Domingo", "A Royal Hideaway Hotel · Embajador Ballroom · Santo Domingo")}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=El+Embajador+Royal+Hideaway+Santo+Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px]"
                      style={{ background: GOLD, color: NAVY }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Google Maps
                    </a>
                    <a
                      href="https://waze.com/ul?q=El%20Embajador%20Santo%20Domingo"
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-5 py-3.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 min-h-[48px] hover:bg-white/5 transition-colors"
                      style={{ borderColor: `${GOLD}80`, color: GOLD }}
                    >
                      <Navigation className="w-4 h-4" aria-hidden="true" /> Waze
                    </a>
                  </div>
                </div>

                <div id="vestimenta" className="p-7 rounded-3xl border scroll-mt-24" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Sparkles className="w-4 h-4" aria-hidden="true" /> {lx("Código de vestimenta", "Dress code")}
                  </div>
                  <h3 className="font-serif-display text-xl font-bold text-white mb-1.5">Black Tie</h3>
                  <p className="text-sm text-white/60 mb-5">
                    {lx(
                      "Esmoquin o traje oscuro para caballeros. Vestido largo para damas.",
                      "Tuxedo or dark suit for gentlemen. Long dress for ladies."
                    )}
                  </p>
                  <div className="flex items-center gap-3">
                    {[
                      { n: lx("Negro", "Black"), c: "#111111" },
                      { n: lx("Azul noche", "Midnight"), c: NAVY },
                      { n: lx("Oro", "Gold"), c: GOLD },
                      { n: lx("Marfil", "Ivory"), c: "#F3EFE7" },
                    ].map((c) => (
                      <div key={c.n} className="text-center">
                        <span className="block w-11 h-11 rounded-full border mb-1.5" style={{ background: c.c, borderColor: "rgba(255,255,255,0.25)" }} aria-hidden="true" />
                        <span className="text-[9px] text-white/50 uppercase tracking-wider">{c.n}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div id="parqueo" className="p-7 rounded-3xl border scroll-mt-24" style={{ background: NAVY_SOFT, borderColor: `${GOLD}33` }}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-semibold mb-3" style={{ color: GOLD }}>
                    <Car className="w-4 h-4" aria-hidden="true" /> {lx("Parqueo y valet", "Parking & valet")}
                  </div>
                  <p className="text-sm text-white/65 leading-relaxed">
                    {lx(
                      "Valet parking cortesía del evento en la entrada principal. Presenta tu pase QR al llegar y el personal se encargará del resto.",
                      "Complimentary valet parking at the main entrance. Show your QR pass on arrival and the staff will take care of the rest."
                    )}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ GALERÍA */}
      <section id="galeria" className="py-24 px-5" style={{ background: NAVY_DEEP }}>
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Antecedentes", "Background")} title={lx("Ediciones anteriores", "Past editions")} />
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GALLERY.map((img, idx) => (
              <Reveal key={img} delay={idx * 80}>
                <button
                  type="button"
                  onClick={() => setActivePhoto(img)}
                  aria-label={lx(`Ampliar fotografía ${idx + 1}`, `Enlarge photo ${idx + 1}`)}
                  className="group relative block w-full h-52 rounded-2xl overflow-hidden border focus-visible:outline-none focus-visible:ring-2"
                  style={{ borderColor: `${GOLD}33` }}
                >
                  <img
                    src={img}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white border border-white/50 rounded-full px-4 py-1.5">
                      {lx("Ampliar", "Enlarge")}
                    </span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ REGISTRO */}
      <section id="registro" className="py-24 px-5 pb-32">
        <div className="max-w-xl mx-auto">
          <Reveal>
            <SectionTitle eyebrow={lx("Aforo limitado", "Limited capacity")} title={lx("Registro de ejecutivos", "Executive registration")} />
          </Reveal>

          <Reveal delay={100}>
            <div className="p-7 sm:p-9 rounded-3xl border-2 shadow-2xl" style={{ background: NAVY_SOFT, borderColor: GOLD }}>
              <p className="text-xs text-white/60 text-center mb-7">
                {lx(
                  "Confirme su participación para la reserva de cupo y la acreditación.",
                  "Confirm your participation for seat reservation and accreditation."
                )}
              </p>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div>
                  <label htmlFor="corp-name" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Nombre completo *", "Full name *")}
                  </label>
                  <input
                    id="corp-name"
                    type="text"
                    required
                    value={rsvpData.fullName}
                    onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                    placeholder={lx("Ej. Lic. Alejandro Mendoza", "E.g. Alejandro Mendoza")}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="corp-company" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Empresa", "Company")}
                    </label>
                    <input
                      id="corp-company"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={lx("Ej. Nombre de tu empresa", "E.g. Your company name")}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label htmlFor="corp-role" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Cargo", "Role")}
                    </label>
                    <input
                      id="corp-role"
                      type="text"
                      value={positionTitle}
                      onChange={(e) => setPositionTitle(e.target.value)}
                      placeholder={lx("Ej. Directora de Operaciones", "E.g. Operations Director")}
                      className={inputClass}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="corp-attendance" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Asistencia", "Attendance")}
                    </label>
                    <select
                      id="corp-attendance"
                      value={rsvpData.attendance}
                      onChange={(e) => setRsvpData({ ...rsvpData, attendance: parseAttendance(e.target.value) })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      <option value="Confirmado">{lx("Confirmo mi asistencia", "I confirm my attendance")}</option>
                      <option value="Declina">{lx("Excuso mi asistencia", "I must decline")}</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="corp-guests" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                      {lx("Acompañantes", "Companions")}
                    </label>
                    <select
                      id="corp-guests"
                      value={rsvpData.guestCount}
                      onChange={(e) => setRsvpData({ ...rsvpData, guestCount: Number(e.target.value) })}
                      className={inputClass}
                      style={inputStyle}
                    >
                      {[1, 2, 3].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="corp-menu" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Preferencia de menú", "Menu preference")}
                  </label>
                  <select
                    id="corp-menu"
                    value={rsvpData.menuPreference}
                    onChange={(e) => setRsvpData({ ...rsvpData, menuPreference: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                  >
                    <option>{lx("Cena ejecutiva de tres tiempos", "Three-course executive dinner")}</option>
                    <option>{lx("Opción vegetariana", "Vegetarian option")}</option>
                    <option>{lx("Opción sin gluten", "Gluten-free option")}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="corp-notes" className="block text-[10px] uppercase tracking-[0.2em] font-semibold text-white/70 mb-2">
                    {lx("Requerimientos especiales (opcional)", "Special requirements (optional)")}
                  </label>
                  <input
                    id="corp-notes"
                    type="text"
                    value={rsvpData.dietaryNotes}
                    onChange={(e) => setRsvpData({ ...rsvpData, dietaryNotes: e.target.value })}
                    placeholder={lx("Ej. Acceso sin escaleras", "E.g. Step-free access")}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 font-bold text-[11px] uppercase tracking-[0.2em] rounded-xl shadow-lg inline-flex items-center justify-center gap-2 min-h-[52px] transition-transform active:scale-95"
                  style={{ background: GOLD, color: NAVY }}
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                  {lx("Enviar registro por WhatsApp", "Send registration via WhatsApp")}
                </button>
              </form>

              {rsvpSubmitted && (
                <div className="mt-5 p-5 rounded-2xl border text-center" style={{ background: NAVY_DEEP, borderColor: GOLD }}>
                  <CheckCircle2 className="w-9 h-9 mx-auto mb-2" style={{ color: GOLD }} aria-hidden="true" />
                  <h3 className="font-bold text-lg text-white mb-1">{lx("Se abrió WhatsApp", "WhatsApp opened")}</h3>
                  {/* La muestra no procesa ni almacena nada: sólo abre el chat. */}
                  <p className="text-xs text-white/70">
                    {lx(
                      "Su registro quedó redactado en WhatsApp. Envíe el mensaje para completarlo.",
                      "Your registration is written out in WhatsApp. Send the message to complete it."
                    )}
                  </p>
                  <p className="text-[10px] text-white/45 mt-2">
                    {lx(
                      "Es una muestra: los datos no se guardan en ningún sistema.",
                      "This is a sample: no data is stored anywhere."
                    )}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {showVipPassModal && (
        <VipPassModal
          eventName="Gala Anual de Innovación 2026"
          defaultGuestName={rsvpData.fullName || "Lic. Alejandro Mendoza"}
          tableNumber="Mesa VIP #04"
          eventDate="28 de Octubre, 2026 — 7:30 PM"
          eventLocation="El Embajador, A Royal Hideaway Hotel"
          onClose={() => setShowVipPassModal(false)}
        />
      )}

      {activePhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setActivePhoto(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lx("Fotografía ampliada", "Enlarged photo")}
        >
          <button
            onClick={() => setActivePhoto(null)}
            aria-label={lx("Cerrar", "Close")}
            className="absolute top-5 right-5 w-11 h-11 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
          <img src={activePhoto} alt="" className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
}
