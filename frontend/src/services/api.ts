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
  }
};