import { useState, useEffect, useCallback } from 'react';
import { Download, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Navbar } from '../components/comunes/Navbar';
import { Footer } from '../components/comunes/Footer';

interface SolicitDoc {
  id: number;
  tipo: string;
  nombre_archivo: string;
  tamano_bytes: number;
  creado_en: string;
}

const MisSolicitudesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [docs, setDocs] = useState<SolicitDoc[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError('');
    try {
      setDocs(await api.listMisSolicitudes());
    } catch {
      setError('No se pudieron cargar tus solicitudes.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void load();
  }, [load]);

  const saveBlob = (blob: unknown, filename: string, type: string) => {
    const url = window.URL.createObjectURL(new Blob([blob as BlobPart], { type }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  };

  const downloadOne = async (d: SolicitDoc) => {
    setBusy(true);
    try {
      saveBlob(await api.downloadSolicitud(d.id), d.nombre_archivo, 'application/octet-stream');
    } catch {
      setError('No se pudo descargar el documento.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    if (selected.length === 0) return;
    setBusy(true);
    try {
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
      saveBlob(await api.downloadSolicitudesZip(selected), `mis_solicitudes_${stamp}.zip`, 'application/zip');
    } catch {
      setError('No se pudo descargar el ZIP.');
    } finally {
      setBusy(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  return (
    <div className="app-shell">
      <Navbar />
      <main className="admin-page">
        <div className="shell">
          <header className="admin-header">
            <div>
              <h1>Mis solicitudes</h1>
              <p>Historial de tus documentos exportados, en orden con fecha y hora</p>
            </div>
          </header>

          {error && <div className="auth-error" role="alert">{error}</div>}

          <section className="admin-section">
            <div className="section-toolbar">
              <span>{docs.length} documento(s)</span>
              <button className="btn-primary" onClick={() => void downloadZip()} disabled={selected.length === 0 || busy}>
                {busy ? 'Descargando…' : `Descargar ZIP (${selected.length})`}
              </button>
            </div>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={docs.length > 0 && selected.length === docs.length}
                        onChange={() => setSelected((prev) => (prev.length === docs.length ? [] : docs.map((d) => d.id)))}
                        aria-label="Seleccionar todos"
                      />
                    </th>
                    <th>Archivo</th>
                    <th>Tipo</th>
                    <th>Tamaño</th>
                    <th>Fecha y hora</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="empty-state">Cargando…</td></tr>
                  ) : docs.length === 0 ? (
                    <tr><td colSpan={6} className="empty-state">Aún no has exportado documentos</td></tr>
                  ) : (
                    docs.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selected.includes(d.id)}
                            onChange={() => setSelected((prev) => (prev.includes(d.id) ? prev.filter((x) => x !== d.id) : [...prev, d.id]))}
                            aria-label={`Seleccionar ${d.nombre_archivo}`}
                          />
                        </td>
                        <td className="request-id"><FileText size={14} /> {d.nombre_archivo}</td>
                        <td><span className="type-badge">{d.tipo.toUpperCase()}</span></td>
                        <td>{formatSize(d.tamano_bytes)}</td>
                        <td>{new Date(d.creado_en).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td>
                          <button className="action-btn" onClick={() => void downloadOne(d)} title="Descargar" disabled={busy}>
                            <Download size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MisSolicitudesPage;
