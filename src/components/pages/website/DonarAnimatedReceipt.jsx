import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { QRCode } from 'react-qrcode-logo';
import ganesha from '../../../assets/animatedganesha.png';
import logo from '../../../assets/logo.png';
import html2canvas from "html2canvas";
// import { decryptData } from '../../utils/Encryption'; // adjust path as needed

function DonerAnimatedReceipt() {
    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const receiptRef = useRef(null);
    const [busy, setBusy] = useState(false);

    // Static placeholder data for now — once the backend endpoint for a single
    // donation-by-id is available, fetch by :donerid (via useParams) here.
    const receipt = {
        donorName: 'SONAL NIKAM',
        org: 'CHANDICHA GANPATI GANESH MITRA MANDAL',
        amount: 500,
        dateTime: '18/08/2025, 10:30 AM',
        receiptNo: '123456789',
        event: 'Ganesh Chaturthi',
    };

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
                            <span className="amount">₹{receipt.amount.toLocaleString('en-IN')}</span>
                            <span className="label">Donated</span>
                        </div>

                        <ul className="ep-receipt-meta">
                            <li><i className="bi bi-clock"></i> {receipt.dateTime}</li>
                            <li><i className="bi bi-receipt"></i> Receipt No: {receipt.receiptNo}</li>
                            <li><i className="bi bi-calendar-event"></i> {receipt.event}</li>
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
            </div>
        </div>
    );
}

export default DonerAnimatedReceipt;
