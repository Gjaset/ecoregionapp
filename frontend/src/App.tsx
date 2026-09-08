import { ArrowDown, Download, Loader2, Sparkles } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { Footer } from './components/comunes/Footer';
import { AIAssistant } from './components/comunes/AIAssistant';
import { Navbar } from './components/comunes/Navbar';
import { AuthoritySelector, type AuthorityCode } from './components/formulario/AuthoritySelector';
import FormularioCAR from './components/formulario/FormularioCAR';
import FormularioCOR from './components/formulario/FormularioCOR';
import FormularioSDA from './components/formulario/FormularioSDA';
import FormularioFUN from './components/formulario/formularioFUN';
import { NormalizationPanel } from './components/formulario/NormalizationPanel';
import { StepProgress } from './components/formulario/StepProgress';
import { api } from './services/api';
import type { FormData, NormalizedData } from './types/formulario';

const initialFormData: FormData = {
  titular: { nombre: '', nit: '', representante_legal: '', direccion: '' },
  predio: { nombre: '', municipio: '', vereda: '', latitud: '', longitud: '' },
  aprovechamiento: { tipo: '', justificacion: '', volumen_total: 0, unidad: 'm3' },
  especies: [{ nombre: '', cantidad: 0, diametro_cm: null }],
};

type FormSection = 'titular' | 'predio' | 'aprovechamiento';

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [normalizedData, setNormalizedData] = useState<NormalizedData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [authority, setAuthority] = useState<AuthorityCode>('CAR');
  const [authorityDetails, setAuthorityDetails] = useState<Record<string, string | boolean>>({});

  const updateSection = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section: FormSection) => {
    const { name, value } = event.target;
    const nextValue = section === 'aprovechamiento' && name === 'volumen_total' ? Number(value) : value;
    setFormData((current) => ({ ...current, [section]: { ...current[section], [name]: nextValue } }));
    setNormalizedData(null);
  };

  const updateSpecies = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const nextValue = name === 'nombre' ? value : value === '' ? null : Number(value);
    setFormData((current) => ({ ...current, especies: current.especies.map((item, itemIndex) => itemIndex === index ? { ...item, [name]: nextValue } : item) }));
    setNormalizedData(null);
  };

  const updateAuthorityDetail = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target;
    setAuthorityDetails((current) => ({ ...current, [name]: type === 'checkbox' ? (event.target as HTMLInputElement).checked : value }));
    setNormalizedData(null);
  };

  const normalize = async (confirmar_revision = false) => {
    setLoading(true);
    setError('');
    try {
      setNormalizedData(await api.normalizar({ ...formData, autoridad_seleccionada: authority, detalles_autoridad: authorityDetails, confirmar_revision }));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'No pudimos analizar estos datos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async () => {
    setLoading(true);
    setError('');
    try {
      const blob = await api.generarDocumento({ ...formData, autoridad_seleccionada: authority, detalles_autoridad: authorityDetails, confirmar_revision: true });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'aprovechamiento_forestal.docx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'No pudimos generar el documento.');
    } finally {
      setLoading(false);
    }
  };

  const addSpecies = () => setFormData((current) => ({ ...current, especies: [...current.especies, { nombre: '', cantidad: 0, diametro_cm: null }] }));
  const removeSpecies = (index: number) => setFormData((current) => ({ ...current, especies: current.especies.filter((_, itemIndex) => itemIndex !== index) }));

  return (
    <div className="app-shell" id="inicio">
      <Navbar />
      <main>
        <section className="hero shell" id="formulario">
          <div className="hero-copy">
            <span className="eyebrow hero-eyebrow"><Sparkles size={15} /> Trámite guiado</span>
            <h1>Un permiso forestal, <i>sin vueltas.</i></h1>
            <p>Organiza la información del aprovechamiento y recibe un documento técnico listo para revisar.</p>
            <a className="scroll-link" href="#datos"><span>Empezar formulario</span><ArrowDown size={17} /></a>
          </div>
          <div className="hero-note"><span className="note-line" /><p>Normalización automática<br /><strong>+ revisión humana</strong></p></div>
        </section>
        <section className="workflow shell" id="datos">
          <div className="workflow-top"><div><span className="eyebrow">Solicitud nueva</span><h2>Cuéntanos sobre el aprovechamiento</h2></div><StepProgress activeStep={normalizedData ? 3 : 0} /></div>
          <AuthoritySelector value={authority} onChange={(nextAuthority) => { setAuthority(nextAuthority); setAuthorityDetails({}); setNormalizedData(null); }} />
          {authority === 'SDA' && <FormularioSDA formData={formData} details={authorityDetails} onSectionChange={updateSection} onSpeciesChange={updateSpecies} onAddSpecies={addSpecies} onRemoveSpecies={removeSpecies} onDetailChange={updateAuthorityDetail} />}
          {authority === 'CAR' && <FormularioCAR formData={formData} details={authorityDetails} onSectionChange={updateSection} onSpeciesChange={updateSpecies} onAddSpecies={addSpecies} onRemoveSpecies={removeSpecies} onDetailChange={updateAuthorityDetail} />}
          {authority === 'CORPOBOYACA' && <FormularioCOR formData={formData} details={authorityDetails} onSectionChange={updateSection} onSpeciesChange={updateSpecies} onAddSpecies={addSpecies} onRemoveSpecies={removeSpecies} onDetailChange={updateAuthorityDetail} />}
          <div className="form-actions"><div><span className="action-hint">Paso final</span><p>Analizaremos tus datos antes de generar el documento.</p></div><button className="primary-button" onClick={() => normalize()} disabled={loading}>{loading ? <><Loader2 className="spin" size={18} /> Analizando...</> : <><Sparkles size={18} /> Analizar y continuar</>}</button></div>
        </section>
        {normalizedData && <section className="shell result-wrap"><NormalizationPanel data={normalizedData} loading={loading} onConfirm={() => normalize(true)} />{normalizedData.listo_para_generar && <button className="download-button" onClick={downloadDocument} disabled={loading}>{loading ? <Loader2 className="spin" size={18} /> : <Download size={18} />} {loading ? 'Generando documento...' : 'Descargar documento Word'}</button>}</section>}
        {error && <div className="shell error-message" role="alert">{error}</div>}
        <section className="shell" id="formulario-general">
          <div className="shell-inner">
            <h2 className="section-title">Formulario General</h2>
            <FormularioFUN />
          </div>
        </section>
      </main>
      <Footer />
      <AIAssistant />
    </div>
  );
}

export default App;
