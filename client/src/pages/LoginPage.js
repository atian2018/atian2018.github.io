import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { LogIn, Eye, EyeOff, UserPlus, Lock, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';

// Heuristic 5: Error prevention - Form validation
// Heuristic 2: Match between system and real world - Natural language
const LoginPage = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', 'forgot'
  
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

  const onSignup = async (data) => {
    setLoading(true);
    try {
      // Mock signup - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      toast.success('Account created successfully! Please check your email for verification.');
      setActiveTab('login');
    } catch (error) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async (data) => {
    setLoading(true);
    try {
      // Mock forgot password - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Password reset link sent to your email!');
      setActiveTab('login');
    } catch (error) {
      toast.error(error.message || 'Failed to send reset link. Please try again.');
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
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          {activeTab === 'login' && (
            <>
              <LogIn size={48} style={{ color: '#3b82f6', marginBottom: '16px' }} />
              <h1 className="card-title">Welcome Back</h1>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>
                Sign in to access the patient data system
              </p>
            </>
          )}
          {activeTab === 'signup' && (
            <>
              <UserPlus size={48} style={{ color: '#3b82f6', marginBottom: '16px' }} />
              <h1 className="card-title">Create Account</h1>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>
                Join the patient data system
              </p>
            </>
          )}
          {activeTab === 'forgot' && (
            <>
              <Lock size={48} style={{ color: '#3b82f6', marginBottom: '16px' }} />
              <h1 className="card-title">Reset Password</h1>
              <p style={{ color: '#6b7280', marginTop: '8px' }}>
                Enter your email to receive a reset link
              </p>
            </>
          )}
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #e5e7eb',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveTab('login')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'login' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'login' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'login' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <LogIn size={16} />
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            style={{
              flex: 1,
              padding: '12px',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === 'signup' ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === 'signup' ? '#3b82f6' : '#6b7280',
              fontWeight: activeTab === 'signup' ? '600' : '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <UserPlus size={16} />
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <>
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

              <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('forgot')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#3b82f6',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot password?
                </button>
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
          </>
        )}

        {/* Signup Form */}
        {activeTab === 'signup' && (
          <>
            <form onSubmit={handleSubmit(onSignup)}>
              <div className="form-group">
                <label htmlFor="signup-name" className="form-label">
                  Full Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                />
                {errors.fullName && (
                  <div className="form-error">{errors.fullName.message}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className={`form-input ${errors.signupEmail ? 'error' : ''}`}
                  placeholder="Enter your email"
                  {...register('signupEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.signupEmail && (
                  <div className="form-error">{errors.signupEmail.message}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="signup-password" className="form-label">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className={`form-input ${errors.signupPassword ? 'error' : ''}`}
                    placeholder="Create a password"
                    {...register('signupPassword', {
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
                {errors.signupPassword && (
                  <div className="form-error">{errors.signupPassword.message}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Confirm your password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password'
                  })}
                />
                {errors.confirmPassword && (
                  <div className="form-error">{errors.confirmPassword.message}</div>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </>
        )}

        {/* Forgot Password Form */}
        {activeTab === 'forgot' && (
          <>
            <form onSubmit={handleSubmit(onForgotPassword)}>
              <div className="form-group">
                <label htmlFor="forgot-email" className="form-label">
                  Email Address
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  className={`form-input ${errors.forgotEmail ? 'error' : ''}`}
                  placeholder="Enter your email"
                  {...register('forgotEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.forgotEmail && (
                  <div className="form-error">{errors.forgotEmail.message}</div>
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
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Send Reset Link
                  </>
                )}
              </button>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </button>
              </div>
            </form>
          </>
        )}

        {/* Heuristic 10: Help and documentation - Demo credentials */}
        <div className="card" style={{ 
          marginTop: '24px', 
          padding: '16px', 
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
            Demo Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <span style={{ fontWeight: '600', color: '#3b82f6' }}>Administrator:</span>
              <br />
              <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                admin@clinic.com / admin123
              </span>
            </div>
            <div>
              <span style={{ fontWeight: '600', color: '#059669' }}>Researcher:</span>
              <br />
              <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                researcher@clinic.com / researcher123
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
