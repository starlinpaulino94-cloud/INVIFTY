import { Home, MessageCircle, Compass } from "lucide-react";
import { buildWhatsAppUrl } from "../config";

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export default function NotFoundPage({ onBackToHome }: NotFoundPageProps) {
  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#EAEAEA] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center py-20">
        <Compass className="w-12 h-12 text-[#D4AF37]/60 mx-auto mb-6" />

        <span className="text-[11px] uppercase tracking-[0.4em] text-[#D4AF37] block mb-3 font-semibold">
          Error 404
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-white mb-4">
          Página no <span className="italic font-light text-[#D4AF37]">encontrada</span>
        </h1>

        <p className="text-white/50 text-sm font-light italic mb-10 max-w-sm mx-auto">
          El enlace que buscas no existe o la invitación ya no está disponible.
          Si recibiste este enlace en una invitación, verifica que esté escrito completo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#F2D06B] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            <Home className="w-4 h-4" />
            Ir al Inicio
          </button>

          <a
            href={buildWhatsAppUrl("Hola Invifty, un enlace de invitación no me funciona. ¿Me pueden ayudar?")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            <MessageCircle className="w-4 h-4" />
            Pedir Ayuda por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
