import React, { useEffect, useMemo, useState } from 'react';
import { donorsApi } from '../../../services/endpoints/donors';
import { apiErrorMessage } from '../../../services/httpClient';

const PAGE_SIZE = 10;

/**
 * Donor list/search for Event Organizers. PRIVACY NOTE: donors never log
 * in themselves (see the donation-flow consent work), so this is the only
 * place an organizer can review who has donated. Only the fields an
 * organizer legitimately needs (name, contact, city, total given) are
 * shown in the table; full address and any other sensitive detail is only
 * revealed in the detail view, on demand, not in the scannable list.
 */
export default function DonorManager() {
    const [donors, setDonors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState(null);

    const load = async (params) => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await donorsApi.list(params);
            const list = Array.isArray(data) ? data : data?.items || data?.results || [];
            setDonors(list);
        } catch (error) {
            setLoadError(apiErrorMessage(error, 'Unable to load donors.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

    // Server-side search where supported (GET /donors "List / search
    // donors"); debounced client trigger, but falls back to client-side
    // filtering below too so results still narrow if the backend ignores
    // unknown query params.
    useEffect(() => {
        const t = setTimeout(() => load(search ? { search } : undefined), 350);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return donors;
        return donors.filter((d) =>
            [d.name, d.phone, d.email].some((v) => String(v || '').toLowerCase().includes(q))
        );
    }, [donors, search]);

    useEffect(() => setPage(1), [search]);
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-person-hearts me-2" />Donors</h4>
                <p className="mb-0 opacity-90 position-relative">Donors who have contributed to your events. Handle their information carefully.</p>
            </div>

            <div className="ep-chart-card">
                <div className="row g-3 align-items-end mb-4">
                    <div className="col-lg-8 col-md-6">
                        <label className="form-label fw-semibold">Search Donors</label>
                        <div className="ep-search-box">
                            <i className="bi bi-search" />
                            <input className="form-control" placeholder="Search by name, phone or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            {search && <button className="ep-search-clear" onClick={() => setSearch('')}><i className="bi bi-x" /></button>}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <button className="btn ep-refresh-btn w-100" onClick={() => load()} disabled={loading}>
                            <i className={`bi ${loading ? 'bi-arrow-repeat ep-spin' : 'bi-arrow-clockwise'} me-2`} /> Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-5 text-center text-muted"><span className="spinner-border spinner-border-sm me-2" />Loading donors...</div>
                ) : loadError ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-exclamation-triangle me-2" />{loadError}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => load()}>Retry</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox display-6 d-block mb-2" />
                        {donors.length === 0 ? 'No donors recorded yet.' : 'No donors match your search.'}
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead><tr><th>Name</th><th>Phone</th><th>City</th><th>Total Donated</th><th className="text-end">Details</th></tr></thead>
                                <tbody>
                                    {rows.map((d) => (
                                        <tr key={d.id}>
                                            <td className="fw-semibold">{d.name}</td>
                                            <td>{d.phone}</td>
                                            <td>{d.city || '—'}</td>
                                            <td>{d.totalDonated != null ? `₹${d.totalDonated}` : '—'}</td>
                                            <td className="text-end">
                                                <button className="btn ep-icon-btn ep-icon-btn--view" title="View details" onClick={() => setSelected(d)}>
                                                    <i className="bi bi-eye" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && (
                            <div className="ep-pagination">
                                <button className="ep-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}><i className="bi bi-chevron-left" /></button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button key={p} className={`ep-page-btn ${page === p ? 'ep-page-btn--active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                                ))}
                                <button className="ep-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}><i className="bi bi-chevron-right" /></button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selected && (
                <div className="ep-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setSelected(null)}>
                    <div className="ep-modal" style={{ maxWidth: 480 }}>
                        <div className="ep-modal__header">
                            <div className="d-flex align-items-center gap-2">
                                <div className="ep-modal-icon"><i className="bi bi-person-vcard" /></div>
                                <h5 className="fw-bold mb-0">{selected.name}</h5>
                            </div>
                            <button className="ep-modal-close" onClick={() => setSelected(null)}><i className="bi bi-x-lg" /></button>
                        </div>
                        <div className="ep-modal__body">
                            <div className="row g-3">
                                <div className="col-md-6"><div className="small text-muted mb-1">Phone</div><div className="fw-semibold">{selected.phone || '—'}</div></div>
                                <div className="col-md-6"><div className="small text-muted mb-1">Email</div><div className="fw-semibold">{selected.email || '—'}</div></div>
                                <div className="col-12"><div className="small text-muted mb-1">Address</div><div className="fw-semibold">{selected.address || '—'}</div></div>
                                <div className="col-md-6"><div className="small text-muted mb-1">Total Donated</div><div className="fw-semibold">{selected.totalDonated != null ? `₹${selected.totalDonated}` : '—'}</div></div>
                            </div>
                            <div className="alert alert-light border mt-3 mb-0 small">
                                <i className="bi bi-shield-lock me-2" />
                                This donor's information was collected for donation/receipt/accounting purposes. Only share it as permitted by your organization's privacy policy.
                            </div>
                        </div>
                        <div className="ep-modal__footer">
                            <button className="btn ep-modal-secondary" onClick={() => setSelected(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
