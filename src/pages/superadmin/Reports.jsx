import React, { useEffect, useState } from 'react';
import { eventOrganizersApi } from '../../services/endpoints/eventOrganizers';
import { eventsApi } from '../../services/endpoints/events';
import { donationsApi } from '../../services/endpoints/donations';
import { apiErrorMessage } from '../../services/httpClient';

/**
 * Platform-level reporting for Super Admin. GET /donations/summary/{eventId}
 * is the only summary endpoint the documented API provides, so this is
 * necessarily event-scoped — pick an organizer, pick one of their events,
 * see that event's real donation summary. There is no
 * GET /donations/summary (all-events) endpoint documented, so this does
 * NOT attempt to fabricate a platform-wide total by summing client-side;
 * that would silently break the moment pagination or filtering changes
 * the events list. If a true platform-wide summary endpoint exists later,
 * this is the one place to add it.
 */
export default function SuperAdminReports() {
    const [organizers, setOrganizers] = useState([]);
    const [events, setEvents] = useState([]);
    const [organizerId, setOrganizerId] = useState('');
    const [eventId, setEventId] = useState('');

    const [loadingLookups, setLoadingLookups] = useState(true);
    const [summary, setSummary] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            setLoadingLookups(true);
            try {
                const [orgData, eventData] = await Promise.all([eventOrganizersApi.list(), eventsApi.list()]);
                setOrganizers(Array.isArray(orgData) ? orgData : orgData?.items || []);
                setEvents(Array.isArray(eventData) ? eventData : eventData?.items || []);
            } catch (e) {
                setError(apiErrorMessage(e, 'Unable to load organizers/events.'));
            } finally {
                setLoadingLookups(false);
            }
        })();
    }, []);

    const filteredEvents = organizerId
        ? events.filter((e) => String(e.eventOrganizerId ?? e.organizerId) === String(organizerId))
        : events;

    const loadSummary = async (id) => {
        if (!id) { setSummary(null); return; }
        setLoadingSummary(true);
        setError('');
        try {
            const data = await donationsApi.getSummary(id);
            setSummary(data);
        } catch (e) {
            setError(apiErrorMessage(e, 'Unable to load the donation summary for this event.'));
            setSummary(null);
        } finally {
            setLoadingSummary(false);
        }
    };

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-graph-up-arrow me-2" />Platform Reports</h4>
                <p className="mb-0 opacity-90 position-relative">Donation totals by status for any event across any Mandal.</p>
            </div>

            <div className="ep-chart-card mb-4">
                <div className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Filter by Organizer / Mandal</label>
                        <select
                            className="form-select"
                            disabled={loadingLookups}
                            value={organizerId}
                            onChange={(e) => { setOrganizerId(e.target.value); setEventId(''); setSummary(null); }}
                        >
                            <option value="">All Organizers</option>
                            {organizers.map((o) => (
                                <option key={o.id} value={o.id}>{o.mandalName || o.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-semibold">Event</label>
                        <select
                            className="form-select"
                            disabled={loadingLookups || filteredEvents.length === 0}
                            value={eventId}
                            onChange={(e) => { setEventId(e.target.value); loadSummary(e.target.value); }}
                        >
                            <option value="">Select an event to view its summary</option>
                            {filteredEvents.map((ev) => (
                                <option key={ev._id} value={ev._id}>{ev.name || ev.eventName}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2" />{error}</div>
            )}

            {loadingSummary ? (
                <div className="py-5 text-center text-muted"><span className="spinner-border spinner-border-sm me-2" />Loading summary...</div>
            ) : !eventId ? (
                <div className="ep-chart-card text-center py-5 text-muted">
                    <i className="bi bi-bar-chart display-6 d-block mb-2" />
                    Select an event above to view its real donation summary.
                </div>
            ) : summary ? (
                <div className="ep-chart-card">
                    <h6 className="fw-bold mb-3">Donation Summary</h6>
                    {Array.isArray(summary) ? (
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead><tr><th>Status</th><th>Count</th><th>Total Amount</th></tr></thead>
                                <tbody>
                                    {summary.map((row, i) => (
                                        <tr key={row.status || i}>
                                            <td>{row.status}</td>
                                            <td>{row.count}</td>
                                            <td>{row.totalAmount != null ? `₹${row.totalAmount}` : '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <pre className="mb-0 small text-muted" style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(summary, null, 2)}</pre>
                    )}
                </div>
            ) : null}
        </div>
    );
}
