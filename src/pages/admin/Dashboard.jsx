import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';
import StatCard from '../../components/ui/StatCard';
import BarChart from '../../components/ui/BarChart';
import QuickAction from '../../components/ui/QuickAction';
import ActivityItem from '../../components/ui/ActivityItem';
import { SkeletonStatRow } from '../../components/ui/Skeleton';

const WEEKLY_COLLECTIONS = [
    { label: 'Mon', value: 18200 },
    { label: 'Tue', value: 24600 },
    { label: 'Wed', value: 19800 },
    { label: 'Thu', value: 31200 },
    { label: 'Fri', value: 28400 },
    { label: 'Sat', value: 40100 },
    { label: 'Sun', value: 36483 },
];

const RECENT_ACTIVITY = [
    { icon: 'bi-receipt', tone: 'indigo', title: 'New receipt #2384', subtitle: 'Anishq Shubhashish · ₹500', time: '2m ago' },
    { icon: 'bi-person-plus', tone: 'teal', title: 'Event manager registered', subtitle: 'Sonal Nikam · Ganesh Mandal', time: '18m ago' },
    { icon: 'bi-receipt', tone: 'indigo', title: 'New receipt #2383', subtitle: 'Rahul Patil · ₹1,100', time: '32m ago' },
    { icon: 'bi-calendar-event', tone: 'amber', title: 'New event created', subtitle: 'Shree Ganesh Utsav Mandal', time: '1h ago' },
];

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        // Static data for now; replace with a real API call (src/services/api.js)
        // once the backend endpoint for admin summary stats is available.
        const timer = setTimeout(() => {
            setSummary({
                eventsToday: 27,
                revenueToday: 36483,
                receiptsToday: 2384,
            });
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4" data-aos="fade-up">
                <h4 className="fw-bold mb-1 position-relative">🪔 Ganpati Festival Dashboard</h4>
                <p className="mb-0 opacity-90 position-relative">A quick look at today's events, receipts, and collections.</p>
            </div>

            {loading ? (
                <SkeletonStatRow count={3} />
            ) : (
                <div className="row" data-aos="fade-up">
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <StatCard
                            title="Current Receipt Number"
                            value={summary.eventsToday}
                            icon="bi-hash"
                            tone="amber"
                            trend={{ direction: 'up', label: '+3 today' }}
                        />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <StatCard
                            title="Today's Revenue"
                            value={`₹${summary.revenueToday.toLocaleString('en-IN')}/-`}
                            icon="bi-currency-rupee"
                            tone="indigo"
                            trend={{ direction: 'up', label: '+12% vs yesterday' }}
                        />
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
                        <StatCard
                            title="Today's Receipts"
                            value={summary.receiptsToday}
                            icon="bi-receipt"
                            tone="teal"
                            trend={{ direction: 'up', label: '+8% vs yesterday' }}
                        />
                    </div>
                </div>
            )}

            <div className="row">
                <div className="col-lg-7 mb-4" data-aos="fade-up">
                    <div className="ep-chart-card h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h6 className="fw-bold mb-0">Weekly Collections</h6>
                                <span className="text-muted small">This week's donation totals</span>
                            </div>
                            <span className="ep-badge ep-badge--indigo">
                                <i className="bi bi-graph-up-arrow"></i> +12%
                            </span>
                        </div>
                        <BarChart data={WEEKLY_COLLECTIONS} formatValue={(v) => `₹${v.toLocaleString('en-IN')}`} />
                    </div>
                </div>

                <div className="col-lg-5 mb-4" data-aos="fade-up">
                    <div className="ep-chart-card h-100">
                        <h6 className="fw-bold mb-3">Recent Activity</h6>
                        <div>
                            {RECENT_ACTIVITY.map((item, i) => (
                                <ActivityItem key={i} {...item} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row" data-aos="fade-up">
                <div className="col-12">
                    <h6 className="fw-bold mb-3">Quick Actions</h6>
                </div>
                <div className="col-md-4 col-sm-6 mb-3">
                    <QuickAction to="events/all" icon="bi-calendar-event" label="Explore Events" tone="indigo" />
                </div>
                <div className="col-md-4 col-sm-6 mb-3">
                    <QuickAction to="events/managers" icon="bi-people-fill" label="Event Managers" tone="teal" />
                </div>
                <div className="col-md-4 col-sm-6 mb-3">
                    <QuickAction to="reports" icon="bi-graph-up-arrow" label="Revenue Report" tone="amber" />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
