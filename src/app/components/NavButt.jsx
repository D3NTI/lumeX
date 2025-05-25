'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function NavButtons() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleSignUpClick = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const handleSignInClick = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="butt-cont">
        <div className="left-butts">
          <Link href="/market">Market</Link>
          <span className="disabled-link">Wallet</span>
          <Link href="/support">Support</Link>
        </div>
        <div className="right-butts">
          <div className="auth-loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="butt-cont">
        <div className="left-butts">
          <Link href="/market">Market</Link>
          {isAuthenticated ? (
            <Link href="/wallet">Wallet</Link>
          ) : (
            <span className="disabled-link" title="Требуется авторизация">
              Wallet
            </span>
          )}
          <Link href="/support">Support</Link>
        </div>
        <div className="right-butts">
          {isAuthenticated ? (
            <Link href="/profile" className="prof-butt">
              Profile
            </Link>
          ) : (
            <div className="auth-buttons">
              <button className="sign-in-btn" onClick={handleSignInClick}>
                Sign In
              </button>
              <button className="sign-up-btn" onClick={handleSignUpClick}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />
    </>
  );
}
