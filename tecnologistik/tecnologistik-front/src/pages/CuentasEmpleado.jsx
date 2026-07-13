import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const formatoMoneda = (valor) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  }).format(Number(valor) || 0);

export default function CuentasEmpleado() {
  const navigate = useNavigate();
  const [cuentas, setCuentas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const cargarCuentas = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/cuentas');
      setCuentas(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCuentas();
  }, []);

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return cuentas;
    return cuentas.filter(
      (c) => c.nombre?.toLowerCase().includes(q) || c.tipo?.toLowerCase().includes(q)
    );
  }, [cuentas, busqueda]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
              Panel operativo
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950">Cuentas disponibles</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Consulta las cuentas de la empresa para registrar tus solicitudes de ingreso o gasto.
            </p>
          </div>

          <button
            onClick={() => navigate('/transacciones')}
            className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-slate-300 whitespace-nowrap"
          >
            Nueva solicitud
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar cuenta por nombre o tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md mb-6 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
        />

        {cargando ? (
          <p className="text-slate-400">Cargando cuentas...</p>
        ) : filtradas.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[28px] p-10 text-center shadow-sm">
            <p className="text-slate-400">No se encontraron cuentas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtradas.map((c) => (
              <div
                key={c.id}
                className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-slate-900 text-lg truncate">{c.nombre}</h3>
                    <p className="text-slate-400 text-sm mt-0.5">{c.tipo}</p>
                  </div>

                  <span
                    className={`shrink-0 px-3 py-1 rounded-full text-xs font-black ${
                      c.estado
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {c.estado ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">
                    Saldo actual
                  </p>
                  <p
                    className={`text-2xl font-black mt-1 ${
                      Number(c.saldo) >= 0 ? 'text-slate-900' : 'text-rose-600'
                    }`}
                  >
                    {formatoMoneda(c.saldo)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
