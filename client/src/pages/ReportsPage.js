import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Download, 
  FileText, 
  Calendar,
  Filter,
  Search,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { patientService } from '../services/patientService';

// Heuristic 7: Flexibility and efficiency of use - Multiple export options
const ReportsPage = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    syncStatus: 'all'
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (error) {
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = !filters.search || 
      patient.patient_id.toLowerCase().includes(filters.search.toLowerCase()) ||
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(filters.search.toLowerCase()) ||
      (patient.diagnosis && patient.diagnosis.toLowerCase().includes(filters.search.toLowerCase()));

    const matchesDate = (!filters.dateFrom && !filters.dateTo) ||
      (patient.created_at >= filters.dateFrom && patient.created_at <= (filters.dateTo || '9999-12-31'));

    const matchesSyncStatus = filters.syncStatus === 'all' || patient.sync_status === filters.syncStatus;

    return matchesSearch && matchesDate && matchesSyncStatus;
  });

  const handleExportPDF = async (patientId) => {
    setExporting(true);
    try {
      await patientService.exportPDF(patientId);
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      await patientService.exportCSV();
      toast.success('CSV exported successfully!');
    } catch (error) {
      toast.error('Failed to export CSV');
    } finally {
      setExporting(false);
    }
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'synced':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'pending':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'error':
        return <AlertCircle size={16} style={{ color: '#ef4444' }} />;
      default:
        return <Clock size={16} style={{ color: '#6b7280' }} />;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading reports...</span>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Reports & Exports
          </h1>
          <p style={{ color: '#6b7280' }}>
            Export patient data in various formats for analysis and archiving.
          </p>
        </div>

        <button
          onClick={loadPatients}
          className="btn btn-secondary"
          disabled={loading}
        >
          <RefreshCw size={20} className={loading ? 'spinner' : ''} />
          Refresh
        </button>
      </div>

      {/* Export Options */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h3 className="card-title">Export Options</h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Bulk CSV Export */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e5e7eb', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <FileText size={32} style={{ color: '#3b82f6', marginBottom: '12px' }} />
            <h4 style={{ marginBottom: '8px' }}>Export All Data (CSV)</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
              Download all patient records as a spreadsheet for analysis
            </p>
            <button
              onClick={handleExportCSV}
              disabled={exporting || patients.length === 0}
              className="btn btn-primary"
            >
              <Download size={16} />
              Export CSV ({patients.length} records)
            </button>
          </div>

          {/* Date Range Export */}
          <div style={{ 
            padding: '20px', 
            border: '2px solid #e5e7eb', 
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <Calendar size={32} style={{ color: '#10b981', marginBottom: '12px' }} />
            <h4 style={{ marginBottom: '8px' }}>Date Range Export</h4>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
              Filter and export records by date range
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="form-input"
                style={{ padding: '8px', fontSize: '14px' }}
                placeholder="From"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="form-input"
                style={{ padding: '8px', fontSize: '14px' }}
                placeholder="To"
              />
            </div>
            <button
              onClick={handleExportCSV}
              disabled={exporting || filteredPatients.length === 0}
              className="btn btn-success"
            >
              <Download size={16} />
              Export Filtered ({filteredPatients.length} records)
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                placeholder="Search by patient ID, name, or diagnosis..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <select
            value={filters.syncStatus}
            onChange={(e) => setFilters({...filters, syncStatus: e.target.value})}
            className="form-input"
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="synced">Synced</option>
            <option value="error">Error</option>
          </select>

          <button
            onClick={() => setFilters({ search: '', dateFrom: '', dateTo: '', syncStatus: 'all' })}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <Filter size={16} />
            Clear Filters
          </button>
        </div>
      </div>

      {/* Patient Records Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            Patient Records ({filteredPatients.length} of {patients.length})
          </h3>
        </div>

        {filteredPatients.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No records found matching your criteria.</p>
            <button
              onClick={() => setFilters({ search: '', dateFrom: '', dateTo: '', syncStatus: 'all' })}
              className="btn btn-secondary"
              style={{ marginTop: '16px' }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Name</th>
                  <th>Date of Birth</th>
                  <th>Diagnosis</th>
                  <th>Created</th>
                  <th>Sync Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
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
                    <td>
                      {patient.date_of_birth ? 
                        new Date(patient.date_of_birth).toLocaleDateString() : 
                        'Not specified'
                      }
                    </td>
                    <td>{patient.diagnosis || 'Not specified'}</td>
                    <td>{new Date(patient.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getSyncStatusIcon(patient.sync_status)}
                        <span className={`status-indicator status-${patient.sync_status}`}>
                          {patient.sync_status}
                        </span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleExportPDF(patient.id)}
                        disabled={exporting}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        title="Export as PDF"
                      >
                        <FileText size={14} />
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
