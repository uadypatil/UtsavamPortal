import React, { useEffect, useMemo, useState } from 'react';
import { donationsApi } from '../../../services/endpoints/donations';
import { eventsApi } from '../../../services/endpoints/events';
import { apiErrorMessage } from '../../../services/httpClient';
import { useToast } from '../../../context/ToastContext';
import useConfirm from '../../../context/useConfirm';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['', 'PENDING', 'COMPLETED', 'REFUNDED'];

// ⚠️ ASSUMPTION FLAG: the exact state machine (which statuses a donation
// may move to from its current one) isn't spelled out in the available
// Swagger extract — only that PATCH /donations/{id}/status is "state
// machine enforced". This is the most conservative, defensible mapping
// (PENDING -> COMPLETED, COMPLETED -> REFUNDED, REFUNDED is terminal) and
// only ever offers actions consistent with it; the backend remains the
// real enforcement point regardless. Confirm the true transitions against
// the live API and adjust this map only if it differs.
const NEXT_STATUSES = {
    PENDING: ['COMPLETED', 'REFUNDED'],
    COMPLETED: ['REFUNDED'],
    REFUNDED: [],
};

/**
 * Replaces the old admin/Reports.jsx, which was a fully static/dummy
 * table unrelated to any real donation data. This uses GET /donations
 * (filterable list) plus GET /donations/summary/{eventId} for the
 * headline numbers once an event is selected.
 */
export default function DonationOversight() {
    const toast = useToast();
    const confirm = useConfirm();
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [donations, setDonations] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const organizerId = localStorage.getItem('eventOrganizerId');

    useEffect(() => {
        (async () => {
            try {
                const data = await eventsApi.list(organizerId ? { eventOrganizerId: organizerId } : undefined);
                setEvents(Array.isArray(data) ? data : data?.items || []);
            } catch (e) {
                setError(apiErrorMessage(e, 'Unable to load your events.'));
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const params = {};
            if (eventId) params.eventId = eventId;
            if (statusFilter) params.status = statusFilter;
            const [donationData, summaryData] = await Promise.all([
                donationsApi.list(params),
                eventId ? donationsApi.getSummary(eventId) : Promise.resolve(null),
            ]);
            setDonations(Array.isArray(donationData) ? donationData : donationData?.items || []);
            setSummary(summaryData);
        } catch (e) {
            setError(apiErrorMessage(e, 'Unable to load donations.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [eventId, statusFilter]);
    useEffect(() => setPage(1), [eventId, statusFilter, search]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return donations;
        return donations.filter((d) =>
            [d.donorName, d.receiptNumber].some((v) => String(v || '').toLowerCase().includes(q))
        );
    }, [donations, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const [statusBusyId, setStatusBusyId] = useState(null);
    const handleStatusChange = async (donation, nextStatus) => {
        const ok = await confirm({
            title: `Mark this donation as ${nextStatus}?`,
            message: nextStatus === 'REFUNDED'
                ? 'This should only be done if the donation is genuinely being refunded.'
                : 'This will update the donation status for reporting and the donor\'s receipt.',
            confirmText: 'Confirm',
            variant: nextStatus === 'REFUNDED' ? 'danger' : 'success',
        });
        if (!ok) return;
        setStatusBusyId(donation.id);
        try {
            await donationsApi.setStatus(donation.id, nextStatus);
            toast.success('Donation status updated.');
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to update donation status.'));
        } finally {
            setStatusBusyId(null);
        }
    };

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-cash-coin me-2" />Donations</h4>
                <p className="mb-0 opacity-90 position-relative">Real donation records collected by your event's donation collectors.</p>
            </div>

            <div className="ep-chart-card mb-4">
                <div className="row g-3 align-items-end">
                    <div className="col-lg-4 col-md-6">
                        <label className="form-label fw-semibold">Event</label>
                        <select className="form-select" value={eventId} onChange={(e) => setEventId(e.target.value)}>
                            <option value="">All Events</option>
                            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.event_name || ev.name}</option>)}
                        </select>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <label className="form-label fw-semibold">Status</label>
                        <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
                        </select>
                    </div>
                    <div className="col-lg-5 col-md-12">
                        <label className="form-label fw-semibold">Search</label>
                        <div className="ep-search-box">
                            <i className="bi bi-search" />
                            <input className="form-control" placeholder="Search by donor name or receipt number..." value={search} onChange={(e) => setSearch(e.target.value)} />
                            {search && <button className="ep-search-clear" onClick={() => setSearch('')}><i className="bi bi-x" /></button>}
                        </div>
                    </div>
                </div>
            </div>

            {eventId && summary && (
                <div className="row g-3 mb-4">
                    {(Array.isArray(summary) ? summary : []).map((row, i) => (
                        <div className="col-6 col-lg-3" key={row.status || i}>
                            <div className="ep-stat-mini">
                                <div className="ep-stat-mini__icon"><i className="bi bi-receipt" /></div>
                                <div>
                                    <span className="text-muted small d-block">{row.status}</span>
                                    <h5 className="fw-bold mb-0">{row.count} · ₹{row.totalAmount ?? 0}</h5>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="ep-chart-card">
                {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}
                {loading ? (
                    <div className="py-5 text-center text-muted"><span className="spinner-border spinner-border-sm me-2" />Loading donations...</div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox display-6 d-block mb-2" />
                        {donations.length === 0 ? 'No donations recorded yet.' : 'No donations match your filters.'}
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead><tr><th>Receipt No.</th><th>Donor</th><th>Amount</th><th>Status</th><th>Date</th><th className="text-end">Actions</th></tr></thead>
                                <tbody>
                                    {rows.map((d) => {
                                        const nextOptions = NEXT_STATUSES[d.status] || [];
                                        const busy = statusBusyId === d.id;
                                        return (
                                            <tr key={d.id}>
                                                <td className="fw-semibold">{d.receiptNumber}</td>
                                                <td>{d.donorName || '—'}</td>
                                                <td>₹{d.amount}</td>
                                                <td>
                                                    <span className={`ep-status ${d.status === 'COMPLETED' ? 'ep-status--active' : d.status === 'REFUNDED' ? 'ep-status--danger' : 'ep-status--pending'}`}>
                                                        <span />{d.status}
                                                    </span>
                                                </td>
                                                <td>{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}</td>
                                                <td className="text-end">
                                                    {nextOptions.length === 0 ? (
                                                        <span className="text-muted small">—</span>
                                                    ) : (
                                                        <div className="d-flex gap-2 justify-content-end">
                                                            {nextOptions.map((status) => (
                                                                <button
                                                                    key={status}
                                                                    className={`btn btn-sm ${status === 'REFUNDED' ? 'ep-danger-btn' : 'ep-success-btn'}`}
                                                                    disabled={busy}
                                                                    onClick={() => handleStatusChange(d, status)}
                                                                >
                                                                    Mark {status}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
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
        </div>
    );
}
