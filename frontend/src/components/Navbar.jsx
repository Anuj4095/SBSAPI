import React from 'react';
import { UserCheck, LogOut, Users } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="brand-icon">
            <Users size={24} />
          </div>
          <div>
            <span className="brand-title">ContactHub</span>
            <span className="brand-subtitle">Smart Contact Manager</span>
          </div>
        </div>

        {user && (
          <div className="nav-user">
            <div className="user-info">
              <UserCheck size={18} className="user-badge-icon" />
              <span className="user-name">{user.fullName || user.email}</span>
            </div>
            <button className="logout-btn" onClick={onLogout} title="Log Out">
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
