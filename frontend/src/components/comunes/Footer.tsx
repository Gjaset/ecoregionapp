import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer" id="guia">
      <div className="shell footer-grid">
        <div className="footer-brand"><Leaf size={18} /><strong>EcoRegión</strong></div>
        <p>Herramientas para trámites ambientales más claros y ordenados.</p>
        <span>© 2026 Eco Región SAS BIC</span>
      </div>
    </footer>
  );
}
