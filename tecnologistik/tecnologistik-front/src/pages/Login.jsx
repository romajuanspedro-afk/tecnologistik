import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useToast } from '../components/Toast';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post('/auth/login', form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem('email', form.email);
      localStorage.setItem('nombre', response.data.nombreCompleto || '');

      if (response.data.rol === 'ADMIN') {
        navigate('/admin/usuarios');
      } else {
        navigate('/empleado/dashboard');
      }
    } catch (error) {
      console.error(error);

      const mensaje = error?.response?.data?.message
        || (error?.code === 'ERR_NETWORK'
              ? 'No se pudo conectar con el servidor. ¿Está corriendo el backend en http://localhost:8081?'
              : null)
        || 'Credenciales incorrectas';

      toast.error(mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6 py-10">
      <form
        onSubmit={login}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
            <span className="text-3xl text-white">T</span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mt-5">
            TecnoLogistik
          </h1>

          <p className="text-slate-500 text-sm mt-2 text-center">
            Plataforma de Gestión Financiera
          </p>
        </div>

        <div className="mb-5">
          <label className="text-slate-700 text-sm mb-2 block font-medium">
            Correo electrónico
          </label>

          <input
            type="email"
            placeholder="tu@empresa.com"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
            required
          />
        </div>

        <div className="mb-5">
          <label className="text-slate-700 text-sm mb-2 block font-medium">
            Contraseña
          </label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full px-4 py-3 pr-20 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200 transition"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900 text-sm font-medium"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-7 text-sm">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="w-4 h-4 accent-slate-900"
            />
            Recuérdame
          </label>

          <button
            type="button"
            className="text-slate-700 hover:text-slate-950 font-medium transition"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>

        <p className="text-center text-slate-500 text-sm mt-8">
          Control de cuentas, movimientos y aprobaciones en un solo lugar
        </p>
      </form>
    </div>
  );
}