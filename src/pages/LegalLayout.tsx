import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LegalLayoutProps {
  titleEs: string;
  titleEn: string;
  updatedEs: string;
  updatedEn: string;
  onBackToHome: () => void;
  children: ReactNode;
}

export default function LegalLayout({ titleEs, titleEn, updatedEs, updatedEn, onBackToHome, children }: LegalLayoutProps) {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <div className="min-h-screen bg-surface text-ink-soft font-sans-clean">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold hover:text-gold-hover transition-colors mb-10 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEs ? "Volver a Invifty" : "Back to Invifty"}
        </button>

        <span className="text-[11px] uppercase tracking-[0.4em] text-gold block mb-3 font-semibold">
          {isEs ? "Documento Legal" : "Legal Document"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white mb-3">
          {isEs ? titleEs : titleEn}
        </h1>
        <p className="text-white/60 text-xs italic font-light mb-12">
          {isEs ? updatedEs : updatedEn}
        </p>

        <div className="space-y-10 text-sm text-white/70 font-light leading-relaxed [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-white [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
          {children}
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-xs text-white/60 font-light italic">
          {isEs
            ? "¿Preguntas sobre este documento? Escríbenos a hola@invifty.com o por WhatsApp."
            : "Questions about this document? Write to hola@invifty.com or reach us on WhatsApp."}
        </div>
      </div>
    </div>
  );
}
