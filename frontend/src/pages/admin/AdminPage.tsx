import { useState, useEffect, useCallback } from 'react';
import { Search, User, Mail, Shield, Trash2, Eye, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

type UserRole = 'admin' | 'consultor' | 'cliente';

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  activo: boolean;
  createdAt: string;
}

interface Request {
  id: string;
  userName: string;
  userEmail: string;
  type: 'CAR' | 'SDA' | 'COR' | 'FUN';
  status: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  createdAt: string;
  updatedAt: string;
}

interface SolicitDoc {
  id: number;
  usuario_id: number;
  usuario_email: string;
  usuario_nombre: string;
  tipo: string;
  nombre_archivo: string;
  tamano_bytes: number;
  creado_en: string;
}

const ESTADO_TO_UI: Record<string, Request['status']> = {
  borrador: 'pendiente',
  en_revision: 'en_revision',
  listo_radicar: 'aprobado',
  radicado: 'aprobado',
  aprobado: 'aprobado',
  devuelto: 'rechazado',
};

const UI_TO_ESTADO: Record<Request['status'], string> = {
  pendiente: 'borrador',
  en_revision: 'en_revision',
  aprobado: 'aprobado',
  rechazado: 'devuelto',
};

const SIGLA_TO_TYPE: Record<string, Request['type']> = {
  CAR: 'CAR',
  SDA: 'SDA',
  CORPOBOYACA: 'COR',
};

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [docs, setDocs] = useState<SolicitDoc[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'docs'>('users');
  const [userFilter, setUserFilter] = useState<number | 'all'>('all');
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    setError('');
    try {
      const [apiUsers, tramites, solicitudes] = await Promise.all([
        api.listUsers(),
        api.listTramites(),
        api.listSolicitudes(),
      ]);
      setUsers(apiUsers.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.nombre,
        role: (u.rol as UserRole) || 'cliente',
        activo: u.activo,
        createdAt: u.creado_en,
      })));
      setRequests(tramites.map((t) => ({
        id: String(t.id),
        userName: t.datos_formulario?.titular?.nombre || `Cliente ${t.cliente_id ?? '—'}`,
        userEmail: t.datos_formulario?.titular?.nit || '—',
        type: SIGLA_TO_TYPE[t.autoridad_sigla || ''] || 'FUN',
        status: ESTADO_TO_UI[t.estado || ''] || 'pendiente',
        createdAt: t.creado_en || new Date().toISOString(),
        updatedAt: t.actualizado_en || t.creado_en || new Date().toISOString(),
      })));
      setDocs(solicitudes);
      setSelectedDocs([]);
    } catch {
      setError('No se pudieron cargar los datos. Verifica la conexión con el backend.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteUser = (userId: number) => {
    if (userId === user?.id) return;
    setShowDeleteConfirm(userId);
  };

  const confirmDeleteUser = async (userId: number) => {
    try {
      await api.deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      setError('No se pudo eliminar el usuario.');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const cycleUserRole = async (u: AdminUser) => {
    const next: UserRole = u.role === 'cliente' ? 'consultor' : u.role === 'consultor' ? 'admin' : 'cliente';
    try {
      const updated = await api.updateUser(u.id, { rol: next });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: updated.rol as UserRole } : x)));
    } catch {
      setError('No se pudo cambiar el rol.');
    }
  };

  const toggleUserActive = async (u: AdminUser) => {
    try {
      const updated = await api.updateUser(u.id, { activo: !u.activo });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, activo: updated.activo } : x)));
    } catch {
      setError('No se pudo cambiar el estado del usuario.');
    }
  };

  const updateRequestStatus = async (requestId: string, status: Request['status']) => {
    try {
      await api.updateTramiteEstado(Number(requestId), UI_TO_ESTADO[status]);
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r))
      );
    } catch {
      setError('No se pudo actualizar el estado del trámite.');
    }
  };

  const filteredDocs = docs.filter((d) => {
    const matchesUser = userFilter === 'all' || d.usuario_id === userFilter;
    const haystack = `${d.usuario_nombre} ${d.usuario_email} ${d.nombre_archivo}`.toLowerCase();
    return matchesUser && haystack.includes(searchTerm.toLowerCase());
  });

  const toggleDoc = (id: number) =>
    setSelectedDocs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleAllDocs = () =>
    setSelectedDocs((prev) => (prev.length === filteredDocs.length ? [] : filteredDocs.map((d) => d.id)));

  const downloadZip = async () => {
    if (selectedDocs.length === 0) return;
    setDownloadingZip(true);
    setError('');
    try {
      const blob = await api.downloadSolicitudesZip(selectedDocs);
      const first = docs.find((d) => d.id === selectedDocs[0]);
      const sameOwner = selectedDocs.every(
        (id) => docs.find((d) => d.id === id)?.usuario_id === first?.usuario_id
      );
      const stamp = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');
      const base = sameOwner && first
        ? first.usuario_nombre.replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'usuario'
        : 'solicitudes';
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/zip' }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${base}_${stamp}.zip`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('No se pudo descargar el ZIP.');
    } finally {
      setDownloadingZip(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 ? `${bytes} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });

  const getStatusLabel = (status: Request['status']) => {
    const labels: Record<Request['status'], string> = {
      pendiente: 'Pendiente',
      en_revision: 'En revisión',
      aprobado: 'Aprobado',
      rechazado: 'Rechazado',
    };
    return labels[status];
  };

  const getStatusClass = (status: Request['status']) => {
    const classes: Record<Request['status'], string> = {
      pendiente: 'status-pending',
      en_revision: 'status-review',
      aprobado: 'status-approved',
      rechazado: 'status-rejected',
    };
    return classes[status];
  };

  const roleLabel: Record<UserRole, string> = {
    admin: 'Admin',
    consultor: 'Consultor',
    cliente: 'Usuario',
  };

  if (!isAdmin) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="admin-page">
          <div className="shell">
            <div className="admin-denied">
              <Shield size={64} className="denied-icon" />
              <h2>Acceso denegado</h2>
              <p>No tienes permisos de administrador para acceder a esta página.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="admin-page">
        <div className="shell">
          <header className="admin-header">
            <div>
              <h1>Panel de Administración</h1>
              <p>Gestiona usuarios y solicitudes del sistema</p>
            </div>
            <div className="admin-stats">
              <div className="stat-card">
                <span className="stat-value">{users.length}</span>
                <span className="stat-label">Usuarios totales</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{requests.filter(r => r.status === 'pendiente').length}</span>
                <span className="stat-label">Solicitudes pendientes</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{requests.filter(r => r.status === 'aprobado').length}</span>
                <span className="stat-label">Solicitudes aprobadas</span>
              </div>
            </div>
          </header>

          {error && <div className="auth-error" role="alert">{error}</div>}
          {loading && <div className="loading">Cargando datos del servidor…</div>}

          <div className="admin-tabs">
            <button
              className={activeTab === 'users' ? 'active' : ''}
              onClick={() => setActiveTab('users')}
            >
              <User size={18} /> Usuarios ({users.length})
            </button>
            <button
              className={activeTab === 'requests' ? 'active' : ''}
              onClick={() => setActiveTab('requests')}
            >
              <Mail size={18} /> Solicitudes ({requests.length})
            </button>
            <button
              className={activeTab === 'docs' ? 'active' : ''}
              onClick={() => setActiveTab('docs')}
            >
              <Eye size={18} /> Documentos ({docs.length})
            </button>
          </div>

          {activeTab === 'users' && (
            <section className="admin-section">
              <div className="section-toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <Filter size={18} />
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}>
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administradores</option>
                    <option value="consultor">Consultores</option>
                    <option value="cliente">Clientes</option>
                  </select>
                </div>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Fecha registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">No hay usuarios</td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                              <span>{u.name}</span>
                            </div>
                          </td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`role-badge ${u.role === 'admin' ? 'admin' : 'user'}`}>
                              {u.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                              {roleLabel[u.role]}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${u.activo ? 'status-approved' : 'status-rejected'}`}>
                              {u.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                          <td>
                            <div className="action-menu">
                              <button className="action-btn" onClick={() => void cycleUserRole(u)} title="Cambiar rol">
                                {u.role === 'admin' ? <User size={16} /> : <Shield size={16} />}
                              </button>
                              <button
                                className="action-btn"
                                onClick={() => void toggleUserActive(u)}
                                title={u.activo ? 'Desactivar' : 'Activar'}
                                disabled={u.id === user?.id && u.activo}
                              >
                                <Eye size={16} />
                              </button>
                              <button className="action-btn danger" onClick={() => handleDeleteUser(u.id)} title="Eliminar">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'requests' && (
            <section className="admin-section">
              <div className="section-toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar solicitud..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <Filter size={18} />
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | Request['status'])}>
                    <option value="all">Todos los estados</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="en_revision">En revisión</option>
                    <option value="aprobado">Aprobado</option>
                    <option value="rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Tipo</th>
                      <th>Estado</th>
                      <th>Fecha creación</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">No hay solicitudes</td>
                      </tr>
                    ) : (
                      filteredRequests.map(r => (
                        <tr key={r.id}>
                          <td className="request-id">#{r.id}</td>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{r.userName.charAt(0).toUpperCase()}</div>
                              <span>{r.userName}</span>
                            </div>
                          </td>
                          <td><span className="type-badge">{r.type}</span></td>
                          <td>
                            <span className={`status-badge ${getStatusClass(r.status)}`}>
                              {getStatusLabel(r.status)}
                            </span>
                          </td>
                          <td>{new Date(r.createdAt).toLocaleDateString('es-ES')}</td>
                          <td>
                            <div className="action-menu">
                              <select
                                value={r.status}
                                onChange={(e) => void updateRequestStatus(r.id, e.target.value as Request['status'])}
                                className="status-select"
                              >
                                <option value="pendiente">Pendiente</option>
                                <option value="en_revision">En revisión</option>
                                <option value="aprobado">Aprobado</option>
                                <option value="rechazado">Rechazado</option>
                              </select>
                              <button className="action-btn" title="Ver detalles">
                                <Eye size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'docs' && (
            <section className="admin-section">
              <div className="section-toolbar">
                <div className="search-box">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Buscar por usuario o archivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <Filter size={18} />
                  <select
                    value={userFilter === 'all' ? 'all' : String(userFilter)}
                    onChange={(e) => setUserFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                  >
                    <option value="all">Todos los usuarios</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => void downloadZip()}
                  disabled={selectedDocs.length === 0 || downloadingZip}
                >
                  {downloadingZip ? 'Generando ZIP…' : `Descargar ZIP (${selectedDocs.length})`}
                </button>
              </div>

              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={filteredDocs.length > 0 && selectedDocs.length === filteredDocs.length}
                          onChange={toggleAllDocs}
                          aria-label="Seleccionar todos"
                        />
                      </th>
                      <th>Usuario</th>
                      <th>Archivo</th>
                      <th>Tipo</th>
                      <th>Tamaño</th>
                      <th>Fecha y hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="empty-state">No hay documentos exportados</td>
                      </tr>
                    ) : (
                      filteredDocs.map((d) => (
                        <tr key={d.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedDocs.includes(d.id)}
                              onChange={() => toggleDoc(d.id)}
                              aria-label={`Seleccionar ${d.nombre_archivo}`}
                            />
                          </td>
                          <td>
                            <div className="user-info">
                              <div className="user-avatar">{d.usuario_nombre.charAt(0).toUpperCase()}</div>
                              <span>{d.usuario_nombre}<br /><small>{d.usuario_email}</small></span>
                            </div>
                          </td>
                          <td className="request-id">{d.nombre_archivo}</td>
                          <td><span className="type-badge">{d.tipo.toUpperCase()}</span></td>
                          <td>{formatSize(d.tamano_bytes)}</td>
                          <td>{formatDateTime(d.creado_en)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {showDeleteConfirm !== null && (
            <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Eliminar usuario</h3>
                <p>¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</button>
                  <button className="btn-primary danger" onClick={() => showDeleteConfirm !== null && void confirmDeleteUser(showDeleteConfirm)}>Eliminar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
