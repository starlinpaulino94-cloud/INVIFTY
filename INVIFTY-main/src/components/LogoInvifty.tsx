/**
 * LOGO OFICIAL DE INVIFTY
 * =======================
 * Monograma "IV" en círculo ornamental dorado, recreado como vector a
 * partir del arte original de la marca. Al ser SVG en línea se ve
 * nítido a cualquier tamaño, con fondo transparente sobre el sitio
 * oscuro, y el degradado metálico se renderiza igual en todos los
 * navegadores.
 */

interface LogoInviftyProps {
  className?: string;
  /** id único si el logo aparece más de una vez en la página (evita colisión de gradientes). */
  idSufijo?: string;
}

export default function LogoInvifty({ className = "w-10 h-auto", idSufijo = "a" }: LogoInviftyProps) {
  const oro = `oro-${idSufijo}`;
  const oroLetra = `oroLetra-${idSufijo}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 296"
      className={className}
      role="img"
      aria-label="Invifty"
    >
      <defs>
        <linearGradient id={oro} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E27A" />
          <stop offset="0.32" stopColor="#D9B54A" />
          <stop offset="0.52" stopColor="#A67C1E" />
          <stop offset="0.72" stopColor="#E8C766" />
          <stop offset="1" stopColor="#8C6D1F" />
        </linearGradient>
        <linearGradient id={oroLetra} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F2D98C" />
          <stop offset="0.45" stopColor="#C99B32" />
          <stop offset="0.65" stopColor="#8C6D1F" />
          <stop offset="1" stopColor="#E8C766" />
        </linearGradient>
      </defs>

      {/* Doble círculo */}
      <circle cx="120" cy="150" r="97" fill="none" stroke={`url(#${oro})`} strokeWidth="3.5" />
      <circle cx="120" cy="150" r="89" fill="none" stroke={`url(#${oro})`} strokeWidth="1.8" />

      {/* Penacho superior */}
      <path d="M120 14 L128 26 L120 38 L112 26 Z" fill={`url(#${oro})`} />
      <path d="M120 40 C125 47 125 56 120 62 C115 56 115 47 120 40 Z" fill={`url(#${oro})`} />
      <path d="M117 63 C104 46 82 44 72 56 C68 61 70 68 76 68 C81 68 83 62 79 59" fill="none" stroke={`url(#${oro})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M123 63 C136 46 158 44 168 56 C172 61 170 68 164 68 C159 68 157 62 161 59" fill="none" stroke={`url(#${oro})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M118 64 C108 56 96 55 88 60" fill="none" stroke={`url(#${oro})`} strokeWidth="2" strokeLinecap="round" />
      <path d="M122 64 C132 56 144 55 152 60" fill="none" stroke={`url(#${oro})`} strokeWidth="2" strokeLinecap="round" />

      {/* Voluta inferior */}
      <path d="M96 250 C104 259 136 259 144 250" fill="none" stroke={`url(#${oro})`} strokeWidth="3" strokeLinecap="round" />
      <path d="M96 250 C90 243 80 245 80 252 C80 258 88 260 92 256" fill="none" stroke={`url(#${oro})`} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M144 250 C150 243 160 245 160 252 C160 258 152 260 148 256" fill="none" stroke={`url(#${oro})`} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M120 262 L127 272 L120 282 L113 272 Z" fill={`url(#${oro})`} />

      {/* Monograma IV */}
      <path d="M67 105 H97 V111 L86 113 V187 L97 189 V195 H67 V189 L78 187 V113 L67 111 Z" fill={`url(#${oroLetra})`} />
      <path d="M101 105 H133 V111 L125 113 L143 172 L159 113 L151 111 V105 H177 V111 L169 113 L146 195 H138 L109 113 L101 111 Z" fill={`url(#${oroLetra})`} />
    </svg>
  );
}
