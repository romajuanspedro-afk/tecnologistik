import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import CommandPalette from './CommandPalette';

export default function Sidebar() {
  const location = useLocation();
  const rol = localStorage.getItem('rol')?.toUpperCase();

  // Controla el menú tipo "drawer" en vista celular/tablet.
  // En escritorio (md en adelante) el sidebar siempre está visible,
  // este estado solo importa por debajo de ese breakpoint.
  const [abierto, setAbierto] = useState(false);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuAdmin = [
    { nombre: 'Usuarios', ruta: '/admin/usuarios' },
    { nombre: 'Cuentas', ruta: '/admin/cuentas' },
    { nombre: 'Categorías', ruta: '/admin/categorias' },
    { nombre: 'Centros de Costo', ruta: '/admin/centros-costo' },
    { nombre: 'Proveedores', ruta: '/admin/proveedores' },
    { nombre: 'Transacciones', ruta: '/transacciones' },
    { nombre: 'Reportes', ruta: '/admin/reportes' },
  ];

  const menuEmpleado = [
    { nombre: 'Dashboard', ruta: '/empleado/dashboard' },
    { nombre: 'Cuentas', ruta: '/empleado/cuentas' },
    { nombre: 'Mis Solicitudes', ruta: '/transacciones' },
  ];

  // Módulos comunes a ambos roles, se muestran en una sección aparte
  const menuComun = [
    { nombre: 'Notificaciones', ruta: '/notificaciones' },
    { nombre: 'Mi Perfil', ruta: '/perfil' },
  ];

  const menu = rol === 'ADMIN' ? menuAdmin : menuEmpleado;

  return (
    <>
      {/* Barra superior fija, solo en móvil/tablet: botón hamburguesa + notificaciones */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setAbierto(true)}
          aria-label="Abrir menú"
          className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6 text-slate-700"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-black text-slate-900">TecnoLogistik</span>
          <NotificationBell />
        </div>
      </div>

      {/* Fondo oscuro detrás del drawer, solo visible en móvil cuando está abierto */}
      {abierto && (
        <div
          onClick={() => setAbierto(false)}
          className="md:hidden fixed inset-0 bg-slate-950/50 z-40"
        />
      )}

      <aside
        className={`
          w-72 min-h-screen bg-white border-r border-slate-200
          flex flex-col justify-between p-6

          fixed top-0 left-0 z-50 transition-transform duration-300
          ${abierto ? 'translate-x-0' : '-translate-x-full'}

          md:static md:translate-x-0 md:z-auto
        `}
      >
        <div>
          <div className="mb-10 hidden md:block">
            <div className="flex items-center justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
                <span className="text-2xl font-black text-white">T</span>
              </div>

              <div className="flex items-center gap-2">
                <CommandPalette />
                <NotificationBell />
              </div>
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              TecnoLogistik
            </h1>

            <p className="text-slate-500 mt-2 text-sm leading-relaxed">
              {rol === 'ADMIN'
                ? 'Panel Administrativo'
                : 'Panel de Empleado'}
            </p>
          </div>

          {/* En móvil, dentro del propio drawer, mostramos un botón para cerrarlo */}
          <div className="md:hidden flex items-center justify-between mb-8">
            <span className="font-black text-slate-900 text-lg">Menú</span>
            <button
              onClick={() => setAbierto(false)}
              aria-label="Cerrar menú"
              className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {menu.map((item) => {
              const active = location.pathname === item.ruta;

              return (
                <Link
                  key={item.ruta}
                  to={item.ruta}
                  onClick={() => setAbierto(false)}
                  className={`
                    flex items-center px-5 py-3.5 rounded-xl
                    transition-all duration-200 font-semibold border
                    ${active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-950'}
                  `}
                >
                  {item.nombre}
                </Link>
              );
            })}
          </nav>

          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-7 mb-3 px-2">
            Mi cuenta
          </p>

          <nav className="space-y-2">
            {menuComun.map((item) => {
              const active = location.pathname === item.ruta;

              return (
                <Link
                  key={item.ruta}
                  to={item.ruta}
                  onClick={() => setAbierto(false)}
                  className={`
                    flex items-center px-5 py-3.5 rounded-xl
                    transition-all duration-200 font-semibold border
                    ${active
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-950'}
                  `}
                >
                  {item.nombre}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={logout}
          className="
            w-full py-3.5 rounded-xl
            bg-slate-100 hover:bg-red-50
            border border-slate-200 hover:border-red-200
            text-slate-700 hover:text-red-600
            transition-all duration-200
            font-semibold
          "
        >
          Cerrar sesión
        </button>
      </aside>
    </>
  );
}
