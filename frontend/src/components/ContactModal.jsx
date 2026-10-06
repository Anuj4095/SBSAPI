import React, { useState, useEffect } from 'react';
import api from '../api';
import { X, Upload, User, Mail, Phone, MapPin, Image as ImageIcon } from 'lucide-react';

export default function ContactModal({ isOpen, onClose, contact, onSuccess, showToast }) {
  const isEditing = Boolean(contact);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    gender: 'male',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: contact.fullName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || '',
        gender: contact.gender || 'male',
      });
      setImagePreview(contact.imageUrl || null);
      setImageFile(null);
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        gender: 'male',
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [contact, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditing && !imageFile) {
      showToast('Please select a contact profile image', 'error');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('gender', formData.gender);

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        // PUT /contact/:id
        await api.put(`/contact/${contact._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Contact updated successfully!', 'success');
      } else {
        // POST /contact/addcontact
        await api.post('/contact/addcontact', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        showToast('Contact created successfully!', 'success');
      }

      onSuccess();
      onClose();
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message || 'Operation failed';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditing ? 'Edit Contact' : 'Add New Contact'}</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Image Picker */}
          <div className="image-upload-section">
            <div className="image-preview-container">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="modal-avatar-preview" />
              ) : (
                <div className="modal-avatar-placeholder">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
            <label className="upload-label">
              <Upload size={16} />
              <span>{imageFile ? 'Change Image' : isEditing ? 'Update Image (Optional)' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <div className="input-with-icon">
                <User size={18} />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <div className="input-with-icon">
                <Phone size={18} />
                <input
                  type="tel"
                  name="phone"
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <div className="input-with-icon">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="custom-select"
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Address *</label>
            <div className="input-with-icon">
              <MapPin size={18} />
              <input
                type="text"
                name="address"
                placeholder="e.g. 123 Main Street, Mumbai"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
