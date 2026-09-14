import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import App from './App'
import { AIAssistant } from './components/comunes/AIAssistant'
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

const FUN_COMPLETADO_KEY = 'ecoregion:fun-completado';

function FUNGuard({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (isAdmin) return <>{children}</>;
  const funCompletado = localStorage.getItem(FUN_COMPLETADO_KEY) === '1';
  return funCompletado ? <>{children}</> : <Navigate to="/formulario-fun" replace />;
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
          <Route path="/formulario-car" element={
            <FUNGuard><FormCARPage /></FUNGuard>
          } />
          <Route path="/formatos" element={
            <FUNGuard><FormatosPage /></FUNGuard>
          } />
          <Route path="/formatos/f1" element={
            <FUNGuard><FormatF1Page /></FUNGuard>
          } />
          <Route path="/formatos/f2" element={
            <FUNGuard><FormatF2Page /></FUNGuard>
          } />
          <Route path="/formatos/f3" element={
            <FUNGuard><FormatF3Page /></FUNGuard>
          } />
          <Route path="/formatos/fg1" element={
            <FUNGuard><FormatFG1Page /></FUNGuard>
          } />
          <Route path="/formatos/fg2" element={
            <FUNGuard><FormatFG2Page /></FUNGuard>
          } />
          <Route path="/mis-solicitudes" element={<MisSolicitudesPage />} />
          <Route path="/admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />
          <Route path="/app/*" element={
            <FUNGuard><App /></FUNGuard>
          } />
        </Routes>
        <AIAssistant />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)