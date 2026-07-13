import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useToast } from '../components/Toast';

const TIPOS = ['INGRESO', 'GASTO', 'AMBOS'];

const estiloTipo = (tipo) => {
  if (tipo === 'INGRESO') return 'bg-emerald-50 text-emerald-700';
  if (tipo === 'GASTO') return 'bg-rose-50 text-rose-700';
  return 'bg-blue-50 text-blue-700';
};

export default function AdminCategorias() {
  const toast = useToast();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editando, setEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState('');

  const [form, setForm] = useState({ nombre: '', tipo: 'GASTO' });

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categorias');
      setCategorias(data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  const limpiarFormulario = () => {
    setEditando(null);
    setErrorGuardado('');
    setForm({ nombre: '', tipo: 'GASTO' });
  };

  const abrirCrear = () => {
    limpiarFormulario();
    setModalAbierto(true);
  };

  const abrirEditar = (categoria) => {
    setEditando(categoria.id);
    setErrorGuardado('');
    setForm({ nombre: categoria.nombre, tipo: categoria.tipo });
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setModalAbierto(false);
  };

  const guardarCategoria = async (e) => {
    e.preventDefault();
    setErrorGuardado('');

    if (!form.nombre.trim()) {
      setErrorGuardado('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      setGuardando(true);

      if (editando) {
        await api.put(`/categorias/${editando}`, form);
        toast.success('Categoría actualizada correctamente');
      } else {
        await api.post('/categorias', form);
        toast.success('Categoría creada correctamente');
      }

      cerrarModal();
      cargarCategorias();
    } catch (error) {
      console.error(error);
      setErrorGuardado(
        error?.response?.data?.message || 'No se pudo guardar la categoría.'
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await api.patch(`/categorias/${id}/estado`);
      cargarCategorias();
    } catch (error) {
      console.error(error);
      toast.error('Error cambiando el estado de la categoría');
    }
  };

  const eliminarCategoria = async (id) => {
    const confirmar = confirm('¿Deseas eliminar esta categoría?');
    if (!confirmar) return;

    try {
      await api.delete(`/categorias/${id}`);
      toast.success('Categoría eliminada correctamente');
      cargarCategorias();
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          'No se pudo eliminar (probablemente ya tiene transacciones asociadas).'
      );
    }
  };

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return categorias;
    return categorias.filter(
      (c) => c.nombre.toLowerCase().includes(q) || c.tipo.toLowerCase().includes(q)
    );
  }, [categorias, busqueda]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
              Catálogo del sistema
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-950">Categorías</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Administra las categorías disponibles al registrar ingresos y gastos.
              Se muestran como lista desplegable al crear una transacción, evitando
              duplicados por errores de tipeo.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="self-start md:self-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition shadow-lg shadow-slate-300 whitespace-nowrap"
          >
            + Nueva categoría
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar categoría por nombre o tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full max-w-md mb-6 px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
        />

        <section className="bg-white border border-slate-200 rounded-[28px] shadow-sm overflow-hidden">
          {loading && (
            <p className="px-6 py-10 text-center text-slate-400">Cargando categorías...</p>
          )}

          {!loading && filtradas.length === 0 && (
            <p className="px-6 py-10 text-center text-slate-400">
              No se encontraron categorías.
            </p>
          )}

          {!loading && filtradas.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-black uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtradas.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-6 py-4 font-bold text-slate-900">{c.nombre}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${estiloTipo(c.tipo)}`}>
                          {c.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => cambiarEstado(c.id)}
                          className={`px-3 py-1 rounded-full text-xs font-black transition ${
                            c.estado
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {c.estado ? 'Activa' : 'Inactiva'}
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
                            onClick={() => eliminarCategoria(c.id)}
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
                {editando ? 'Editar categoría' : 'Nueva categoría'}
              </h3>
              <button
                type="button"
                onClick={cerrarModal}
                className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={guardarCategoria} className="p-8">
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
                    placeholder="Ej. Movilidad, Ventas, Soporte"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Aplica a
                  </label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  >
                    {TIPOS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-400 mt-1.5">
                    "AMBOS" la muestra tanto para ingresos como para gastos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  disabled={guardando}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 py-4 rounded-2xl text-white font-black transition-all shadow-lg shadow-slate-300"
                >
                  {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear categoría'}
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
