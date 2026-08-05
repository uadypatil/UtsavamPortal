import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import failedGif from '../../../assets/shield.gif';
import doneGif from '../../../assets/verified.gif';
import qrcodeImg from '../../../assets/qrcode.png';

function EventManagerNewDonationForm() {
    const [donor, setDonor] = useState({
        fullName: '',
        contactNumber: '',
        email: '',
        address: '',
        amount: '',
        paymentMode: '',
        transactionId: '',
    });

    const [showQR, setShowQR] = useState(false);
    const [paymentDone, setPaymentDone] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDonor({ ...donor, [name]: value });
    };

    const handleQR = () => {
        if (donor.paymentMode === 'upi') {
            setShowQR(true);
        } else {
            setShowQR(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Donation Data:", donor);
        // Add your API call here
    };

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1">
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12">
                    <h2 className="mb-3">New Donation</h2>

                    <form onSubmit={handleSubmit} style={{height: "75dvh", overflowY: "scroll"}}>
                        {/* Donor Details */}
                        <div className="card mb-4">
                            <div className="card-body pb-2">
                                <label className='form-label'>Full Name<span className='text-danger'>*</span></label>
                                <input type="text" name="fullName" value={donor.fullName} onChange={handleChange} className='form-control' required />

                                <label className='form-label mt-3'>Contact Number <span className='text-muted'>(optional)</span></label>
                                <input type="text" name="contactNumber" value={donor.contactNumber} onChange={handleChange} className='form-control' />

                                <label className='form-label mt-3'>Email <span className='text-muted'>(for receipt)</span></label>
                                <input type="email" name="email" value={donor.email} onChange={handleChange} className='form-control' />

                                <label className='form-label mt-3'>Address<span className='text-danger'>*</span></label>
                                <input type="text" name="address" value={donor.address} onChange={handleChange} className='form-control' required />
                            </div>
                        </div>

                        {/* Donation Details */}
                        <div className="card">
                            <div className="card-body pb-2">
                                <h4>Fill Donation Details</h4>

                                <label className='form-label'>Donation Amount<span className='text-danger'>*</span></label>
                                <input type="number" name="amount" value={donor.amount} onChange={handleChange} className='form-control' required />

                                <label className='form-label mt-3'>Mode of Payment <span className='text-danger'>*</span></label>
                                <select name="paymentMode" value={donor.paymentMode} onChange={handleChange} className='form-select' required>
                                    <option value="" disabled>Select payment mode</option>
                                    <option value="cash">Cash</option>
                                    <option value="upi">UPI</option>
                                </select>

                                {donor.paymentMode === 'upi' && (
                                    <div className='mt-3'>
                                        <button type="button" className='btn btn-primary mb-2' onClick={handleQR}>Show QR</button>
                                        {showQR && <img src={qrcodeImg} alt="QR Code" className='img-fluid' />}
                                    </div>
                                )}

                                <label className='form-label mt-3'>Payment Status <span className='text-danger'>*</span></label>
                                <div className="d-flex justify-content-start gap-3 align-items-center">
                                    <button type="button" className='btn btn-warning' onClick={() => setPaymentDone(true)}>Done</button>
                                    {paymentDone ? (
                                        <img src={doneGif} alt="Done" style={{ height: '50px' }} />
                                    ) : (
                                        <img src={failedGif} alt="Pending" style={{ height: '50px' }} />
                                    )}
                                </div>

                                {donor.paymentMode === 'upi' && (
                                    <>
                                        <label className='form-label mt-3'>Transaction ID<span className='text-danger'>*</span></label>
                                        <input type="text" name="transactionId" value={donor.transactionId} onChange={handleChange} className='form-control' required />
                                    </>
                                )}

                                <div className='mt-4'>
                                    <button type='submit' className='btn btn-success w-100'>Donate</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EventManagerNewDonationForm;
