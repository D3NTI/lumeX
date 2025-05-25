'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function ProfileContent() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleLogout = () => {
    logout();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    // Здесь будет логика обновления профиля
    console.log('Updating profile:', editForm);
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
        <h1 className="profile-title">Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="profile-username">{user?.username}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>

          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${
                activeTab === 'info' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('info')}
            >
              <span className="nav-icon">👤</span>
              Personal Info
            </button>
            <button
              className={`profile-nav-item ${
                activeTab === 'security' ? 'active' : ''
              }`}
              onClick={() => setActiveTab('security')}
            >
              <span className="nav-icon">⚙️</span>
              Preferences
            </button>
          </nav>

          <div className="profile-actions">
            <Link href="/wallet" className="action-btn wallet-btn">
              <span className="btn-icon">💼</span>
              My Wallet
            </Link>
            <button onClick={handleLogout} className="action-btn logout-btn">
              <span className="btn-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>

        <div className="profile-content">
          {activeTab === 'info' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h3>Personal Information</h3>
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {isEditing ? (
                <form onSubmit={handleEditSubmit} className="edit-form">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      value={editForm.username}
                      onChange={(e) =>
                        setEditForm({ ...editForm, username: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="info-display">
                  <div className="info-item">
                    <label>Username</label>
                    <div className="info-value">{user?.username}</div>
                  </div>

                  <div className="info-item">
                    <label>Email</label>
                    <div className="info-value">{user?.email}</div>
                  </div>

                  <div className="info-item">
                    <label>User ID</label>
                    <div className="info-value">{user?.id}</div>
                  </div>

                  <div className="info-item">
                    <label>Member Since</label>
                    <div className="info-value">
                      {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                    </div>
                  </div>

                  <div className="info-item">
                    <label>Last Updated</label>
                    <div className="info-value">
                      {user?.updatedAt ? formatDate(user.updatedAt) : 'N/A'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h3>Security Settings</h3>
              </div>

              <div className="security-section">
                <div className="security-item">
                  <div className="security-info">
                    <h4>Password</h4>
                    <p>Last changed: Never</p>
                  </div>
                  <button className="security-btn">Change Password</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security</p>
                  </div>
                  <button className="security-btn">Enable 2FA</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h4>Login Sessions</h4>
                    <p>Manage your active sessions</p>
                  </div>
                  <button className="security-btn">View Sessions</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="profile-tab">
              <div className="tab-header">
                <h3>Preferences</h3>
              </div>

              <div className="preferences-section">
                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Theme</h4>
                    <p>Choose your preferred theme</p>
                  </div>
                  <select className="preference-select">
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Language</h4>
                    <p>Select your language</p>
                  </div>
                  <select className="preference-select">
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Email Notifications</h4>
                    <p>Receive updates via email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="preference-item">
                  <div className="preference-info">
                    <h4>Price Alerts</h4>
                    <p>Get notified about price changes</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
