import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { SpreadsheetEditor } from './SpreadsheetEditor';
import './formatos.css';

export const FormatFG1: React.FC = () => {
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  return (
    <div className="formato-container">
      <header className="formato-header">
        <h1>FGR-06 · Registro de Información para Aprovechamiento</h1>
        <p>Corpoboyacá — completa la plantilla y expórtala</p>
      </header>
      {message && (
        <div className={`formato-message ${message.type}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}
      <SpreadsheetEditor
        src="/formatos/formatosFG/FGR-06-REGISTRO_INFOR.xlsx"
        titulo="FGR-06"
        nombreArchivo="FGR-06-REGISTRO_INFOR"
        onError={(msg) => setMessage({ type: 'error', text: msg })}
        onInfo={(msg) => setMessage({ type: 'success', text: msg })}
      />
    </div>
  );
};

export default FormatFG1;