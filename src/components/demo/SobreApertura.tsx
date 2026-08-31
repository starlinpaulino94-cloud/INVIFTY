import { useEffect, useState } from "react";
import { EsquinaBotanica } from "./Botanica";

/**
 * APERTURA DE SOBRE
 * =================
 * Portada de la invitación: un sobre de papel cerrado con sello de lacre.
 * Al tocarlo, el sello se funde, la solapa gira hacia atrás, la tarjeta
 * sale del sobre y la escena se desvanece para revelar la invitación.
 *
 * Construido solo con CSS (clip-path + transforms): sin librerías, sin
 * imágenes. Con `prefers-reduced-motion` la apertura es inmediata.
 */

interface SobreAperturaProps {
  /** Iniciales del sello, ya compuestas (ej. C & L con la "&" caligráfica). */
  sello: React.ReactNode;
  /** Nombres que aparecen en la tarjeta que sale del sobre. */
  titulo: React.ReactNode;
  /** Línea pequeña sobre los nombres (ej. "NUESTRA BODA"). */
  antetitulo: string;
  /** Línea bajo los nombres (ej. la fecha). */
  fecha: string;
  /** Texto guía bajo el sobre. */
  indicacion: string;
  /** Se llama cuando la animación termina y hay que revelar la invitación. */
  onAbierto: () => void;
  /** Paleta del sobre. */
  colores?: {
    fondo: string;
    papel: string;
    papelOscuro: string;
    interior: string;
    acento: string;
    tinta: string;
  };
}

const COLORES_BODA = {
  fondo: "#101713",
  papel: "#F3EDE0",
  papelOscuro: "#E9E1CF",
  interior: "#DDD2BB",
  acento: "#B3924F",
  tinta: "#2E2A24",
};

type Fase = "cerrado" | "abriendo" | "saliendo" | "desvaneciendo";

function movimientoReducido(): boolean {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function SobreApertura({
  sello,
  titulo,
  antetitulo,
  fecha,
  indicacion,
  onAbierto,
  colores = COLORES_BODA,
}: SobreAperturaProps) {
  const [fase, setFase] = useState<Fase>("cerrado");
  const c = colores;

  // Mientras el sobre está en pantalla, la página de atrás no se desplaza.
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, []);

  const abrir = () => {
    if (fase !== "cerrado") return;
    if (movimientoReducido()) {
      onAbierto();
      return;
    }
    setFase("abriendo");
    window.setTimeout(() => setFase("saliendo"), 700);
    window.setTimeout(() => setFase("desvaneciendo"), 1500);
    window.setTimeout(onAbierto, 2150);
  };

  const abierto = fase !== "cerrado";
  const saliendo = fase === "saliendo" || fase === "desvaneciendo";

  return (
    <div
      className={`fixed inset-0 z-[70] flex flex-col items-center justify-center px-6 transition-opacity duration-700 ${
        fase === "desvaneciendo" ? "opacity-0" : "opacity-100"
      }`}
      style={{ background: c.fondo }}
      role="dialog"
      aria-label={antetitulo}
    >
      {/* Ornamentos botánicos en las esquinas del telón */}
      <EsquinaBotanica className="absolute top-6 left-4 w-24 h-24 sm:w-32 sm:h-32" style={{ color: c.papel, opacity: 0.22 }} />
      <EsquinaBotanica className="absolute top-6 right-4 w-24 h-24 sm:w-32 sm:h-32 -scale-x-100" style={{ color: c.papel, opacity: 0.22 }} />
      <EsquinaBotanica className="absolute bottom-6 right-4 w-24 h-24 sm:w-32 sm:h-32 rotate-180" style={{ color: c.papel, opacity: 0.22 }} />
      <EsquinaBotanica className="absolute bottom-6 left-4 w-24 h-24 sm:w-32 sm:h-32 rotate-180 -scale-x-100" style={{ color: c.papel, opacity: 0.22 }} />

      <button
        type="button"
        onClick={abrir}
        aria-label={indicacion}
        className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 rounded-lg"
        style={{ width: "min(88vw, 420px)", height: "min(62vw, 296px)", perspective: "1400px" }}
      >
        {/* Cuerpo trasero del sobre */}
        <span className="absolute inset-0 rounded-lg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]" style={{ background: c.papelOscuro }} aria-hidden="true"></span>

        {/* Interior visible al abrirse */}
        <span className="absolute inset-0 rounded-lg" style={{ background: c.interior }} aria-hidden="true"></span>

        {/* Tarjeta que sale del sobre */}
        <span
          className={`absolute left-4 right-4 rounded-md flex flex-col items-center justify-center text-center px-4 transition-all ease-out ${
            saliendo ? "duration-[800ms] z-40" : "duration-500 z-[5]"
          }`}
          style={{
            top: "6%",
            bottom: "8%",
            background: "#FCFAF5",
            boxShadow: saliendo ? "0 24px 60px -18px rgba(0,0,0,0.55)" : "none",
            transform: saliendo ? "translateY(-58%) scale(1.04)" : "translateY(0) scale(1)",
          }}
          aria-hidden="true"
        >
          <span className="text-[9px] font-sans-clean uppercase tracking-[0.4em] font-semibold mb-2.5" style={{ color: c.acento }}>
            {antetitulo}
          </span>
          <span className="font-cormorant text-3xl sm:text-4xl leading-tight" style={{ color: c.tinta }}>
            {titulo}
          </span>
          <span className="block h-px w-16 my-3" style={{ background: `${c.acento}80` }}></span>
          <span className="text-[10px] font-sans-clean uppercase tracking-[0.3em]" style={{ color: c.tinta, opacity: 0.65 }}>
            {fecha}
          </span>
        </span>

        {/* Solapas laterales */}
        <span className="absolute inset-0 rounded-lg z-10" style={{ background: c.papel, clipPath: "polygon(0 0, 50% 52%, 0 100%)" }} aria-hidden="true"></span>
        <span className="absolute inset-0 rounded-lg z-10" style={{ background: c.papel, clipPath: "polygon(100% 0, 50% 52%, 100% 100%)" }} aria-hidden="true"></span>

        {/* Solapa inferior */}
        <span
          className="absolute inset-0 rounded-lg z-20"
          style={{
            background: `linear-gradient(to bottom, ${c.papelOscuro}, ${c.papel})`,
            clipPath: "polygon(0 100%, 50% 42%, 100% 100%)",
            filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.08))",
          }}
          aria-hidden="true"
        ></span>

        {/* Solapa superior: gira hacia atrás al abrir */}
        <span
          className={`absolute top-0 left-0 right-0 transition-transform duration-700 ease-in-out ${abierto ? "z-0" : "z-30"}`}
          style={{
            height: "56%",
            transformOrigin: "top center",
            transformStyle: "preserve-3d",
            transform: abierto ? "rotateX(178deg)" : "rotateX(0deg)",
          }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${c.papel}, ${c.papelOscuro})`,
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              borderRadius: "8px 8px 0 0",
              filter: "drop-shadow(0 3px 4px rgba(0,0,0,0.12))",
            }}
          ></span>
        </span>

        {/* Sello de lacre sobre la punta de la solapa */}
        <span
          className={`absolute left-1/2 z-40 flex items-center justify-center rounded-full transition-all duration-300 ${
            abierto ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
          style={{
            top: "56%",
            width: "72px",
            height: "72px",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle at 35% 30%, ${c.acento}, #8A6D38)`,
            boxShadow: "0 6px 16px rgba(0,0,0,0.35), inset 0 0 0 3px rgba(255,255,255,0.12)",
            color: "#F7F1E2",
          }}
          aria-hidden="true"
        >
          {sello}
        </span>
      </button>

      {/* Indicación bajo el sobre */}
      <p
        className={`mt-10 text-[11px] font-sans-clean uppercase tracking-[0.35em] text-center transition-opacity duration-500 ${
          abierto ? "opacity-0" : "opacity-100 animate-pulse"
        }`}
        style={{ color: `${c.papel}B3`, animationDuration: "2600ms" }}
      >
        {indicacion}
      </p>
    </div>
  );
}
