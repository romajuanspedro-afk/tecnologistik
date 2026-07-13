import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ACCIONES_ADMIN = [
  { grupo: 'Navegación', nombre: 'Usuarios', ruta: '/admin/usuarios', icono: '👥' },
  { grupo: 'Navegación', nombre: 'Cuentas', ruta: '/admin/cuentas', icono: '🏦' },
  { grupo: 'Navegación', nombre: 'Categorías', ruta: '/admin/categorias', icono: '🏷️' },
  { grupo: 'Navegación', nombre: 'Centros de Costo', ruta: '/admin/centros-costo', icono: '🏢' },
  { grupo: 'Navegación', nombre: 'Proveedores', ruta: '/admin/proveedores', icono: '🤝' },
  { grupo: 'Navegación', nombre: 'Transacciones', ruta: '/transacciones', icono: '💳' },
  { grupo: 'Navegación', nombre: 'Reportes', ruta: '/admin/reportes', icono: '📊' },
];

const ACCIONES_EMPLEADO = [
  { grupo: 'Navegación', nombre: 'Dashboard', ruta: '/empleado/dashboard', icono: '🏠' },
  { grupo: 'Navegación', nombre: 'Cuentas', ruta: '/empleado/cuentas', icono: '🏦' },
  { grupo: 'Navegación', nombre: 'Mis Solicitudes', ruta: '/transacciones', icono: '💳' },
];

const ACCIONES_COMUNES = [
  { grupo: 'Mi cuenta', nombre: 'Notificaciones', ruta: '/notificaciones', icono: '🔔' },
  { grupo: 'Mi cuenta', nombre: 'Mi Perfil', ruta: '/perfil', icono: '👤' },
];

export default function CommandPalette() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [query, setQuery] = useState('');
  const [activo, setActivo] = useState(0);

  const rol = localStorage.getItem('rol')?.toUpperCase();

  const acciones = useMemo(() => {
    const base = rol === 'ADMIN' ? ACCIONES_ADMIN : ACCIONES_EMPLEADO;
    return [...base, ...ACCIONES_COMUNES];
  }, [rol]);

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return acciones;
    return acciones.filter((a) => a.nombre.toLowerCase().includes(q));
  }, [acciones, query]);

  // Atajo global: Ctrl+K / Cmd+K abre, Esc cierra
  useEffect(() => {
    const onKeyDown = (e) => {
      const esAtajoBusqueda = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';

      if (esAtajoBusqueda) {
        e.preventDefault();
        setAbierto((prev) => !prev);
        return;
      }

      if (e.key === 'Escape') {
        setAbierto(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (abierto) {
      setQuery('');
      setActivo(0);
    }
  }, [abierto]);

  useEffect(() => {
    setActivo(0);
  }, [query]);

  const ir = (ruta) => {
    setAbierto(false);
    navigate(ruta);
  };

  const onKeyDownInput = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActivo((prev) => Math.min(prev + 1, filtradas.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActivo((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtradas[activo]) {
      ir(filtradas[activo].ruta);
    }
  };

  if (!abierto) {
    return (
      <button
        onClick={() => setAbierto(true)}
        className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 text-sm font-semibold transition"
        aria-label="Abrir buscador (Ctrl+K)"
      >
        <span>🔎</span>
        <span>Buscar...</span>
        <span className="ml-3 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-400">
          Ctrl K
        </span>
      </button>
    );
  }

  let indiceGlobal = -1;

  return (
    <div
      className="fixed inset-0 z-[200] bg-slate-950/50 flex items-start justify-center pt-24 px-4"
      onClick={() => setAbierto(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <span className="text-slate-400">🔎</span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDownInput}
            placeholder="Ir a Usuarios, Cuentas, Reportes..."
            className="flex-1 outline-none text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-400">
            Esc
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {filtradas.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-slate-400">
              No se encontraron resultados.
            </p>
          )}

          {['Navegación', 'Mi cuenta'].map((grupo) => {
            const items = filtradas.filter((a) => a.grupo === grupo);
            if (items.length === 0) return null;

            return (
              <div key={grupo} className="mb-2 last:mb-0">
                <p className="px-5 py-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  {grupo}
                </p>

                {items.map((item) => {
                  indiceGlobal += 1;
                  const esActivo = indiceGlobal === activo;

                  return (
                    <button
                      key={item.ruta}
                      onMouseEnter={() => setActivo(indiceGlobal)}
                      onClick={() => ir(item.ruta)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-left transition ${
                        esActivo ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-lg">{item.icono}</span>
                      <span className="font-semibold text-sm">{item.nombre}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
