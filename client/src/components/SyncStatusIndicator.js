import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { patientService } from '../services/patientService';

// Heuristic 1: Visibility of system status - Sync status display
const SyncStatusIndicator = ({ onSync }) => {
  const [stats, setStats] = useState({ total: 0, pending: 0, synced: 0, errors: 0 });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      setStats(patientService.getSyncStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline || syncing) return;

    setSyncing(true);
    try {
      await patientService.syncAllPending();
      setStats(patientService.getSyncStats());
      if (onSync) onSync();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div className="card-header">
        <h3 className="card-title">Data Sync Status</h3>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Connection status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOnline ? (
            <>
              <Cloud size={20} style={{ color: '#10b981' }} />
              <span>Online</span>
            </>
          ) : (
            <>
              <CloudOff size={20} style={{ color: '#ef4444' }} />
              <span>Offline</span>
            </>
          )}
        </div>

        {/* Sync statistics */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {stats.pending > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <RefreshCw size={16} style={{ color: '#f59e0b' }} />
              <span>{stats.pending} Pending</span>
            </div>
          )}
          
          {stats.synced > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle size={16} style={{ color: '#10b981' }} />
              <span>{stats.synced} Synced</span>
            </div>
          )}
          
          {stats.errors > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertCircle size={16} style={{ color: '#ef4444' }} />
              <span>{stats.errors} Errors</span>
            </div>
          )}
        </div>

        {/* Sync button */}
        {isOnline && stats.pending > 0 && (
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '14px' }}
          >
            <RefreshCw size={16} className={syncing ? 'spinner' : ''} />
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
        )}
      </div>

      {/* Heuristic 9: Help users recognize, diagnose, and recover from errors */}
      {!isOnline && stats.pending > 0 && (
        <div className="error-message" style={{ marginTop: '16px' }}>
          <strong>Offline Mode:</strong> You have {stats.pending} record(s) waiting to sync. 
          Data will automatically sync when you're back online.
        </div>
      )}
    </div>
  );
};

export default SyncStatusIndicator;
