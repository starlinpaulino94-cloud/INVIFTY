import { useState, useRef } from "react";
import { 
  X, QrCode, Sparkles, Download, Share2, CheckCircle2, 
  ShieldCheck, Award, User, Building, MapPin, Calendar, 
  Clock, Check, RefreshCw, Zap, Lock, CreditCard
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface VipPassModalProps {
  eventName?: string;
  eventType?: "boda" | "corporativo" | "quince" | "general";
  defaultGuestName?: string;
  tableNumber?: string;
  eventDate?: string;
  eventLocation?: string;
  onClose: () => void;
}

export default function VipPassModal({
  eventName = "Gala Anual de Innovación & Elegancia 2026",
  eventType = "corporativo",
  defaultGuestName = "Lic. Alejandro Mendoza",
  tableNumber = "Mesa VIP #04",
  eventDate = "28 de Octubre, 2026 — 7:30 PM",
  eventLocation = "Hotel El Embajador, Santo Domingo",
  onClose
}: VipPassModalProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  const [guestName, setGuestName] = useState(defaultGuestName);
  const [guestTable, setGuestTable] = useState(tableNumber);
  const [passType, setPassType] = useState<"VIP Executive" | "Guest Pass" | "Acceso Total" | "Mesa de Honor">("VIP Executive");
  const [passCode] = useState(() => `INV-${Math.floor(100000 + Math.random() * 900000)}`);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<"idle" | "valid" | "expired">("idle");
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate QR code URL dynamically based on guest details & pass code
  const qrPayload = JSON.stringify({
    passId: passCode,
    event: eventName,
    guest: guestName,
    table: guestTable,
    type: passType,
    status: "VALIDATED_ONLINE"
  });

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrPayload)}&color=000000&bgcolor=ffffff`;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult("idle");
    setTimeout(() => {
      setIsScanning(false);
      setScanResult("valid");
    }, 1800);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(`PASE VIP: ${eventName} | Invitado: ${guestName} | Código: ${passCode}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn select-none">
      
      {/* Outer Card Wrapper */}
      <div className="bg-[#121212] border border-[#D4AF37]/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-[0_25px_70px_-15px_rgba(212,175,55,0.3)] my-auto">
        
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            {isEs ? "Acreditación Digital Segura" : "Secure Digital Pass"}
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            {isEs ? "Pase VIP Personalizado con Código QR" : "Personalized VIP QR Pass"}
          </h3>
          
          <p className="text-xs text-white/50 font-light italic mt-1">
            {isEs 
              ? "Control de acceso exclusivo e interactivo para tus invitados de honor."
              : "Interactive digital pass for door check-in and exclusive guest access."}
          </p>
        </div>

        {/* VIP PASS CARD DISPLAY (PHYSICAL METALLIC LOOK) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1F1C18] via-[#121110] to-[#0A0A0A] border-2 border-[#D4AF37] shadow-2xl overflow-hidden mb-8 group">
          
          {/* Holographic Metallic Overlay */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-bl from-[#D4AF37]/20 via-[#F2D06B]/10 to-transparent rounded-full filter blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#D4AF37]/10 rounded-full filter blur-xl pointer-events-none"></div>

          {/* Pass Top Bar */}
          <div className="flex items-start justify-between gap-4 mb-6 relative z-10 border-b border-white/10 pb-4">
            <div>
              <span className="text-[9px] uppercase tracking-[0.3em] font-bold text-[#D4AF37] block mb-0.5">
                PASE DE ACCESO OFICIAL • {passCode}
              </span>
              <h4 className="font-serif text-lg sm:text-xl text-white font-medium leading-tight">
                {eventName}
              </h4>
            </div>

            <div className="bg-[#D4AF37] text-black text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-black" />
              {passType}
            </div>
          </div>

          {/* Main Card Content Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center relative z-10">
            
            {/* Left 2 Cols: Guest Info */}
            <div className="sm:col-span-2 space-y-4">
              
              <div>
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">
                  {isEs ? "Nombre del Invitado" : "Guest Name"}
                </span>
                <div className="font-serif text-xl sm:text-2xl text-white font-medium text-[#D4AF37] tracking-wide">
                  {guestName || (isEs ? "Nombre de Invitado" : "Guest Name")}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5 text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                    {isEs ? "Ubicación / Mesa" : "Seat / Table"}
                  </span>
                  <span className="text-white font-semibold">{guestTable || "General VIP"}</span>
                </div>

                <div>
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block">
                    {isEs ? "Estado" : "Status"}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {isEs ? "Confirmado" : "Confirmed"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-white/60 font-light">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#D4AF37]" />
                  <span>{eventDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{eventLocation}</span>
                </div>
              </div>

            </div>

            {/* Right Col: Dynamic QR Code Box */}
            <div className="flex flex-col items-center justify-center bg-white p-3.5 rounded-2xl border border-[#D4AF37]/50 shadow-inner">
              <img 
                src={qrImageUrl} 
                alt="QR Code Pass" 
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain rounded-lg"
              />
              <span className="text-[8px] font-mono text-black font-bold uppercase tracking-widest mt-1.5">
                ESCANEAR EN ENTRADA
              </span>
            </div>

          </div>

          {/* Pass Footer Shield */}
          <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 relative z-10">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              {isEs ? "Código Criptográfico Único — Antifraude" : "Encrypted Anti-Fraud Pass"}
            </span>
            <span className="font-mono text-[#D4AF37]">INVIFTY VIP SYSTEM</span>
          </div>

        </div>

        {/* INTERACTIVE CUSTOMIZER CONTROLS */}
        <div className="bg-[#0A0A0A] p-4 sm:p-5 rounded-2xl border border-white/10 mb-6 space-y-4">
          <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-2">
            {isEs ? "Personalizar Nombre para Prueba:" : "Personalize Guest Name for Testing:"}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-white/50 block mb-1">
                {isEs ? "Nombre y Apellido" : "Full Name"}
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Ej: Dra. Carmen Morales"
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-[10px] text-white/50 block mb-1">
                {isEs ? "Mesa o Asignación" : "Table / Seat"}
              </label>
              <input
                type="text"
                value={guestTable}
                onChange={(e) => setGuestTable(e.target.value)}
                placeholder="Ej: Mesa Imperial #01"
                className="w-full bg-[#151515] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>
        </div>

        {/* CHECK-IN SCANNER SIMULATOR BUTTON & FEEDBACK */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#151515] p-4 rounded-2xl border border-white/10">
          
          <div>
            <span className="text-xs font-semibold text-white block">
              {isEs ? "Simulador de Escaneo en Puerta" : "Door Check-in Scanner Simulator"}
            </span>
            <p className="text-[10px] text-white/40">
              {isEs 
                ? "Prueba cómo el recepcionista del evento validará esta entrada en tiempo real."
                : "Test how event staff will scan & validate this pass at reception."}
            </p>
          </div>

          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F2D06B] transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                {isEs ? "Verificando QR..." : "Scanning QR..."}
              </>
            ) : (
              <>
                <QrCode className="w-4 h-4 text-black" />
                {isEs ? "Simular Escaneo" : "Simulate Scan"}
              </>
            )}
          </button>

        </div>

        {/* SCAN RESULT BANNER */}
        {scanResult === "valid" && (
          <div className="mt-3 bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl text-center text-emerald-300 text-xs animate-fadeIn flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-left">
              <strong className="block text-emerald-200 text-sm font-bold">
                ¡PASE VÁLIDO & AUTORIZADO!
              </strong>
              <span>
                {guestName} • {guestTable} • Código: {passCode} — Entrada registrada correctamente.
              </span>
            </div>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={handleCopyPass}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#0A0A0A] border border-white/10 hover:border-white/30 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            {copiedLink ? <Check className="w-4 h-4 text-[#D4AF37]" /> : <Share2 className="w-4 h-4" />}
            {copiedLink ? (isEs ? "¡Pase Copiado!" : "Pass Copied!") : (isEs ? "Compartir Pase" : "Share Pass")}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#D4AF37] text-black font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-[#F2D06B] transition-colors"
          >
            {isEs ? "Entendido / Cerrar" : "Got it / Close"}
          </button>
        </div>

      </div>

    </div>
  );
}
