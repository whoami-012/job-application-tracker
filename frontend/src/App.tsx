import { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Filter, Briefcase, Building2, Calendar, Link as LinkIcon, Pencil, Trash2, Sun, Moon, MapPin } from 'lucide-react';
import { api } from './api';
import type { JobApplication, JobStatus, JobCreate } from './api';
import './App.css';

const STATUS_OPTIONS: JobStatus[] = [
  "Applied",
  "Under Review",
  "Interview Scheduled",
  "Interviewed",
  "Offer Received",
  "Accepted",
  "Rejected",
  "Withdrawn"
];

function StatusBadge({ status }: { status: JobStatus }) {
  const statusClass = status.toLowerCase().replace(/\s+/g, '-');
  return (
    <span className={`status-badge status-${statusClass}`}>
      {status}
    </span>
  );
}

const getDomain = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
};

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobApplication | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  const [formData, setFormData] = useState<JobCreate>({
    company_name: '',
    job_title: '',
    job_description: '',
    job_url: '',
    status: 'Applied',
    location: '',
    notes: ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const data = await api.fetchApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = 
        app.company_name.toLowerCase().includes(search.toLowerCase()) ||
        app.job_title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        await api.updateApplication(editingJob.id, formData);
      } else {
        await api.createApplication(formData);
      }
      setIsModalOpen(false);
      setEditingJob(null);
      setFormData({ company_name: '', job_title: '', job_description: '', job_url: '', status: 'Applied', location: '', notes: '' });
      loadApplications();
    } catch (error) {
      console.error('Failed to save application:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.deleteApplication(id);
        loadApplications();
      } catch (error) {
        console.error('Failed to delete application:', error);
      }
    }
  };

  const openEditModal = (job: JobApplication) => {
    setEditingJob(job);
    setFormData({
      company_name: job.company_name,
      job_title: job.job_title,
      job_description: job.job_description || '',
      job_url: job.job_url || '',
      status: job.status,
      location: job.location || '',
      notes: job.notes || ''
    });
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content container">
          <div className="brand">
            <div className="logo-icon">
              <Briefcase size={24} color="white" />
            </div>
            <h1>Job Tracker</h1>
          </div>
          
          <div className="stats-header">
            <div className="stat-item">
              <span className="stat-value">{applications.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interviewed').length}
              </span>
              <span className="stat-label">Interviews</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="btn-primary" onClick={() => { 
              setEditingJob(null); 
              setFormData({ company_name: '', job_title: '', job_description: '', job_url: '', status: 'Applied', location: '', notes: '' });
              setIsModalOpen(true); 
            }}>
              <Plus size={20} />
              <span>Add Application</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="filters-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search company or title..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="filter-select">
            <Filter size={18} className="filter-icon" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your applications...</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="jobs-grid">
            {filteredApplications.map(app => {
              const domain = app.job_url ? getDomain(app.job_url) : null;
              const logoUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;
              
              return (
                <div key={app.id} className="job-card">
                  <div className="job-card-header">
                    <div className="job-header-main">
                      {logoUrl ? (
                        <img 
                          src={logoUrl} 
                          alt={app.company_name} 
                          className="company-logo"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="company-logo">
                          <Building2 size={20} />
                        </div>
                      )}
                      <div className="job-info">
                        <h3 className="company-name">{app.company_name}</h3>
                        <h4 className="job-title">{app.job_title}</h4>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button onClick={() => openEditModal(app)} title="Edit">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDelete(app.id)} title="Delete" className="btn-delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="job-card-body">
                    <div className="detail-row">
                      <StatusBadge status={app.status} />
                      <div className="job-meta">
                        {app.location && (
                          <div className="meta-info">
                            <MapPin size={14} />
                            <span>{app.location}</span>
                          </div>
                        )}
                        <div className="meta-info">
                          <Calendar size={14} />
                          <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {app.job_url && (
                      <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="job-link">
                        <LinkIcon size={14} />
                        <span>View Job Posting</span>
                      </a>
                    )}
                  </div>

                  {app.notes && (
                    <div className="job-card-footer">
                      <p className="job-notes">{app.notes}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Building2 size={48} />
            <h2>No applications found</h2>
            <p>Start tracking your job search by adding your first application!</p>
          </div>
        )}
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingJob ? 'Edit Application' : 'Add New Application'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Company Name *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.company_name}
                  onChange={e => setFormData({...formData, company_name: e.target.value})}
                  placeholder="e.g. Google"
                />
              </div>
              <div className="form-group">
                <label>Job Title *</label>
                <input 
                  required 
                  type="text" 
                  value={formData.job_title}
                  onChange={e => setFormData({...formData, job_title: e.target.value})}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as JobStatus})}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Job URL</label>
                  <input 
                    type="url" 
                    value={formData.job_url}
                    onChange={e => setFormData({...formData, job_url: e.target.value})}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. Remote, New York"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea 
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any additional information..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingJob ? 'Save Changes' : 'Add Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
