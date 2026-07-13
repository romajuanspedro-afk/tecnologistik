import { useEffect, useState } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';

const iniciales = (nombre) =>
  (nombre || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [nombreForm, setNombreForm] = useState('');
  const [guardandoNombre, setGuardandoNombre] = useState(false);
  const [mensajeNombre, setMensajeNombre] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    actual: '',
    nueva: '',
    confirmar: '',
  });
  const [guardandoPassword, setGuardandoPassword] = useState(false);
  const [mensajePassword, setMensajePassword] = useState(null);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const { data } = await api.get('/auth/me');
      setPerfil(data);
      setNombreForm(data.nombreCompleto || '');

      // Mantiene sincronizado el localStorage (usado por el Sidebar y
      // el saludo del dashboard) con lo que realmente hay en el backend.
      localStorage.setItem('nombre', data.nombreCompleto || '');
      localStorage.setItem('rol', data.rol || '');
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  const guardarNombre = async (e) => {
    e.preventDefault();
    setMensajeNombre(null);

    try {
      setGuardandoNombre(true);
      const { data } = await api.put('/auth/perfil', { nombreCompleto: nombreForm });
      setPerfil(data);
      localStorage.setItem('nombre', data.nombreCompleto || '');
      setMensajeNombre({ tipo: 'ok', texto: 'Nombre actualizado correctamente.' });
    } catch (error) {
      console.error(error);
      setMensajeNombre({
        tipo: 'error',
        texto: error?.response?.data?.message || 'No se pudo actualizar el nombre.',
      });
    } finally {
      setGuardandoNombre(false);
    }
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();
    setMensajePassword(null);

    if (passwordForm.nueva !== passwordForm.confirmar) {
      setMensajePassword({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' });
      return;
    }

    if (passwordForm.nueva.length < 6) {
      setMensajePassword({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    try {
      setGuardandoPassword(true);
      await api.put('/auth/password', {
        passwordActual: passwordForm.actual,
        passwordNuevo: passwordForm.nueva,
      });
      setPasswordForm({ actual: '', nueva: '', confirmar: '' });
      setMensajePassword({ tipo: 'ok', texto: 'Contraseña actualizada correctamente.' });
    } catch (error) {
      console.error(error);
      setMensajePassword({
        tipo: 'error',
        texto: error?.response?.data?.message || 'No se pudo cambiar la contraseña.',
      });
    } finally {
      setGuardandoPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">
      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-4 shadow-sm">
            Mi cuenta
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950">Mi perfil</h1>
          <p className="text-slate-500 mt-2">
            Consulta tus datos y actualiza tu información de acceso.
          </p>
        </div>

        {cargando ? (
          <p className="text-slate-400">Cargando perfil...</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Tarjeta resumen */}
            <section className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm xl:col-span-1 h-fit">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-slate-900 flex items-center justify-center shadow-md mb-5">
                  <span className="text-3xl font-black text-white">
                    {iniciales(perfil?.nombreCompleto)}
                  </span>
                </div>

                <h2 className="text-xl font-black text-slate-900">
                  {perfil?.nombreCompleto}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{perfil?.email}</p>

                <span
                  className={`mt-4 inline-flex px-4 py-1.5 rounded-full text-xs font-black tracking-wide ${
                    perfil?.rol === 'ADMIN'
                      ? 'bg-slate-900 text-white'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  {perfil?.rol}
                </span>
              </div>
            </section>

            <div className="xl:col-span-2 flex flex-col gap-6">
              {/* Datos personales */}
              <section className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-5">
                  Datos personales
                </h3>

                <form onSubmit={guardarNombre} className="space-y-4">
                  <div>
                    <label className="text-slate-700 text-sm mb-2 block font-medium">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={nombreForm}
                      onChange={(e) => setNombreForm(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 text-sm mb-2 block font-medium">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      value={perfil?.email || ''}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">
                      El correo no se puede modificar. Contacta a un administrador si necesitas cambiarlo.
                    </p>
                  </div>

                  {mensajeNombre && (
                    <p
                      className={`text-sm font-semibold ${
                        mensajeNombre.tipo === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {mensajeNombre.texto}
                    </p>
                  )}

                  <button
                    disabled={guardandoNombre}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold transition"
                  >
                    {guardandoNombre ? 'Guardando...' : 'Guardar cambios'}
                  </button>
                </form>
              </section>

              {/* Cambiar contraseña */}
              <section className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
                <h3 className="text-lg font-black text-slate-900 mb-5">
                  Cambiar contraseña
                </h3>

                <form onSubmit={cambiarPassword} className="space-y-4">
                  <div>
                    <label className="text-slate-700 text-sm mb-2 block font-medium">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={passwordForm.actual}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, actual: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 text-sm mb-2 block font-medium">
                        Nueva contraseña
                      </label>
                      <input
                        type="password"
                        value={passwordForm.nueva}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, nueva: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 text-sm mb-2 block font-medium">
                        Confirmar contraseña
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmar}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmar: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>

                  {mensajePassword && (
                    <p
                      className={`text-sm font-semibold ${
                        mensajePassword.tipo === 'ok' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {mensajePassword.texto}
                    </p>
                  )}

                  <button
                    disabled={guardandoPassword}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-bold transition"
                  >
                    {guardandoPassword ? 'Actualizando...' : 'Actualizar contraseña'}
                  </button>
                </form>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
