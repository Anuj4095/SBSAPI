import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, contact, onConfirm, loading }) {
  if (!isOpen || !contact) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="danger-header-title">
            <AlertTriangle className="danger-icon" size={22} />
            <h3>Delete Contact</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>{contact.fullName}</strong>?
          </p>
          <p className="danger-subtext">
            This action cannot be undone. The contact details and uploaded image will be permanently removed.
          </p>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            <Trash2 size={16} />
            <span>{loading ? 'Deleting...' : 'Delete Permanently'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
