import { Leaf, MessageCircle } from 'lucide-react';
import logo from '/logo.svg';

export function Footer() {
  const whatsappNumber = '573001234567'; // TODO: Reemplazar con tu número de WhatsApp (código país + número, sin + ni espacios)
  const whatsappMessage = encodeURIComponent('Hola, necesito ayuda con mi trámite forestal');
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <>
      <footer className="site-footer" id="guia">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="EcoRegión" className="brand-logo" />
            <strong>EcoRegión</strong>
          </div>
          <p>Herramientas para trámites ambientales más claros y ordenados.</p>
          <span>© 2026 Eco Región SAS BIC</span>
        </div>
      </footer>
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </>
  );
}
