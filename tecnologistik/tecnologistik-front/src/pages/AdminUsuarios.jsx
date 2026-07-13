import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

export default function AdminUsuarios() {
  const [form, setForm] = useState({
    nombreCompleto: '',
    email: '',
    password: '',
    rol: 'USUARIO'
  });

  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get('/usuarios');
      setUsuarios(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Error cargando usuarios');
    } finally {
      setLoading(false);
    }
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    try {
      setGuardando(true);

      if (editando) {
        await api.put(`/usuarios/${editando}`, form);
        toast.success('Usuario actualizado correctamente');
      } else {
        await api.post('/auth/register', form);
        toast.success('Usuario creado correctamente');
      }

      limpiarFormulario();
      setModalAbierto(false);
      cargarUsuarios();

    } catch (error) {
      console.error(error);
      toast.error('No se pudo guardar el usuario');
    } finally {
      setGuardando(false);
    }
  };

  const abrirCrear = () => {
    limpiarFormulario();
    setModalAbierto(true);
  };

  const editarUsuario = (usuario) => {
    setEditando(usuario.id);

    setForm({
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      password: '',
      rol: usuario.rol?.nombre || usuario.rol || 'USUARIO'
    });

    setModalAbierto(true);
  };

  const eliminarUsuario = async (id) => {
    const confirmar = confirm('¿Deseas eliminar este usuario?');

    if (!confirmar) return;

    try {
      await api.delete(`/usuarios/${id}`);
      toast.success('Usuario eliminado correctamente');
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      toast.error('Error eliminando usuario');
    }
  };

  const cambiarEstado = async (id) => {
    try {
      await api.patch(`/usuarios/${id}/estado`);
      cargarUsuarios();
    } catch (error) {
      console.error(error);
      toast.error('Error cambiando estado');
    }
  };

  const limpiarFormulario = () => {
    setEditando(null);

    setForm({
      nombreCompleto: '',
      email: '',
      password: '',
      rol: 'USUARIO'
    });
  };

  const cerrarModal = () => {
    limpiarFormulario();
    setModalAbierto(false);
  };

  const obtenerRol = (usuario) => {
    return usuario.rol?.nombre || usuario.rol || 'USUARIO';
  };

  const obtenerEstado = (usuario) => {
    return usuario.estado === true || usuario.estado === 'Activo';
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const rol = obtenerRol(usuario);

    return (
      usuario.nombreCompleto?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
      rol.toLowerCase().includes(busqueda.toLowerCase())
    );
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-5 shadow-sm">
              Panel Administrativo
            </span>

            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
              Gestión de usuarios
            </h2>

            <p className="text-slate-500 text-lg">
              Administra accesos, roles y usuarios del sistema empresarial.
            </p>
          </div>

          <button
            type="button"
            onClick={abrirCrear}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-slate-300 transition-all duration-300"
          >
            + Crear usuario
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Usuarios</p>
            <h2 className="text-3xl font-black text-slate-900">
              {usuarios.length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Admins</p>
            <h2 className="text-3xl font-black text-emerald-600">
              {usuarios.filter((u) => obtenerRol(u) === 'ADMIN').length}
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <p className="text-slate-500 text-sm mb-1">Operativos</p>
            <h2 className="text-3xl font-black text-blue-600">
              {usuarios.filter((u) => obtenerRol(u) === 'USUARIO').length}
            </h2>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
            <div>
              <h3 className="text-3xl font-black text-slate-900">
                Lista de usuarios
              </h3>

              <p className="text-slate-500 mt-2">
                Visualiza, edita, activa o elimina usuarios registrados.
              </p>
            </div>

            <input
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full md:w-80 px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
            />
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-500 font-semibold">
              Cargando usuarios...
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-16 text-center">
              <h3 className="text-2xl font-black text-slate-800">
                No hay usuarios registrados
              </h3>

              <p className="text-slate-500 mt-3">
                Crea un usuario para verlo aquí.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left border-b border-slate-200">
                    <th className="py-4 px-4 text-sm text-slate-500">Nombre</th>
                    <th className="py-4 px-4 text-sm text-slate-500">Correo</th>
                    <th className="py-4 px-4 text-sm text-slate-500">Rol</th>
                    <th className="py-4 px-4 text-sm text-slate-500">Estado</th>
                    <th className="py-4 px-4 text-sm text-slate-500 text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {usuariosFiltrados.map((usuario) => {
                    const rol = obtenerRol(usuario);
                    const activo = obtenerEstado(usuario);

                    return (
                      <tr
                        key={usuario.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="py-5 px-4 font-bold text-slate-900">
                          {usuario.nombreCompleto}
                        </td>

                        <td className="py-5 px-4 text-slate-500">
                          {usuario.email}
                        </td>

                        <td className="py-5 px-4">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-black border ${
                              rol === 'ADMIN'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}
                          >
                            {rol}
                          </span>
                        </td>

                        <td className="py-5 px-4">
                          <button
                            type="button"
                            onClick={() => cambiarEstado(usuario.id)}
                            className={`px-4 py-2 rounded-full text-xs font-black border ${
                              activo
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : 'bg-red-50 text-red-700 border-red-100'
                            }`}
                          >
                            {activo ? 'ACTIVO' : 'INACTIVO'}
                          </button>
                        </td>

                        <td className="py-5 px-4">
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => editarUsuario(usuario)}
                              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                            >
                              Editar
                            </button>

                            <button
                              type="button"
                              onClick={() => eliminarUsuario(usuario.id)}
                              className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold transition"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
                  {editando ? 'Editar usuario' : 'Crear usuario'}
                </h3>

                <p className="text-slate-500 mt-1">
                  {editando
                    ? 'Actualiza la información del usuario seleccionado.'
                    : 'Completa la información para registrar un nuevo acceso.'}
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

            <form onSubmit={guardarUsuario} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Nombre completo
                  </label>

                  <input
                    placeholder="Ej. Juan Pérez"
                    value={form.nombreCompleto}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nombreCompleto: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Contraseña
                  </label>

                  <input
                    type="password"
                    placeholder={editando ? 'Dejar vacío para no cambiar' : '********'}
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                    required={!editando}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm font-bold text-slate-700 block mb-2">
                    Rol del usuario
                  </label>

                  <select
                    value={form.rol}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        rol: e.target.value
                      })
                    }
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all"
                  >
                    <option value="USUARIO">USUARIO</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-8">
                <button
                  type="submit"
                  disabled={guardando}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 py-4 rounded-2xl text-white font-black transition-all duration-300 shadow-lg shadow-slate-300 disabled:opacity-60"
                >
                  {guardando
                    ? 'Guardando...'
                    : editando
                      ? 'Guardar cambios'
                      : 'Crear usuario'}
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