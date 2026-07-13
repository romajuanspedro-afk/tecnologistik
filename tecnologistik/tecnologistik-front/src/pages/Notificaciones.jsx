import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const ESTILO_TIPO = {
  NUEVA_SOLICITUD: { label: 'Nueva solicitud', clase: 'bg-blue-50 text-blue-700', icono: '📩' },
  APROBADA: { label: 'Aprobada', clase: 'bg-emerald-50 text-emerald-700', icono: '✅' },
  RECHAZADA: { label: 'Rechazada', clase: 'bg-rose-50 text-rose-700', icono: '⛔' },
};

const estiloTipo = (tipo) =>
  ESTILO_TIPO[tipo] || { label: tipo || 'Notificación', clase: 'bg-slate-100 text-slate-600', icono: '🔔' };

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('TODAS'); // TODAS | NO_LEIDAS | LEIDAS

  const cargar = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/notificaciones');
      setNotificaciones(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const marcarLeida = async (id) => {
    try {
      await api.patch(`/notificaciones/${id}/leer`);
      setNotificaciones((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
    } catch (error) {
      console.error(error);
    }
  };

  const marcarTodasLeidas = async () => {
    try {
      await api.patch('/notificaciones/leer-todas');
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const formatoFecha = (fecha) => {
    try {
      return new Date(fecha).toLocaleString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const visibles = useMemo(() => {
    if (filtro === 'NO_LEIDAS') return notificaciones.filter((n) => !n.leida);
    if (filtro === 'LEIDAS') return notificaciones.filter((n) => n.leida);
    return notificaciones;
  }, [notificaciones, filtro]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const tabs = [
    { valor: 'TODAS', label: 'Todas', total: notificaciones.length },
    { valor: 'NO_LEIDAS', label: 'No leídas', total: noLeidas },
    { valor: 'LEIDAS', label: 'Leídas', total: notificaciones.length - noLeidas },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
              Centro de notificaciones
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950">Notificaciones</h1>
            <p className="text-slate-500 mt-2">
              Aquí verás las alertas sobre tus solicitudes y movimientos.
            </p>
          </div>

          {noLeidas > 0 && (
            <button
              onClick={marcarTodasLeidas}
              className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-slate-300 whitespace-nowrap"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {/* Tabs de filtro */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.valor}
              onClick={() => setFiltro(t.valor)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition border ${
                filtro === t.valor
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t.label} <span className="opacity-70">({t.total})</span>
            </button>
          ))}
        </div>

        <section className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          {cargando && (
            <p className="px-6 py-10 text-center text-slate-400">Cargando notificaciones...</p>
          )}

          {!cargando && visibles.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-400">
              No hay notificaciones en esta categoría.
            </p>
          )}

          {!cargando &&
            visibles.map((n) => {
              const estilo = estiloTipo(n.tipo);
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-4 px-6 py-5 border-b border-slate-100 last:border-0 transition ${
                    n.leida ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    {estilo.icono}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${estilo.clase}`}>
                        {estilo.label}
                      </span>
                      {!n.leida && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                    </div>

                    <p className={`text-sm ${n.leida ? 'text-slate-500' : 'text-slate-900 font-semibold'}`}>
                      {n.mensaje}
                    </p>

                    <p className="text-xs text-slate-400 mt-1.5">{formatoFecha(n.fecha)}</p>
                  </div>

                  {!n.leida && (
                    <button
                      onClick={() => marcarLeida(n.id)}
                      className="shrink-0 text-xs font-bold text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded-lg px-3 py-2 transition whitespace-nowrap"
                    >
                      Marcar leída
                    </button>
                  )}
                </div>
              );
            })}
        </section>
      </main>
    </div>
  );
}
