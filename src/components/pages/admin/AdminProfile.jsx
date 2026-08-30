import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import StatCard from "../../ui/StatCard";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const TEMP_PROFILES = [
  {
    fullName: "Uday Patil",
    username: "udaypatil",
    email: "uday@example.com",
    contactNumber: "9876543210",
    alternateContactNumber: "9123456780",
    age: 22,
    gender: "Male",
    permanentAddress: "Jalgaon, Maharashtra",
    currentAddress: "Nashik, Maharashtra",
    eventLimit: 10,
    collectionExecutiveLimit: 25,
    isActive: true,
  },
  {
    fullName: "Rahul Sharma",
    username: "rahulsharma",
    email: "rahul@example.com",
    contactNumber: "9876501234",
    alternateContactNumber: "9123405678",
    age: 28,
    gender: "Male",
    permanentAddress: "Pune, Maharashtra",
    currentAddress: "Mumbai, Maharashtra",
    eventLimit: 15,
    collectionExecutiveLimit: 30,
    isActive: true,
  },
  {
    fullName: "Priya Patil",
    username: "priyapatil",
    email: "priya@example.com",
    contactNumber: "9988776655",
    alternateContactNumber: "9090909090",
    age: 25,
    gender: "Female",
    permanentAddress: "Nashik, Maharashtra",
    currentAddress: "Pune, Maharashtra",
    eventLimit: 8,
    collectionExecutiveLimit: 20,
    isActive: false,
  },
];

const TEMP_PAYMENTS = [
  {
    payeeUpiId: "uday@upi",
    payeeName: "Uday Patil",
    currency: "INR",
    merchantCategoryCode: "6012",
    transactionDetailsUrl: "https://example.com/payment/uday",
    isActive: true,
  },
  {
    payeeUpiId: "rahul@upi",
    payeeName: "Rahul Sharma",
    currency: "INR",
    merchantCategoryCode: "6012",
    transactionDetailsUrl: "https://example.com/payment/rahul",
    isActive: true,
  },
  {
    payeeUpiId: "priya@upi",
    payeeName: "Priya Patil",
    currency: "INR",
    merchantCategoryCode: "6012",
    transactionDetailsUrl: "https://example.com/payment/priya",
    isActive: false,
  },
];

function Field({ label, col, children }) {
  return (
    <div className={col}>
      <label className="form-label small fw-semibold text-muted mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function AdminProfile() {
  const [profile, setProfile] = useState(TEMP_PROFILES[0]);
  const [payment, setPayment] = useState(TEMP_PAYMENTS[0]);

  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    // Simulate loading temporary data
    const timer = setTimeout(() => {
      setProfile({ ...TEMP_PROFILES[0] });
      setPayment({ ...TEMP_PAYMENTS[0] });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleProfileChange = (field) => (e) => {
    setProfile((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handlePaymentChange = (field) => (e) => {
    setPayment((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const saveProfile = () => {
    setSavingProfile(true);

    setTimeout(() => {
      setEditingProfile(false);
      setSavingProfile(false);

      setAlert({
        type: "success",
        message: "Profile updated successfully.",
      });
    }, 500);
  };

  const savePayment = () => {
    setSavingPayment(true);

    setTimeout(() => {
      setEditingPayment(false);
      setSavingPayment(false);

      setAlert({
        type: "success",
        message: "Payment details updated successfully.",
      });
    }, 500);
  };

  const cancelProfileEdit = () => {
    setProfile({ ...TEMP_PROFILES[0] });
    setEditingProfile(false);
  };

  const cancelPaymentEdit = () => {
    setPayment({ ...TEMP_PAYMENTS[0] });
    setEditingPayment(false);
  };

  const initials = (profile.fullName || profile.username || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <h4 className="fw-bold mb-1 position-relative">🪔 My Profile</h4>

        <p className="mb-0 opacity-90 position-relative">
          Manage your account details and UPI payment settings.
        </p>
      </div>

      {alert && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {alert.message}

          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
        </div>
      )}

      {loading ? (
        <div className="row" data-aos="fade-up">
          {[1, 2, 3].map((i) => (
            <div className="col-12 col-md-6 col-lg-4 mb-4" key={i}>
              <div
                className="ep-chart-card placeholder-glow"
                style={{ height: 120 }}
              >
                <span className="placeholder col-6 d-block mb-2"></span>
                <span className="placeholder col-8 d-block"></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Profile Header */}
          <div className="row mb-2" data-aos="fade-up">
            <div className="col-12">
              <div className="ep-chart-card d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-4">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: 72,
                    height: 72,
                    background: "var(--ep-indigo, #4f46e5)",
                    color: "#fff",
                    fontSize: 24,
                    fontWeight: 700,
                  }}
                >
                  {initials || <i className="bi bi-person"></i>}
                </div>

                <div className="text-center text-sm-start flex-grow-1">
                  <h5 className="fw-bold mb-1">
                    {profile.fullName || profile.username}
                  </h5>

                  <div className="text-muted small mb-2">
                    @{profile.username}
                  </div>

                  <span
                    className={`ep-badge ${
                      profile.isActive ? "ep-badge--teal" : "ep-badge--amber"
                    }`}
                  >
                    <i
                      className={`bi ${
                        profile.isActive ? "bi-check-circle" : "bi-pause-circle"
                      }`}
                    ></i>{" "}
                    {profile.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="row" data-aos="fade-up">
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <StatCard
                title="Event Limit"
                value={profile.eventLimit}
                icon="bi-calendar-event"
                tone="indigo"
              />
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <StatCard
                title="Collection Executive Limit"
                value={profile.collectionExecutiveLimit}
                icon="bi-people-fill"
                tone="teal"
              />
            </div>

            <div className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <StatCard
                title="Account Status"
                value={profile.isActive ? "Active" : "Inactive"}
                icon="bi-shield-check"
                tone="amber"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div className="row">
            <div className="col-12 mb-4" data-aos="fade-up">
              <div className="ep-chart-card">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h6 className="fw-bold mb-0">Personal Details</h6>

                  {!editingProfile ? (
                    <button
                      className="btn btn-sm btn-outline-primary w-100 w-sm-auto"
                      onClick={() => setEditingProfile(true)}
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                  ) : (
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                      <button
                        className="btn btn-sm btn-secondary flex-fill"
                        onClick={cancelProfileEdit}
                        disabled={savingProfile}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-sm btn-primary flex-fill"
                        onClick={saveProfile}
                        disabled={savingProfile}
                      >
                        {savingProfile ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="row g-3">
                  <Field label="Full Name" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={profile.fullName}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("fullName")}
                    />
                  </Field>

                  <Field label="Username" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={profile.username}
                      disabled
                    />
                  </Field>

                  <Field label="Email" col="col-12 col-md-6">
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("email")}
                    />
                  </Field>

                  <Field label="Contact Number" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={profile.contactNumber}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("contactNumber")}
                    />
                  </Field>

                  <Field label="Alternate Contact Number" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={profile.alternateContactNumber || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("alternateContactNumber")}
                    />
                  </Field>

                  <Field label="Age" col="col-6 col-md-3">
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={profile.age || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("age")}
                    />
                  </Field>

                  <Field label="Gender" col="col-6 col-md-3">
                    <select
                      className="form-select"
                      value={profile.gender || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("gender")}
                    >
                      <option value="">Select</option>

                      {GENDER_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Permanent Address" col="col-12 col-md-6">
                    <textarea
                      className="form-control"
                      rows={2}
                      value={profile.permanentAddress || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("permanentAddress")}
                    />
                  </Field>

                  <Field label="Current Address" col="col-12 col-md-6">
                    <textarea
                      className="form-control"
                      rows={2}
                      value={profile.currentAddress || ""}
                      disabled={!editingProfile}
                      onChange={handleProfileChange("currentAddress")}
                    />
                  </Field>
                </div>
              </div>
            </div>
          </div>

          {/* UPI Payment Details */}
          <div className="row">
            <div className="col-12 mb-4" data-aos="fade-up">
              <div className="ep-chart-card">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <div>
                    <h6 className="fw-bold mb-0">UPI Payment Details</h6>

                    <span className="text-muted small">
                      Used to receive donation payments
                    </span>
                  </div>

                  {!editingPayment ? (
                    <button
                      className="btn btn-sm btn-outline-primary w-100 w-sm-auto"
                      onClick={() => setEditingPayment(true)}
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                  ) : (
                    <div className="d-flex gap-2 w-100 w-sm-auto">
                      <button
                        className="btn btn-sm btn-secondary flex-fill"
                        onClick={cancelPaymentEdit}
                        disabled={savingPayment}
                      >
                        Cancel
                      </button>

                      <button
                        className="btn btn-sm btn-primary flex-fill"
                        onClick={savePayment}
                        disabled={savingPayment}
                      >
                        {savingPayment ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="row g-3">
                  <Field label="Payee UPI ID" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={payment.payeeUpiId}
                      disabled={!editingPayment}
                      onChange={handlePaymentChange("payeeUpiId")}
                      placeholder="name@bank"
                    />
                  </Field>

                  <Field label="Payee Name" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={payment.payeeName}
                      disabled={!editingPayment}
                      onChange={handlePaymentChange("payeeName")}
                    />
                  </Field>

                  <Field label="Currency" col="col-6 col-md-3">
                    <input
                      className="form-control"
                      value={payment.currency}
                      disabled={!editingPayment}
                      onChange={handlePaymentChange("currency")}
                    />
                  </Field>

                  <Field label="Merchant Category Code" col="col-6 col-md-3">
                    <input
                      className="form-control"
                      value={payment.merchantCategoryCode || ""}
                      disabled={!editingPayment}
                      onChange={handlePaymentChange("merchantCategoryCode")}
                    />
                  </Field>

                  <Field label="Transaction Details URL" col="col-12 col-md-6">
                    <input
                      className="form-control"
                      value={payment.transactionDetailsUrl || ""}
                      disabled={!editingPayment}
                      onChange={handlePaymentChange("transactionDetailsUrl")}
                      placeholder="https://"
                    />
                  </Field>

                  <div className="col-12 col-md-6 d-flex align-items-end">
                    <span
                      className={`ep-badge ${
                        payment.isActive ? "ep-badge--teal" : "ep-badge--amber"
                      }`}
                    >
                      <i
                        className={`bi ${
                          payment.isActive
                            ? "bi-check-circle"
                            : "bi-pause-circle"
                        }`}
                      ></i>{" "}
                      {payment.isActive
                        ? "Payment method active"
                        : "Payment method inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminProfile;
