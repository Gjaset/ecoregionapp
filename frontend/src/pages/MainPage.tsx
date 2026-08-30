import { ArrowDown, Sparkles, Shield, Zap, Users, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/comunes/Navbar';
import { Footer } from '../components/comunes/Footer';

const MainPage: React.FC = () => {
  return (
    <div className="app-shell" id="inicio">
      <Navbar />
      <main>
        <section className="hero shell" id="inicio">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={15} /> Trámite guiado</span>
            <h1>Un permiso forestal, <i>sin vueltas.</i></h1>
            <p>Organiza la información del aprovechamiento y recibe un documento técnico listo para revisar.</p>
            <Link className="scroll-link" to="/formulario-fun"><span>Empezar formulario</span><ArrowDown size={17} /></Link>
          </div>
          <div className="hero-note"><span className="note-line" /><p>Normalización automática<br /><strong>+ revisión humana</strong></p></div>
        </section>

        <section className="features shell" id="features">
          <div className="section-head">
            <span className="eyebrow">¿Qué obtienes?</span>
            <h2>Todo en un solo lugar</h2>
          </div>
          <div className="features-grid">
            <article className="feature-card">
              <div className="feature-icon"><Shield size={24} /></div>
              <h3>Validación automática</h3>
              <p>Revisamos que tu información cumpla con los requisitos normativos antes de enviarla.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Zap size={24} /></div>
              <h3>Generación de documentos</h3>
              <p>Obtén el formato técnico listo para presentar ante la autoridad ambiental.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Users size={24} /></div>
              <h3>Soporte multi-autoridad</h3>
              <p>CAR, SDA, Corpoboyacá y formulario general único nacional.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><FileText size={24} /></div>
              <h3>Historial y seguimiento</h3>
              <p>Guarda tus trámites y consulta el estado en cualquier momento.</p>
            </article>
            <article className="feature-card">
              <div className="feature-icon"><Search size={24} /></div>
              <h3>Búsqueda de requisitos</h3>
              <p>Encuentra rápido qué necesitas según tu tipo de aprovechamiento.</p>
            </article>
          </div>
        </section>

        <section className="cta shell" id="cta">
          <div className="cta-card">
            <h2>¿Listo para iniciar tu trámite?</h2>
            <p>Selecciona la autoridad competente y completa el formulario guiado paso a paso.</p>
            <Link className="primary-button" to="/formulario-fun"><Sparkles size={18} /> Ir al Formulario General</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default MainPage;