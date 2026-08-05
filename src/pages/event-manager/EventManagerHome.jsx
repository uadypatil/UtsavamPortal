import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/ui/BarChart';
import QuickAction from '../../components/ui/QuickAction';
import Badge from '../../components/ui/Badge';
import { SkeletonTable } from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

const WEEKLY_DONATIONS = [
    { label: 'Mon', value: 6 },
    { label: 'Tue', value: 9 },
    { label: 'Wed', value: 4 },
    { label: 'Thu', value: 12 },
    { label: 'Fri', value: 10 },
    { label: 'Sat', value: 17 },
    { label: 'Sun', value: 14 },
];

function EventManagerHome() {
    const [loading, setLoading] = useState(true);
    const [registrationsToday, setRegistrationsToday] = useState(0);
    const [recent, setRecent] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        // Static data for now; replace with a real API call (src/services/api.js)
        // once the backend endpoint for recent donations is available.
        const timer = setTimeout(() => {
            setRegistrationsToday(17);
            setRecent([
                { regNo: 142, name: 'Anishq Shubhashish', amount: 500, mode: 'UPI' },
                { regNo: 143, name: 'Rahul Patil', amount: 1100, mode: 'Cash' },
                { regNo: 144, name: 'Sonal Nikam', amount: 250, mode: 'UPI' },
                { regNo: 145, name: 'Ganesh Deshmukh', amount: 2100, mode: 'Card' },
                { regNo: 146, name: 'Priya Kulkarni', amount: 750, mode: 'UPI' },
            ]);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const filtered = useMemo(() => {
        if (!search.trim()) return recent;
        const q = search.trim().toLowerCase();
        return recent.filter(
            (r) => r.name.toLowerCase().includes(q) || String(r.regNo).includes(q)
        );
    }, [recent, search]);

    const modeTone = { UPI: 'indigo', Cash: 'success', Card: 'info' };

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4" data-aos="fade-up">
                <h4 className="fw-bold mb-1 position-relative">🪔 Welcome back</h4>
                <p className="mb-0 opacity-90 position-relative">Here's what's happening with today's collections.</p>
            </div>

            <div className="row">
                <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
                    {loading ? (
                        <div className="ep-skeleton ep-skeleton-card" style={{ height: 150 }} />
                    ) : (
                        <StatCard
                            title="Today's Registrations"
                            value={registrationsToday}
                            icon="bi-person-check-fill"
                            tone="amber"
                            trend={{ direction: 'up', label: '+5 since noon' }}
                        />
                    )}
                    <div className="mt-3">
                        <QuickAction to="/em/donation/new" icon="bi-plus-circle" label="New Donation" tone="amber" />
                    </div>
                </div>

                <div className="col-lg-8 col-md-6 mb-4" data-aos="fade-up">
                    <div className="ep-chart-card h-100">
                        <h6 className="fw-bold mb-3">This Week's Donations</h6>
                        <BarChart data={WEEKLY_DONATIONS} formatValue={(v) => `${v} receipts`} />
                    </div>
                </div>
            </div>

            <div className="ep-datatable-card" data-aos="fade-up">
                <div className="ep-datatable-toolbar">
                    <h6 className="fw-bold mb-0">Recently Added</h6>
                    <div className="ep-datatable-search">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search by name or reg. no..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-3">
                        <SkeletonTable rows={5} columns={4} />
                    </div>
                ) : filtered.length === 0 ? (
                    <EmptyState
                        icon="bi-receipt"
                        title={recent.length === 0 ? 'No receipts yet' : 'No matching receipts'}
                        subtitle={recent.length === 0 ? "Receipts you create will show up here." : 'Try a different name or receipt number.'}
                        actionLabel={recent.length === 0 ? 'New Donation' : undefined}
                        onAction={recent.length === 0 ? () => (window.location.href = '/em/donation/new') : undefined}
                    />
                ) : (
                    <div className="ep-datatable-scroll" style={{ maxHeight: '45dvh' }}>
                        <table className="ep-table">
                            <thead>
                                <tr>
                                    <th>Reg. No</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Mode</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((row) => (
                                    <tr key={row.regNo}>
                                        <td className="text-muted">#{row.regNo}</td>
                                        <td className="fw-medium">{row.name}</td>
                                        <td>₹{row.amount.toLocaleString('en-IN')}</td>
                                        <td><Badge tone={modeTone[row.mode] || 'neutral'}>{row.mode}</Badge></td>
                                        <td>
                                            <Link to="/em/doner/profile" className="btn btn-sm border-primary text-primary">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventManagerHome;
