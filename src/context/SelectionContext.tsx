import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";

interface Selection {
  /** Id del plan que el visitante eligió (`popular`, `a-medida`…). */
  planId?: string;
  /** Id/slug de la demo que le gustó. */
  demoId?: string;
}

interface SelectionContextValue extends Selection {
  selectPlan: (planId: string) => void;
  selectDemo: (demoId: string) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const STORAGE_KEY = "invifty:selection";

function readStored(): Selection {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const source = parsed as Record<string, unknown>;
    return {
      planId: typeof source.planId === "string" ? source.planId : undefined,
      demoId: typeof source.demoId === "string" ? source.demoId : undefined,
    };
  } catch {
    return {};
  }
}

/**
 * Conserva el plan y la demo que eligió el visitante.
 *
 * Vive en `sessionStorage` para que la selección sobreviva a cambios de ruta,
 * al cambio de idioma y a una recarga accidental: el recorrido real es
 * "ver una demo → mirar planes → bajar al formulario", y perder el contexto por
 * el camino obliga al visitante a repetirlo.
 *
 * Guarda identificadores, nunca datos personales.
 */
export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selection, setSelection] = useState<Selection>(() =>
    typeof window === "undefined" ? {} : readStored()
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      // sessionStorage puede fallar en modo privado; la selección es una mejora, no un requisito.
    }
  }, [selection]);

  const selectPlan = useCallback((planId: string) => {
    setSelection((prev) => ({ ...prev, planId }));
  }, []);

  const selectDemo = useCallback((demoId: string) => {
    setSelection((prev) => ({ ...prev, demoId }));
  }, []);

  const clearSelection = useCallback(() => setSelection({}), []);

  const value = useMemo(
    () => ({ ...selection, selectPlan, selectDemo, clearSelection }),
    [selection, selectPlan, selectDemo, clearSelection]
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection(): SelectionContextValue {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection debe usarse dentro de <SelectionProvider>");
  return ctx;
}
