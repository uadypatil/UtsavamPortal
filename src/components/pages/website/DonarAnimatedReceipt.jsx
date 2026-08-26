import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { useAuth } from "../../../hooks/useAuth"; // ⚠️ adjust to your actual hook path

/* ============================================================
   Sri-Yantra style motif — layered triangles + concentric rings.
   Mirrored on the right via CSS transform: scaleX(-1).
   ============================================================ */
function MandalaMotif({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="75" cy="75" r="72" stroke="#C9A227" strokeWidth="0.75" />
      <circle cx="75" cy="75" r="60" stroke="#C9A227" strokeWidth="0.75" />
      <circle cx="75" cy="75" r="48" stroke="#C9A227" strokeWidth="0.75" />
      <circle cx="75" cy="75" r="4" fill="#C9A227" />

      {/* upward triangles */}
      <polygon points="75,14 128,108 22,108" stroke="#C9A227" strokeWidth="0.9" fill="none" />
      <polygon points="75,32 114,100 36,100" stroke="#C9A227" strokeWidth="0.7" fill="none" />
      <polygon points="75,50 100,92 50,92" stroke="#C9A227" strokeWidth="0.6" fill="none" />

      {/* downward triangles */}
      <polygon points="75,136 22,42 128,42" stroke="#C9A227" strokeWidth="0.9" fill="none" />
      <polygon points="75,118 36,50 114,50" stroke="#C9A227" strokeWidth="0.7" fill="none" />
      <polygon points="75,100 50,58 100,58" stroke="#C9A227" strokeWidth="0.6" fill="none" />

      {/* corner squares */}
      {[
        [14, 14],
        [122, 14],
        [14, 122],
        [122, 122],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="14"
          height="14"
          stroke="#C9A227"
          strokeWidth="0.9"
          fill="none"
        />
      ))}
    </svg>
  );
}

/* ============================================================
   Ornate corner flourish — bracket line + petal medallion.
   Used on all four corners of the ivory body section.
   ============================================================ */
function CornerFlourish({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* corner bracket */}
      <path d="M2 30 L2 6 Q2 2 6 2 L30 2" stroke="#C9A227" strokeWidth="1.4" strokeLinecap="round" />
      {/* petal medallion */}
      <g transform="translate(10,10)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-5.5"
            rx="1.7"
            ry="4.2"
            fill="#C9A227"
            opacity="0.85"
            transform={`rotate(${angle})`}
          />
        ))}
        <circle r="2.4" fill="#C9A227" />
      </g>
      {/* small tick marks trailing the bracket */}
      <path d="M2 20 L7 20" stroke="#C9A227" strokeWidth="1" />
      <path d="M20 2 L20 7" stroke="#C9A227" strokeWidth="1" />
    </svg>
  );
}

/* ---------------------------------------------------------------
   Default template — mirrors the reference screenshots exactly.
   Used whenever the API returns nothing or fails.
   --------------------------------------------------------------- */
const DEFAULT_TEMPLATE = {
  headerImageUrl: null, // falls back to bundled ganesha asset
  greetingText: "DONATED BY",
  useCustomBackground: false,
  customBackgroundUrl: null,
  showDonorName: true,
  showMandalName: true,
  mandalTagLine: null, // falls back to receipt.event
  showDonationAmount: true,
  showDonationDateTime: true,
  showReceiptNumber: true,
  showEventName: true,
  qrCodeUrl: null, // falls back to window.location.href
  showQrCode: true,
};

function DonerAnimatedReceipt() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: "ease-out-back" });
  }, []);

  const { donerid: receiptNumber } = useParams();
  const { user } = useAuth();

  const receiptRef = useRef(null);
  const qrBlockRef = useRef(null);

  const [busy, setBusy] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  // 1) Load the receipt itself.
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
          eventId: data.eventId || data.event?.id || null,
          eventOrganizerId: data.eventOrganizerId || data.organizerId || null,
        });
      })
      .catch((e) => setError(apiErrorMessage(e, "This receipt could not be found.")))
      .finally(() => setLoading(false));
  }, [receiptNumber]);

  // 2) Fetch the dynamic design template once we know the seasonId
  //    (from auth) and, optionally, the event/organizer context (from
  //    the loaded receipt). Any failure or empty response silently
  //    falls back to DEFAULT_TEMPLATE — the page never blocks on this.
  useEffect(() => {
    const seasonId = user?.seasonId;
    if (!seasonId) return; // no seasonId → nothing to fetch, keep default

    const params = new URLSearchParams({ seasonId });
    if (receipt?.eventOrganizerId) params.append("eventOrganizerId", receipt.eventOrganizerId);
    if (receipt?.eventId) params.append("eventId", receipt.eventId);

    let cancelled = false;
    fetch(`/api/v1/receipt-templates?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data && typeof data === "object") {
          setTemplate({ ...DEFAULT_TEMPLATE, ...data });
        }
        // empty/null response → keep DEFAULT_TEMPLATE
      })
      .catch(() => {
        // network/parse failure → keep DEFAULT_TEMPLATE
      });

    return () => {
      cancelled = true;
    };
  }, [user?.seasonId, receipt?.eventOrganizerId, receipt?.eventId]);

  const show = useCallback(
    (key) => template[key] !== false,
    [template]
  );

  const headerImageSrc = template.headerImageUrl || ganesha;
  const headerBgStyle =
    template.useCustomBackground && template.customBackgroundUrl
      ? {
          backgroundImage: `url(${template.customBackgroundUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }
      : undefined;

  const donatedLabel = template.greetingText || "DONATED BY";
  const subtitle = template.mandalTagLine || (show("showEventName") ? receipt?.event : "");

  // Waits one animation frame so the browser has applied the "hidden"
  // class before html2canvas reads the DOM.
  const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

  const captureCanvas = async () => {
    const element = receiptRef.current;
    const hiddenEls = element.querySelectorAll(".hide-on-download");
    hiddenEls.forEach((el) => el.classList.add("download-hidden"));
    if (qrBlockRef.current) qrBlockRef.current.classList.add("download-hidden");
    try {
      await nextFrame();
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
      return canvas;
    } finally {
      hiddenEls.forEach((el) => el.classList.remove("download-hidden"));
      if (qrBlockRef.current) qrBlockRef.current.classList.remove("download-hidden");
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
        const file = new File([blob], "donation-receipt.png", { type: "image/png" });

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
            <div className="ep-receipt-card" ref={receiptRef} data-aos-easing="ease-out-back">
              <CornerFlourish className="ep-r-corner tl" />
              <CornerFlourish className="ep-r-corner tr" />
              <CornerFlourish className="ep-r-corner bl" />
              <CornerFlourish className="ep-r-corner br" />

              <div className="ep-receipt-card-inner">
                <div className="ep-r-header" style={headerBgStyle}>
                  <MandalaMotif className="ep-r-header-mandala left" />
                  <MandalaMotif className="ep-r-header-mandala right" />
                  <img src={headerImageSrc} alt="" className="ep-r-mascot" />
                  <div className="ep-r-header-text">
                    <p className="ep-r-eyebrow">DONATION RECEIPT</p>
                    {show("showMandalName") && <h1 className="ep-r-org">{receipt.org}</h1>}
                    {subtitle && <p className="ep-r-subtitle">{subtitle}</p>}
                  </div>
                </div>

                {show("showDonorName") && (
                  <div className="ep-r-donated">
                    <p className="ep-r-donated-label">{donatedLabel}</p>
                    <h2 className="ep-r-donor-name">{receipt.donorName}</h2>
                  </div>
                )}

                {show("showDonationAmount") && (
                  <div className="ep-r-amount">
                    <div className="ep-r-amount-box">
                      <span className="ep-r-amount-value">
                        ₹{Number(receipt.amount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}

                {show("showEventName") && receipt.event && (
                  <p className="ep-r-meta-event">{receipt.event}</p>
                )}

                {show("showQrCode") && (
                  <div className="ep-r-qr" ref={qrBlockRef}>
                    <div className="ep-r-qr-box">
                      <QRCode
                        value={
                          template.qrCodeUrl ||
                          (typeof window !== "undefined" ? window.location.href : receipt.receiptNo)
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
                    <p className="ep-r-qr-caption">Scan to view or re-download this receipt</p>
                  </div>
                )}

                <div className="ep-r-divider" />

                <div className="ep-r-meta">
                  {show("showDonationDateTime") ? <span>{receipt.dateTime}</span> : <span />}
                  {show("showReceiptNumber") ? (
                    <strong>{receipt.receiptNo}</strong>
                  ) : (
                    <strong />
                  )}
                </div>

                <div className="ep-r-footer">
                  <div className="ep-r-footer-brand">
                    <img src={logo} alt="" className="ep-r-footer-logo" />
                    <span className="ep-r-footer-text">
                      Generated with <b>Utsavam</b> · utsavam.in
                    </span>
                  </div>
                  <span className="ep-r-demo-badge">Demo receipt — not a real transaction</span>
                </div>
              </div>
            </div>

            <div className="ep-receipt-actions hide-on-download">
              <button className="btn btn-light" onClick={handleDownload} disabled={busy}>
                <i className="bi bi-download me-1"></i> Download
              </button>
              <button className="btn btn-festive" onClick={handleShare} disabled={busy}>
                <i className="bi bi-share-fill me-1"></i> Share to Story
              </button>
            </div>

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
