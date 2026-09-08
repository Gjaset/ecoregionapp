import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useState } from 'react';

export function AIAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <div className="ai-assistant">
      {open && (
        <section className="ai-chat" aria-label="Asistente EcoRegión">
          <header className="ai-chat-header">
            <span className="ai-avatar"><Bot size={17} /></span>
            <div><strong>Asistente EcoRegión</strong><small>Vista previa</small></div>
            <button className="ai-close" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={17} /></button>
          </header>
          <div className="ai-chat-body">
            <div className="ai-message">Hola. Puedo orientarte sobre los campos del formulario y los anexos requeridos.</div>
            <div className="ai-message ai-message-muted">Esta función estará disponible próximamente.</div>
          </div>
          <div className="ai-chat-input">
            <input type="text" placeholder="Escribe una pregunta..." aria-label="Pregunta para el asistente" disabled />
            <button aria-label="Enviar pregunta" disabled><Send size={15} /></button>
          </div>
        </section>
      )}
      <button className={`ai-fab ${open ? 'is-open' : ''}`} onClick={() => setOpen((current) => !current)} aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'} aria-expanded={open}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="ai-fab-pulse" />}
      </button>
    </div>
  );
}
