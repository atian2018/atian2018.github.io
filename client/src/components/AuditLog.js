import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Calendar, 
  Filter, 
  ChevronDown,
  ChevronRight,
  Activity,
  Users,
  Database
} from 'lucide-react';
import { mockAdminService } from '../services/mockDataService';

// Heuristic 6: Recognition rather than recall - Clear audit trail visualization
const AuditLog = () => {
  const [auditEntries, setAuditEntries] = useState([]);
  const [auditStats, setAuditStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedEntries, setExpandedEntries] = useState(new Set());
  const [filters, setFilters] = useState({
    action: '',
    user_email: '',
    entity_type: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    loadAuditData();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAuditData = async () => {
    try {
      const [entries, stats] = await Promise.all([
        mockAdminService.getAuditLog(filters),
        mockAdminService.getAuditStats()
      ]);
      setAuditEntries(entries);
      setAuditStats(stats);
    } catch (error) {
      console.error('Failed to load audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (entryId) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE_PATIENT':
      case 'CREATE_USER':
        return <User size={16} style={{ color: '#10b981' }} />;
      case 'UPDATE_PATIENT':
        return <FileText size={16} style={{ color: '#3b82f6' }} />;
      case 'SYNC_PATIENT':
        return <Database size={16} style={{ color: '#8b5cf6' }} />;
      case 'TOGGLE_USER_STATUS':
        return <Users size={16} style={{ color: '#f59e0b' }} />;
      default:
        return <Activity size={16} style={{ color: '#6b7280' }} />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE_PATIENT':
      case 'CREATE_USER':
        return 'status-synced';
      case 'UPDATE_PATIENT':
        return 'status-pending';
      case 'SYNC_PATIENT':
        return 'status-synced';
      case 'TOGGLE_USER_STATUS':
        return 'status-error';
      default:
        return 'status-pending';
    }
  };

  const formatChanges = (changes) => {
    return Object.entries(changes).map(([field, change]) => (
      <div key={field} style={{ 
        padding: '8px 12px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '6px',
        marginBottom: '4px',
        fontSize: '14px'
      }}>
        <strong>{field.replace(/_/g, ' ').toUpperCase()}:</strong>
        <div style={{ marginTop: '2px' }}>
          {change.from === null ? (
            <span style={{ color: '#10b981' }}>Created: "{change.to}"</span>
          ) : (
            <span>
              <span style={{ color: '#ef4444' }}>"{change.from}"</span>
              <span style={{ margin: '0 8px', color: '#6b7280' }}>→</span>
              <span style={{ color: '#10b981' }}>"{change.to}"</span>
            </span>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading audit log...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Audit Statistics */}
      {auditStats && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <Activity size={24} style={{ color: '#3b82f6', marginBottom: '8px' }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {auditStats.total_entries}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Entries</div>
          </div>
          
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <Calendar size={24} style={{ color: '#10b981', marginBottom: '8px' }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {auditStats.last_24h}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Last 24 Hours</div>
          </div>
          
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <Users size={24} style={{ color: '#f59e0b', marginBottom: '8px' }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {Object.keys(auditStats.users).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Users</div>
          </div>
          
          <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <Database size={24} style={{ color: '#8b5cf6', marginBottom: '8px' }} />
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
              {auditStats.last_7d}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Last 7 Days</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
          <Filter size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
          Filter Audit Log
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <label className="form-label">Action Type</label>
            <select
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="form-input"
            >
              <option value="">All Actions</option>
              <option value="CREATE_PATIENT">Create Patient</option>
              <option value="UPDATE_PATIENT">Update Patient</option>
              <option value="CREATE_USER">Create User</option>
              <option value="TOGGLE_USER_STATUS">Toggle User Status</option>
              <option value="SYNC_PATIENT">Sync Patient</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">User Email</label>
            <input
              type="text"
              placeholder="Search by user email..."
              value={filters.user_email}
              onChange={(e) => setFilters({...filters, user_email: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">Entity Type</label>
            <select
              value={filters.entity_type}
              onChange={(e) => setFilters({...filters, entity_type: e.target.value})}
              className="form-input"
            >
              <option value="">All Types</option>
              <option value="patient">Patient</option>
              <option value="user">User</option>
            </select>
          </div>
          
          <div>
            <label className="form-label">Date From</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({...filters, date_from: e.target.value})}
              className="form-input"
            />
          </div>
          
          <div>
            <label className="form-label">Date To</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({...filters, date_to: e.target.value})}
              className="form-input"
            />
          </div>
        </div>
        
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={() => setFilters({ action: '', user_email: '', entity_type: '', date_from: '', date_to: '' })}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Audit Log Entries */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Audit Log Entries ({auditEntries.length})</h3>
        </div>

        {auditEntries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#6b7280' 
          }}>
            <FileText size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No audit entries found matching your criteria.</p>
          </div>
        ) : (
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {auditEntries.map((entry) => (
              <div key={entry.id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px', 
                marginBottom: '12px',
                backgroundColor: '#fafafa'
              }}>
                {/* Entry Header */}
                <div 
                  style={{ 
                    padding: '16px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => toggleExpanded(entry.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {expandedEntries.has(entry.id) ? 
                      <ChevronDown size={16} style={{ color: '#6b7280' }} /> : 
                      <ChevronRight size={16} style={{ color: '#6b7280' }} />
                    }
                    {getActionIcon(entry.action)}
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                        {entry.action.replace(/_/g, ' ')}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        {entry.entity_name} • {entry.user_email}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`status-indicator ${getActionColor(entry.action)}`}>
                      {entry.entity_type}
                    </span>
                    <div style={{ fontSize: '14px', color: '#6b7280', textAlign: 'right' }}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                      <br />
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedEntries.has(entry.id) && (
                  <div style={{ 
                    padding: '16px', 
                    borderTop: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px'
                  }}>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                        Changes Made
                      </h4>
                      {formatChanges(entry.changes)}
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                      gap: '16px',
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      <div>
                        <strong>IP Address:</strong><br />
                        {entry.ip_address}
                      </div>
                      <div>
                        <strong>User Agent:</strong><br />
                        <span style={{ fontSize: '12px' }}>
                          {entry.user_agent.split(' ')[0]}...
                        </span>
                      </div>
                      <div>
                        <strong>Timestamp:</strong><br />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLog;
