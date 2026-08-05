import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Must be included globally (not imported twice)
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import ShowQrCode from '../../utils/ShowQrCode';
import { useNavigate } from 'react-router-dom';

function EventManagerProfile() {

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back one step in history
    };


    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1">
            {/* Top Header */}
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <h2 className="mb-2">My Profile</h2>
                </div>
            </div>

            {/* Today's Registrations */}
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <div className="card">
                        <div className="card-body pb-0">
                            <p className='m-0 p-0 text-center'><small>Name</small></p>
                            <h4 className='text-center'>Samikant Shedke</h4>

                            <p className='m-0 p-0 text-center'><small>Contact Number</small></p>
                            <h5 className='text-center'>82342 23842</h5>

                            <p className='m-0 p-0 text-center'><small>Registrations</small></p>
                            <p className="display-1 fw-semibold text-center text-success">17</p>

                            <p className='m-0 p-0 text-center'><small>Collection</small></p>
                            <p className="display-1 fw-semibold text-center text-danger">1767</p>

                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Added Table */}
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6">
                    <hr />
                    <div className="card">
                        <div className="card-body pb-3">
                            <p className='m-0 p-0'>
                                <a href=''>Privacy Policy</a>
                            </p>
                            <p className='m-0 p-0'>
                                <a href=''>Terms To Use</a>
                            </p>
                        </div>

                        <div className="card-body pb-3">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <button className='btn btn-secondary btn-sm' onClick={handleBack}>back</button>
                                </div>

                                <div>
                                    <a className='btn btn-light border-danger text-danger btn-sm' onClick={handleBack}>Logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventManagerProfile;
