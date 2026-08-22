import React, { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../App.css";
import "./style/Doneranimatedreceipt.css";
import { QRCode } from "react-qrcode-logo";
import ganesha from "../../../assets/animatedganesha.png";
import logo from "../../../assets/utsavamLogoCircle.png";
import html2canvas from "html2canvas";
import { donationsApi } from "../../../services/endpoints/donations";
import { apiErrorMessage } from "../../../services/httpClient";

// Small decorative sri-yantra-style motif used twice in the header
// (mirrored on the right via CSS transform: scaleX(-1)).
function MandalaMotif({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="75" cy="75" r="70" stroke="#C9A227" strokeWidth="1" />
      <circle cx="75" cy="75" r="52" stroke="#C9A227" strokeWidth="1" />
      <circle cx="75" cy="75" r="34" stroke="#C9A227" strokeWidth="1" />
      <polygon
        points="75,20 122,100 28,100"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
      <polygon
        points="75,130 28,50 122,50"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="18"
        y="18"
        width="18"
        height="18"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="114"
        y="18"
        width="18"
        height="18"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="18"
        y="114"
        width="18"
        height="18"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
      <rect
        x="114"
        y="114"
        width="18"
        height="18"
        stroke="#C9A227"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

// Small gold corner-bracket flourish used on all four corners of the
// ivory body section.
function CornerFlourish({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 16 L2 6 Q2 2 6 2 L16 2"
        stroke="#C9A227"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="9" cy="9" r="3" stroke="#C9A227" strokeWidth="1.4" />
      <path d="M2 22 L10 22" stroke="#C9A227" strokeWidth="1.2" />
      <path d="M22 2 L22 10" stroke="#C9A227" strokeWidth="1.2" />
    </svg>
  );
}

function DonerAnimatedReceipt() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-back",
    });
  }, []);

  // The route param is named :donerid (see AppRoutes.jsx) but the value
  // it actually carries is the server-generated receipt number produced
  // by POST /donations — this page is public (no donor login), so the
  // receipt number is the only identifier it's safe to expose in a URL.
  const { donerid: receiptNumber } = useParams();
  const receiptRef = useRef(null);
  const qrBlockRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!receiptNumber) {
      setError("No receipt number provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    donationsApi
      .getByReceiptNumber(receiptNumber)
      .then((data) => {
        setReceipt({
          donorName: data.donor?.donorName || data.donorName || "—",
          org: data.organizingMandalName || "the Mandal",
          amount: data.donationAmount ?? 0,
          dateTime: data.donation?.createdAt
            ? new Date(data.donation.createdAt).toLocaleString("en-IN")
            : "—",
          receiptNo: data.receiptNumber || receiptNumber,
          event: data.eventName || data.event?.name || "",
        });
      })
      .catch((e) =>
        setError(apiErrorMessage(e, "This receipt could not be found.")),
      )
      .finally(() => setLoading(false));
  }, [receiptNumber]);

  // Waits one animation frame so the browser has actually applied the
  // "hidden" class (display:none) to the DOM before html2canvas reads it.
  const nextFrame = () =>
    new Promise((resolve) => requestAnimationFrame(() => resolve()));

  // Captures the receipt as a canvas, guaranteeing the QR code is never
  // part of the capture: the QR block is display:none'd (removing its
  // <canvas> from the render tree entirely, which is what avoids the
  // html2canvas "tainted/unsupported nested canvas" failure) and the
  // action buttons are hidden too. Both are always restored, even if
  // html2canvas throws.
  const captureCanvas = async () => {
    const element = receiptRef.current;
    const hiddenEls = element.querySelectorAll(".hide-on-download");
    hiddenEls.forEach((el) => el.classList.add("download-hidden"));
    if (qrBlockRef.current) {
      qrBlockRef.current.classList.add("download-hidden");
    }
    try {
      await nextFrame();
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: null,
      });
      return canvas;
    } finally {
      hiddenEls.forEach((el) => el.classList.remove("download-hidden"));
      if (qrBlockRef.current) {
        qrBlockRef.current.classList.remove("download-hidden");
      }
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "donation-receipt.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setBusy(false);
    }
  };

  // Native share sheet (WhatsApp/Instagram/etc.) on supporting mobile
  // browsers, so donors can post this straight to their story/status.
  // Falls back to a plain download if the browser doesn't support sharing
  // image files.
  const handleShare = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const canvas = await captureCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setBusy(false);
          return;
        }
        const file = new File([blob], "donation-receipt.png", {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: "My Donation Receipt",
              text: `I just contributed to ${receipt.org}! 🙏`,
            });
          } catch (err) {
            console.error(err);
          }
        } else {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "donation-receipt.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        setBusy(false);
      }, "image/png");
    } catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  return (
    <div className="ep-receipt-page">
      <div className="d-flex flex-column align-items-center w-100">
        {loading ? (
          <div className="text-center text-muted py-5">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading receipt...
          </div>
        ) : error || !receipt ? (
          <div className="text-center text-muted py-5 px-3">
            <i className="bi bi-receipt display-6 d-block mb-2"></i>
            {error || "This receipt could not be found."}
          </div>
        ) : (
          <>
            <div
              className="ep-receipt-card"
              ref={receiptRef}
              // data-aos="zoom-in"
              data-aos-easing="ease-out-back"
            >
              <CornerFlourish className="ep-r-corner tl" />
              <CornerFlourish className="ep-r-corner tr" />
              <CornerFlourish className="ep-r-corner bl" />
              <CornerFlourish className="ep-r-corner br" />

              <div className="ep-receipt-card-inner">
                <div className="ep-r-header">
                  <MandalaMotif className="ep-r-header-mandala left" />
                  <MandalaMotif className="ep-r-header-mandala right" />
                  <img src={ganesha} alt="" className="ep-r-mascot" />
                  <div className="ep-r-header-text">
                    <p className="ep-r-eyebrow">DONATION RECEIPT</p>
                    <h1 className="ep-r-org">{receipt.org}</h1>
                    {receipt.event && (
                      <p className="ep-r-subtitle">{receipt.event}</p>
                    )}
                  </div>
                </div>

                <div className="ep-r-donated">
                  <p className="ep-r-donated-label">DONATED BY</p>
                  <h2 className="ep-r-donor-name">{receipt.donorName}</h2>
                </div>

                <div className="ep-r-amount">
                  <div className="ep-r-amount-box">
                    <span className="ep-r-amount-value">
                      ₹{Number(receipt.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {receipt.event && (
                  <p className="ep-r-meta-event">{receipt.event}</p>
                )}

                <div className="ep-r-qr" ref={qrBlockRef}>
                  <div className="ep-r-qr-box">
                    <QRCode
                      value={
                        typeof window !== "undefined"
                          ? window.location.href
                          : receipt.receiptNo
                      }
                      size={92}
                      quietZone={4}
                      fgColor="#2A1245"
                      bgColor="#ffffff"
                      eyeRadius={4}
                      logoImage={logo}
                      logoWidth={22}
                      logoHeight={22}
                      logoPadding={2}
                      logoPaddingStyle="circle"
                      removeQrCodeBehindLogo
                    />
                  </div>
                  <p className="ep-r-qr-caption">
                    Scan to view or re-download this receipt
                  </p>
                </div>

                <div className="ep-r-divider" />

                <div className="ep-r-meta">
                  <span>{receipt.dateTime}</span>
                  <strong>{receipt.receiptNo}</strong>
                </div>

                <div className="ep-r-footer">
                  <div className="ep-r-footer-brand">
                    <img src={logo} alt="" className="ep-r-footer-logo" />
                    <span className="ep-r-footer-text">
                      Generated with <b>Utsavam</b> · utsavamlive.in
                    </span>
                  </div>
                  <span className="ep-r-demo-badge">
                    Demo receipt — not a real transaction
                  </span>
                </div>
              </div>
            </div>

            <div className="ep-receipt-actions hide-on-download">
              <button
                className="btn btn-light"
                onClick={handleDownload}
                disabled={busy}
              >
                <i className="bi bi-download me-1"></i> Download
              </button>
              <button
                className="btn btn-festive"
                onClick={handleShare}
                disabled={busy}
              >
                <i className="bi bi-share-fill me-1"></i> Share to Story
              </button>
            </div>

            {/* Fraud/QR-misuse note: this page is read-only proof of a
                    donation already made — viewing or sharing it cannot be
                    used to register a new donation or claim any benefit. */}
            <p className="text-center text-muted small mt-2 px-3 hide-on-download">
              This receipt is a read-only record of a completed donation.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default DonerAnimatedReceipt;
