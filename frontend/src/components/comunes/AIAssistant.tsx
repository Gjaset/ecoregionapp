import { Bot, Loader2, MessageCircle, Send, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { api } from '../../services/api';

type ChatMessage = { role: 'user' | 'assistant'; content: string; fallback?: boolean };

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hola. Puedo orientarte sobre los campos del formulario y los anexos requeridos.' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const content = question.trim();
    if (!content || loading) return;
    setQuestion('');
    setError('');
    setMessages((current) => [...current, { role: 'user', content }]);
    setLoading(true);
    try {
      const response = await api.chat([
        { role: 'system', content: 'Eres el asistente de EcoRegión. Responde en español y orienta sobre el trámite forestal sin inventar requisitos.' },
        ...messages.map(({ role, content: message }) => ({ role, content: message })),
        { role: 'user', content },
      ]);
      setMessages((current) => [...current, { role: 'assistant', content: response.reply, fallback: response.fallback }]);
    } catch {
      setError('No pudimos contactar al asistente. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-assistant">
      {open && (
        <section className="ai-chat" aria-label="Asistente EcoRegión">
          <header className="ai-chat-header">
            <span className="ai-avatar"><Bot size={17} /></span>
            <div><strong>Asistente EcoRegión</strong><small>Orientación en tiempo real</small></div>
            <button className="ai-close" onClick={() => setOpen(false)} aria-label="Cerrar asistente"><X size={17} /></button>
          </header>
          <div className="ai-chat-body">
            {messages.map((message, index) => (
              <div className={`ai-message ${message.role === 'user' ? 'ai-message-user' : ''}`} key={`${message.role}-${index}`}>
                {message.content}
                {message.fallback && <small className="ai-fallback">Respuesta de respaldo</small>}
              </div>
            ))}
            {loading && <div className="ai-message ai-message-muted"><Loader2 className="spin" size={15} /> Pensando…</div>}
            {error && <div className="ai-error" role="alert">{error}</div>}
          </div>
          <form className="ai-chat-input" onSubmit={sendQuestion}>
            <input className="control" type="text" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Escribe una pregunta..." aria-label="Pregunta para el asistente" />
            <button type="submit" aria-label="Enviar pregunta" disabled={loading || !question.trim()}><Send size={15} /></button>
          </form>
        </section>
      )}
      <button className={`ai-fab ${open ? 'is-open' : ''}`} onClick={() => setOpen((current) => !current)} aria-label={open ? 'Cerrar asistente' : 'Abrir asistente'} aria-expanded={open}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
        {!open && <span className="ai-fab-pulse" />}
      </button>
    </div>
  );
}
