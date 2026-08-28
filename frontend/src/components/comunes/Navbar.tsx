import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="shell nav-inner">
        <a className="brand" href="#inicio" aria-label="EcoRegión, inicio">
          <span className="brand-mark"><Leaf size={20} strokeWidth={2.4} /></span>
          <span><strong>EcoRegión</strong><small>gestión ambiental</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Abrir menú">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
          <a href="#formulario" onClick={() => setOpen(false)}>Nuevo trámite</a>
          <a href="#guia" onClick={() => setOpen(false)}>Guía</a>
          <span className="status-chip"><span className="status-dot" /> Servicio activo</span>
        </nav>
      </div>
    </header>
  );
}
