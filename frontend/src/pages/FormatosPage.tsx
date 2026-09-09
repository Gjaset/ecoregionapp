import React, { useState } from 'react';
import { LayoutDashboard, FileSpreadsheet, FileText, ChevronRight } from 'lucide-react';
import { FormatF1 } from '../components/formatos/FormatF1';
import { FormatF2 } from '../components/formatos/FormatF2';
import { FormatF3 } from '../components/formatos/FormatF3';
import { FormatFG1 } from '../components/formatos/FormatFG1';
import { FormatFG2 } from '../components/formatos/FormatFG2';
import { Navbar } from '../components/comunes/Navbar';
import { Footer } from '../components/comunes/Footer';
import { useAuth } from '../context/AuthContext';
import '../components/formatos/formatos.css';

type FormatoType = 'f1' | 'f2' | 'f3' | 'fg1' | 'fg2';

interface FormatoInfo {
  id: FormatoType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description: string;
  extension: string;
}

const FORMATOS: FormatoInfo[] = [
  {
    id: 'f1',
    title: 'Formato F1',
    subtitle: 'Solicitud Manejo Aprovechamiento Forestal',
    icon: <FileSpreadsheet size={24} />,
    description: 'Formulario completo para solicitud de aprovechamiento forestal y manejo sostenible. Incluye todos los datos del interesado, predio, especies, coordenadas y firmas.',
    extension: '.xlsx'
  },
  {
    id: 'f2',
    title: 'Formato F2',
    subtitle: 'Ficha 1 - Recolección Información Silvicultural',
    icon: <FileSpreadsheet size={24} />,
    description: 'Ficha de recolección de información silvicultural por individuo. Datos de ubicación, coordenadas, características del árbol y observaciones.',
    extension: '.xls'
  },
  {
    id: 'f3',
    title: 'Formato F3',
    subtitle: 'Ficha Técnica de Registro (Ficha 2)',
    icon: <FileText size={24} />,
    description: 'Ficha técnica de registro de predios forestales. Genera documento Word (.docx) con datos del predio, composición forestal, inventario y plan de manejo.',
    extension: '.docx'
  },
  {
    id: 'fg1',
    title: 'Formato FG1',
    subtitle: 'Registro Información Forestal (FGR-06)',
    icon: <FileSpreadsheet size={24} />,
    description: 'Formulario de registro de información forestal. Incluye datos del interesado, predio, especies, coordenadas y costos.',
    extension: '.xlsx'
  },
  {
    id: 'fg2',
    title: 'Formato FG2',
    subtitle: 'Declaración Costos Inversión (FGR-29 V3)',
    icon: <FileSpreadsheet size={24} />,
    description: 'Declaración de costos de inversión y operación. Incluye costos de inversión, operación, financiamiento y responsable técnico.',
    extension: '.xls'
  }
];

export const FormatosPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [activeFormato, setActiveFormato] = useState<FormatoType | null>(null);
  const [view, setView] = useState<'list' | 'detail'>('list');

  const formatoComponent = {
    f1: <FormatF1 />,
    f2: <FormatF2 />,
    f3: <FormatF3 />,
    fg1: <FormatFG1 />,
    fg2: <FormatFG2 />
  };

  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <div className="formatos-shell">
          <header className="formatos-header">
            <div className="formatos-header-content">
              <div className="formatos-breadcrumb">
                <LayoutDashboard size={18} />
                <span>Formatos</span>
              </div>
              <h1>Formatos Forestales</h1>
              <p>Selecciona un formato para editar y exportar</p>
            </div>
            {isAdmin && (
              <div className="formatos-admin-badge">
                <span>Panel de Administración</span>
                <ChevronRight size={16} />
              </div>
            )}
          </header>

          {view === 'list' ? (
            <div className="formatos-grid">
              {FORMATOS.map(formato => (
                <article key={formato.id} className="formato-card" onClick={() => { setActiveFormato(formato.id); setView('detail'); }}>
                  <div className="formato-card-icon">
                    {formato.icon}
                  </div>
                  <div className="formato-card-content">
                    <h3>{formato.title}</h3>
                    <h4>{formato.subtitle}</h4>
                    <p>{formato.description}</p>
                    <span className="formato-extension">{formato.extension}</span>
                  </div>
                  <ChevronRight size={20} className="formato-card-arrow" />
                </article>
              ))}
            </div>
          ) : (
            <div className="formato-detail">
              <button className="back-button" onClick={() => { setActiveFormato(null); setView('list'); }}>
                <ChevronRight size={18} />
                Volver a formatos
              </button>
              {activeFormato && formatoComponent[activeFormato]}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FormatosPage;