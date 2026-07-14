import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [pendingTours, setPendingTours] = useState([]);
  const [allTours, setAllTours] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'all', 'users'
  const [editingTour, setEditingTour] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, pendingRes, allToursRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/tours/pending'),
        api.get('/admin/tours'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data.data);
      setPendingTours(pendingRes.data.data);
      setAllTours(allToursRes.data.data);
      setUsers(usersRes.data.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const handleApprove = async (id) => {
    const notes = prompt('Admin notes (optional):');
    if (notes === null) return;
    try {
      await api.put(`/admin/tours/${id}/approve`, { notes });
      setPendingTours(pendingTours.filter(t => t._id !== id));
      loadData();
      alert('✅ Tour approved!');
    } catch (err) {
      alert('❌ Failed to approve tour');
    }
  };

  const handleReject = async (id) => {
    const notes = prompt('Reason for rejection:');
    if (notes === null) return;
    try {
      await api.put(`/admin/tours/${id}/reject`, { notes });
      setPendingTours(pendingTours.filter(t => t._id !== id));
      loadData();
      alert('❌ Tour rejected.');
    } catch (err) {
      alert('❌ Failed to reject tour');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tour? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/tours/${id}`);
      loadData();
      alert('🗑️ Tour deleted.');
    } catch (err) {
      alert('❌ Failed to delete tour');
    }
  };

  const handleEdit = (tour) => {
    setEditingTour(tour);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/tours/${editingTour._id}/edit`, editingTour);
      setEditingTour(null);
      loadData();
      alert('✅ Tour updated successfully!');
    } catch (err) {
      alert('❌ Failed to update tour');
    }
  };

  const handlePreview = (tourId) => {
    window.open(`/tours/${tourId}`, '_blank');
  };

  const viewTourDetail = (tourId) => {
    navigate(`/tours/${tourId}`);
  };

  // ===== Edit Modal =====
  if (editingTour) {
    return (
      <div className="container" style={{ maxWidth: 800 }}>
        <h2 style={{ color: '#1a237e' }}>✏️ Edit Tour</h2>
        <div className="card">
          <form onSubmit={handleEditSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editingTour.title || ''}
                onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="4"
                value={editingTour.description || ''}
                onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                required
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={editingTour.category || 'wildlife'}
                  onChange={(e) => setEditingTour({ ...editingTour, category: e.target.value })}
                >
                  <option value="wildlife">Wildlife</option>
                  <option value="history">History</option>
                  <option value="geography">Geography</option>
                  <option value="culture">Culture</option>
                  <option value="science">Science</option>
                  <option value="environment">Environment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Media Type</label>
                <select
                  value={editingTour.mediaType || '360_image'}
                  onChange={(e) => setEditingTour({ ...editingTour, mediaType: e.target.value })}
                >
                  <option value="360_image">360° Image</option>
                  <option value="360_video">360° Video</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Media URL</label>
              <input
                type="url"
                value={editingTour.mediaUrl || ''}
                onChange={(e) => setEditingTour({ ...editingTour, mediaUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label>Thumbnail URL</label>
              <input
                type="url"
                value={editingTour.thumbnailUrl || ''}
                onChange={(e) => setEditingTour({ ...editingTour, thumbnailUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label>Price (Ksh)</label>
                <input
                  type="number"
                  value={editingTour.price?.ksh || 300}
                  onChange={(e) => setEditingTour({
                    ...editingTour,
                    price: { ...editingTour.price, ksh: parseInt(e.target.value) }
                  })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingTour.status || 'pending'}
                  onChange={(e) => setEditingTour({ ...editingTour, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn btn-primary">💾 Save Changes</button>
              <button
                type="button"
                onClick={() => setEditingTour(null)}
                className="btn"
                style={{ background: '#ddd' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ color: '#1a237e' }}>🛡️ Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1e88e5, #42a5f5)', color: 'white' }}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #43a047, #66bb6a)', color: 'white' }}>
          <h3>Active Tours</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalTours}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #ff6f00, #ffa726)', color: 'white' }}>
          <h3>Pending Approval</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.pendingTours}</p>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg, #1a237e, #3949ab)', color: 'white' }}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>Ksh {stats.totalRevenue?.toLocaleString()}</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderBottom: '2px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.8rem 1.5rem',
            background: activeTab === 'pending' ? '#1e88e5' : 'transparent',
            color: activeTab === 'pending' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📝 Pending ({pendingTours.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.8rem 1.5rem',
            background: activeTab === 'all' ? '#1e88e5' : 'transparent',
            color: activeTab === 'all' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          📋 All Tours ({allTours.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '0.8rem 1.5rem',
            background: activeTab === 'users' ? '#1e88e5' : 'transparent',
            color: activeTab === 'users' ? 'white' : '#333',
            border: 'none',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          👥 Users ({users.length})
        </button>
      </div>

      {/* ===== PENDING TOURS TAB ===== */}
      {activeTab === 'pending' && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>📝 Pending Tour Approvals</h2>
          {pendingTours.length === 0 ? (
            <p>No pending tours.</p>
          ) : (
            pendingTours.map(tour => (
              <div key={tour._id} style={{ padding: '1rem', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <h3>{tour.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#666' }}>By: {tour.createdBy?.name} | Category: {tour.category}</p>
                  <p style={{ fontSize: '0.85rem' }}>{tour.description?.substring(0, 100)}...</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handlePreview(tour._id)} className="btn" style={{ padding: '0.5rem 1rem', background: '#1e88e5', color: 'white' }}>👁️ Preview</button>
                  <button onClick={() => handleApprove(tour._id)} className="btn btn-success" style={{ padding: '0.5rem 1rem' }}>✅ Approve</button>
                  <button onClick={() => handleReject(tour._id)} className="btn" style={{ padding: '0.5rem 1rem', background: '#f44336', color: 'white' }}>❌ Reject</button>
                  <button onClick={() => handleEdit(tour)} className="btn" style={{ padding: '0.5rem 1rem', background: '#ff6f00', color: 'white' }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(tour._id)} className="btn" style={{ padding: '0.5rem 1rem', background: '#880e4f', color: 'white' }}>🗑️ Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ===== ALL TOURS TAB ===== */}
      {activeTab === 'all' && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>📋 All Tours</h2>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e3f2fd' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Title</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Creator</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTours.map(tour => (
                  <tr key={tour._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.8rem' }}>{tour.title}</td>
                    <td style={{ padding: '0.8rem' }}>{tour.createdBy?.name}</td>
                    <td style={{ padding: '0.8rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 10,
                        fontSize: '0.85rem',
                        background: tour.status === 'approved' ? '#c8e6c9' : tour.status === 'pending' ? '#fff3e0' : '#ffcdd2'
                      }}>
                        {tour.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handlePreview(tour._id)} className="btn" style={{ padding: '0.3rem 0.8rem', background: '#1e88e5', color: 'white', fontSize: '0.8rem' }}>👁️</button>
                        <button onClick={() => handleEdit(tour)} className="btn" style={{ padding: '0.3rem 0.8rem', background: '#ff6f00', color: 'white', fontSize: '0.8rem' }}>✏️</button>
                        <button onClick={() => handleDelete(tour._id)} className="btn" style={{ padding: '0.3rem 0.8rem', background: '#880e4f', color: 'white', fontSize: '0.8rem' }}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== USERS TAB ===== */}
      {activeTab === 'users' && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <h2 style={{ color: '#1a237e', marginBottom: '1rem' }}>👥 All Users</h2>
          <div className="table-responsive">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e3f2fd' }}>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.8rem', textAlign: 'left' }}>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '0.8rem' }}>{u.name}</td>
                    <td style={{ padding: '0.8rem' }}>{u.email}</td>
                    <td style={{ padding: '0.8rem' }}><span style={{ background: '#e3f2fd', padding: '0.2rem 0.6rem', borderRadius: 10, fontSize: '0.85rem' }}>{u.role}</span></td>
                    <td style={{ padding: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;