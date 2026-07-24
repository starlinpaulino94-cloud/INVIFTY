import { useState, useEffect, FormEvent } from "react";
import { createDemoWatermarkWhatsAppUrl, createRsvpWhatsAppUrl } from "../utils/whatsapp";
import { RsvpFormData } from "../types";
import { 
  Sparkles, MapPin, Calendar, Clock, Award, CheckCircle2, 
  ArrowLeft, Send, Building, Users, ExternalLink, QrCode, 
  Car, Navigation, X, ShieldCheck
} from "lucide-react";
import corporateImg from "../assets/images/gala_corporate_demo_1784839877907.jpg";

interface CorporateDemoProps {
  onBackToHome: () => void;
}

export default function CorporateDemo({ onBackToHome }: CorporateDemoProps) {
  // Target date: October 28, 2026 19:30:00 AST
  const targetDate = new Date("2026-10-28T19:30:00").getTime();

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showQrModal, setShowQrModal] = useState(false);

  // Corporate RSVP Form State
  const [rsvpData, setRsvpData] = useState<RsvpFormData>({
    fullName: "",
    attendance: "Confirmado",
    guestCount: 1,
    menuPreference: "Cena Ejecutiva de Tres Tiempos",
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
      dietaryNotes: `Empresa: ${companyName || "N/A"} | Cargo: ${positionTitle || "N/A"} | ${rsvpData.dietaryNotes}`
    };

    const url = createRsvpWhatsAppUrl("Gala Anual de Innovación 2026", fullData);
    window.open(url, "_blank", "noopener,noreferrer");
    setRsvpSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Gala Anual de Innovación 2026 — Corporativo");
    const details = encodeURIComponent("Gala Anual de Innovación 2026 en El Embajador, A Royal Hideaway Hotel.");
    const location = encodeURIComponent("El Embajador, A Royal Hideaway Hotel, Santo Domingo");
    const start = "20261028T233000Z";
    const end = "20261029T040000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const speakers = [
    {
      name: "Ing. Guillermo Henríquez",
      title: "Presidente del Consejo de Innovación",
      topic: "Transformación Digital e Inteligencia Artificial en R.D."
    },
    {
      name: "Dra. Elena Vasquez",
      title: "Directora de Inteligencia de Negocios",
      topic: "El Futuro del Liderazgo Ejecutivo 2030"
    },
    {
      name: "Lic. Marcos De la Cruz",
      title: "Vicepresidente de Alianzas Estratégicas",
      topic: "Estrategias de Sostenibilidad y Mercado Global"
    }
  ];

  return (
    <div className="bg-[#0B132B] text-[#E0E6ED] min-h-screen font-sans-clean selection:bg-[#D4AF37]/30 relative pb-20">
      
      {/* Top Floating Watermark Bar */}
      <div className="bg-[#070B19] text-[#FFF1CB] py-2.5 px-4 sticky top-0 z-50 shadow-md border-b border-[#D4AF37]/30 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-gray-300 hover:text-[#D4AF37] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Volver a Invifty
        </button>

        <a
          href={createDemoWatermarkWhatsAppUrl("Gala Empresarial Vitrexi")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#D4AF37] text-black font-semibold px-4 py-1.5 text-[10px] uppercase tracking-widest flex items-center gap-1.5 hover:bg-[#F2D06B] transition-colors"
        >
          ◆ Muestra de Exhibición — Cotizar este diseño
        </a>
      </div>

      {/* Sticky Internal Navigation Bar */}
      <div className="bg-[#1C2541]/90 backdrop-blur-md border-b border-[#D4AF37]/30 sticky top-10 z-40 py-2 px-4 overflow-x-auto shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 sm:gap-4 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap text-[#D4AF37]">
          <button onClick={() => scrollToSection("agenda")} className="hover:text-white transition-colors px-2 py-1">
            Agenda
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("ponentes")} className="hover:text-white transition-colors px-2 py-1">
            Ponentes
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("ubicacion")} className="hover:text-white transition-colors px-2 py-1">
            Ubicación
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("vestimenta")} className="hover:text-white transition-colors px-2 py-1">
            Dress Code
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("parqueo")} className="hover:text-white transition-colors px-2 py-1">
            Parqueo & Valet
          </button>
          <span>·</span>
          <button onClick={() => scrollToSection("registro")} className="bg-[#D4AF37] text-[#0B132B] px-3 py-1 rounded-full text-[10px] font-bold">
            Registro Ejecutivos
          </button>
        </div>
      </div>

      {/* HERO COVER */}
      <header className="relative min-h-[80vh] flex items-center justify-center text-center p-6 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={corporateImg}
            alt="Gala Empresarial"
            className="w-full h-full object-cover object-center opacity-25 filter scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/80 via-[#0B132B]/90 to-[#0B132B]"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1C2541] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
            <Building className="w-4 h-4" />
            Evento Corporativo Exclusivo
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold font-serif-display tracking-tight text-white leading-tight">
            Gala Anual de Innovación <span className="gold-gradient-text block font-normal italic">2026</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
            Una noche dedicada a reconocer la excelencia empresarial, el liderazgo transformador y la innovación tecnológica en la República Dominicana.
          </p>

          <div className="pt-4 text-xs uppercase tracking-widest text-[#FFF1CB] font-bold flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#D4AF37]" /> 28.OCT.2026</span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-[#D4AF37]" /> Hotel El Embajador</span>
          </div>
        </div>
      </header>

      {/* COUNTDOWN TIMER */}
      <section className="max-w-3xl mx-auto -mt-12 relative z-20 px-4">
        <div className="bg-[#1C2541] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-4">
            CUENTA REGRESIVA DEL EVENTO
          </span>

          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
            <div className="bg-[#0B132B] p-3 rounded-2xl border border-[#D4AF37]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.days}</span>
              <span className="text-[10px] uppercase text-gray-400">Días</span>
            </div>
            <div className="bg-[#0B132B] p-3 rounded-2xl border border-[#D4AF37]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.hours}</span>
              <span className="text-[10px] uppercase text-gray-400">Horas</span>
            </div>
            <div className="bg-[#0B132B] p-3 rounded-2xl border border-[#D4AF37]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.minutes}</span>
              <span className="text-[10px] uppercase text-gray-400">Min</span>
            </div>
            <div className="bg-[#0B132B] p-3 rounded-2xl border border-[#D4AF37]/30">
              <span className="block text-2xl sm:text-4xl font-bold text-white">{timeLeft.seconds}</span>
              <span className="text-[10px] uppercase text-gray-400">Seg</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={createGoogleCalendarUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#0B132B] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-[#FFF1CB] transition-colors shadow-sm"
            >
              <Calendar className="w-4 h-4" /> Agregar a mi Google Calendar
            </a>
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 bg-black/60 border border-[#D4AF37]/50 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-black transition-colors"
            >
              <QrCode className="w-4 h-4 text-[#D4AF37]" /> Simular Pase QR
            </button>
          </div>
        </div>
      </section>

      {/* AGENDA DEL EVENTO */}
      <section id="agenda" className="py-20 px-4 max-w-3xl mx-auto text-center scroll-mt-20">
        <Clock className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
        <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
          PROGRAMA OFICIAL
        </span>
        <h2 className="text-3xl font-serif-display font-bold text-white mb-8">Agenda Ejecutiva</h2>

        <div className="space-y-4 text-left">
          {[
            { time: "07:30 PM", title: "Acreditación & Cóctel VIP de Bienvenida", detail: "Foyer Principal, Hotel El Embajador" },
            { time: "08:15 PM", title: "Conferencia Magistral & Panel de Ponentes", detail: "Salón Gran Embajador" },
            { time: "09:00 PM", title: "Entrega de Galardones a la Excelencia", detail: "Premio Innovador Corporativo del Año" },
            { time: "09:45 PM", title: "Cena de Gala & Networking de Alto Nivel", detail: "Cena gourmet de tres tiempos" },
            { time: "11:00 PM", title: "Brindis de Cierre & Presentación Musical", detail: "Show en vivo para ejecutivos invitados" }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#1C2541] p-5 rounded-2xl border border-[#D4AF37]/20 flex items-center gap-4">
              <span className="bg-[#D4AF37] text-[#0B132B] text-xs font-bold px-3 py-1.5 rounded-xl shrink-0">
                {item.time}
              </span>
              <div>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-gray-300 mt-0.5">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PONENTES DESTACADOS */}
      <section id="ponentes" className="py-16 bg-[#1C2541]/50 border-y border-[#D4AF37]/20 px-4 scroll-mt-20">
        <div className="max-w-5xl mx-auto text-center">
          <Users className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
          <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
            EXPOSITORES ESTELARES
          </span>
          <h2 className="text-3xl font-serif-display font-bold text-white mb-8">Ponentes Principales</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {speakers.map((speaker, idx) => (
              <div key={idx} className="bg-[#0B132B] p-6 rounded-2xl border border-[#D4AF37]/30 shadow-md">
                <Award className="w-6 h-6 text-[#D4AF37] mb-3" />
                <h3 className="font-bold text-white text-base mb-1">{speaker.name}</h3>
                <p className="text-xs text-[#D4AF37] font-semibold mb-3">{speaker.title}</p>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Tema: <em>"{speaker.topic}"</em>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UBICACIÓN, DRESS CODE & PARQUEO */}
      <section id="ubicacion" className="py-20 px-4 max-w-5xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          <div className="bg-[#1C2541] p-6 rounded-3xl border border-[#D4AF37]/30">
            <MapPin className="w-8 h-8 text-[#D4AF37] mb-3" />
            <h3 className="text-2xl font-bold text-white mb-1">Sede del Evento</h3>
            <p className="text-sm text-[#D4AF37] font-bold mb-1">El Embajador, A Royal Hideaway Hotel</p>
            <p className="text-xs text-gray-400 mb-4">Bella Vista, Santo Domingo, R.D.</p>

            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 h-48 mb-4 shadow-inner">
              <iframe
                title="Hotel El Embajador Santo Domingo"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.7431289154627!2d-69.93284562398285!3d18.45032828262846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8ea5620fc12b32f9%3A0x6b45a90e38604d55!2sEl%20Embajador%2C%20a%20Royal%20Hideaway%20Hotel!5e0!3m2!1ses!2sdo!4v1700000000000!5m2!1ses!2sdo"
                className="w-full h-full border-0"
                loading="lazy"
              ></iframe>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://maps.google.com/?q=El+Embajador+Royal+Hideaway+Hotel"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#D4AF37] text-[#0B132B] font-bold text-xs py-3 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#FFF1CB] transition-colors"
              >
                Google Maps <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://waze.com/ul?q=Hotel+El+Embajador+Santo+Domingo"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 border border-[#D4AF37]/50 text-white font-bold text-xs py-3 rounded-xl text-center uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
              >
                Abrir Waze <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
              </a>
            </div>
          </div>

          <div id="vestimenta" className="bg-[#1C2541] p-6 rounded-3xl border border-[#D4AF37]/30 flex flex-col justify-between scroll-mt-20">
            <div>
              <Sparkles className="w-8 h-8 text-[#D4AF37] mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">Código de Vestimenta</h3>
              <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider mb-3">
                Etiqueta Negra / Black Tie Corporate
              </p>
              <p className="text-xs text-gray-300 leading-relaxed mb-6">
                Traje de noche formal o esmoquin para ejecutivos. Vestido largo o traje de sastrería de alta costura para ejecutivas.
              </p>
            </div>

            <div className="bg-[#0B132B] p-5 rounded-2xl border border-[#D4AF37]/30 text-center">
              <QrCode className="w-8 h-8 text-[#D4AF37] mx-auto mb-2" />
              <span className="text-xs text-[#D4AF37] font-bold uppercase block mb-1">
                Acreditación Digital Express
              </span>
              <p className="text-[11px] text-gray-300 mb-3">
                Su confirmación genera un código QR exclusivo que agiliza la entrada sin filas.
              </p>
              <button
                onClick={() => setShowQrModal(true)}
                className="bg-[#D4AF37] text-[#0B132B] text-[10px] uppercase font-bold px-4 py-2 rounded-xl hover:bg-[#FFF1CB]"
              >
                Ver Ejemplo de Pase QR
              </button>
            </div>
          </div>

        </div>

        {/* PARQUEO & VALET PARKING */}
        <div id="parqueo" className="bg-[#1C2541] p-6 rounded-3xl border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center gap-6 scroll-mt-20">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
            <Car className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <div className="text-left space-y-1">
            <h4 className="text-lg font-bold text-white">Servicio de Valet Parking & Parqueo Privado</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              El evento cuenta con servicio complementario de Valet Parking en la entrada principal del Hotel El Embajador y parqueo de dos niveles vigilado 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* QR MODAL PREVIEW */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md">
          <div className="bg-[#1C2541] border border-[#D4AF37] p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl space-y-4">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-[10px] font-bold uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> Pase VIP Acreditado
            </div>

            <h3 className="text-xl font-bold text-white">Gala de Innovación 2026</h3>
            <p className="text-xs text-gray-300">Acreditación Ejecutiva Individual</p>

            <div className="bg-white p-4 rounded-2xl border-4 border-[#D4AF37] w-48 h-48 mx-auto flex flex-col items-center justify-center gap-2 shadow-lg">
              <QrCode className="w-32 h-32 text-black" />
              <span className="text-[10px] font-mono text-black font-bold">INVIFTY-GALA-2026</span>
            </div>

            <p className="text-[11px] text-gray-400">
              Presente este código en su teléfono móvil al ingresar al Foyer Principal.
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase py-3 rounded-xl"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}

      {/* REGISTRO DE ASISTENCIA */}
      <section className="py-20 px-4 bg-[#1C2541] border-t border-[#D4AF37]/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-serif-display font-bold text-white mb-2">
            Registro de Asistencia Ejecutiva
          </h2>
          <p className="text-xs text-gray-300 mb-8">Por favor confirme su participación para la reserva de cupo y acreditación.</p>

          {rsvpSubmitted ? (
            <div className="bg-[#0B132B] border border-[#D4AF37] p-6 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-[#D4AF37] mx-auto mb-2" />
              <h3 className="font-bold text-xl text-white mb-1">¡Registro Confirmado!</h3>
              <p className="text-xs text-gray-300">Hemos procesado sus datos y enviado la confirmación vía WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="bg-[#0B132B] p-6 rounded-2xl border border-[#D4AF37]/30 text-left space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={rsvpData.fullName}
                  onChange={(e) => setRsvpData({ ...rsvpData, fullName: e.target.value })}
                  placeholder="Ej. Ing. Roberto Mendoza"
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Empresa / Institución</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Banco Caribe"
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Cargo / Posición</label>
                  <input
                    type="text"
                    required
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    placeholder="Ej. Director de Operaciones"
                    className="w-full bg-[#1C2541] border border-[#D4AF37]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Confirmación de Asistencia</label>
                <select
                  value={rsvpData.attendance}
                  onChange={(e) => setRsvpData({ ...rsvpData, attendance: e.target.value as any })}
                  className="w-full bg-[#1C2541] border border-[#D4AF37]/30 rounded-xl p-3 text-sm text-white focus:outline-none"
                >
                  <option value="Confirmado">✅ Asistiré a la Gala</option>
                  <option value="No podré asistir">❌ Excuso mi asistencia</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0B132B] font-bold text-xs uppercase py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#FFF1CB]"
              >
                <Send className="w-4 h-4" />
                Completar Registro por WhatsApp
              </button>
            </form>
          )}
        </div>
      </section>

      {/* WATERMARK FOOTER */}
      <footer className="bg-[#050811] py-8 text-center border-t border-[#D4AF37]/20">
        <a
          href={createDemoWatermarkWhatsAppUrl("Gala Empresarial Vitrexi")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#D4AF37] hover:underline"
        >
          ◆ Diseñado por Invifty — Solicitud de invitaciones digitales para eventos
        </a>
      </footer>

    </div>
  );
}
