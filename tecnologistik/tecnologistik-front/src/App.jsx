import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';

import Login from './pages/Login';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminCuentas from './pages/AdminCuentas';
import AdminCategorias from './pages/AdminCategorias';
import AdminCentrosCosto from './pages/AdminCentrosCosto';
import AdminProveedores from './pages/AdminProveedores';
import EmpleadoDashboard from './pages/EmpleadoDashboard';
import Transacciones from './pages/Transacciones';
import Reportes from './pages/Reportes';
import Perfil from './pages/Perfil';
import Notificaciones from './pages/Notificaciones';
import CuentasEmpleado from './pages/CuentasEmpleado';

function ProtectedRoute({ children, rolPermitido }) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol')?.toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolPermitido && rol !== rolPermitido) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function RedirectByRole() {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol')?.toUpperCase();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rol === 'ADMIN') {
    return <Navigate to="/admin/usuarios" replace />;
  }

  return <Navigate to="/empleado/dashboard" replace />;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <AdminUsuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cuentas"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <AdminCuentas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <AdminCategorias />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/centros-costo"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <AdminCentrosCosto />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/proveedores"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <AdminProveedores />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transacciones"
          element={
            <ProtectedRoute>
              <Transacciones />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute rolPermitido="ADMIN">
              <Reportes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleado/dashboard"
          element={
            <ProtectedRoute rolPermitido="USUARIO">
              <EmpleadoDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/empleado/cuentas"
          element={
            <ProtectedRoute rolPermitido="USUARIO">
              <CuentasEmpleado />
            </ProtectedRoute>
          }
        />

        {/* Módulos compartidos: cualquier usuario autenticado, sin importar el rol */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute>
              <Notificaciones />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<RedirectByRole />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
    </ToastProvider>
  );
}