import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../App.css";
import StatCard from "../../components/ui/StatCard";
import BarChart from "../../components/ui/BarChart";
import QuickAction from "../../components/ui/QuickAction";
import Badge from "../../components/ui/Badge";
import { SkeletonTable } from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { donationsApi } from "../../services/endpoints/donations";
import { apiErrorMessage } from "../../services/httpClient";
import useAuth from "../../hooks/useAuth";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MODE_TONE = { UPI: "indigo", CASH: "success", CARD: "info" };

/**
 * Previously fully static (fake registration count, a hardcoded 5-row
 * "recent" table, a fabricated weekly bar chart). Now built from the real
 * GET /donations list for this event:
 *  - "Today's Registrations" and the weekly chart are DERIVED from that
 *    real list (grouped client-side), same approach as the Super Admin
 *    dashboard — never a separate fabricated number.
 *  - "Recently Added" shows the actual latest donations, most recent first.
 */
function EventManagerHome() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const filters = {
          ...(user.seasonId && { seasonId: user.seasonId }),
          ...(user.eventId && { eventId: user.eventId }),
          ...(user.id && { collectionExecutiveId: user.id }),
        };

        const data = await donationsApi.filter(filters);
        const list = Array.isArray(data)
          ? data
          : data?.items || data?.results || [];
        list.sort(
          (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
        );
        setDonations(list);
      } catch (error) {
        setLoadError(
          apiErrorMessage(error, "Unable to load recent donations."),
        );
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const registrationsToday = useMemo(() => {
    const todayKey = new Date().toDateString();
    return donations.filter(
      (d) => d.donation.createdAt && new Date(d.donation.createdAt).toDateString() === todayKey,
    ).length;
  }, [donations]);

  const weeklyData = useMemo(() => {
    const counts = Array(7).fill(0);
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    donations.forEach((d) => {
      if (!d.donation.createdAt) return;
      const dt = new Date(d.donation.createdAt);
      if (dt >= sevenDaysAgo && dt <= now) counts[dt.getDay()] += 1;
    });
    // Order starting from 6 days ago through today, left to right.
    const ordered = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      ordered.push({
        label: DAY_LABELS[d.getDay()],
        value: counts[d.getDay()],
      });
    }
    return ordered;
  }, [donations]);

  const recent = donations.slice(0, 20);
  const filtered = useMemo(() => {
    if (!search.trim()) return recent;
    const q = search.trim().toLowerCase();
    return recent.filter(
      (r) =>
        (r.donorName || "").toLowerCase().includes(q) ||
        String(r.donation.receiptNumber || "").includes(q),
    );
  }, [recent, search]);

  return (
    <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <h4 className="fw-bold mb-1 position-relative">🪔 Welcome back</h4>
        <p className="mb-0 opacity-90 position-relative">
          Here's what's happening with today's collections.
        </p>
      </div>

      {loadError && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-exclamation-triangle me-2" />
            {loadError}
          </span>
        </div>
      )}

      <div className="row">
        <div className="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
          {loading ? (
            <div
              className="ep-skeleton ep-skeleton-card"
              style={{ height: 150 }}
            />
          ) : (
            <StatCard
              title="Today's Registrations"
              value={registrationsToday}
              icon="bi-person-check-fill"
              tone="amber"
            />
          )}
          <div className="mt-3">
            <QuickAction
              to="/em/donation/new"
              icon="bi-plus-circle"
              label="New Donation"
              tone="amber"
            />
          </div>
        </div>

        <div className="col-lg-8 col-md-6 mb-4" data-aos="fade-up">
          <div className="ep-chart-card h-100">
            <h6 className="fw-bold mb-3">This Week's Donations</h6>
            <BarChart data={weeklyData} formatValue={(v) => `${v} receipts`} />
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
              placeholder="Search by name or receipt number..."
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
            title={
              recent.length === 0 ? "No receipts yet" : "No matching receipts"
            }
            subtitle={
              recent.length === 0
                ? "Receipts you create will show up here."
                : "Try a different name or receipt number."
            }
            actionLabel={recent.length === 0 ? "New Donation" : undefined}
            onAction={
              recent.length === 0
                ? () => (window.location.href = "/em/donation/new")
                : undefined
            }
          />
        ) : (
          <div className="ep-datatable-scroll" style={{ maxHeight: "45dvh" }}>
            <table className="ep-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted">{row.donation.receiptNumber}</td>
                    <td className="fw-medium">{row.donorName || "—"}</td>
                    <td>₹{Number(row.donationAmount || 0).toLocaleString("en-IN")}</td>
                    <td>
                      <Badge tone={MODE_TONE[row.donation.paymentMode] || "neutral"}>
                        {row.donation.paymentMode || "—"}
                      </Badge>
                    </td>
                    <td>
                      <Link
                        to={`/doner/${row.donation.receiptNumber}/receipt`}
                        target="_blank"
                        className="btn btn-sm border-primary text-primary"
                      >
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
