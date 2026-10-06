import React, { useState, useEffect } from 'react';
import api from './api';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import ContactCard from './components/ContactCard';
import ContactModal from './components/ContactModal';
import DeleteModal from './components/DeleteModal';
import {
  UserPlus,
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import './App.css';

export default function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Contacts State
  const [contacts, setContacts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Search, Filter & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modals & Active Selections
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null); // null = Add, obj = Edit
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Fetch Total Contacts Count
  const fetchCount = async () => {
    try {
      const res = await api.get('/contact/count');
      setTotalCount(res.data.Total || 0);
    } catch (err) {
      console.error('Count fetch error:', err);
    }
  };

  // Fetch Contacts
  const fetchContacts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      if (genderFilter !== 'all') {
        // GET /contact/contactbygender/:gender
        const res = await api.get(`/contact/contactbygender/${genderFilter}`);
        setContacts(res.data.contactbygender || []);
      } else {
        // GET /contact/allcontact?page=X&limit=Y
        const res = await api.get(`/contact/allcontact?page=${page}&limit=${limit}`);
        setContacts(res.data.contactlist || []);
      }
      fetchCount();
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout();
        showToast('Session expired, please login again', 'error');
      } else {
        showToast(err.response?.data?.error || 'Failed to load contacts', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user, page, genderFilter]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setContacts([]);
    showToast('Logged out successfully', 'info');
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setPage(1);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (contact) => {
    setContactToDelete(contact);
    setDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    setDeleteLoading(true);
    try {
      // DELETE /contact/:id
      await api.delete(`/contact/${contactToDelete._id}`);
      showToast('Contact deleted successfully', 'success');
      setDeleteModalOpen(false);
      setContactToDelete(null);
      fetchContacts();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete contact', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Client-side Search filtering
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = c.fullName?.toLowerCase().includes(q);
    const emailMatch = c.email?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.toLowerCase().includes(q);
    const addressMatch = c.address?.toLowerCase().includes(q);
    return nameMatch || emailMatch || phoneMatch || addressMatch;
  });

  return (
    <div className="app-container">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="main-content">
        {!user ? (
          <Auth onLoginSuccess={handleLoginSuccess} showToast={showToast} />
        ) : (
          <div className="dashboard">
            {/* Header / Stats Banner */}
            <div className="dashboard-header">
              <div className="header-text">
                <h2>Contact Directory</h2>
                <p>Easily view, search, add and edit your saved contacts</p>
              </div>

              <div className="header-actions">
                <div className="stats-badge">
                  <Users size={18} />
                  <span>Total Contacts: <strong>{totalCount}</strong></span>
                </div>
                <button className="btn-primary" onClick={handleOpenAddModal}>
                  <UserPlus size={18} />
                  <span>Add Contact</span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="controls-bar">
              <div className="search-box">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by name, email, phone or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <Filter size={18} className="filter-icon" />
                <span className="filter-label">Filter:</span>
                <select
                  value={genderFilter}
                  onChange={(e) => {
                    setGenderFilter(e.target.value);
                    setPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>

                <button
                  className="refresh-btn"
                  onClick={fetchContacts}
                  title="Reload Contacts"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                </button>
              </div>
            </div>

            {/* Contacts Grid */}
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading contacts...</p>
              </div>
            ) : filteredContacts.length > 0 ? (
              <div className="contacts-grid">
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact._id}
                    contact={contact}
                    onEdit={handleOpenEditModal}
                    onDelete={handleOpenDeleteModal}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <Users size={48} />
                </div>
                <h3>No contacts found</h3>
                <p>
                  {searchQuery
                    ? `No contacts match "${searchQuery}"`
                    : genderFilter !== 'all'
                    ? `No ${genderFilter} contacts found`
                    : 'Your contact list is currently empty. Click "Add Contact" to create one!'}
                </p>
                {!searchQuery && genderFilter === 'all' && (
                  <button className="btn-primary" onClick={handleOpenAddModal}>
                    <UserPlus size={18} />
                    <span>Create Your First Contact</span>
                  </button>
                )}
              </div>
            )}

            {/* Pagination Controls (when viewing All Genders) */}
            {genderFilter === 'all' && totalCount > limit && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || loading}
                >
                  <ChevronLeft size={18} />
                  <span>Previous</span>
                </button>
                <span className="page-indicator">
                  Page <strong>{page}</strong> of{' '}
                  <strong>{Math.ceil(totalCount / limit) || 1}</strong>
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= Math.ceil(totalCount / limit) || loading}
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add / Edit Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSuccess={fetchContacts}
        showToast={showToast}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        contact={contactToDelete}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
