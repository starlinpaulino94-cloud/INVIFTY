import { Home, MessageCircle, Compass } from "lucide-react";
import { buildWhatsAppUrl } from "../config";
import { useLanguage } from "../context/LanguageContext";

interface NotFoundPageProps {
  onBackToHome: () => void;
}

export default function NotFoundPage({ onBackToHome }: NotFoundPageProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className="min-h-screen bg-surface text-ink-soft flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center py-20">
        <Compass className="w-12 h-12 text-gold/60 mx-auto mb-6" />

        <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
          Error 404
        </span>

        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-white mb-4">
          {isEs ? "Página no " : "Page not "}
          <span className="italic font-light text-gold">{isEs ? "encontrada" : "found"}</span>
        </h1>

        <p className="text-white/50 text-sm font-light italic mb-10 max-w-sm mx-auto">
          {isEs
            ? "El enlace que buscas no existe o la invitación ya no está disponible. Si recibiste este enlace en una invitación, verifica que esté escrito completo."
            : "The link you're looking for doesn't exist or the invitation is no longer available. If you received this link in an invitation, check that it was typed in full."}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onBackToHome}
            className="w-full sm:w-auto px-8 py-4 bg-gold text-black font-semibold text-xs uppercase tracking-widest hover:bg-gold-hover active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            <Home className="w-4 h-4" />
            {isEs ? "Ir al Inicio" : "Go Home"}
          </button>

          <a
            href={buildWhatsAppUrl(isEs ? "Hola Invifty, un enlace de invitación no me funciona. ¿Me pueden ayudar?" : "Hello Invifty, an invitation link is not working for me. Can you help?")}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold text-xs uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[48px] touch-manipulation"
          >
            <MessageCircle className="w-4 h-4" />
            {isEs ? "Pedir Ayuda por WhatsApp" : "Get Help on WhatsApp"}
          </a>
        </div>
      </div>
    </div>
  );
}
