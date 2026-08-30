import { Leaf, Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.svg';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved === 'dark' : prefersDark;
    setIsDark(initial);
    document.documentElement.setAttribute('data-theme', initial ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <Link className="brand" to="/" aria-label="EcoRegión, inicio">
          <img src={logo} alt="EcoRegión" className="brand-logo" />
          <span><strong>EcoRegión</strong><small>gestión ambiental</small></span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <Link to="/" onClick={() => setOpen(false)}>Inicio</Link>
          <Link to="/formulario-fun" onClick={() => setOpen(false)}>Formulario General</Link>
          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/admin" onClick={() => setOpen(false)}><LayoutDashboard size={18} /> Panel Admin</Link>}
              <div className="user-menu">
                <Link to="/formulario-fun" onClick={() => setOpen(false)} className="user-link">
                  <User size={18} /> {user?.name}
                </Link>
                <button className="btn-logout" onClick={handleLogout} aria-label="Cerrar sesión">
                  <LogOut size={18} /> Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="nav-link-login">Iniciar sesión</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="nav-link-register">Registrarse</Link>
            </>
          )}
          <span className="status-chip"><span className="status-dot" /> Servicio activo</span>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
