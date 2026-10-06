import React from 'react';
import { Mail, Phone, MapPin, Edit3, Trash2, User } from 'lucide-react';

export default function ContactCard({ contact, onEdit, onDelete }) {
  const genderColorClass =
    contact.gender?.toLowerCase() === 'male'
      ? 'badge-male'
      : contact.gender?.toLowerCase() === 'female'
      ? 'badge-female'
      : 'badge-other';

  return (
    <div className="contact-card">
      <div className="contact-card-top">
        <div className="avatar-wrapper">
          {contact.imageUrl ? (
            <img
              src={contact.imageUrl}
              alt={contact.fullName}
              className="contact-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
              }}
            />
          ) : (
            <div className="contact-avatar-placeholder">
              <User size={28} />
            </div>
          )}
        </div>
        <div className="contact-header-info">
          <h3 className="contact-name">{contact.fullName}</h3>
          <span className={`gender-badge ${genderColorClass}`}>
            {contact.gender || 'Not specified'}
          </span>
        </div>
      </div>

      <div className="contact-details">
        <div className="detail-item">
          <Phone size={16} className="detail-icon" />
          <a href={`tel:${contact.phone}`} className="detail-text">{contact.phone}</a>
        </div>
        <div className="detail-item">
          <Mail size={16} className="detail-icon" />
          <a href={`mailto:${contact.email}`} className="detail-text">{contact.email}</a>
        </div>
        <div className="detail-item">
          <MapPin size={16} className="detail-icon" />
          <span className="detail-text">{contact.address}</span>
        </div>
      </div>

      <div className="contact-card-actions">
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(contact)}
          title="Edit Contact"
        >
          <Edit3 size={16} />
          <span>Edit</span>
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(contact)}
          title="Delete Contact"
        >
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
