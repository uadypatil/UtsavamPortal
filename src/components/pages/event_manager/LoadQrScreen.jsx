import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import ShowQrCode from '../../utils/ShowQrCode';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Post-donation QR screen. Previously encoded the literal placeholder
 * string "asdfasdf". Now encodes a URL to the donor's real, public
 * receipt page (/doner/:receiptNumber/receipt — see AppRoutes.jsx and
 * DonarAnimatedReceipt.jsx), using the server-generated receipt number
 * received via router state from EventManagerNewDonationForm.jsx.
 *
 * SECURITY NOTE (QR misuse): the QR intentionally encodes only the public
 * receipt number, never an internal database id, auth token, or donor PII.
 * The receipt page it links to is read-only — viewing it cannot "claim" a
 * donation or grant any benefit, so a copied/screenshotted QR only lets
 * someone view (or falsely claim credit for) a donation, not alter or
 * redeem anything. That residual "screenshot and claim credit" risk is a
 * social one the frontend can't fully close without the backend adding a
 * verification/ownership mechanism — flagging here rather than pretending
 * this screen solves it.
 */
function LoadQrScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const { receiptNumber, donorName, amount } = location.state || {};

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleBack = () => navigate('/em/dashboard');

    const receiptUrl = receiptNumber
        ? `${window.location.origin}/doner/${encodeURIComponent(receiptNumber)}/receipt`
        : null;

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1 mt-3">
            <div className="row d-flex justify-content-center w-100 mx-0 h-100">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    {receiptNumber ? (
                        <>
                            <h3 className="mb-1 text-center">Scan this QR to get the receipt</h3>
                            <p className="text-center text-muted mb-3">
                                {donorName ? `${donorName} · ` : ''}{amount ? `₹${amount}` : ''} · Receipt #{receiptNumber}
                            </p>
                        </>
                    ) : (
                        <h3 className="mb-2 text-center">No donation selected</h3>
                    )}
                </div>
            </div>

            {receiptUrl ? (
                <>
                    <ShowQrCode value={receiptUrl} />
                    <p className="text-center text-muted small px-3">
                        This QR only opens a read-only receipt page — it does not grant access to any account
                        or benefit by itself.
                    </p>
                </>
            ) : (
                <div className="text-center text-muted py-4">
                    Start a new donation to generate a receipt QR code.
                </div>
            )}

            <div className="d-flex w-100 justify-content-center gap-2">
                <button className='btn btn-secondary' onClick={handleBack}>Back to Dashboard</button>
                <button className='btn btn-outline-success' onClick={() => navigate('/em/donation/new')}>New Donation</button>
            </div>
        </div>
    );
}

export default LoadQrScreen;
