import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import App from './App'
import MainPage from './pages/MainPage'
import FormularioFUNPage from './pages/FormularioFUNPage'
import FormCARPage from './pages/formulario/FormCARPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminPage from './pages/admin/AdminPage'
import FormatosPage from './pages/FormatosPage'
import MisSolicitudesPage from './pages/MisSolicitudesPage'
import FormatF1Page from './pages/formatos/FormatF1Page'
import FormatF2Page from './pages/formatos/FormatF2Page'
import FormatF3Page from './pages/formatos/FormatF3Page'
import FormatFG1Page from './pages/formatos/FormatFG1Page'
import FormatFG2Page from './pages/formatos/FormatFG2Page'
import './index.css'

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <div className="loading">Cargando...</div>;
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/formulario-fun" element={<FormularioFUNPage />} />
          <Route path="/formulario-car" element={<FormCARPage />} />
          <Route path="/formatos" element={<FormatosPage />} />
          <Route path="/formatos/f1" element={<FormatF1Page />} />
          <Route path="/formatos/f2" element={<FormatF2Page />} />
          <Route path="/formatos/f3" element={<FormatF3Page />} />
          <Route path="/formatos/fg1" element={<FormatFG1Page />} />
          <Route path="/formatos/fg2" element={<FormatFG2Page />} />
          <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} />
          <Route path="/admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)