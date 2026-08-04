import { useState } from "react";
import { CONFIG } from "../config";
import { AlertCircle, X } from "lucide-react";

export default function WhatsAppChangeNotice() {
  const [dismissed, setDismissed] = useState(false);
  const isPending = CONFIG.rawWhatsappNumber === "NUMERO_PENDIENTE";

  if (dismissed || !isPending) return null;

  return (
    <div className="bg-gradient-to-r from-[#2A2315] via-[#3A2F1A] to-[#2A2315] border-b border-gold/40 text-[#FFF1CB] text-xs md:text-sm py-2.5 px-4 relative z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-gold shrink-0 animate-pulse" />
          <span>
            <strong className="font-semibold text-white">Aviso para Administrador:</strong> El número de WhatsApp está en modo borrador (<code>NUMERO_PENDIENTE</code>). Edita el archivo <code className="bg-black/40 px-1.5 py-0.5 rounded text-gold font-mono">src/config.ts</code> para colocar tu número real de WhatsApp.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white p-1 transition-colors rounded-full hover:bg-white/10 shrink-0"
          title="Cerrar aviso"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
