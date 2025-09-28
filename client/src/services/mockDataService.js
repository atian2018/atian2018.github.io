// Mock data service for frontend-only prototype
// This simulates the backend API responses for UI testing

// Mock users
const mockUsers = [
  {
    id: 1,
    email: 'admin@clinic.com',
    role: 'administrator',
    created_at: '2024-01-15T10:00:00Z',
    last_login: '2024-01-20T14:30:00Z',
    is_active: true
  },
  {
    id: 2,
    email: 'researcher@clinic.com',
    role: 'researcher',
    created_at: '2024-01-16T09:00:00Z',
    last_login: '2024-01-20T11:15:00Z',
    is_active: true
  }
];

// Mock patient records
let mockPatients = [
  {
    id: 1,
    patient_id: 'PAT-123456-ABC',
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '1985-03-15',
    gender: 'male',
    diagnosis: 'Hypertension',
    treatment_plan: 'Lifestyle modifications, ACE inhibitor',
    notes: 'Patient responds well to treatment',
    created_by: 2,
    created_at: '2024-01-18T10:30:00Z',
    updated_at: '2024-01-18T10:30:00Z',
    sync_status: 'synced',
    redcap_record_id: 'REDCAP_001'
  },
  {
    id: 2,
    patient_id: 'PAT-789012-DEF',
    first_name: 'Jane',
    last_name: 'Smith',
    date_of_birth: '1990-07-22',
    gender: 'female',
    diagnosis: 'Type 2 Diabetes',
    treatment_plan: 'Metformin, dietary counseling',
    notes: 'Newly diagnosed, needs education',
    created_by: 2,
    created_at: '2024-01-19T14:45:00Z',
    updated_at: '2024-01-19T14:45:00Z',
    sync_status: 'pending',
    redcap_record_id: null
  },
  {
    id: 3,
    patient_id: 'PAT-345678-GHI',
    first_name: 'Michael',
    last_name: 'Johnson',
    date_of_birth: '1978-11-08',
    gender: 'male',
    diagnosis: 'Asthma',
    treatment_plan: 'Inhaler, avoid triggers',
    notes: 'Well-controlled condition',
    created_by: 2,
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    sync_status: 'error',
    redcap_record_id: null
  }
];

// Mock audit log entries
let mockAuditLog = [
  {
    id: 1,
    user_id: 2,
    user_email: 'researcher@clinic.com',
    action: 'CREATE_PATIENT',
    entity_type: 'patient',
    entity_id: 1,
    entity_name: 'PAT-123456-ABC (John Doe)',
    changes: {
      patient_id: { from: null, to: 'PAT-123456-ABC' },
      first_name: { from: null, to: 'John' },
      last_name: { from: null, to: 'Doe' },
      diagnosis: { from: null, to: 'Hypertension' }
    },
    timestamp: '2024-01-18T10:30:00Z',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 2,
    user_id: 2,
    user_email: 'researcher@clinic.com',
    action: 'UPDATE_PATIENT',
    entity_type: 'patient',
    entity_id: 1,
    entity_name: 'PAT-123456-ABC (John Doe)',
    changes: {
      treatment_plan: { from: 'Lifestyle modifications', to: 'Lifestyle modifications, ACE inhibitor' },
      notes: { from: 'Initial assessment', to: 'Patient responds well to treatment' }
    },
    timestamp: '2024-01-18T14:20:00Z',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 3,
    user_id: 2,
    user_email: 'researcher@clinic.com',
    action: 'CREATE_PATIENT',
    entity_type: 'patient',
    entity_id: 2,
    entity_name: 'PAT-789012-DEF (Jane Smith)',
    changes: {
      patient_id: { from: null, to: 'PAT-789012-DEF' },
      first_name: { from: null, to: 'Jane' },
      last_name: { from: null, to: 'Smith' },
      diagnosis: { from: null, to: 'Type 2 Diabetes' }
    },
    timestamp: '2024-01-19T14:45:00Z',
    ip_address: '192.168.1.105',
    user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  {
    id: 4,
    user_id: 1,
    user_email: 'admin@clinic.com',
    action: 'CREATE_USER',
    entity_type: 'user',
    entity_id: 3,
    entity_name: 'newuser@clinic.com',
    changes: {
      email: { from: null, to: 'newuser@clinic.com' },
      role: { from: null, to: 'researcher' }
    },
    timestamp: '2024-01-20T09:30:00Z',
    ip_address: '192.168.1.110',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 5,
    user_id: 1,
    user_email: 'admin@clinic.com',
    action: 'TOGGLE_USER_STATUS',
    entity_type: 'user',
    entity_id: 3,
    entity_name: 'newuser@clinic.com',
    changes: {
      is_active: { from: true, to: false }
    },
    timestamp: '2024-01-20T10:15:00Z',
    ip_address: '192.168.1.110',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  },
  {
    id: 6,
    user_id: 2,
    user_email: 'researcher@clinic.com',
    action: 'SYNC_PATIENT',
    entity_type: 'patient',
    entity_id: 1,
    entity_name: 'PAT-123456-ABC (John Doe)',
    changes: {
      sync_status: { from: 'pending', to: 'synced' },
      redcap_record_id: { from: null, to: 'REDCAP_001' }
    },
    timestamp: '2024-01-20T11:00:00Z',
    ip_address: '192.168.1.100',
    user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
  }
];

// Mock authentication service
export const mockAuthService = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && (password === 'admin123' || password === 'researcher123')) {
      const token = `mock-token-${Date.now()}`;
      localStorage.setItem('authToken', token);
      localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role
      }));
      return {
        id: user.id,
        email: user.email,
        role: user.role
      };
    }
    throw new Error('Invalid credentials');
  },

  getCurrentUser: async () => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      return JSON.parse(userStr);
    }
    throw new Error('No authentication token');
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getAuthHeaders: () => {
    return localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {};
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Mock patient service
export const mockPatientService = {
  getPatients: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPatients];
  },

  createPatient: async (patientData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPatient = {
      id: mockPatients.length + 1,
      ...patientData,
      created_by: 2, // Mock user ID
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sync_status: 'pending',
      redcap_record_id: null
    };
    
    mockPatients.push(newPatient);
    
    // Add audit log entry
    addAuditLogEntry(
      'researcher@clinic.com', // Current user (would be dynamic in real app)
      'CREATE_PATIENT',
      'patient',
      newPatient.id,
      `${newPatient.patient_id} (${newPatient.first_name} ${newPatient.last_name})`,
      {
        patient_id: { from: null, to: newPatient.patient_id },
        first_name: { from: null, to: newPatient.first_name },
        last_name: { from: null, to: newPatient.last_name },
        diagnosis: { from: null, to: newPatient.diagnosis }
      }
    );
    
    return newPatient;
  },

  syncRecord: async (recordId) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const patient = mockPatients.find(p => p.id === recordId);
    if (patient) {
      patient.sync_status = 'synced';
      patient.redcap_record_id = `REDCAP_${Date.now()}`;
      return { message: 'Successfully synced to REDCap', redcap_id: patient.redcap_record_id };
    }
    throw new Error('Record not found');
  },

  syncAllPending: async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const pendingPatients = mockPatients.filter(p => p.sync_status === 'pending');
    pendingPatients.forEach(patient => {
      patient.sync_status = 'synced';
      patient.redcap_record_id = `REDCAP_${Date.now()}`;
    });
    
    return pendingPatients.map(p => ({ recordId: p.id, status: 'success' }));
  },

  exportPDF: async (recordId) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const patient = mockPatients.find(p => p.id === recordId);
    if (!patient) {
      throw new Error('Patient not found');
    }
    
    // Create a mock PDF blob
    const mockPdfContent = `
      Patient Medical Record
      ===================
      
      Patient ID: ${patient.patient_id}
      Name: ${patient.first_name} ${patient.last_name}
      Date of Birth: ${patient.date_of_birth || 'Not provided'}
      Gender: ${patient.gender || 'Not provided'}
      Diagnosis: ${patient.diagnosis || 'Not provided'}
      Treatment Plan: ${patient.treatment_plan || 'Not provided'}
      Notes: ${patient.notes || 'No additional notes'}
      
      Generated: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([mockPdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patient_${patient.patient_id}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  exportCSV: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const csvContent = [
      'Patient ID,First Name,Last Name,Date of Birth,Gender,Diagnosis,Status',
      ...mockPatients.map(p => 
        `"${p.patient_id}","${p.first_name}","${p.last_name}","${p.date_of_birth || ''}","${p.gender || ''}","${p.diagnosis || ''}","${p.sync_status}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all_patient_records.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  getSyncStats: () => {
    return {
      total: mockPatients.length,
      pending: mockPatients.filter(p => p.sync_status === 'pending').length,
      synced: mockPatients.filter(p => p.sync_status === 'synced').length,
      errors: mockPatients.filter(p => p.sync_status === 'error').length
    };
  },

  hasPendingSyncs: () => {
    return mockPatients.some(p => p.sync_status === 'pending');
  }
};

// Helper function to add audit log entry
const addAuditLogEntry = (userEmail, action, entityType, entityId, entityName, changes) => {
  const currentUser = mockUsers.find(u => u.email === userEmail);
  
  const auditEntry = {
    id: mockAuditLog.length + 1,
    user_id: currentUser ? currentUser.id : null,
    user_email: userEmail,
    action: action,
    entity_type: entityType,
    entity_id: entityId,
    entity_name: entityName,
    changes: changes,
    timestamp: new Date().toISOString(),
    ip_address: '192.168.1.100', // Mock IP
    user_agent: navigator.userAgent
  };
  
  mockAuditLog.unshift(auditEntry); // Add to beginning for chronological order
  return auditEntry;
};

// Mock admin service
export const mockAdminService = {
  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers.map(u => ({
      id: u.id,
      email: u.email,
      role: u.role,
      created_at: u.created_at,
      last_login: u.last_login,
      is_active: u.is_active
    }));
  },

  createUser: async (userData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      last_login: null,
      is_active: true
    };
    
    mockUsers.push(newUser);
    
    // Add audit log entry
    addAuditLogEntry(
      'admin@clinic.com', // Current user (would be dynamic in real app)
      'CREATE_USER',
      'user',
      newUser.id,
      newUser.email,
      {
        email: { from: null, to: newUser.email },
        role: { from: null, to: newUser.role }
      }
    );
    
    return newUser;
  },

  toggleUserStatus: async (userId, isActive) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      const oldStatus = user.is_active;
      user.is_active = isActive;
      
      // Add audit log entry
      addAuditLogEntry(
        'admin@clinic.com', // Current user (would be dynamic in real app)
        'TOGGLE_USER_STATUS',
        'user',
        userId,
        user.email,
        {
          is_active: { from: oldStatus, to: isActive }
        }
      );
      
      return { message: 'User status updated successfully' };
    }
    throw new Error('User not found');
  },

  getAuditLog: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLog = [...mockAuditLog];
    
    // Apply filters
    if (filters.action) {
      filteredLog = filteredLog.filter(entry => entry.action === filters.action);
    }
    
    if (filters.user_email) {
      filteredLog = filteredLog.filter(entry => 
        entry.user_email.toLowerCase().includes(filters.user_email.toLowerCase())
      );
    }
    
    if (filters.entity_type) {
      filteredLog = filteredLog.filter(entry => entry.entity_type === filters.entity_type);
    }
    
    if (filters.date_from) {
      filteredLog = filteredLog.filter(entry => entry.timestamp >= filters.date_from);
    }
    
    if (filters.date_to) {
      filteredLog = filteredLog.filter(entry => entry.timestamp <= filters.date_to);
    }
    
    // Sort by timestamp (most recent first)
    return filteredLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  getAuditStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stats = {
      total_entries: mockAuditLog.length,
      actions: {},
      users: {},
      entity_types: {},
      last_24h: 0,
      last_7d: 0
    };
    
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    mockAuditLog.forEach(entry => {
      const entryDate = new Date(entry.timestamp);
      
      // Count by action
      stats.actions[entry.action] = (stats.actions[entry.action] || 0) + 1;
      
      // Count by user
      stats.users[entry.user_email] = (stats.users[entry.user_email] || 0) + 1;
      
      // Count by entity type
      stats.entity_types[entry.entity_type] = (stats.entity_types[entry.entity_type] || 0) + 1;
      
      // Count recent activity
      if (entryDate >= dayAgo) stats.last_24h++;
      if (entryDate >= weekAgo) stats.last_7d++;
    });
    
    return stats;
  }
};
