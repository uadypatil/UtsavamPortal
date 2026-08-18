import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { QRCode } from 'react-qrcode-logo';
import ganesha from '../../../assets/animatedganesha.png';
import logo from '../../../assets/logo.png';
import html2canvas from "html2canvas";
import { donationsApi } from '../../../services/endpoints/donations';
import { apiErrorMessage } from '../../../services/httpClient';

function DonerAnimatedReceipt() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    // The route param is named :donerid (see AppRoutes.jsx) but the value
    // it actually carries is the server-generated receipt number produced
    // by POST /donations — this page is public (no donor login), so the
    // receipt number is the only identifier it's safe to expose in a URL.
    const { donerid: receiptNumber } = useParams();
    const receiptRef = useRef(null);
    const [busy, setBusy] = useState(false);
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!receiptNumber) {
            setError('No receipt number provided.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError('');
        donationsApi.getByReceiptNumber(receiptNumber)
            .then((data) => {
                setReceipt({
                    donorName: data.donorName || data.donor?.name || '—',
                    org: data.organizerName || data.mandalName || data.eventOrganizerName || 'the Mandal',
                    amount: data.amount ?? 0,
                    dateTime: data.createdAt ? new Date(data.createdAt).toLocaleString('en-IN') : '—',
                    receiptNo: data.receiptNumber || receiptNumber,
                    event: data.eventName || data.event?.name || '',
                });
            })
            .catch((e) => setError(apiErrorMessage(e, 'This receipt could not be found.')))
            .finally(() => setLoading(false));
    }, [receiptNumber]);

    const captureCanvas = async () => {
        const element = receiptRef.current;
        const hiddenEls = element.querySelectorAll(".hide-on-download");
        hiddenEls.forEach(el => el.classList.add("download-hidden"));
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: null });
        hiddenEls.forEach(el => el.classList.remove("download-hidden"));
        return canvas;
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
                if (!blob) { setBusy(false); return; }
                const file = new File([blob], "donation-receipt.png", { type: "image/png" });

                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    try {
                        await navigator.share({
                            files: [file],
                            title: "My Donation Receipt",
                            text: `I just contributed to ${receipt.org}! 🙏`,
                        });
                    } catch (err) {
                        // user closed the share sheet — nothing to do
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
            setBusy(false);
        }
    };

    return (
        <div className="ep-receipt-page">
            <div className="d-flex flex-column align-items-center w-100">
                {loading ? (
                    <div className="text-center text-muted py-5">
                        <span className="spinner-border spinner-border-sm me-2" />Loading receipt...
                    </div>
                ) : error || !receipt ? (
                    <div className="text-center text-muted py-5 px-3">
                        <i className="bi bi-receipt display-6 d-block mb-2"></i>
                        {error || 'This receipt could not be found.'}
                    </div>
                ) : (
                <>
                <div className="ep-receipt-card" ref={receiptRef} data-aos="zoom-in">
                    <div className="ep-receipt-card-inner">
                        <div className="ep-receipt-brand">
                            <img src={logo} alt="" style={{ height: 16 }} />
                            ePavti Book
                        </div>

                        <div className="ep-receipt-mascot">
                            <img src={ganesha} alt="" className="img-fluid ep-float" />
                        </div>

                        <p className="ep-receipt-thankyou">Thank You</p>
                        <h1 className="ep-receipt-donor-name">{receipt.donorName}</h1>
                        <p className="ep-receipt-org">for your generous contribution to<br />{receipt.org}</p>

                        <div className="ep-receipt-amount-badge">
                            <span className="amount">₹{Number(receipt.amount).toLocaleString('en-IN')}</span>
                            <span className="label">Donated</span>
                        </div>

                        <ul className="ep-receipt-meta">
                            <li><i className="bi bi-clock"></i> {receipt.dateTime}</li>
                            <li><i className="bi bi-receipt"></i> Receipt No: {receipt.receiptNo}</li>
                            {receipt.event && <li><i className="bi bi-calendar-event"></i> {receipt.event}</li>}
                        </ul>

                        <div className="ep-receipt-qr-box">
                            <QRCode value={typeof window !== 'undefined' ? window.location.href : receipt.receiptNo} size={92} quietZone={0} />
                        </div>
                        <p className="ep-receipt-qr-caption">Scan to view this receipt</p>

                        <div className="ep-receipt-divider"></div>
                        <p className="ep-receipt-tagline">Your support keeps our tradition alive. 🪔</p>
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
