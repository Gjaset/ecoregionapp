import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  normalizar: async (formData: any) => {
    const response = await axios.post(`${API_BASE_URL}/formulario/normalizar`, formData);
    return response.data;
  },
  generarDocumento: async (formData: any) => {
    const response = await axios.post(`${API_BASE_URL}/formulario/generar-documento`, formData, {
      responseType: 'blob'
    });
    return response.data;
  },
  getDraft: async (draftId: string) => {
    const response = await axios.get(`${API_BASE_URL}/formulario/drafts/${draftId}`);
    return response.data;
  },
  putDraft: async (draftId: string, version: number, data: unknown) => {
    const response = await axios.put(`${API_BASE_URL}/formulario/drafts/${draftId}`, { version, data });
    return response.data;
  },
  chat: async (messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) => {
    const response = await axios.post(`${API_BASE_URL}/ia/chat`, { messages });
    return response.data as { reply: string; fallback: boolean; model?: string };
  },
};