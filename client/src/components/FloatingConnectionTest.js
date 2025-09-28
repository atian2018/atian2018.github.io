import React, { useState } from 'react';
import { Wifi, WifiOff, X } from 'lucide-react';

// Floating connection test button for demo purposes
const FloatingConnectionTest = () => {
  const [isOpen, setIsOpen] = useState(false);

  const simulateOffline = () => {
    window.dispatchEvent(new Event('offline'));
  };

  const simulateOnline = () => {
    window.dispatchEvent(new Event('online'));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          zIndex: 1000,
          transition: 'all 0.2s ease'
        }}
        title="Test Connection Status"
      >
        <Wifi size={24} />
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                Connection Status Test
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <X size={20} style={{ color: '#6b7280' }} />
              </button>
            </div>

            <p style={{ 
              marginBottom: '20px', 
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              Use these buttons to test the connection status indicators throughout the app.
              This is useful for demonstrating offline/online functionality.
            </p>
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                onClick={() => {
                  simulateOnline();
                  setIsOpen(false);
                }}
                className="btn btn-success"
                style={{ flex: 1 }}
              >
                <Wifi size={16} style={{ marginRight: '8px' }} />
                Simulate Online
              </button>
              
              <button
                onClick={() => {
                  simulateOffline();
                  setIsOpen(false);
                }}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                <WifiOff size={16} style={{ marginRight: '8px' }} />
                Simulate Offline
              </button>
            </div>
            
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '8px',
              fontSize: '14px',
              color: '#374151'
            }}>
              <strong>Current Status:</strong> {navigator.onLine ? 'Online' : 'Offline'}
              <br />
              <strong>Indicators:</strong> Check the top banner and navigation bar for status updates.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingConnectionTest;
