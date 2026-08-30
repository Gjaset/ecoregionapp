import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import App from './App'
import MainPage from './pages/MainPage'
import FormularioFUNPage from './pages/FormularioFUNPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import AdminPage from './pages/admin/AdminPage'
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
          <Route path="/admin" element={
            <AdminRoute><AdminPage /></AdminRoute>
          } />
          <Route path="/app/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)