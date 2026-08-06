import { useEffect, useState } from "react";
import { Cookie, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { trackEvent } from "../services/analytics";
import {
  AnalyticsConsent,
  getAnalyticsConsent,
  setAnalyticsConsent,
} from "../services/analytics/consent";

interface AnalyticsConsentBannerProps {
  onNavigatePrivacy: () => void;
}

export default function AnalyticsConsentBanner({
  onNavigatePrivacy,
}: AnalyticsConsentBannerProps) {
  const { language } = useLanguage();
  const [consent, setConsentState] = useState<AnalyticsConsent>("pending");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = getAnalyticsConsent();
    setConsentState(stored);
    setIsOpen(stored === "pending");
  }, []);

  const choose = (choice: "accepted" | "rejected") => {
    setAnalyticsConsent(choice);
    setConsentState(choice);
    setIsOpen(false);

    // La vista inicial ocurrió antes de que GA4 pudiera cargar. Al aceptar,
    // la registramos una sola vez para no perder la sesión de entrada.
    if (choice === "accepted") {
      window.setTimeout(() => {
        trackEvent("page_view", {
          page_path: window.location.pathname,
          language,
        });
      }, 0);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[70] inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-black/85 px-3.5 py-2 text-[11px] font-semibold text-white/75 shadow-xl backdrop-blur-md transition hover:border-gold/60 hover:text-gold"
        aria-label={language === "es" ? "Gestionar preferencias de cookies" : "Manage cookie preferences"}
      >
        <Cookie className="h-3.5 w-3.5" aria-hidden="true" />
        {language === "es" ? "Cookies" : "Cookies"}
      </button>
    );
  }

  return (
    <aside
      className="fixed inset-x-3 bottom-3 z-[80] mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-[#111410]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:bottom-5 sm:p-6"
      aria-label={language === "es" ? "Preferencias de privacidad" : "Privacy preferences"}
    >
      {consent !== "pending" && (
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          aria-label={language === "es" ? "Cerrar" : "Close"}
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-gold/10 p-2 text-gold">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-lg text-white">
            {language === "es" ? "Tu privacidad importa" : "Your privacy matters"}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-white/65 sm:text-sm">
            {language === "es"
              ? "Usamos Google Analytics para entender qué páginas y diseños interesan más. Solo se activa si aceptas; nunca enviamos nombres, teléfonos ni mensajes personales."
              : "We use Google Analytics to understand which pages and designs are most useful. It only activates if you accept; we never send names, phone numbers or personal messages."}
          </p>
          <button
            type="button"
            onClick={onNavigatePrivacy}
            className="mt-2 text-xs font-semibold text-gold underline-offset-4 hover:underline"
          >
            {language === "es" ? "Leer la política de privacidad" : "Read the privacy policy"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="min-h-11 rounded-xl border border-white/20 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
        >
          {language === "es" ? "Rechazar analítica" : "Reject analytics"}
        </button>
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="min-h-11 rounded-xl bg-gold px-5 py-2.5 text-xs font-bold text-black transition hover:bg-gold-hover"
        >
          {language === "es" ? "Aceptar analítica" : "Accept analytics"}
        </button>
      </div>
    </aside>
  );
}

