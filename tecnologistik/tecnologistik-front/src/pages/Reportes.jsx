import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const formatoMoneda = (valor) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(Number(valor) || 0);

export default function Reportes() {
  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, saldoNeto: 0 });
  const [transacciones, setTransacciones] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      const [resResumen, resTransacciones, resCuentas] = await Promise.all([
        api.get('/transacciones/resumen'),
        api.get('/transacciones'),
        api.get('/cuentas'),
      ]);

      setResumen(resResumen.data || { ingresos: 0, gastos: 0, saldoNeto: 0 });
      setTransacciones(resTransacciones.data || []);
      setCuentas(resCuentas.data || []);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los reportes. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Top categorías por monto (solo transacciones aprobadas), calculado en el cliente
  // a partir de la lista completa de transacciones que ya trae el backend.
  const topCategorias = useMemo(() => {
    const acumulado = {};

    transacciones
      .filter((t) => t.estado === 'APROBADO')
      .forEach((t) => {
        const categoria = t.categoria?.nombre || 'Sin categoría';
        const monto = Number(t.monto) || 0;
        const signo = t.tipo === 'GASTO' ? -1 : 1;
        acumulado[categoria] = (acumulado[categoria] || 0) + signo * monto;
      });

    return Object.entries(acumulado)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
      .slice(0, 6);
  }, [transacciones]);

  const pendientes = useMemo(
    () => transacciones.filter((t) => t.estado === 'PENDIENTE').length,
    [transacciones]
  );

  const ingresos = Number(resumen.ingresos) || 0;
  const gastos = Number(resumen.gastos) || 0;
  const saldoNeto = Number(resumen.saldoNeto) || 0;
  const maxBarra = Math.max(ingresos, gastos, 1);
  const maxCategoria = Math.max(...topCategorias.map((c) => Math.abs(c.total)), 1);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
              Panel Administrativo
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950">
              Reportes financieros
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Resumen de ingresos, gastos y saldo neto de todas las cuentas aprobadas.
            </p>
          </div>

          <button
            onClick={cargarDatos}
            disabled={cargando}
            className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-slate-300 whitespace-nowrap"
          >
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 font-semibold">
            {error}
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold">Ingresos totales</p>
            <h3 className="text-2xl md:text-3xl font-black text-emerald-600 mt-2 truncate">
              {formatoMoneda(ingresos)}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold">Gastos totales</p>
            <h3 className="text-2xl md:text-3xl font-black text-rose-600 mt-2 truncate">
              {formatoMoneda(gastos)}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold">Saldo neto</p>
            <h3 className={`text-2xl md:text-3xl font-black mt-2 truncate ${saldoNeto >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatoMoneda(saldoNeto)}
            </h3>
          </div>

          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <p className="text-slate-500 text-sm font-semibold">Solicitudes pendientes</p>
            <h3 className="text-2xl md:text-3xl font-black text-amber-600 mt-2">
              {pendientes}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Comparativo ingresos vs gastos */}
          <section className="xl:col-span-2 bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              Ingresos vs. Gastos
            </h2>

            <div className="flex items-end gap-8 h-52">
              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-sm font-bold text-slate-700 mb-2">
                  {formatoMoneda(ingresos)}
                </span>
                <div
                  className="w-full max-w-[96px] bg-emerald-500 rounded-t-2xl transition-all duration-500"
                  style={{ height: `${Math.max((ingresos / maxBarra) * 100, 4)}%` }}
                />
                <span className="text-slate-500 text-sm font-semibold mt-3">Ingresos</span>
              </div>

              <div className="flex-1 flex flex-col items-center justify-end h-full">
                <span className="text-sm font-bold text-slate-700 mb-2">
                  {formatoMoneda(gastos)}
                </span>
                <div
                  className="w-full max-w-[96px] bg-rose-500 rounded-t-2xl transition-all duration-500"
                  style={{ height: `${Math.max((gastos / maxBarra) * 100, 4)}%` }}
                />
                <span className="text-slate-500 text-sm font-semibold mt-3">Gastos</span>
              </div>
            </div>
          </section>

          {/* Saldos por cuenta */}
          <section className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
            <h2 className="text-xl font-black text-slate-900 mb-6">
              Saldo por cuenta
            </h2>

            <div className="space-y-4 max-h-52 overflow-y-auto pr-1">
              {cuentas.length === 0 && (
                <p className="text-slate-400 text-sm">No hay cuentas registradas.</p>
              )}

              {cuentas.map((c) => (
                <div key={c.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{c.nombre}</p>
                    <p className="text-xs text-slate-400">{c.tipo}</p>
                  </div>
                  <span
                    className={`font-black whitespace-nowrap ${
                      Number(c.saldo) >= 0 ? 'text-slate-900' : 'text-rose-600'
                    }`}
                  >
                    {formatoMoneda(c.saldo)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Top categorías */}
        <section className="mt-6 bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
          <h2 className="text-xl font-black text-slate-900 mb-6">
            Categorías principales
          </h2>

          {topCategorias.length === 0 ? (
            <p className="text-slate-400 text-sm">
              Aún no hay transacciones aprobadas para mostrar.
            </p>
          ) : (
            <div className="space-y-4">
              {topCategorias.map((c) => {
                const esGasto = c.total < 0;
                const ancho = Math.max((Math.abs(c.total) / maxCategoria) * 100, 3);

                return (
                  <div key={c.categoria}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="font-semibold text-slate-700 truncate">
                        {c.categoria}
                      </span>
                      <span className={`font-bold whitespace-nowrap ml-3 ${esGasto ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {formatoMoneda(c.total)}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${esGasto ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${ancho}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
