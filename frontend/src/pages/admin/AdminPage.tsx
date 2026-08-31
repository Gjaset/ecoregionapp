import { useState, useEffect } from 'react';
import { Search, User, Mail, Shield, Trash2, Eye, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/comunes/Navbar';
import { Footer } from '../../components/comunes/Footer';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Request {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'CAR' | 'SDA' | 'COR' | 'FUN';
  status: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  createdAt: string;
  updatedAt: string;
}

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado'>('all');
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    
    const storedUsers = JSON.parse(localStorage.getItem('ecoregion_users') || '[]');
    const storedRequests = JSON.parse(localStorage.getItem('ecoregion_requests') || '[]');
    
    setUsers(storedUsers.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: (u.role === 'admin' ? 'admin' : 'user') as 'user' | 'admin',
      createdAt: u.createdAt,
    })));
    
    setRequests(storedRequests);
  }, [isAdmin]);

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

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) return;
    setShowDeleteConfirm(userId);
  };

  const confirmDeleteUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('ecoregion_users', JSON.stringify(updatedUsers));
    setShowDeleteConfirm(null);
  };

  const toggleUserRole = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, role: u.role === 'user' ? 'admin' : 'user' as 'user' | 'admin' } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('ecoregion_users', JSON.stringify(updatedUsers));
  };

  const updateRequestStatus = (requestId: string, status: Request['status']) => {
    const updatedRequests = requests.map(r => 
      r.id === requestId ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem('ecoregion_requests', JSON.stringify(updatedRequests));
  };

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
                  <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as any)}>
                    <option value="all">Todos los roles</option>
                    <option value="user">Usuarios</option>
                    <option value="admin">Administradores</option>
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
                      <th>Fecha registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="empty-state">No hay usuarios</td>
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
                            <span className={`role-badge ${u.role}`}>
                              {u.role === 'admin' ? <Shield size={14} /> : <User size={14} />}
                              {u.role === 'admin' ? 'Admin' : 'Usuario'}
                            </span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                          <td>
                            <div className="action-menu">
                              <button className="action-btn" onClick={() => toggleUserRole(u.id)} title="Cambiar rol">
                                {u.role === 'user' ? <Shield size={16} /> : <User size={16} />}
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
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
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
                          <td className="request-id">{r.id.slice(0, 8)}...</td>
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
                                onChange={(e) => updateRequestStatus(r.id, e.target.value as Request['status'])}
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

          {showDeleteConfirm && (
            <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h3>Eliminar usuario</h3>
                <p>¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.</p>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancelar</button>
                  <button className="btn-primary danger" onClick={() => confirmDeleteUser(showDeleteConfirm)}>Eliminar</button>
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