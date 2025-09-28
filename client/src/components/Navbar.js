import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, LogOut, Database, FileText, BarChart3, Settings } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  // Heuristic 4: Consistency and standards - Navigation structure
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/patient-form', label: 'Patient Form', icon: FileText },
    { path: '/reports', label: 'Reports', icon: Database },
  ];

  // Add admin panel for administrators
  if (user.role === 'administrator') {
    navItems.push({ path: '/admin', label: 'Admin Panel', icon: Settings });
  }

  return (
    <nav className="nav">
      <div className="nav-content">
        <div className="nav-menu">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          
          {/* Right side items */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginLeft: 'auto'
          }}>
            {/* Compact connection status */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: navigator.onLine ? '#d1fae5' : '#fef3c7',
              borderRadius: '16px',
              border: `1px solid ${navigator.onLine ? '#10b981' : '#f59e0b'}`,
              fontSize: '12px',
              fontWeight: '600',
              color: navigator.onLine ? '#065f46' : '#92400e'
            }}>
              {navigator.onLine ? (
                <>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#10b981', 
                    borderRadius: '50%' 
                  }}></div>
                  ONLINE
                </>
              ) : (
                <>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    backgroundColor: '#f59e0b', 
                    borderRadius: '50%' 
                  }}></div>
                  OFFLINE
                </>
              )}
            </div>
            
            {/* Compact user info */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#6b7280',
              fontSize: '14px'
            }}>
              <User size={16} />
              <span>{user.email.split('@')[0]}</span>
              <span style={{ 
                fontSize: '12px', 
                padding: '2px 6px', 
                backgroundColor: user.role === 'administrator' ? '#dbeafe' : '#f3f4f6',
                color: user.role === 'administrator' ? '#1e40af' : '#6b7280',
                borderRadius: '4px'
              }}>
                {user.role}
              </span>
              <button
                onClick={onLogout}
                className="btn btn-secondary"
                style={{ 
                  padding: '6px 12px', 
                  fontSize: '12px',
                  minWidth: 'auto'
                }}
                title="Logout from the system"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
