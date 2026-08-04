import { MessageCircle } from "lucide-react";

interface DemoRsvpNoticeProps {
  /** Idioma activo de la demo. */
  isEs: boolean;
  /** Fondo sobre el que se muestra, para mantener el contraste legible. */
  tone?: "light" | "dark";
}

/**
 * Aviso honesto tras enviar el RSVP de una DEMO.
 *
 * Las demos no tienen backend: el formulario únicamente abre WhatsApp con el
 * mensaje redactado. Este aviso lo dice de forma explícita.
 *
 * Es deliberado que NO diga "confirmación guardada", "registrado" ni nada que
 * sugiera que los datos quedaron almacenados en algún sitio: en una muestra
 * pública eso sería engañoso para el visitante.
 */
export default function DemoRsvpNotice({ isEs, tone = "light" }: DemoRsvpNoticeProps) {
  const isDark = tone === "dark";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-left ${
        isDark
          ? "border-gold/40 bg-gold/10 text-white/80"
          : "border-[#1C2621]/20 bg-[#1C2621]/5 text-[#1C2621]"
      }`}
    >
      <MessageCircle
        className={`mt-0.5 h-4 w-4 shrink-0 ${isDark ? "text-gold" : "text-[#1C2621]"}`}
        aria-hidden="true"
      />
      <p className="text-[11px] leading-relaxed">
        {isEs ? (
          <>
            <strong className="font-semibold">Se abrió WhatsApp</strong> con tu confirmación
            redactada. Envía el mensaje para que llegue.{" "}
            <span className="opacity-75">
              Esto es una muestra: los datos no se guardan en ningún sistema.
            </span>
          </>
        ) : (
          <>
            <strong className="font-semibold">WhatsApp opened</strong> with your RSVP already
            written. Send the message so it reaches the host.{" "}
            <span className="opacity-75">
              This is a sample: no data is stored anywhere.
            </span>
          </>
        )}
      </p>
    </div>
  );
}
