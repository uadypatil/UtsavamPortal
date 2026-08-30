import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../App.css";

import StatCard from "../../components/ui/StatCard";
import QuickAction from "../../components/ui/QuickAction";
import { SkeletonStatRow } from "../../components/ui/Skeleton";

import useAuth from "../../hooks/useAuth";
import { donorsApi } from "../../services/endpoints/donors";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const data = await donorsApi.list({
        eventOrganizerId: user?.id || undefined,
        seasonId: user?.seasonId || undefined,
      });

      const donors = Array.isArray(data)
        ? data
        : data?.items || data?.results || [];

      /*
       * Calculate live statistics from donor records
       */

      const totalDonors = donors.length;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayDonors = donors.filter((donor) => {
        if (!donor.createdAt) return false;

        const donorDate = new Date(donor.createdAt);
        donorDate.setHours(0, 0, 0, 0);

        return donorDate.getTime() === today.getTime();
      });

      const revenueToday = todayDonors.reduce((total, donor) => {
        return (
          total +
          Number(
            donor.totalDonation || donor.donationAmount || donor.amount || 0,
          )
        );
      }, 0);

      const receiptsToday = todayDonors.length;

      setSummary({
        totalDonors,
        revenueToday,
        receiptsToday,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);

      setSummary({
        totalDonors: 0,
        revenueToday: 0,
        receiptsToday: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <h4 className="fw-bold mb-1 position-relative">
          🪔 Ganpati Festival Dashboard
        </h4>

        <p className="mb-0 opacity-90 position-relative">
          A quick look at today's events, receipts, and collections.
        </p>
      </div>

      {loading ? (
        <SkeletonStatRow count={3} />
      ) : (
        <div className="row" data-aos="fade-up">
          {/* Total Donors */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <StatCard
              title="Total Donors"
              value={summary?.totalDonors || 0}
              icon="bi-person"
              tone="amber"
            />
          </div>

          {/* Today's Revenue */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <StatCard
              title="Today's Revenue"
              value={`₹${Number(summary?.revenueToday || 0).toLocaleString(
                "en-IN",
              )}/-`}
              icon="bi-currency-rupee"
              tone="indigo"
            />
          </div>

          {/* Today's Receipts */}
          <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
            <StatCard
              title="Today's Receipts"
              value={summary?.receiptsToday || 0}
              icon="bi-receipt"
              tone="teal"
            />
          </div>
        </div>
      )}

      {/*
        Weekly Collections / Recent Activity
        Kept hidden intentionally.
      */}
      <div className="d-none">{/* Hidden dashboard sections */}</div>

      {/* Quick Actions */}
      <div className="row" data-aos="fade-up">
        <div className="col-12">
          <h6 className="fw-bold mb-3">Quick Actions</h6>
        </div>

        <div className="col-md-4 col-sm-6 mb-3">
          <QuickAction
            to="events/all"
            icon="bi-calendar-event"
            label="Explore Events"
            tone="indigo"
          />
        </div>

        <div className="col-md-4 col-sm-6 mb-3">
          <QuickAction
            to="events/managers"
            icon="bi-people-fill"
            label="Event Managers"
            tone="teal"
          />
        </div>

        <div className="col-md-4 col-sm-6 mb-3">
          <QuickAction
            to="reports"
            icon="bi-graph-up-arrow"
            label="Revenue Report"
            tone="amber"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
