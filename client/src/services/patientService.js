// Patient data service with offline sync capability
import { mockPatientService } from './mockDataService';

class PatientService {
  constructor() {
    this.baseURL = '/api';
    this.localStorageKey = 'patient_records_offline';
    this.syncQueueKey = 'sync_queue';
  }

  // Get all patient records (online/offline)
  async getPatients() {
    try {
      // Use mock service for prototype
      return await mockPatientService.getPatients();
    } catch (error) {
      console.log('Offline mode - using cached data');
      // Fallback to offline data
      const offlineData = localStorage.getItem(this.localStorageKey);
      return offlineData ? JSON.parse(offlineData) : [];
    }
  }

  // Create new patient record (with offline capability)
  async createPatient(patientData) {
    try {
      // Use mock service for prototype
      return await mockPatientService.createPatient(patientData);
    } catch (error) {
      console.log('Error creating patient:', error);
      throw error;
    }
  }

  // Sync specific record to server
  async syncRecord(recordId) {
    try {
      // Use mock service for prototype
      return await mockPatientService.syncRecord(recordId);
    } catch (error) {
      throw error;
    }
  }

  // Sync all pending records
  async syncAllPending() {
    try {
      // Use mock service for prototype
      return await mockPatientService.syncAllPending();
    } catch (error) {
      throw error;
    }
  }

  // Offline storage methods
  saveOfflineRecord(record) {
    const offlineRecords = this.getOfflineRecords();
    offlineRecords.push(record);
    localStorage.setItem(this.localStorageKey, JSON.stringify(offlineRecords));
  }

  getOfflineRecords() {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  updateRecordStatus(recordId, status) {
    const offlineRecords = this.getOfflineRecords();
    const recordIndex = offlineRecords.findIndex(r => r.id === recordId);
    
    if (recordIndex !== -1) {
      offlineRecords[recordIndex].sync_status = status;
      localStorage.setItem(this.localStorageKey, JSON.stringify(offlineRecords));
    }
  }

  removeFromOfflineStorage(recordId) {
    const offlineRecords = this.getOfflineRecords();
    const filtered = offlineRecords.filter(r => r.id !== recordId);
    localStorage.setItem(this.localStorageKey, JSON.stringify(filtered));
  }

  // Export methods
  async exportPDF(recordId) {
    try {
      // Use mock service for prototype
      return await mockPatientService.exportPDF(recordId);
    } catch (error) {
      throw error;
    }
  }

  async exportCSV() {
    try {
      // Use mock service for prototype
      return await mockPatientService.exportCSV();
    } catch (error) {
      throw error;
    }
  }

  // Check if we have pending syncs
  hasPendingSyncs() {
    return mockPatientService.hasPendingSyncs();
  }

  // Get sync statistics
  getSyncStats() {
    return mockPatientService.getSyncStats();
  }
}

export const patientService = new PatientService();
