import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function AdminCuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    tipo: 'EFECTIVO',
    saldo: ''
  });

  const [busqueda, setBusqueda] = useState('');

  const limpiarFormulario = () => {
    setForm({
      nombre: '',
      tipo: 'EFECTIVO',
      saldo: ''
    });
  };

  const abrirModal = () => {
    limpiarFormulario();
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setModalAbierto(false);
  };

  const cargarCuentas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cuentas');
      setCuentas(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando cuentas');
    } finally {
      setLoading(false);
    }
  };

  const crearCuenta = async (e) => {
    e.preventDefault();

    try {
      await api.post('/cuentas', {
        nombre: form.nombre,
        tipo: form.tipo,
        saldo: Number(form.saldo)
      });

      cerrarModal();
      cargarCuentas();
      toast.success('Cuenta creada correctamente');

    } catch (error) {
      console.error(error);
      toast.error('Error creando cuenta');
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await api.patch(`/cuentas/${id}/estado`);
      cargarCuentas();
    } catch (error) {
      console.error(error);
      toast.error('Error cambiando estado');
    }
  };

  const eliminarCuenta = async (id) => {
    const confirmar = confirm('¿Deseas eliminar esta cuenta?');

    if (!confirmar) return;

    try {
      await api.delete(`/cuentas/${id}`);
      cargarCuentas();
    } catch (error) {
      console.error(error);
      toast.error('Error eliminando cuenta');
    }
  };

  const cuentasFiltradas = cuentas.filter((cuenta) =>
    cuenta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cuenta.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const balanceTotal = cuentas.reduce(
    (acc, item) => acc + Number(item.saldo || 0),
    0
  );

  const formatoMoneda = (valor) => {
    return Number(valor || 0).toLocaleString('es-PE', {
      minimumFractionDigits: 2
    });
  };

  useEffect(() => {
    cargarCuentas();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-5 shadow-sm">
              Gestión Financiera
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
              Administración de cuentas
            </h2>

            <p className="text-slate-500 text-lg">
              Controla cuentas, saldos y estados financieros del sistema.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirModal}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-300 transition-all duration-300"
          >
            + Crear cuenta
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">
              Total cuentas
            </p>

            <h2 className="text-3xl font-black text-slate-900">
              {cuentas.length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">
              Activas
            </p>

            <h2 className="text-3xl font-black text-emerald-600">
              {cuentas.filter((c) => c.estado).length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">
              Balance total
            </p>

            <h2 className="text-3xl font-black text-slate-900">
              S/. {formatoMoneda(balanceTotal)}
            </h2>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                Lista de cuentas
              </h3>

              <p className="text-slate-500 mt-2">
                Visualiza y administra las cuentas registradas.
              </p>
            </div>

            <input
              placeholder="Buscar cuenta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-80 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 font-semibold">
              Cargando cuentas...
            </div>
          ) : cuentasFiltradas.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-16 text-center">
              <h3 className="text-2xl font-black text-slate-800">
                No hay cuentas registradas
              </h3>

              <p className="text-slate-500 mt-3">
                Crea una cuenta financiera para comenzar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {cuentasFiltradas.map((cuenta) => (
                <div
                  key={cuenta.id}
                  className="group bg-white border border-slate-200 rounded-[28px] p-6 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate">
                        {cuenta.nombre}
                      </h3>

                      <p className="text-slate-500 text-sm mt-1">
                        {cuenta.tipo}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => cambiarEstado(cuenta.id)}
                      className={`px-4 py-2 rounded-full text-xs font-black border ${
                        cuenta.estado
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-red-50 text-red-700 border-red-100'
                      }`}
                    >
                      {cuenta.estado ? 'ACTIVA' : 'INACTIVA'}
                    </button>
                  </div>

                  <div className="mt-8">
                    <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide font-bold">
                      Balance
                    </p>

                    <h2 className="text-3xl font-black text-slate-900">
                      S/. {formatoMoneda(cuenta.saldo)}
                    </h2>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => eliminarCuenta(cuenta.id)}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-5">
          <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden">

            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-3xl font-black text-slate-900">
                  Crear cuenta
                </h3>

                <p className="text-slate-500 mt-1">
                  Registra una nueva cuenta financiera dentro del sistema.
                </p>
              </div>

              <button
                type="button"
                onClick={cerrarModal}
                className="w-11 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={crearCuenta} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Nombre de cuenta
                  </label>

                  <input
                    placeholder="Ej. Caja principal"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nombre: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Tipo de cuenta
                  </label>

                  <select
                    value={form.tipo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tipo: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  >
                    <option value="EFECTIVO">EFECTIVO</option>
                    <option value="AHORROS">AHORROS</option>
                    <option value="CORRIENTE">CORRIENTE</option>
                    <option value="CAJA_CHICA">CAJA CHICA</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Saldo inicial
                  </label>

                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.saldo}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        saldo: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 py-4 rounded-2xl text-white font-black transition-all duration-300 shadow-lg shadow-slate-300"
                >
                  Crear cuenta
                </button>

                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 py-4 rounded-2xl text-slate-700 font-black transition-all duration-300"
                >
                  Cancelar
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}