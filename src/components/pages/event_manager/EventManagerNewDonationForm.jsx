import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../App.css";
import { useNavigate } from "react-router-dom";
import { donorsApi } from "../../../services/endpoints/donors";
import { donationsApi } from "../../../services/endpoints/donations";
import { apiErrorMessage } from "../../../services/httpClient";
import { useToast } from "../../../context/ToastContext";
import qrcodeImg from "../../../assets/qrcode.png";
import useAuth from "../../../hooks/useAuth";

const INITIAL_DONOR = {
  fullName: "",
  contactNumber: "",
  email: "",
  address: "",
};
const INITIAL_DONATION = { amount: "", paymentMode: "", transactionId: "" };

/**
 * Real donation workflow (previously this just console.log'd the form):
 *   1. Search for an existing donor by phone (GET /donors).
 *   2. If none found, create one (POST /donors) — but only after the
 *      collector explicitly confirms donor consent below.
 *   3. Create the donation (POST /donations) — the server generates the
 *      receipt number; this never invents one client-side.
 *   4. Hand the real receipt number to the QR screen via router state
 *      (not a URL query param, so it never sits in browser history/logs).
 *
 * DONOR CONSENT: donors don't log in, so the collector is the only person
 * who can confirm they were informed. This is deliberately a distinct,
 * explicit checkbox (not bundled into "Donate") and links to the real
 * Privacy Policy page rather than a dead link.
 */
function EventManagerNewDonationForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [donor, setDonor] = useState(INITIAL_DONOR);
  const [donation, setDonation] = useState(INITIAL_DONATION);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleDonorChange = (e) => {
    const { name, value } = e.target;
    setDonor((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setDonation((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!donor.fullName.trim()) next.fullName = "Required";
    if (!donor.address.trim()) next.address = "Required";
    if (!donation.amount || Number(donation.amount) <= 0)
      next.amount = "Enter a valid amount";
    if (!donation.paymentMode) next.paymentMode = "Required";
    if (donation.paymentMode === "UPI" && !donation.transactionId.trim())
      next.transactionId = "Required for UPI payments";
    if (!consentGiven)
      next.consent =
        "Donor consent must be confirmed before saving this donation.";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions (double-click / slow network)

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length) {
      if (validation.consent) toast.error(validation.consent);
      return;
    }

    setSubmitting(true);
    try {
      // Step 1: look for an existing donor by phone so repeat donors
      // aren't duplicated in the donor list.
      let donorId = null;

      if (donor.contactNumber?.trim()) {
        const contactNumber = donor.contactNumber.trim();

        const response = await donorsApi.list({ search: contactNumber });

        const list = Array.isArray(response)
          ? response
          : (response?.items ?? []);

        const matchingDonors = list.filter(
          (d) => d?.contactNumber?.trim() === contactNumber,
        );

        const latestDonor = matchingDonors.reduce((latest, current) => {
          if (!latest) return current;

          return new Date(current?.createdAt || 0) >
            new Date(latest?.createdAt || 0)
            ? current
            : latest;
        }, null);

        donorId = latestDonor?.id || latestDonor?._id || null;
      }

      // Step 2: create the donor if no match was found.
      if (!donorId) {
        const created = await donorsApi.create({
          donorName: donor.fullName.trim(),
          contactNumber: donor.contactNumber.trim(),
          email: donor.email.trim(),
          address: donor.address.trim(),

          seasonId: user.seasonId,
          eventId: user.eventId,
          collectionExecutiveId: user.id,
        });
        donorId = created.id;
      }

      console.log(donorId)

      // Step 3: create the donation. The receipt number is NEVER
      // generated here — it comes back from the server.
      const created = await donationsApi.create({
        donorId,
        donationAmount: Number(donation.amount),
        paymentMode: donation.paymentMode.toUpperCase(),
        transactionId: donation.transactionId.trim() || undefined,

        seasonId: user.seasonId,
        eventId: user.eventId,
        collectionExecutiveId: user.id,
      });

      toast.success(`Donation recorded — receipt #${created.receiptNumber}`);

      // Router state, not a query param: keeps the donor's name/amount
      // out of the URL (and therefore out of browser history/server logs).
      navigate("/em/loadqr", {
        state: {
          receiptNumber: created.receiptNumber,
          donorName: donor.fullName.trim(),
          amount: donation.amount,
        },
      });
    } catch (error) {
      toast.error(
        apiErrorMessage(
          error,
          "Unable to record this donation. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1">
      <div className="row d-flex justify-content-center w-100 mx-0">
        <div className="col-lg-6 col-md-6 col-sm-12">
          <h2 className="mb-3">New Donation</h2>

          <form
            onSubmit={handleSubmit}
            style={{ height: "75dvh", overflowY: "scroll" }}
          >
            {/* Donor Details */}
            <div className="card mb-4">
              <div className="card-body pb-2">
                <label className="form-label">
                  Full Name<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={donor.fullName}
                  onChange={handleDonorChange}
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                />
                {errors.fullName && (
                  <div className="invalid-feedback d-block">
                    {errors.fullName}
                  </div>
                )}

                <label className="form-label mt-3">
                  Contact Number{" "}
                  <span className="text-muted">
                    (optional, used to avoid duplicate donor records)
                  </span>
                </label>
                <input
                  type="text"
                  name="contactNumber"
                  value={donor.contactNumber}
                  onChange={handleDonorChange}
                  className="form-control"
                />

                <label className="form-label mt-3">
                  Email <span className="text-muted">(for receipt)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={donor.email}
                  onChange={handleDonorChange}
                  className="form-control"
                />

                <label className="form-label mt-3">
                  Address<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={donor.address}
                  onChange={handleDonorChange}
                  className={`form-control ${errors.address ? "is-invalid" : ""}`}
                />
                {errors.address && (
                  <div className="invalid-feedback d-block">
                    {errors.address}
                  </div>
                )}
              </div>
            </div>

            {/* Donation Details */}
            <div className="card mb-4">
              <div className="card-body pb-2">
                <h4>Fill Donation Details</h4>

                <label className="form-label">
                  Donation Amount<span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={donation.amount}
                  onChange={handleDonationChange}
                  className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                />
                {errors.amount && (
                  <div className="invalid-feedback d-block">
                    {errors.amount}
                  </div>
                )}

                <label className="form-label mt-3">
                  Mode of Payment <span className="text-danger">*</span>
                </label>
                <select
                  name="paymentMode"
                  value={donation.paymentMode}
                  onChange={handleDonationChange}
                  className={`form-select ${errors.paymentMode ? "is-invalid" : ""}`}
                >
                  <option value="" disabled>
                    Select payment mode
                  </option>
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                </select>
                {errors.paymentMode && (
                  <div className="invalid-feedback d-block">
                    {errors.paymentMode}
                  </div>
                )}

                {donation.paymentMode === "UPI" && (
                  <div className="mt-3">
                    <button
                      type="button"
                      className="btn btn-primary mb-2"
                      onClick={() => setShowQR((v) => !v)}
                    >
                      {showQR ? "Hide QR" : "Show Payment QR"}
                    </button>
                    {showQR && (
                      <img
                        src={qrcodeImg}
                        alt="Mandal UPI QR"
                        className="img-fluid"
                      />
                    )}

                    <label className="form-label mt-3">
                      Transaction ID<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="transactionId"
                      value={donation.transactionId}
                      onChange={handleDonationChange}
                      className={`form-control ${errors.transactionId ? "is-invalid" : ""}`}
                    />
                    {errors.transactionId && (
                      <div className="invalid-feedback d-block">
                        {errors.transactionId}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Donor Consent — required before this donation can be saved. */}
            <div
              className={`card mb-4 ${errors.consent ? "border-danger" : ""}`}
            >
              <div className="card-body pb-2">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="donorConsent"
                    checked={consentGiven}
                    onChange={(e) => {
                      setConsentGiven(e.target.checked);
                      setErrors((p) => ({ ...p, consent: "" }));
                    }}
                  />
                  <label
                    className="form-check-label small"
                    htmlFor="donorConsent"
                  >
                    I confirm the donor has been informed that their name,
                    contact number, email and address are being collected for
                    donation, receipt and accounting purposes, and that they
                    consent to this in accordance with the{" "}
                    <a href="/privacy-policy" target="_blank" rel="noreferrer">
                      Privacy Policy
                    </a>
                    .
                  </label>
                </div>
                {errors.consent && (
                  <div className="text-danger small mt-1">{errors.consent}</div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving Donation...
                  </>
                ) : (
                  "Donate"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EventManagerNewDonationForm;
