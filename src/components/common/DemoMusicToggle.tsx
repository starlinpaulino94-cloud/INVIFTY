import { Volume2, VolumeX } from "lucide-react";

interface DemoMusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
  isEs: boolean;
  /** Clases del botón, para que cada demo conserve su paleta. */
  className: string;
  /** Texto visible en escritorio cuando suena. */
  labelOn: string;
  /** Texto visible en escritorio cuando está en silencio. */
  labelOff: string;
}

/**
 * Control de audio de las demos.
 *
 * Existe para que el control cumpla tres reglas en todas las demos por igual:
 *  - La música SIEMPRE arranca apagada; sólo suena tras pulsar este botón.
 *  - El control es persistente y siempre visible (posición fija).
 *  - Es accesible: tiene nombre para lectores de pantalla y comunica su estado
 *    con `aria-pressed`, no sólo con el color del icono.
 *
 * El área táctil mínima es de 44×44 px, el tamaño recomendado para acciones
 * móviles.
 */
export default function DemoMusicToggle({
  isPlaying,
  onToggle,
  isEs,
  className,
  labelOn,
  labelOff,
}: DemoMusicToggleProps) {
  const accessibleLabel = isPlaying
    ? isEs
      ? "Silenciar la música"
      : "Mute the music"
    : isEs
      ? "Reproducir la música"
      : "Play the music";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isPlaying}
      aria-label={accessibleLabel}
      className={`min-h-[44px] min-w-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold ${className}`}
    >
      {isPlaying ? (
        <Volume2 className="w-4 h-4" aria-hidden="true" />
      ) : (
        <VolumeX className="w-4 h-4" aria-hidden="true" />
      )}
      <span className="hidden md:inline">{isPlaying ? labelOn : labelOff}</span>
    </button>
  );
}
