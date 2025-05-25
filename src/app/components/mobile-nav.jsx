"use client"
import { useState } from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import AuthModal from "./AuthModal"

export default function MobileNav() {
  const { isAuthenticated, user, logout, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState("login")

  const handleSignUpClick = () => {
    setAuthModalMode("register")
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  const handleSignInClick = () => {
    setAuthModalMode("login")
    setIsAuthModalOpen(true)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
      <div className="mobile-nav-container">
        {/* Logo */}
        <Link href="/" className="mobile-logo" onClick={closeMenu}>
          Lume
          <span className="logx">X</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-navigation">
          <div className="nav-links-container">
            <Link href="/market" className="nav-link">
              Market
            </Link>
            {isAuthenticated ? (
              <Link href="/wallet" className="nav-link">
                Wallet
              </Link>
            ) : (
              <span className="disabled-link" title="Требуется авторизация">
                Wallet
              </span>
            )}
            <Link href="/support" className="nav-link">
              Support
            </Link>
          </div>

          <div className="auth-section">
            {isLoading ? (
              <div className="auth-loading">Loading...</div>
            ) : isAuthenticated ? (
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

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMenu}>
            <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
              <div className="mobile-menu-header">
                <Link href="/" className="mobile-menu-logo" onClick={closeMenu}>
                  Lume<span className="logx">X</span>
                </Link>
                <button className="mobile-close-button" onClick={closeMenu}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <nav className="mobile-nav-links">
                <Link href="/market" className="mobile-nav-link" onClick={closeMenu}>
                  Market
                </Link>
                {isAuthenticated ? (
                  <Link href="/wallet" className="mobile-nav-link" onClick={closeMenu}>
                    Wallet
                  </Link>
                ) : (
                  <span className="mobile-disabled-link">
                    Wallet
                    <small>Требуется авторизация</small>
                  </span>
                )}
                <Link href="/support" className="mobile-nav-link" onClick={closeMenu}>
                  Support
                </Link>
              </nav>

              <div className="mobile-auth-section">
                {isLoading ? (
                  <div className="auth-loading">Loading...</div>
                ) : isAuthenticated ? (
                  <div className="mobile-user-section">
                    <Link href="/profile" className="mobile-profile-button" onClick={closeMenu}>
                      Profile
                    </Link>
                    <button
                      className="mobile-logout-button"
                      onClick={() => {
                        logout()
                        closeMenu()
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="mobile-auth-buttons">
                    <button className="mobile-sign-in-button" onClick={handleSignInClick}>
                      Sign In
                    </button>
                    <button className="mobile-sign-up-button" onClick={handleSignUpClick}>
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode={authModalMode} />
    </>
  )
}
