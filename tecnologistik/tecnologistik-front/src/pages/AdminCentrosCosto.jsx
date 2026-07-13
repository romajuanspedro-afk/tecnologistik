import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';

export default function AdminCentrosCosto() {
  const toast = useToast();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState('');

  const [form, setForm] = useState({ nombre: '', codigo: '' });

  const cargar = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/centros-costo');
      setItems(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando centros de costo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiarFormulario = () => {
    setEditando(null);
    setErrorGuardado('');
    setForm({ nombre: '', codigo: '' });
  };

  const abrirCrear = () => {
    limpiarFormulario();
    setModalAbierto(true);
  };

  const abrirEditar = (item) => {
    setEditando(item.id);
    setErrorGuardado('');
    setForm({ nombre: item.nombre, codigo: item.codigo || '' });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setModalAbierto(false);
  };

  const guardar = async (e) => {
    e.preventDefault();
    setErrorGuardado('');

    if (!form.nombre.trim()) {
      setErrorGuardado('El nombre es obligatorio.');
      return;
    }

    try {
      setGuardando(true);

      if (editando) {
        await api.put(`/centros-costo/${editando}`, form);
        toast.success('Centro de costo actualizado correctamente');
      } else {
        await api.post('/centros-costo', form);
        toast.success('Centro de costo creado correctamente');
      }

      cerrarModal();
      cargar();
    } catch (error) {
      console.error(error);
      setErrorGuardado(
        error?.response?.data?.message || 'No se pudo guardar el centro de costo.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await api.patch(`/centros-costo/${id}/estado`);
      cargar();
    } catch (error) {
      console.error(error);
      toast.error('Error cambiando el estado');
    }
  };

  const eliminar = async (id) => {
    const confirmar = confirm('¿Deseas eliminar este centro de costo?');
    if (!confirmar) return;

    try {
      await api.delete(`/centros-costo/${id}`);
      toast.success('Centro de costo eliminado correctamente');
      cargar();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          'No se pudo eliminar (probablemente ya tiene transacciones asociadas).'
      );
    }
  };

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.codigo || '').toLowerCase().includes(q)
    );
  }, [items, busqueda]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
              Catálogo del sistema
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950">Centros de Costo</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Áreas o proyectos del negocio a los que se puede asignar un movimiento
              (opcional al crear una transacción), útil para reportes por departamento.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-slate-300 whitespace-nowrap"
          >
            + Nuevo centro de costo
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md mb-6 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
        />

        <section className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          {loading && (
            <p className="px-6 py-10 text-center text-slate-400">Cargando...</p>
          )}

          {!loading && filtrados.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-400">
              No se encontraron centros de costo.
            </p>
          )}

          {!loading && filtrados.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Código</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-6 py-4 font-bold text-slate-900">{c.nombre}</td>
                      <td className="px-6 py-4 text-slate-500">{c.codigo || '—'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => cambiarEstado(c.id)}
                          className={`px-3 py-1 rounded-full text-xs font-black transition ${
                            c.estado
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {c.estado ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => abrirEditar(c)}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => eliminar(c.id)}
                            className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-sm transition"
                          >
                            🗑 Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modalAbierto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-sm px-5"
          onClick={cerrarModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">
                {editando ? 'Editar centro de costo' : 'Nuevo centro de costo'}
              </h3>
              <button
                type="button"
                onClick={cerrarModal}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardar} className="p-8">
              {errorGuardado && (
                <div className="mb-5 px-5 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
                  {errorGuardado}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Nombre
                  </label>
                  <input
                    placeholder="Ej. Logística, Administración, Ventas"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Código <span className="text-slate-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    placeholder="Ej. LOG-01"
                    value={form.codigo}
                    onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  disabled={guardando}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 py-4 rounded-2xl text-white font-black transition-all shadow-lg shadow-slate-300"
                >
                  {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 py-4 rounded-2xl text-slate-700 font-black transition-all"
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
