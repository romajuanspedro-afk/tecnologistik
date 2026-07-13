import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Intervalo de sondeo (polling). No hay WebSocket en este proyecto,
// así que revisamos periódicamente si hay notificaciones nuevas.
const INTERVALO_MS = 20000;

export default function NotificationBell() {
  const navigate = useNavigate();
  const [contador, setContador] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);
  const contenedorRef = useRef(null);

  const cargarContador = async () => {
    try {
      const { data } = await api.get('/notificaciones/no-leidas/contador');
      setContador(data.total || 0);
    } catch (error) {
      // Si falla el sondeo (ej. sesión vencida) simplemente no actualizamos;
      // el interceptor de axios ya se encarga de redirigir si el token expiró.
      console.error('Error consultando notificaciones', error);
    }
  };

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/notificaciones');
      setNotificaciones(data);
    } catch (error) {
      console.error('Error cargando notificaciones', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarContador();
    const intervalo = setInterval(cargarContador, INTERVALO_MS);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const cerrarSiClickAfuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', cerrarSiClickAfuera);
    return () => document.removeEventListener('mousedown', cerrarSiClickAfuera);
  }, []);

  const alAbrir = () => {
    const nuevoEstado = !abierto;
    setAbierto(nuevoEstado);
    if (nuevoEstado) {
      cargarNotificaciones();
    }
  };

  const marcarLeida = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}/leer`);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      cargarContador();
    } catch (error) {
      console.error('Error marcando notificación como leída', error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await api.patch('/notificaciones/leer-todas');
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setContador(0);
    } catch (error) {
      console.error('Error marcando todas como leídas', error);
    }
  };

  const formatoFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={contenedorRef}>
      <button
        onClick={alAbrir}
        className="relative w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
        aria-label="Notificaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-slate-700"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {contador > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
            {contador > 9 ? '9+' : contador}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute left-0 top-14 w-[90vw] max-w-96 max-h-[28rem] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-xl z-50">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Notificaciones</h3>
            {contador > 0 && (
              <button
                onClick={marcarTodasLeidas}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          {cargando && (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">
              Cargando...
            </p>
          )}

          {!cargando && notificaciones.length === 0 && (
            <p className="px-5 py-6 text-sm text-slate-400 text-center">
              No tienes notificaciones
            </p>
          )}

          {!cargando &&
            notificaciones.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.leida && marcarLeida(n.id)}
                className={`w-full text-left px-5 py-4 border-b border-slate-50 last:border-0 transition-all ${
                  n.leida ? 'bg-white' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.leida && (
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm ${n.leida ? 'text-slate-500' : 'text-slate-900 font-semibold'}`}>
                      {n.mensaje}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatoFecha(n.fecha)}
                    </p>
                  </div>
                </div>
              </button>
            ))}

          <button
            onClick={() => {
              setAbierto(false);
              navigate('/notificaciones');
            }}
            className="w-full text-center px-5 py-3.5 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-t border-slate-100 transition"
          >
            Ver todas las notificaciones
          </button>
        </div>
      )}
    </div>
  );
}
