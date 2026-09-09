import axios from 'axios';

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const TOKEN_KEY = 'ecoregion_token';

// Instancia compartida: inyecta el JWT en cada petición autenticada.
export const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface BackendUser {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
  creado_en: string;
}

export const api = {
  normalizar: async (formData: any) => {
    const response = await http.post(`/formulario/normalizar`, formData);
    return response.data;
  },
  generarDocumento: async (formData: any) => {
    const response = await http.post(`/formulario/generar-documento`, formData, {
      responseType: 'blob'
    });
    return response.data;
  },
  getDraft: async (draftId: string) => {
    const response = await http.get(`/formulario/drafts/${draftId}`);
    return response.data;
  },
  putDraft: async (draftId: string, version: number, data: unknown) => {
    const response = await http.put(`/formulario/drafts/${draftId}`, { version, data });
    return response.data;
  },
  chat: async (messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) => {
    const response = await http.post(`/ia/chat`, { messages });
    return response.data as { reply: string; fallback: boolean; model?: string };
  },
  exportarFunPdf: async (formData: any) => {
    const response = await http.post(`/formulario/fun/exportar-pdf`, formData, {
      responseType: 'blob',
    });
    return response.data;
  },
  register: async (payload: { email: string; nombre: string; password: string }) => {
    const response = await http.post(`/auth/register`, payload);
    return response.data as BackendUser;
  },
  login: async (email: string, password: string) => {
    const body = new URLSearchParams({ username: email, password });
    const response = await http.post(`/auth/login`, body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data as { access_token: string; token_type: string };
  },
  me: async () => {
    const response = await http.get(`/auth/me`);
    return response.data as BackendUser;
  },
  listUsers: async () => {
    const response = await http.get(`/auth/usuarios`);
    return response.data as BackendUser[];
  },
  updateUser: async (id: number, payload: { rol?: string; activo?: boolean }) => {
    const response = await http.patch(`/auth/usuarios/${id}`, payload);
    return response.data as BackendUser;
  },
  deleteUser: async (id: number) => {
    await http.delete(`/auth/usuarios/${id}`);
  },
  listTramites: async () => {
    const response = await http.get(`/tramites`);
    return response.data as Array<{
      id: number;
      cliente_id: number | null;
      tipo_tramite: string | null;
      estado: string | null;
      datos_formulario: { titular?: { nombre?: string; nit?: string } } | null;
      autoridad_sigla: string | null;
      creado_en: string | null;
      actualizado_en: string | null;
    }>;
  },
  updateTramiteEstado: async (id: number, estado: string) => {
    const response = await http.patch(`/tramites/${id}/estado`, { estado });
    return response.data;
  },
  listMisSolicitudes: async () => {
    const response = await http.get(`/solicitudes/mias`);
    return response.data as Array<{
      id: number;
      usuario_id: number;
      usuario_email: string;
      usuario_nombre: string;
      tipo: string;
      nombre_archivo: string;
      tamano_bytes: number;
      creado_en: string;
    }>;
  },
  listSolicitudes: async (usuarioId?: number) => {
    const response = await http.get(`/solicitudes`, {
      params: usuarioId ? { usuario_id: usuarioId } : {},
    });
    return response.data as Array<{
      id: number;
      usuario_id: number;
      usuario_email: string;
      usuario_nombre: string;
      tipo: string;
      nombre_archivo: string;
      tamano_bytes: number;
      creado_en: string;
    }>;
  },
  downloadSolicitud: async (id: number) => {
    const response = await http.get(`/solicitudes/${id}/descargar`, { responseType: 'blob' });
    return response.data;
  },
  downloadSolicitudesZip: async (ids: number[]) => {
    const response = await http.get(`/solicitudes/descargar-zip`, {
      params: { ids: ids.join(',') },
      responseType: 'blob',
    });
    return response.data;
  },
};

export { TOKEN_KEY };
