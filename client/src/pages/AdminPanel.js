import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  FileText
} from 'lucide-react';
import { mockAdminService } from '../services/mockDataService';
import AuditLog from '../components/AuditLog';

// Heuristic 10: Help and documentation - Admin functionality
const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'audit'
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    role: 'researcher'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Use mock service for prototype
      const data = await mockAdminService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    try {
      // Use mock service for prototype
      await mockAdminService.createUser(newUser);
      toast.success('User created successfully');
      setNewUser({ email: '', password: '', role: 'researcher' });
      setShowCreateUser(false);
      loadUsers();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      // Use mock service for prototype
      await mockAdminService.toggleUserStatus(userId, !currentStatus);
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading admin panel...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Admin Panel
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage users, roles, and system settings.
          </p>
        </div>

        {activeTab === 'users' && (
          <button
            onClick={() => setShowCreateUser(!showCreateUser)}
            className="btn btn-primary"
          >
            <UserPlus size={20} />
            Add New User
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #e5e7eb', 
        marginBottom: '24px' 
      }}>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'users' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'users' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'users' ? '600' : '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Users size={16} />
          User Management
        </button>
        
        <button
          onClick={() => setActiveTab('audit')}
          style={{
            padding: '12px 24px',
            border: 'none',
            backgroundColor: 'transparent',
            borderBottom: activeTab === 'audit' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'audit' ? '#3b82f6' : '#6b7280',
            fontWeight: activeTab === 'audit' ? '600' : '400',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FileText size={16} />
          Audit Log
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' ? (
        <>
          {/* System Statistics */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '32px' 
          }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: '#dbeafe',
                  color: '#3b82f6'
                }}>
                  <Users size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                    {users.length}
                  </h3>
                  <p style={{ color: '#6b7280' }}>Total Users</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: '#d1fae5',
                  color: '#10b981'
                }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                    {users.filter(u => u.is_active).length}
                  </h3>
                  <p style={{ color: '#6b7280' }}>Active Users</p>
                </div>
              </div>
            </div>

            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  backgroundColor: '#fef3c7',
                  color: '#f59e0b'
                }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                    {users.filter(u => u.role === 'administrator').length}
                  </h3>
                  <p style={{ color: '#6b7280' }}>Administrators</p>
                </div>
              </div>
            </div>
          </div>

      {/* Create User Form */}
      {showCreateUser && (
        <div className="card" style={{ marginBottom: '32px' }}>
          <div className="card-header">
            <h3 className="card-title">Create New User</h3>
          </div>

          <form onSubmit={handleCreateUser}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="user@clinic.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-input"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Minimum 6 characters"
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role *
                </label>
                <select
                  id="role"
                  className="form-input"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  required
                >
                  <option value="researcher">Researcher</option>
                  <option value="administrator">Administrator</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn btn-primary">
                <UserPlus size={16} />
                Create User
              </button>
              <button 
                type="button" 
                onClick={() => setShowCreateUser(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">User Management</h3>
          <button
            onClick={loadUsers}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userData) => (
                <tr key={userData.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} style={{ color: '#6b7280' }} />
                      {userData.email}
                    </div>
                  </td>
                  <td>
                    <span className={`status-indicator ${
                      userData.role === 'administrator' ? 'status-synced' : 'status-pending'
                    }`}>
                      <Shield size={12} style={{ marginRight: '4px' }} />
                      {userData.role}
                    </span>
                  </td>
                  <td>{new Date(userData.created_at).toLocaleDateString()}</td>
                  <td>
                    {userData.last_login ? 
                      new Date(userData.last_login).toLocaleDateString() : 
                      'Never'
                    }
                  </td>
                  <td>
                    <span className={`status-indicator ${
                      userData.is_active ? 'status-synced' : 'status-error'
                    }`}>
                      {userData.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(userData.id, userData.is_active)}
                      className={`btn ${userData.is_active ? 'btn-danger' : 'btn-success'}`}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      title={userData.is_active ? 'Deactivate user' : 'Activate user'}
                    >
                      {userData.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      {userData.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

          {/* System Information */}
          <div className="card" style={{ marginTop: '32px' }}>
            <div className="card-header">
              <h3 className="card-title">System Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>Application Status</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle size={16} style={{ color: '#10b981' }} />
                  <span>System Online</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle size={16} style={{ color: '#10b981' }} />
                  <span>Database Connected</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <CheckCircle size={16} style={{ color: '#10b981' }} />
                  <span>REDCap Integration Ready</span>
                </div>
              </div>

              <div>
                <h4 style={{ marginBottom: '12px', color: '#374151' }}>Security Features</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={16} style={{ color: '#3b82f6' }} />
                  <span>HIPAA Compliant</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={16} style={{ color: '#3b82f6' }} />
                  <span>Role-based Access Control</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Shield size={16} style={{ color: '#3b82f6' }} />
                  <span>Encrypted Data Storage</span>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <AuditLog />
      )}
    </div>
  );
};

export default AdminPanel;
