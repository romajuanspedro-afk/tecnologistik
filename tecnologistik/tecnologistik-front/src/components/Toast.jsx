import { createContext, useCallback, useContext, useRef, useState } from 'react';

const ToastContext = createContext(null);

const ESTILOS = {
  success: {
    borde: 'border-emerald-200',
    icono: '✓',
    iconoBg: 'bg-emerald-500',
  },
  error: {
    borde: 'border-rose-200',
    icono: '✕',
    iconoBg: 'bg-rose-500',
  },
  info: {
    borde: 'border-slate-200',
    icono: 'i',
    iconoBg: 'bg-slate-900',
  },
};

const DURACION_MS = 4500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const contadorRef = useRef(0);

  const quitar = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const mostrar = useCallback(
    (mensaje, tipo = 'info') => {
      const id = ++contadorRef.current;
      setToasts((prev) => [...prev, { id, mensaje, tipo }]);
      setTimeout(() => quitar(id), DURACION_MS);
      return id;
    },
    [quitar]
  );

  const api = {
    success: (mensaje) => mostrar(mensaje, 'success'),
    error: (mensaje) => mostrar(mensaje, 'error'),
    info: (mensaje) => mostrar(mensaje, 'info'),
  };

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-[calc(100vw-2.5rem)] max-w-sm">
        {toasts.map((t) => {
          const estilo = ESTILOS[t.tipo] || ESTILOS.info;
          return (
            <div
              key={t.id}
              role="status"
              className={`flex items-start gap-3 bg-white border ${estilo.borde} rounded-2xl shadow-xl px-4 py-3.5 animate-[toast-in_0.25s_ease-out]`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-full ${estilo.iconoBg} text-white text-xs font-black flex items-center justify-center mt-0.5`}
              >
                {estilo.icono}
              </span>

              <p className="text-sm text-slate-800 font-semibold leading-snug flex-1">
                {t.mensaje}
              </p>

              <button
                onClick={() => quitar(t.id)}
                aria-label="Cerrar"
                className="shrink-0 text-slate-300 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast debe usarse dentro de <ToastProvider>');
  }
  return ctx;
}
