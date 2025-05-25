'use client';
import { useState } from 'react';
import { LoginForm } from './Login';
import { RegisterForm } from './Register';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);

  if (!isOpen) return null;

  const handleSwitchToLogin = () => setMode('login');
  const handleSwitchToRegister = () => setMode('register');

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {mode === 'login' ? (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onClose={onClose}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={handleSwitchToLogin}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
