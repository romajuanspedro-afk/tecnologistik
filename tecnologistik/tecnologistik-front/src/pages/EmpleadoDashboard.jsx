import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function EmpleadoDashboard() {
  const navigate = useNavigate();

  const nombre = localStorage.getItem('nombre') || 'Empleado';

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex">

      <Sidebar />

      <main className="flex-1 p-5 pt-24 md:p-10 md:pt-10 overflow-hidden w-full">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

          <div>
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-bold mb-5 shadow-sm">
              Panel Operativo
            </span>

            <h1 className="text-3xl md:text-5xl font-black text-slate-950 mb-4">
              Bienvenido, {nombre}
            </h1>

            <p className="text-slate-500 text-lg max-w-2xl">
              Desde este panel podrás enviar solicitudes financieras,
              consultar el estado de tus movimientos y realizar el
              seguimiento de tus registros operativos.
            </p>
          </div>

          <button
            onClick={() => navigate('/transacciones')}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-black transition shadow-xl shadow-slate-300"
          >
            Ir a mis solicitudes
          </button>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button
            onClick={() => navigate('/empleado/cuentas')}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="text-2xl">🏦</span>
            <p className="font-black text-slate-900 mt-3">Ver cuentas</p>
            <p className="text-slate-400 text-sm mt-1">Consulta saldos disponibles</p>
          </button>

          <button
            onClick={() => navigate('/notificaciones')}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="text-2xl">🔔</span>
            <p className="font-black text-slate-900 mt-3">Notificaciones</p>
            <p className="text-slate-400 text-sm mt-1">Revisa el estado de tus solicitudes</p>
          </button>

          <button
            onClick={() => navigate('/perfil')}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <span className="text-2xl">👤</span>
            <p className="font-black text-slate-900 mt-3">Mi perfil</p>
            <p className="text-slate-400 text-sm mt-1">Actualiza tus datos y contraseña</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
              <span className="text-2xl">✓</span>
            </div>

            <p className="text-slate-500 text-sm font-semibold">
              Estado del usuario
            </p>

            <h3 className="text-3xl font-black text-emerald-600 mt-2">
              Activo
            </h3>

            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Tu cuenta se encuentra habilitada para registrar solicitudes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
              <span className="text-2xl">👤</span>
            </div>

            <p className="text-slate-500 text-sm font-semibold">
              Rol del sistema
            </p>

            <h3 className="text-3xl font-black text-slate-900 mt-2">
              EMPLEADO
            </h3>

            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Puedes registrar movimientos y consultar el estado de aprobación.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-[28px] p-7 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center mb-5">
              <span className="text-2xl">📄</span>
            </div>

            <p className="text-slate-500 text-sm font-semibold">
              Acceso operativo
            </p>

            <h3 className="text-3xl font-black text-slate-900 mt-2">
              Solicitudes
            </h3>

            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Envía gastos o ingresos para revisión administrativa.
            </p>
          </div>

        </div>

        <section className="mt-10 bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <h2 className="text-3xl font-black text-slate-900">
                Flujo del sistema
              </h2>

              <p className="text-slate-500 mt-2">
                Así funciona el proceso operativo dentro de TecnoLogistik.
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <span className="text-sm font-black text-cyan-600">
                PASO 01
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3">
                Registrar solicitud
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                El empleado registra un ingreso o gasto desde el módulo de transacciones.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <span className="text-sm font-black text-yellow-600">
                PASO 02
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3">
                Revisión administrativa
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                El administrador revisa y valida la solicitud enviada.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
              <span className="text-sm font-black text-emerald-600">
                PASO 03
              </span>

              <h3 className="text-2xl font-black text-slate-900 mt-3">
                Aprobación final
              </h3>

              <p className="text-slate-500 mt-3 leading-relaxed">
                El sistema actualiza automáticamente balances y registros financieros.
              </p>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}