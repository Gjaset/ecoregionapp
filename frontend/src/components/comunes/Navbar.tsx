import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.svg';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [showFormulariosSDA, setShowFormulariosSDA] = useState(false);
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
          <Link to="/formulario-car" onClick={() => setOpen(false)}>Formulario CAR</Link>
          
          {/* Dropdown Formularios SDA */}
          <div className="nav-dropdown">
            <button className="nav-dropdown-toggle" onClick={() => setShowFormulariosSDA(!showFormulariosSDA)} aria-label="Formularios SDA">
              <FileSpreadsheet size={18} /> Formularios
              <ChevronDown size={16} />
            </button>
            {showFormulariosSDA && (
              <div className="nav-dropdown-menu">
                <div className="nav-dropdown-section">
                  <span className="nav-dropdown-section-title">Formatos PM</span>
                  <Link to="/formatos/f1" onClick={() => { setShowFormulariosSDA(false); setOpen(false); }}>
                    <FileSpreadsheet size={18} /> Formato F1 - Solicitud Aprovechamiento (.xlsx)
                  </Link>
                  <Link to="/formatos/f2" onClick={() => { setShowFormulariosSDA(false); setOpen(false); }}>
                    <FileSpreadsheet size={18} /> Formato F2 - Ficha Silvicultural (.xls)
                  </Link>
                  <Link to="/formatos/f3" onClick={() => { setShowFormulariosSDA(false); setOpen(false); }}>
                    <FileText size={18} /> Formato F3 - Ficha Técnica Registro (.docx)
                  </Link>
                </div>
                <div className="nav-dropdown-section">
                  <span className="nav-dropdown-section-title">Formatos FG</span>
                  <Link to="/formatos/fg1" onClick={() => { setShowFormulariosSDA(false); setOpen(false); }}>
                    <FileSpreadsheet size={18} /> Formato FG1 - Registro Información (FGR-06)
                  </Link>
                  <Link to="/formatos/fg2" onClick={() => { setShowFormulariosSDA(false); setOpen(false); }}>
                    <FileSpreadsheet size={18} /> Formato FG2 - Declaración Costos (FGR-29)
                  </Link>
                </div>
              </div>
            )}
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
        </div>
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
