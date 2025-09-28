import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Users, 
  FileText, 
  Download, 
  RefreshCw,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { patientService } from '../services/patientService';
import SyncStatusIndicator from '../components/SyncStatusIndicator';

// Heuristic 6: Recognition rather than recall - Dashboard with clear metrics
const Dashboard = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    synced: 0,
    errors: 0
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
      
      // Calculate statistics
      const newStats = patientService.getSyncStats();
      setStats(newStats);
    } catch (error) {
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = () => {
    loadPatients();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading dashboard...</span>
      </div>
    );
  }

  // Heuristic 8: Aesthetic and minimalist design - Clean dashboard layout
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Dashboard
          </h1>
          <p style={{ color: '#6b7280' }}>
            Welcome back, {user.email}. Manage your patient data collection.
          </p>
        </div>
        
        <Link to="/patient-form" className="btn btn-primary">
          <Plus size={20} />
          New Patient Record
        </Link>
      </div>

      {/* Heuristic 1: Visibility of system status - Sync status */}
      <SyncStatusIndicator onSync={handleSync} />

      {/* Statistics cards */}
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
                {stats.total}
              </h3>
              <p style={{ color: '#6b7280' }}>Total Records</p>
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
              <Clock size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {stats.pending}
              </h3>
              <p style={{ color: '#6b7280' }}>Pending Sync</p>
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
                {stats.synced}
              </h3>
              <p style={{ color: '#6b7280' }}>Synced Records</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              padding: '16px', 
              borderRadius: '12px', 
              backgroundColor: '#fee2e2',
              color: '#ef4444'
            }}>
              <TrendingUp size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '4px' }}>
                {stats.errors}
              </h3>
              <p style={{ color: '#6b7280' }}>Sync Errors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent records */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Patient Records</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={loadPatients}
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
              title="Refresh data"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <Link
              to="/reports"
              className="btn btn-secondary"
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              <Download size={16} />
              Export
            </Link>
          </div>
        </div>

        {patients.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No patient records found.</p>
            <Link to="/patient-form" className="btn btn-primary" style={{ marginTop: '16px' }}>
              Create Your First Record
            </Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Diagnosis</th>
                  <th>Created</th>
                  <th>Sync Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.slice(0, 10).map((patient) => (
                  <tr key={patient.id}>
                    <td>
                      <code style={{ 
                        backgroundColor: '#f3f4f6', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}>
                        {patient.patient_id}
                      </code>
                    </td>
                    <td>
                      <strong>{patient.first_name} {patient.last_name}</strong>
                    </td>
                    <td>{patient.diagnosis || 'Not specified'}</td>
                    <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-indicator status-${patient.sync_status}`}>
                        {patient.sync_status}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`/reports?patient=${patient.id}`}
                        className="btn btn-secondary"
                        style={{ padding: '4px 12px', fontSize: '12px' }}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {patients.length > 10 && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <Link to="/reports" className="btn btn-secondary">
                  View All Records
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
