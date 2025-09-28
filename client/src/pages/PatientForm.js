import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Wifi, 
  WifiOff, 
  CheckCircle, 
  AlertTriangle,
  User,
  FileText
} from 'lucide-react';
import { patientService } from '../services/patientService';

// Heuristic 5: Error prevention - Comprehensive form validation
// Heuristic 2: Match between system and real world - Natural language labels
const PatientForm = ({ user }) => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm({
    defaultValues: {
      patient_id: '',
      first_name: '',
      last_name: '',
      date_of_birth: '',
      gender: '',
      diagnosis: '',
      treatment_plan: '',
      notes: ''
    }
  });

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSaveStatus('online');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSaveStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Generate patient ID automatically
  useEffect(() => {
    const generatePatientId = () => {
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.random().toString(36).substring(2, 5).toUpperCase();
      return `PAT-${timestamp}-${random}`;
    };

    // Only set if field is empty
    const currentPatientId = watch('patient_id');
    if (!currentPatientId) {
      reset({ patient_id: generatePatientId() });
    }
  }, [watch, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const result = await patientService.createPatient(data);
      
      // Heuristic 1: Visibility of system status - Clear feedback
      if (result.id && result.id.startsWith('temp_')) {
        setSaveStatus('offline_saved');
        toast.success('Patient record saved offline. Will sync when online.');
      } else {
        setSaveStatus('online_saved');
        toast.success('Patient record saved and synced successfully!');
      }

      // Reset form after successful save
      reset();
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      // Heuristic 9: Help users recognize, diagnose, and recover from errors
      toast.error(error.message || 'Failed to save patient record');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  // Heuristic 3: User control and freedom - Confirmation before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
            Patient Data Entry Form
          </h1>
          <p style={{ color: '#6b7280' }}>
            Enter patient information. Data will be saved locally if offline.
          </p>
        </div>

        {/* Heuristic 1: Visibility of system status - Enhanced connection status */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          padding: '12px 20px',
          backgroundColor: isOnline ? '#d1fae5' : '#fef3c7',
          borderRadius: '12px',
          border: `2px solid ${isOnline ? '#10b981' : '#f59e0b'}`,
          fontWeight: '600'
        }}>
          {isOnline ? (
            <>
              <Wifi size={20} style={{ color: '#10b981' }} />
              <span style={{ color: '#065f46' }}>ONLINE - Auto-sync</span>
            </>
          ) : (
            <>
              <WifiOff size={20} style={{ color: '#f59e0b' }} />
              <span style={{ color: '#92400e' }}>OFFLINE - Local Save</span>
            </>
          )}
        </div>
      </div>

      {/* Heuristic 9: Help users recognize, diagnose, and recover from errors - Status messages */}
      {saveStatus === 'offline_saved' && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fbbf24',
          color: '#92400e',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <AlertTriangle size={20} />
          <div>
            <strong>Record saved offline</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
              Your data is safely stored locally and will sync automatically when you're back online.
            </p>
          </div>
        </div>
      )}

      {saveStatus === 'online_saved' && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          backgroundColor: '#d1fae5',
          border: '1px solid #10b981',
          color: '#065f46',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <CheckCircle size={20} />
          <div>
            <strong>Record saved and synced</strong>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
              Patient data has been successfully saved and synced to the central database.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="card">
        {/* Patient Identification Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <User size={20} />
            Patient Identification
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="patient_id" className="form-label">
                Patient ID *
              </label>
              <input
                id="patient_id"
                type="text"
                className={`form-input ${errors.patient_id ? 'error' : ''}`}
                placeholder="PAT-123456-ABC"
                {...register('patient_id', {
                  required: 'Patient ID is required',
                  pattern: {
                    value: /^PAT-\d{6}-[A-Z]{3}$/,
                    message: 'Patient ID must follow format: PAT-123456-ABC'
                  }
                })}
              />
              {errors.patient_id && (
                <div className="form-error">{errors.patient_id.message}</div>
              )}
              <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                Auto-generated. Can be edited if needed.
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth" className="form-label">
                Date of Birth
              </label>
              <input
                id="date_of_birth"
                type="date"
                className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
                {...register('date_of_birth', {
                  validate: (value) => {
                    if (!value) return true; // Optional field
                    const date = new Date(value);
                    const today = new Date();
                    return date < today || 'Date of birth cannot be in the future';
                  }
                })}
              />
              {errors.date_of_birth && (
                <div className="form-error">{errors.date_of_birth.message}</div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">
                First Name *
              </label>
              <input
                id="first_name"
                type="text"
                className={`form-input ${errors.first_name ? 'error' : ''}`}
                placeholder="Enter first name"
                {...register('first_name', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters'
                  }
                })}
              />
              {errors.first_name && (
                <div className="form-error">{errors.first_name.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name" className="form-label">
                Last Name *
              </label>
              <input
                id="last_name"
                type="text"
                className={`form-input ${errors.last_name ? 'error' : ''}`}
                placeholder="Enter last name"
                {...register('last_name', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters'
                  }
                })}
              />
              {errors.last_name && (
                <div className="form-error">{errors.last_name.message}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="gender" className="form-label">
                Gender
              </label>
              <select
                id="gender"
                className={`form-input ${errors.gender ? 'error' : ''}`}
                {...register('gender')}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
              {errors.gender && (
                <div className="form-error">{errors.gender.message}</div>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <FileText size={20} />
            Medical Information
          </h3>

          <div className="form-group">
            <label htmlFor="diagnosis" className="form-label">
              Primary Diagnosis
            </label>
            <input
              id="diagnosis"
              type="text"
              className={`form-input ${errors.diagnosis ? 'error' : ''}`}
              placeholder="Enter primary diagnosis"
              {...register('diagnosis', {
                maxLength: {
                  value: 200,
                  message: 'Diagnosis must be less than 200 characters'
                }
              })}
            />
            {errors.diagnosis && (
              <div className="form-error">{errors.diagnosis.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="treatment_plan" className="form-label">
              Treatment Plan
            </label>
            <textarea
              id="treatment_plan"
              className={`form-input ${errors.treatment_plan ? 'error' : ''}`}
              placeholder="Describe the treatment plan..."
              rows={4}
              {...register('treatment_plan', {
                maxLength: {
                  value: 1000,
                  message: 'Treatment plan must be less than 1000 characters'
                }
              })}
            />
            {errors.treatment_plan && (
              <div className="form-error">{errors.treatment_plan.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">
              Additional Notes
            </label>
            <textarea
              id="notes"
              className={`form-input ${errors.notes ? 'error' : ''}`}
              placeholder="Any additional notes or observations..."
              rows={3}
              {...register('notes', {
                maxLength: {
                  value: 500,
                  message: 'Notes must be less than 500 characters'
                }
              })}
            />
            {errors.notes && (
              <div className="form-error">{errors.notes.message}</div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {isDirty && <span>You have unsaved changes</span>}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {isOnline ? 'Save & Sync' : 'Save Offline'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
