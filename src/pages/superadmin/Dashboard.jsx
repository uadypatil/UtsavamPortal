import React, { useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import StatCard from '../../components/ui/StatCard';
import { SkeletonStatRow } from '../../components/ui/Skeleton';

import { usersApi } from '../../services/endpoints/users';
import { eventOrganizersApi } from '../../services/endpoints/eventOrganizers';
import { eventsApi } from '../../services/endpoints/events';
import { expensesApi } from '../../services/endpoints/expenses';
import { apiErrorMessage } from '../../services/httpClient';

/**
 * Safely unwrap common API response formats.
 *
 * Supported examples:
 * []
 * { data: [] }
 * { data: { items: [] } }
 * { items: [] }
 * { results: [] }
 * null
 * undefined
 */
function unwrapResponse(response) {
    if (response == null) {
        return null;
    }

    // Axios-style response
    if (
        response &&
        typeof response === 'object' &&
        Object.prototype.hasOwnProperty.call(response, 'data')
    ) {
        return response.data ?? null;
    }

    return response;
}

/**
 * Safely get a numeric count from different API response formats.
 *
 * Never returns undefined, null, NaN or negative values.
 */
function countOf(response) {
    const data = unwrapResponse(response);

    if (data == null) {
        return 0;
    }

    // Direct array
    if (Array.isArray(data)) {
        return data.length;
    }

    if (typeof data !== 'object') {
        return 0;
    }

    // Direct count fields
    const possibleCounts = [
        data.total,
        data.totalCount,
        data.count,
        data.totalItems,
        data.totalRecords,
    ];

    for (const value of possibleCounts) {
        const numericValue = Number(value);

        if (Number.isFinite(numericValue) && numericValue >= 0) {
            return numericValue;
        }
    }

    // Common paginated response formats
    const collections = [
        data.items,
        data.results,
        data.records,
        data.rows,
        data.docs,
        data.data,
    ];

    for (const collection of collections) {
        if (Array.isArray(collection)) {
            return collection.length;
        }
    }

    return 0;
}

/**
 * Default dashboard state.
 *
 * Keeping this as a real object instead of null means the UI
 * can always render, even when the backend has no data yet.
 */
const EMPTY_STATS = {
    users: 0,
    organizers: 0,
    events: 0,
    pendingExpenses: 0,
};

export default function SuperAdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(EMPTY_STATS);

    const load = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        setError('');

        try {
            /*
             * Do not allow one failed endpoint to make the entire
             * dashboard disappear.
             *
             * allSettled lets us use whatever data is available.
             */
            const results = await Promise.allSettled([
                usersApi.list(),
                eventOrganizersApi.list(),
                eventsApi.list(),
                expensesApi.list({ status: 'SUBMITTED' }),
            ]);

            const [usersResult, organizersResult, eventsResult, expensesResult] =
                results;

            const nextStats = {
                users:
                    usersResult.status === 'fulfilled'
                        ? countOf(usersResult.value)
                        : 0,

                organizers:
                    organizersResult.status === 'fulfilled'
                        ? countOf(organizersResult.value)
                        : 0,

                events:
                    eventsResult.status === 'fulfilled'
                        ? countOf(eventsResult.value)
                        : 0,

                pendingExpenses:
                    expensesResult.status === 'fulfilled'
                        ? countOf(expensesResult.value)
                        : 0,
            };

            setStats(nextStats);

            /*
             * Find failed requests and show a non-blocking warning.
             * The dashboard itself still renders.
             */
            const failedRequests = results.filter(
                (result) => result.status === 'rejected'
            );

            if (failedRequests.length > 0) {
                const firstError = failedRequests[0].reason;

                setError(
                    apiErrorMessage(
                        firstError,
                        'Some dashboard statistics could not be loaded.'
                    )
                );
            }
        } catch (e) {
            /*
             * This is a final safety net.
             *
             * Even if something unexpected happens, keep the dashboard
             * visible with zero values instead of rendering an empty page.
             */
            setStats((currentStats) => ({
                ...EMPTY_STATS,
                ...(currentStats || {}),
            }));

            setError(
                apiErrorMessage(
                    e,
                    'Unable to load dashboard statistics.'
                )
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        load(false);
    }, [load]);

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            {/* =========================================================
                HEADER
            ========================================================== */}
            <div className="ep-festive-banner mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <h4 className="fw-bold mb-1 position-relative">
                            <i className="bi bi-speedometer2 me-2" />
                            Super Admin Dashboard
                        </h4>

                        <p className="mb-0 opacity-90 position-relative">
                            Platform-wide overview across every Event Organizer
                            and Mandal.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn-light btn-sm fw-semibold"
                        onClick={() => load(true)}
                        disabled={loading || refreshing}
                    >
                        <i
                            className={`bi ${
                                refreshing
                                    ? 'bi-arrow-repeat'
                                    : 'bi-arrow-clockwise'
                            } me-1`}
                        />

                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>

            {/* =========================================================
                ERROR / PARTIAL LOAD WARNING
            ========================================================== */}
            {error && (
                <div
                    className="alert alert-warning d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
                    role="alert"
                >
                    <div>
                        <i className="bi bi-exclamation-triangle me-2" />

                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => load(true)}
                        disabled={refreshing}
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* =========================================================
                STATISTICS
            ========================================================== */}
            {loading ? (
                <SkeletonStatRow count={4} />
            ) : (
                <div className="row g-3 mb-4">
                    <div className="col-6 col-lg-3">
                        <StatCard
                            title="Platform Users"
                            value={Number.isFinite(Number(stats?.users))
                                ? Number(stats.users)
                                : 0}
                            icon="bi-person-badge"
                            tone="indigo"
                        />
                    </div>

                    <div className="col-6 col-lg-3">
                        <StatCard
                            title="Event Organizers"
                            value={
                                Number.isFinite(Number(stats?.organizers))
                                    ? Number(stats.organizers)
                                    : 0
                            }
                            icon="bi-shop"
                            tone="teal"
                        />
                    </div>

                    <div className="col-6 col-lg-3">
                        <StatCard
                            title="Events"
                            value={
                                Number.isFinite(Number(stats?.events))
                                    ? Number(stats.events)
                                    : 0
                            }
                            icon="bi-calendar-event"
                            tone="amber"
                        />
                    </div>

                    <div className="col-6 col-lg-3">
                        <StatCard
                            title="Expenses Awaiting Approval"
                            value={
                                Number.isFinite(
                                    Number(stats?.pendingExpenses)
                                )
                                    ? Number(stats.pendingExpenses)
                                    : 0
                            }
                            icon="bi-check2-square"
                            tone="rose"
                        />
                    </div>
                </div>
            )}

            {/* =========================================================
                EMPTY PLATFORM STATE
            ========================================================== */}
            {!loading &&
                stats?.users === 0 &&
                stats?.organizers === 0 &&
                stats?.events === 0 &&
                stats?.pendingExpenses === 0 && (
                    <div className="card border-0 shadow-sm rounded-4 mb-4">
                        <div className="card-body text-center py-5">
                            <div
                                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light mb-3"
                                style={{
                                    width: '72px',
                                    height: '72px',
                                }}
                            >
                                <i className="bi bi-bar-chart fs-2 text-secondary" />
                            </div>

                            <h5 className="fw-bold mb-2">
                                No platform data yet
                            </h5>

                            <p
                                className="text-muted mb-3 mx-auto"
                                style={{ maxWidth: '600px' }}
                            >
                                Your dashboard is ready, but there are currently
                                no users, organizers, events, or pending
                                expenses available from the backend.
                            </p>

                            <button
                                type="button"
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => load(true)}
                                disabled={refreshing}
                            >
                                <i className="bi bi-arrow-clockwise me-1" />
                                Check Again
                            </button>
                        </div>
                    </div>
                )}

            {/* =========================================================
                QUICK NAVIGATION / INFORMATION
            ========================================================== */}
            <div className="ep-chart-card">
                <div className="d-flex align-items-start gap-3">
                    <div
                        className="d-flex align-items-center justify-content-center rounded-3 bg-light flex-shrink-0"
                        style={{
                            width: '42px',
                            height: '42px',
                        }}
                    >
                        <i className="bi bi-compass fs-5" />
                    </div>

                    <div>
                        <h6 className="fw-bold mb-2">
                            Where to go next
                        </h6>

                        <p className="text-muted mb-0 small">
                            Onboard or review Mandals under{' '}
                            <strong>Event Organizers</strong>, manage global{' '}
                            <strong>Expense Categories</strong> so organizers
                            can file expenses, and clear the{' '}
                            <strong>Expense Approvals</strong> queue as
                            submissions come in. Platform-level donation
                            reporting is available under{' '}
                            <strong>Platform Reports</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}