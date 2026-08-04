import { useState } from "react";
import { buildWhatsAppUrl } from "../config";
import { MessageCircle, X, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function FloatingWhatsApp() {
  const { language } = useLanguage();
  const isEs = language === "es";
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {/* Tooltip Chat Bubble */}
      {showTooltip && (
        <div className="pointer-events-auto bg-[#161D1A] border border-gold/50 text-white rounded-2xl p-3.5 shadow-2xl max-w-[260px] animate-in slide-in-from-bottom-2 duration-300 relative group">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute -top-2 -left-2 bg-[#2A3631] hover:bg-black text-gray-300 p-0.5 rounded-full border border-gold/40 transition-colors"
            title="Cerrar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1 text-[11px] font-bold text-gold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" /> {isEs ? "Asesoría Invifty" : "Invifty Support"}
          </div>
          <p className="text-xs text-[#E8E6E1] font-light leading-snug">
            {isEs
              ? "¡Hola! 👋 ¿Tienes alguna pregunta sobre tu invitación digital? Escríbenos por WhatsApp."
              : "Hi! 👋 Any questions about your digital invitation? Message us on WhatsApp."}
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={buildWhatsAppUrl(isEs ? "Hola Invifty, me gustaría cotizar una invitación digital para mi evento." : "Hello Invifty, I would like a quote for a digital invitation for my event.")}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-r from-whatsapp to-[#128C7E] text-white flex items-center justify-center shadow-2xl shadow-whatsapp/30 hover:scale-110 active:scale-95 transition-all duration-300 group relative"
        title={isEs ? "Chat por WhatsApp" : "Chat on WhatsApp"}
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-whatsapp opacity-40 animate-ping pointer-events-none"></span>
      </a>

    </div>
  );
}
