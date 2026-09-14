import { useCallback, useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { DocxEditor } from './DocxEditor';
import './formatos.css';

interface Ficha3Data {
  radicado: string;
  fechaVisita: string;
  especie: string;
  nombreCientifico: string;
  arbolNo: string;
  codSigau: string;
  localizacion: string;
  sitioVisita: string;
  solicitante: string;
  direccionSolicitante: string;
  identificacion: string; // c.c. ó NIT
  estadoFisico: string;
  estadoSanitario: string;
  causasIntervencion: string;
  pap: string;
  alturaTotal: string;
  alturaCom: string;
  volumenComercial: string;
  conceptoTecnico: string;
  firma: string;
}

const initialState: Ficha3Data = {
  radicado: '', fechaVisita: '', especie: '', nombreCientifico: '', arbolNo: '',
  codSigau: '', localizacion: '', sitioVisita: '', solicitante: '',
  direccionSolicitante: '', identificacion: '', estadoFisico: '', estadoSanitario: '',
  causasIntervencion: '', pap: '', alturaTotal: '', alturaCom: '', volumenComercial: '',
  conceptoTecnico: '', firma: '',
};

// Mapa campo -> etiqueta exacta en el documento (para ubicar la celda a rellenar)
const MAPEO_F3: Record<string, string> = {
  radicado: 'Radicado No.',
  fechaVisita: 'Fecha de visita técnica',
  especie: 'Especie',
  nombreCientifico: 'N. científico',
  arbolNo: 'Árbol N.º',
  codSigau: 'Cod.SIGAU',
  localizacion: 'Localización Exacta del árbol',
  sitioVisita: 'Sitio de Visita',
  solicitante: 'Solicitante',
  direccionSolicitante: 'Dirección Solicitante',
  identificacion: 'c.c. ó N.I.T',
  estadoFisico: 'ESTADO FISICO:',
  estadoSanitario: 'ESTADO SANITARIO:',
  causasIntervencion: 'CAUSAS DE LA INTERVENCIÓN',
  pap: 'P.A.P. (m)',
  alturaTotal: 'Altura Total (m)',
  alturaCom: 'Altura Com. (m)',
  volumenComercial: 'Volumen Comercial (m3)',
  conceptoTecnico: 'CONCEPTO TÉCNICO',
  firma: 'Ing. Forestal: ',
};

const CAMPOS: Array<{ key: keyof Ficha3Data; label: string; tipo?: string }> = [
  { key: 'radicado', label: 'Radicado No.' },
  { key: 'fechaVisita', label: 'Fecha de visita técnica', tipo: 'date' },
  { key: 'especie', label: 'Especie' },
  { key: 'nombreCientifico', label: 'N. científico' },
  { key: 'arbolNo', label: 'Árbol N.º' },
  { key: 'codSigau', label: 'Código SIGAU' },
  { key: 'localizacion', label: 'Localización exacta del árbol' },
  { key: 'sitioVisita', label: 'Sitio de visita' },
  { key: 'solicitante', label: 'Solicitante' },
  { key: 'direccionSolicitante', label: 'Dirección del solicitante' },
  { key: 'identificacion', label: 'Cédula / NIT' },
  { key: 'estadoFisico', label: 'Estado físico' },
  { key: 'estadoSanitario', label: 'Estado sanitario' },
  { key: 'causasIntervencion', label: 'Causas de la intervención' },
  { key: 'pap', label: 'P.A.P. (m)' },
  { key: 'alturaTotal', label: 'Altura total (m)' },
  { key: 'alturaCom', label: 'Altura comercial (m)' },
  { key: 'volumenComercial', label: 'Volumen comercial (m³)' },
  { key: 'conceptoTecnico', label: 'Concepto técnico' },
  { key: 'firma', label: 'Nombre del profesional' },
];

export const FormatF3: React.FC = () => {
  const [formData, setFormData] = useState<Ficha3Data>(initialState);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const setField = useCallback((key: keyof Ficha3Data, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setMessage(null);
  }, []);

  const handleClear = useCallback(() => {
    setFormData({ ...initialState });
    setMessage(null);
  }, []);

  return (
    <div className="formato-container">
      <header className="formato-header">
        <h1>F3 · Ficha Técnica de Registro (Ficha 2)</h1>
        <p>Secretaría Distrital de Ambiente — edita la ficha y expórtala</p>
      </header>

      <div className="formato-toolbar">
        <button className="btn-secondary" onClick={handleClear} title="Limpiar todos los campos">Limpiar</button>
      </div>

      {message && (
        <div className={`formato-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="formato-form">
        <div className="form-section">
          <h2>Datos del árbol</h2>
          <div className="field-grid">
            {CAMPOS.slice(0, 8).map((c) => (
              <div className={`field ${c.key === 'localizacion' ? 'field-wide' : ''}`} key={c.key}>
                <label>{c.label}</label>
                <input
                  type={c.tipo || 'text'}
                  value={formData[c.key]}
                  onChange={(e) => setField(c.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Estado e intervención</h2>
          <div className="field-grid">
            {CAMPOS.slice(8).map((c) => (
              <div className={`field ${c.key === 'causasIntervencion' || c.key === 'conceptoTecnico' ? 'field-wide' : ''}`} key={c.key}>
                <label>{c.label}</label>
                <input
                  type={c.tipo || 'text'}
                  value={formData[c.key]}
                  onChange={(e) => setField(c.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <DocxEditor
        src="/formatos/formatospm/PM04-PR30-F3 Ficha tecnica de registro Ficha 2.docx"
        titulo="F3 · Ficha Técnica de Registro"
        nombreArchivo="PM04-PR30-F3_Ficha_Tecnica"
        mapeo={MAPEO_F3}
        valores={formData as unknown as Record<string, unknown>}
        onError={(msg) => setMessage({ type: 'error', text: msg })}
        onInfo={(msg) => setMessage({ type: 'success', text: msg })}
      />
    </div>
  );
};

export default FormatF3;