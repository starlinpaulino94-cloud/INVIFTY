import { CSSProperties } from "react";

/**
 * ORNAMENTOS BOTÁNICOS
 * ====================
 * Ilustraciones vectoriales de línea fina para las invitaciones: ramas de
 * olivo, esquinas florales y separadores. Dibujadas a mano en SVG para que
 * pesen casi nada, hereden el color por `currentColor` y se vean nítidas a
 * cualquier tamaño. Son decorativas: siempre van con `aria-hidden`.
 */

interface OrnamentoProps {
  className?: string;
  style?: CSSProperties;
}

/** Rama de olivo horizontal: tallo curvo con pares de hojas alargadas. */
export function Rama({ className = "w-24 h-6", style }: OrnamentoProps) {
  return (
    <svg viewBox="0 0 120 26" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M4 16 C34 10 74 9 116 14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Hojas superiores */}
      <path d="M22 13 C24 6 30 3 35 4 C33 10 28 13 22 13 Z" fill="currentColor" opacity="0.85" />
      <path d="M46 11 C48 4 54 1 59 2 C57 8 52 11 46 11 Z" fill="currentColor" opacity="0.85" />
      <path d="M72 10 C74 3 80 0 85 1 C83 7 78 10 72 10 Z" fill="currentColor" opacity="0.85" />
      <path d="M96 11 C98 5 103 2 108 3 C106 9 101 11 96 11 Z" fill="currentColor" opacity="0.85" />
      {/* Hojas inferiores */}
      <path d="M32 15 C30 21 24 24 19 23 C21 18 26 15 32 15 Z" fill="currentColor" opacity="0.6" />
      <path d="M58 13 C56 19 50 22 45 21 C47 16 52 13 58 13 Z" fill="currentColor" opacity="0.6" />
      <path d="M84 13 C82 19 76 22 71 21 C73 16 78 13 84 13 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/**
 * Esquina botánica: rama que nace del ángulo con hojas y una flor pequeña.
 * Pensada para las esquinas del hero o de una sección; se rota con clases
 * (`rotate-90`, `-scale-x-100`…) según la esquina donde se coloque.
 */
export function EsquinaBotanica({ className = "w-28 h-28", style }: OrnamentoProps) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M6 6 C30 20 44 40 52 68 M6 6 C24 12 46 16 74 14" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Hojas de la rama descendente */}
      <path d="M22 22 C29 18 36 19 40 24 C33 27 26 26 22 22 Z" fill="currentColor" opacity="0.75" />
      <path d="M34 38 C41 35 48 37 51 42 C44 45 37 43 34 38 Z" fill="currentColor" opacity="0.6" />
      <path d="M44 56 C51 54 57 57 59 62 C52 64 46 61 44 56 Z" fill="currentColor" opacity="0.45" />
      {/* Hojas de la rama horizontal */}
      <path d="M30 12 C34 5 41 3 47 5 C43 11 36 14 30 12 Z" fill="currentColor" opacity="0.75" />
      <path d="M52 13 C56 7 63 5 68 7 C65 13 58 15 52 13 Z" fill="currentColor" opacity="0.55" />
      {/* Flor de cinco pétalos */}
      <g opacity="0.9">
        <circle cx="16" cy="16" r="3.2" fill="currentColor" opacity="0.5" />
        <circle cx="16" cy="8.5" r="3" fill="currentColor" />
        <circle cx="23" cy="13.5" r="3" fill="currentColor" />
        <circle cx="20.5" cy="21.5" r="3" fill="currentColor" />
        <circle cx="11.5" cy="21.5" r="3" fill="currentColor" />
        <circle cx="9" cy="13.5" r="3" fill="currentColor" />
      </g>
    </svg>
  );
}

/** Brote pequeño vertical, para cerrar secciones o acompañar títulos. */
export function Brote({ className = "w-6 h-10", style }: OrnamentoProps) {
  return (
    <svg viewBox="0 0 24 40" fill="none" className={className} style={style} aria-hidden="true">
      <path d="M12 38 C12 24 12 14 12 4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M12 12 C7 10 4 6 4 1 C9 2 12 6 12 12 Z" fill="currentColor" opacity="0.85" />
      <path d="M12 12 C17 10 20 6 20 1 C15 2 12 6 12 12 Z" fill="currentColor" opacity="0.85" />
      <path d="M12 24 C8 22 5 19 5 14 C10 15 12 19 12 24 Z" fill="currentColor" opacity="0.6" />
      <path d="M12 24 C16 22 19 19 19 14 C14 15 12 19 12 24 Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

type Variante = "rama" | "diamante" | "estrella";

interface SeparadorProps {
  /** Motivo central del separador. */
  variante?: Variante;
  /** Color del ornamento (hereda por defecto). */
  className?: string;
}

/**
 * Separador de sección: línea fina — motivo — línea fina.
 * Tres motivos para no repetir siempre el mismo: rama de olivo,
 * rombo y destello.
 */
export function SeparadorBotanico({ variante = "diamante", className = "text-[#B3924F]" }: SeparadorProps) {
  return (
    <div className={`flex items-center justify-center gap-4 py-1 ${className}`} aria-hidden="true">
      <span className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to right, transparent, currentColor)" , opacity: 0.5 }} />
      {variante === "rama" && <Rama className="w-20 h-5 shrink-0" />}
      {variante === "diamante" && <span className="block w-1.5 h-1.5 rotate-45 border border-current" />}
      {variante === "estrella" && <span className="text-sm leading-none">✦</span>}
      <span className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to left, transparent, currentColor)", opacity: 0.5 }} />
    </div>
  );
}
