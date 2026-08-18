import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StatCard from '../../components/ui/StatCard';
import { SkeletonStatRow } from '../../components/ui/Skeleton';
import { usersApi } from '../../services/endpoints/users';
import { eventOrganizersApi } from '../../services/endpoints/eventOrganizers';
import { eventsApi } from '../../services/endpoints/events';
import { expensesApi } from '../../services/endpoints/expenses';
import { apiErrorMessage } from '../../services/httpClient';

// There is no dedicated "platform dashboard summary" endpoint in the
// documented API, so — per the requirement to never manufacture stats —
// this derives every number from the real list endpoints (their array
// length / count field) instead of a fabricated metrics call. That means
// this issues several requests on mount; if the backend later adds a
// single summary endpoint, swap the Promise.all below for that one call.
function countOf(data) {
    if (Array.isArray(data)) return data.length;
    if (data?.total != null) return data.total;
    if (Array.isArray(data?.items)) return data.items.length;
    if (Array.isArray(data?.results)) return data.results.length;
    return 0;
}

export default function SuperAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const [users, organizers, events, pendingExpenses] = await Promise.all([
                usersApi.list(),
                eventOrganizersApi.list(),
                eventsApi.list(),
                expensesApi.list({ status: 'SUBMITTED' }),
            ]);
            setStats({
                users: countOf(users),
                organizers: countOf(organizers),
                events: countOf(events),
                pendingExpenses: countOf(pendingExpenses),
            });
        } catch (e) {
            setError(apiErrorMessage(e, 'Unable to load dashboard statistics.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-speedometer2 me-2" />Super Admin Dashboard</h4>
                <p className="mb-0 opacity-90 position-relative">Platform-wide overview across every Event Organizer and Mandal.</p>
            </div>

            {error && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center">
                    <span><i className="bi bi-exclamation-triangle me-2" />{error}</span>
                    <button className="btn btn-sm btn-outline-danger" onClick={load}>Retry</button>
                </div>
            )}

            {loading ? (
                <SkeletonStatRow count={4} />
            ) : stats && (
                <div className="row g-3 mb-4">
                    <div className="col-6 col-lg-3">
                        <StatCard title="Platform Users" value={stats.users} icon="bi-person-badge" tone="indigo" />
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatCard title="Event Organizers" value={stats.organizers} icon="bi-shop" tone="teal" />
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatCard title="Events" value={stats.events} icon="bi-calendar-event" tone="amber" />
                    </div>
                    <div className="col-6 col-lg-3">
                        <StatCard title="Expenses Awaiting Approval" value={stats.pendingExpenses} icon="bi-check2-square" tone="rose" />
                    </div>
                </div>
            )}

            <div className="ep-chart-card">
                <h6 className="fw-bold mb-2">Where to go next</h6>
                <p className="text-muted mb-0 small">
                    Onboard or review Mandals under <strong>Event Organizers</strong>, manage global
                    <strong> Expense Categories</strong> so organizers can file expenses, and clear the
                    <strong> Expense Approvals</strong> queue as submissions come in. Platform-level donation
                    reporting is under <strong>Platform Reports</strong>.
                </p>
            </div>
        </div>
    );
}
