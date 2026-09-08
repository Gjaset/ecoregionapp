import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, FileSpreadsheet, FileText, ChevronDown, Building2, Trees } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '/logo.svg';
import { useAuth } from '../../context/AuthContext';

type DropdownId = 'car' | 'sda' | 'corpoboyaca' | null;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openMenu, setOpenMenu] = useState<DropdownId>(null);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);

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

  const toggleMenu = (id: Exclude<DropdownId, null>) =>
    setOpenMenu((current) => (current === id ? null : id));

  const closeAll = () => {
    setOpenMenu(null);
    setOpen(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

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
          <span><strong>EcoRegión SAS BIC</strong><small>gestión ambiental</small></span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menú" aria-expanded={open}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav ref={navRef} className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <Link to="/" onClick={closeAll}>Inicio</Link>
          <Link to="/formulario-fun" onClick={closeAll}>Formulario General</Link>

          <div className="nav-dropdown">
            <button
              className="nav-dropdown-toggle"
              onClick={() => toggleMenu('car')}
              aria-label="Formulario CAR"
              aria-expanded={openMenu === 'car'}
              aria-haspopup="true"
            >
              <Building2 size={18} />  CAR
              <ChevronDown size={16} />
            </button>
            {openMenu === 'car' && (
              <div className="nav-dropdown-menu" role="menu">
                <div className="nav-dropdown-section">
                  <span className="nav-dropdown-section-title">CAR Cundinamarca</span>
                  <Link to="/formulario-car" onClick={closeAll}>
                    <FileText size={18} /> Abrir formulario CAR
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="nav-dropdown">
            <button
              className="nav-dropdown-toggle"
              onClick={() => toggleMenu('sda')}
              aria-label="Formularios Secretaría Distrital"
              aria-expanded={openMenu === 'sda'}
              aria-haspopup="true"
            >
              <Building2 size={18} /> Secretaría de Ambiente
              <ChevronDown size={16} />
            </button>
            {openMenu === 'sda' && (
              <div className="nav-dropdown-menu" role="menu">
                <div className="nav-dropdown-section">
                  <span className="nav-dropdown-section-title">Formularios PM</span>
                  <Link to="/formatos/f1" onClick={closeAll}>
                    <FileSpreadsheet size={18} /> PM04-PR30-F1 - Solicitud de aprovechamiento
                  </Link>
                  <Link to="/formatos/f2" onClick={closeAll}>
                    <FileSpreadsheet size={18} /> PM04-PR30-F2 - Ficha silvicultural
                  </Link>
                  <Link to="/formatos/f3" onClick={closeAll}>
                    <FileText size={18} /> PM04-PR30-F3 - Ficha técnica de registro
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="nav-dropdown">
            <button
              className="nav-dropdown-toggle"
              onClick={() => toggleMenu('corpoboyaca')}
              aria-label="Formularios Corpoboyacá"
              aria-expanded={openMenu === 'corpoboyaca'}
              aria-haspopup="true"
            >
              <Trees size={18} /> Corpoboyacá
              <ChevronDown size={16} />
            </button>
            {openMenu === 'corpoboyaca' && (
              <div className="nav-dropdown-menu" role="menu">
                <div className="nav-dropdown-section">
                  <span className="nav-dropdown-section-title">Formularios FG</span>
                  <Link to="/formatos/fg1" onClick={closeAll}>
                    <FileSpreadsheet size={18} /> FGR-06 - Registro de información forestal
                  </Link>
                  <Link to="/formatos/fg2" onClick={closeAll}>
                    <FileSpreadsheet size={18} /> FGR-29 - Declaración de costos
                  </Link>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <>
              {isAdmin && <Link to="/admin" onClick={closeAll}><LayoutDashboard size={18} /> Panel Admin</Link>}
              <div className="user-menu">
                <Link to="/formulario-fun" onClick={closeAll} className="user-link">
                  <User size={18} /> {user?.name}
                </Link>
                <button className="btn-logout" onClick={handleLogout} aria-label="Cerrar sesión">
                  <LogOut size={18} /> Salir
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeAll} className="nav-link-login">Iniciar sesión</Link>
              <Link to="/register" onClick={closeAll} className="nav-link-register">Registrarse</Link>
            </>
          )}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}>
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
}
