import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

// Heuristic 5: Error prevention - Form validation
// Heuristic 2: Match between system and real world - Natural language
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await authService.login(data.email, data.password);
      onLogin(user);
      toast.success('Login successful!');
    } catch (error) {
      // Heuristic 9: Help users recognize, diagnose, and recover from errors
      toast.error(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <LogIn size={48} style={{ color: '#3b82f6', marginBottom: '16px' }} />
          <h1 className="card-title">Patient Data System</h1>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>
            Secure patient data collection and management
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <div className="form-error">{errors.email.message}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-error">{errors.password.message}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Heuristic 10: Help and documentation - Demo credentials */}
        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <strong>Demo Credentials:</strong>
          <br />
          <strong>Admin:</strong> admin@clinic.com / admin123
          <br />
          <strong>Researcher:</strong> researcher@clinic.com / researcher123
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
