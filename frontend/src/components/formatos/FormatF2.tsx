import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { SpreadsheetEditor } from './SpreadsheetEditor';
import './formatos.css';

export const FormatF2: React.FC = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  return (
    <div className="formato-container">
      <header className="formato-header">
        <h1>F2 · Recolección de Información Silvicultural</h1>
        <p>Secretaría Distrital de Ambiente — completa la plantilla y expórtala</p>
      </header>
      {message && (
        <div className={`formato-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}
      <SpreadsheetEditor
        src="/formatos/formatospm/PM04-PR30-F2 Recoleccion informacion silvicultural individuo ficha1.xlsx"
        titulo="F2"
        nombreArchivo="PM04-PR30-F2_Ficha"
        onError={(msg) => setMessage({ type: 'error', text: msg })}
        onInfo={(msg) => setMessage({ type: 'success', text: msg })}
      />
    </div>
  );
};

export default FormatF2;