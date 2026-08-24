import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { donationsApi } from "../../../services/endpoints/donations";
import { apiErrorMessage } from "../../../services/httpClient";

function EventManagerProfile() {
  const navigate = useNavigate();
  const { getUser, logout } = useAuth();

  const user = getUser();
  const eventId = localStorage.getItem("eventId");

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
    });
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");

      try {
        const params = {};

        if (eventId) params.eventId = eventId;
        if (user?.id) params.collectedBy = user.id;

        const data = await donationsApi.list(params);

        const list = Array.isArray(data)
          ? data
          : data?.items || data?.data || [];

        setStats({
          count: list.length,
          total: list.reduce((sum, d) => {
            const amount =
              d?.donationAmount?.$numberDecimal ?? d?.donationAmount ?? 0;

            return sum + (Number(amount) || 0);
          }, 0),
        });
      } catch (e) {
        setError(apiErrorMessage(e, "Unable to load your statistics."));
      } finally {
        setLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = () => navigate("/em/dashboard");

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const displayName = user?.name || user?.username || "Event Manager";

  const initials = displayName
    .split(" ")
    .map((name) => name.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const formattedTotal = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(stats?.total ?? 0);

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 col-xl-7">
          {/* Header */}
          <div
            className="d-flex align-items-center justify-content-between mb-4"
            data-aos="fade-down"
          >
            <div>
              <h2 className="fw-bold mb-1">My Profile</h2>

              <p className="text-muted mb-0">
                Manage your account and view your collection statistics.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3"
              onClick={handleBack}
            >
              <i className="bi bi-arrow-left me-1"></i>
              Back
            </button>
          </div>

          {/* Profile Card */}
          <div
            className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4"
            data-aos="fade-up"
          >
            {/* Cover */}
            <div
              className="position-relative"
              style={{
                height: "120px",
                background: "linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)",
              }}
            >
              <div
                className="position-absolute top-0 end-0 opacity-25"
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  background: "#fff",
                  transform: "translate(40px, -70px)",
                }}
              />
            </div>

            <div className="card-body px-4 pb-4">
              {/* Avatar */}
              <div
                className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center fw-bold text-primary"
                style={{
                  width: "90px",
                  height: "90px",
                  fontSize: "28px",
                  marginTop: "-45px",
                  position: "relative",
                }}
              >
                {initials}
              </div>

              {/* User information */}
              <div className="mt-3">
                <h3 className="fw-bold mb-1">{displayName}</h3>

                <div className="text-muted d-flex align-items-center gap-2">
                  <i className="bi bi-person-circle"></i>

                  <span>@{user?.username || "username"}</span>

                  <span className="badge bg-success-subtle text-success rounded-pill">
                    Active
                  </span>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-4" />

              {/* Account information */}
              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div className="bg-light rounded-3 p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-person me-1"></i>
                      Full Name
                    </small>

                    <span className="fw-semibold">{displayName}</span>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="bg-light rounded-3 p-3 h-100">
                    <small className="text-muted d-block mb-1">
                      <i className="bi bi-at me-1"></i>
                      Username
                    </small>

                    <span className="fw-semibold">{user?.username || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-4" data-aos="fade-up" data-aos-delay="100">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h5 className="fw-bold mb-1">My Statistics</h5>

                <small className="text-muted">
                  Your donation collection overview
                </small>
              </div>

              <i className="bi bi-bar-chart-line fs-4 text-primary"></i>
            </div>

            {error ? (
              <div className="alert alert-warning border-0 rounded-4 shadow-sm">
                <i className="bi bi-exclamation-circle me-2"></i>
                {error}
              </div>
            ) : loading ? (
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body py-5 text-center">
                  <div
                    className="spinner-border text-primary mb-3"
                    role="status"
                  />

                  <div className="text-muted">Loading your statistics...</div>
                </div>
              </div>
            ) : (
              <div className="row g-3">
                {/* Registrations */}
                <div className="col-12 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted fw-semibold">
                            REGISTRATIONS
                          </small>

                          <div className="display-6 fw-bold text-success mt-2">
                            {stats?.count ?? 0}
                          </div>

                          <small className="text-muted">
                            Total donations collected
                          </small>
                        </div>

                        <div
                          className="rounded-3 bg-success-subtle text-success d-flex align-items-center justify-content-center"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <i className="bi bi-people-fill fs-5"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collection */}
                <div className="col-12 col-sm-6">
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <small className="text-muted fw-semibold">
                            TOTAL COLLECTION
                          </small>

                          <div className="display-6 fw-bold text-primary mt-2">
                            ₹{formattedTotal}
                          </div>

                          <small className="text-muted">
                            Total amount collected
                          </small>
                        </div>

                        <div
                          className="rounded-3 bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                          style={{
                            width: "48px",
                            height: "48px",
                          }}
                        >
                          <i className="bi bi-currency-rupee fs-5"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Links & Actions */}
          <div
            className="card border-0 shadow-sm rounded-4"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Account & Legal</h6>

              <div className="list-group list-group-flush mb-4">
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0 py-3 d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 bg-light p-2 me-3">
                      <i className="bi bi-shield-check text-primary"></i>
                    </div>

                    <span className="fw-medium">Privacy Policy</span>
                  </div>

                  <i className="bi bi-chevron-right text-muted"></i>
                </a>

                <a
                  href="/terms-of-use"
                  target="_blank"
                  rel="noreferrer"
                  className="list-group-item list-group-item-action border-0 px-0 py-3 d-flex align-items-center justify-content-between"
                >
                  <div className="d-flex align-items-center">
                    <div className="rounded-3 bg-light p-2 me-3">
                      <i className="bi bi-file-earmark-text text-primary"></i>
                    </div>

                    <span className="fw-medium">Terms of Use</span>
                  </div>

                  <i className="bi bi-chevron-right text-muted"></i>
                </a>
              </div>

              <hr />

              <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between pt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-pill px-4"
                  onClick={handleBack}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Dashboard
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger rounded-pill px-4"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-muted small mt-4">
            <i className="bi bi-shield-check me-1"></i>
            Your account information is securely managed.
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventManagerProfile;
