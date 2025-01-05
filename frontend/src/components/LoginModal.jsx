import React, { useState } from 'react';
import '../style/AuthModal.css';
import { useAuth } from '../context/AuthContext';

const LoginModal = ({ isOpen, onClose, switchToSignup }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.emailOrPhone || !formData.password) {
      setError('All fields are required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    const result = await login(formData.emailOrPhone, formData.password);
    
    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-content">
        <h2 className="auth-modal-title">Login</h2>
        
        {error && (
          <div className="auth-modal-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal-form">
          <input
            type="text"
            name="emailOrPhone"
            placeholder="Email or Phone Number"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className="auth-modal-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className="auth-modal-input"
          />
          
          <button 
            type="submit"
            className="auth-modal-button primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-modal-switch">
          Don't have an account?{' '}
          <button 
            onClick={switchToSignup}
            className="auth-modal-switch-button"
          >
            Sign Up
          </button>
        </p>
        
        <button 
          className="auth-modal-button secondary"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;