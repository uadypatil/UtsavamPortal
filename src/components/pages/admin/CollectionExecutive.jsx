import React, { useEffect, useMemo, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
// Migrated off the legacy CollectionExecutive/getBy/event_id and
// CollectionExecutive/save calls (non-REST backend) onto the documented
// REST contract (see services/endpoints/collectionExecutives.js). All
// existing behavior (search, filter, pagination, view/edit/toggle/delete)
// is preserved — only the data-access layer changed.
import { collectionExecutivesApi } from '../../../services/endpoints/collectionExecutives';
import { apiErrorMessage } from '../../../services/httpClient';
import { useToast } from '../../../context/ToastContext';
import { useNavigate } from 'react-router-dom';

// Same ACTIVE/INACTIVE convention used by the Super Admin entity screens
// (see pages/superadmin/*.jsx) — kept in one place per resource type would
// be nicer, but this mirrors the existing file's local-constant style.
const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

const PAGE_SIZE = 8;

const getId = (item) => item?._id || item?.id || item?.collectionExecutiveId;

const normalize = (item) => ({
  ...item,
  id: getId(item),
  fullName: item?.fullName || item?.full_name || '',
  username: item?.username || '',
  email: item?.email || '',
  contactNumber: item?.contactNumber || item?.contact_number || '',
  alternateContactNumber:
    item?.alternateContactNumber || item?.alternate_contact_number || '',
  age: item?.age ?? '',
  isActive:
    typeof item?.isActive === 'boolean'
      ? item.isActive
      : typeof item?.is_active === 'boolean'
        ? item.is_active
        : item?.status?.toLowerCase() !== 'disabled',
});

function CollectionExecutive() {
  const navigate = useNavigate();
  const toast = useToast();
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [viewCollector, setViewCollector] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const loadCollectors = async () => {
    try {
      setLoading(true);
      const eventId = localStorage.getItem('eventId') || undefined;
      const response = await collectionExecutivesApi.list(eventId ? { eventId } : undefined);
      const data = Array.isArray(response) ? response : response?.items || response?.results || [];
      setCollectors(data.map(normalize));
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Unable to load donation collectors.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 600, once: true });
    loadCollectors();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return collectors.filter((c) => {
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.username.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.contactNumber.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && c.isActive) ||
        (statusFilter === 'disabled' && !c.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [collectors, search, statusFilter]);

  useEffect(() => setPage(1), [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async () => {
    const collector = confirm?.collector;
    if (!collector) return;

    try {
      setActionLoading(collector.id);
      await collectionExecutivesApi.remove(collector.id);
      toast.success('Collector deleted.');
      setConfirm(null);
      await loadCollectors();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Unable to delete donation collector.'));
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async () => {
    const collector = confirm?.collector;
    if (!collector) return;

    try {
      setActionLoading(collector.id);
      await collectionExecutivesApi.setStatus(
        collector.id,
        collector.isActive ? STATUS_VALUES.inactive : STATUS_VALUES.active
      );
      toast.success('Collector status updated.');
      setConfirm(null);
      await loadCollectors();
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Unable to update collector status.'));
    } finally {
      setActionLoading(null);
    }
  };

  const activeCount = collectors.filter((c) => c.isActive).length;
  const disabledCount = collectors.length - activeCount;

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h4 className="fw-bold mb-1 position-relative">🪔 Donation Collectors</h4>
            <p className="mb-0 opacity-90 position-relative">
              Manage collection executives assigned to your festival event.
            </p>
          </div>
          <button
            className="btn ep-action-btn ep-action-btn--indigo"
            onClick={() => navigate('/admin/addDCollector')}
          >
            <i className="bi bi-person-plus-fill me-2" />
            Add Collector
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <Stat title="Total Collectors" value={collectors.length} icon="bi-people-fill" tone="indigo" />
        <Stat title="Active Collectors" value={activeCount} icon="bi-person-check-fill" tone="teal" />
        <Stat title="Disabled" value={disabledCount} icon="bi-person-slash" tone="amber" />
      </div>

      <div className="ep-chart-card" data-aos="fade-up">
        <div className="row g-3 align-items-end mb-4">
          <div className="col-lg-7 col-md-6">
            <label className="form-label fw-semibold">Search Collectors</label>
            <div className="ep-search-box">
              <i className="bi bi-search" />
              <input
                className="form-control"
                placeholder="Search by name, username, email or contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="ep-search-clear" onClick={() => setSearch('')}>
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          </div>

          <div className="col-lg-3 col-md-3">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Collectors</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-3">
            <button className="btn ep-refresh-btn w-100" onClick={loadCollectors} disabled={loading}>
              <i className={`bi ${loading ? 'bi-arrow-repeat ep-spin' : 'bi-arrow-clockwise'} me-2`} />
              Refresh
            </button>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6 className="fw-bold mb-1">Collection Executives</h6>
            <span className="text-muted small">{filtered.length} collector(s)</span>
          </div>
          {(search || statusFilter !== 'all') && (
            <button
              className="btn btn-sm ep-clear-filter"
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
              }}
            >
              <i className="bi bi-x-circle me-1" /> Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <Skeleton />
        ) : rows.length === 0 ? (
          <div className="ep-empty-state">
            <div className="ep-empty-state__icon"><i className="bi bi-people" /></div>
            <h6 className="fw-bold">No collectors found</h6>
            <p className="text-muted small">Try changing your search/filter or create a new collector.</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table ep-data-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Collector</th>
                    <th>Contact</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((collector) => (
                    <tr key={collector.id} className={!collector.isActive ? 'ep-row-disabled' : ''}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="ep-avatar ep-avatar--indigo">
                            {collector.fullName.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase() || 'DC'}
                          </div>
                          <div>
                            <div className="fw-semibold">{collector.fullName}</div>
                            <div className="small text-muted">@{collector.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="small fw-semibold">{collector.contactNumber || '—'}</div>
                        <div className="small text-muted">{collector.email || '—'}</div>
                      </td>
                      <td>{collector.age || '—'}</td>
                      <td>
                        <span className={`ep-status ${collector.isActive ? 'ep-status--active' : 'ep-status--disabled'}`}>
                          <span /> {collector.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn ep-icon-btn ep-icon-btn--view" title="View" onClick={() => setViewCollector(collector)}>
                            <i className="bi bi-eye" />
                          </button>
                          {/* Fixed route mismatch: this used to point to
                              /donation-collectors/edit/:id, which was never
                              a registered route (see AppRoutes.jsx) — the
                              actual edit screen lives under /admin/addDCollector/:id */}
                          <button className="btn ep-icon-btn ep-icon-btn--edit" title="Edit" onClick={() => navigate(`/admin/addDCollector/${collector.id}`)}>
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className={`btn ep-icon-btn ${collector.isActive ? 'ep-icon-btn--disable' : 'ep-icon-btn--enable'}`}
                            title={collector.isActive ? 'Disable' : 'Enable'}
                            onClick={() => setConfirm({ type: 'toggle', collector })}
                            disabled={actionLoading === collector.id}
                          >
                            <i className={`bi ${collector.isActive ? 'bi-person-slash' : 'bi-person-check'}`} />
                          </button>
                          <button
                            className="btn ep-icon-btn ep-icon-btn--delete"
                            title="Delete"
                            onClick={() => setConfirm({ type: 'delete', collector })}
                            disabled={actionLoading === collector.id}
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="ep-pagination">
                <button className="ep-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <i className="bi bi-chevron-left" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`ep-page-btn ${page === p ? 'ep-page-btn--active' : ''}`} onClick={() => setPage(p)}>
                    {p}
                  </button>
                ))}
                <button className="ep-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {viewCollector && (
        <ViewModal collector={viewCollector} onClose={() => setViewCollector(null)} />
      )}

      {confirm && (
        <ConfirmModal
          confirm={confirm}
          loading={actionLoading === confirm.collector.id}
          onClose={() => setConfirm(null)}
          onConfirm={confirm.type === 'delete' ? handleDelete : handleToggle}
        />
      )}
    </div>
  );
}

function Stat({ title, value, icon, tone }) {
  return (
    <div className="col-lg-4 col-md-6" data-aos="fade-up">
      <div className={`ep-stat-mini ep-stat-mini--${tone}`}>
        <div className="ep-stat-mini__icon"><i className={`bi ${icon}`} /></div>
        <div>
          <span className="text-muted small d-block">{title}</span>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ collector, onClose }) {
  return (
    <div className="ep-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ep-modal">
        <div className="ep-modal__header">
          <div className="d-flex align-items-center gap-2">
            <div className="ep-modal-icon"><i className="bi bi-person-vcard" /></div>
            <div>
              <h5 className="fw-bold mb-0">Donation Collector</h5>
              <span className="text-muted small">Collector account details</span>
            </div>
          </div>
          <button className="ep-modal-close" onClick={onClose}><i className="bi bi-x-lg" /></button>
        </div>

        <div className="ep-modal__body">
          <div className="d-flex align-items-center gap-3 mb-4">
            <div className="ep-avatar ep-avatar--indigo ep-avatar-lg">
              {collector.fullName.split(' ').map((x) => x[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div>
              <h5 className="fw-bold mb-1">{collector.fullName}</h5>
              <div className="text-muted">@{collector.username}</div>
              <span className={`ep-status mt-2 ${collector.isActive ? 'ep-status--active' : 'ep-status--disabled'}`}>
                <span /> {collector.isActive ? 'Active' : 'Disabled'}
              </span>
            </div>
          </div>

          <div className="row g-3">
            <Info label="Age" value={collector.age || '—'} />
            <Info label="Primary Contact" value={collector.contactNumber || '—'} />
            <Info label="Alternate Contact" value={collector.alternateContactNumber || '—'} />
            <Info label="Email" value={collector.email || '—'} />
          </div>
        </div>

        <div className="ep-modal__footer">
          <button className="btn ep-modal-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="col-md-6">
      <div className="small text-muted mb-1">{label}</div>
      <div className="fw-semibold">{value}</div>
    </div>
  );
}

function ConfirmModal({ confirm, loading, onClose, onConfirm }) {
  const isDelete = confirm.type === 'delete';
  const isActive = confirm.collector.isActive;

  return (
    <div className="ep-modal-backdrop">
      <div className="ep-confirm-modal">
        <div className={`ep-confirm-icon ${isDelete ? 'ep-confirm-icon--danger' : isActive ? 'ep-confirm-icon--warning' : 'ep-confirm-icon--success'}`}>
          <i className={`bi ${isDelete ? 'bi-trash3' : isActive ? 'bi-person-slash' : 'bi-person-check'}`} />
        </div>
        <h5 className="fw-bold mb-2">
          {isDelete ? 'Delete Collector?' : isActive ? 'Disable Collector?' : 'Enable Collector?'}
        </h5>
        <p className="text-muted mb-4">
          {isDelete
            ? `This will permanently delete ${confirm.collector.fullName}.`
            : isActive
              ? `${confirm.collector.fullName} will no longer be able to access the collector account.`
              : `${confirm.collector.fullName} will be enabled again.`}
        </p>
        <div className="d-flex justify-content-center gap-2">
          <button className="btn ep-modal-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button
            className={`btn ${isDelete ? 'ep-danger-btn' : isActive ? 'ep-warning-btn' : 'ep-success-btn'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing...' : isDelete ? 'Delete' : isActive ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="ep-skeleton-table">
      {Array.from({ length: 6 }).map((_, i) => (
        <div className="ep-skeleton-row" key={i}>
          <div className="d-flex gap-3 align-items-center">
            <div className="ep-skeleton ep-skeleton-avatar" />
            <div>
              <div className="ep-skeleton ep-skeleton-title mb-2" />
              <div className="ep-skeleton ep-skeleton-subtitle" />
            </div>
          </div>
          <div className="ep-skeleton ep-skeleton-line" />
          <div className="ep-skeleton ep-skeleton-short" />
          <div className="ep-skeleton ep-skeleton-status" />
          <div className="d-flex gap-2">
            <div className="ep-skeleton ep-skeleton-button" />
            <div className="ep-skeleton ep-skeleton-button" />
            <div className="ep-skeleton ep-skeleton-button" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CollectionExecutive;
