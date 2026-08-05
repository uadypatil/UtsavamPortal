import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Must be included globally (not imported twice)
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import ShowQrCode from '../../utils/ShowQrCode';
import { useNavigate } from 'react-router-dom';

function ViewDonatedProfile() {

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
                    <div className="d-flex justify-content-between">
                        <h2 className="mb-2">Doner Profile</h2>

                        <div>
                            <button className='btn btn-secondary btn-sm' onClick={handleBack}>back</button>

                        </div>
                    </div>

                </div>
            </div>

            {/* Today's Registrations */}
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <div className="card">
                        <div className="card-body pb-0">
                            <h4 className='text-center'>Prathamesh B. Prabodhani</h4>
                            <div className="d-flex justify-content-center mx-0">
                                <div>
                                    <p className='text-center m-0'><small>Donated</small></p>
                                    <p className="display-1 fw-semibold text-center text-success m-0">1001/-</p>
                                </div>
                            </div>
                            <div className="d-flex justify-content-center mx-0">
                                <div>
                                    <p className='text-center m-0'><small>To</small></p>
                                    <p className="fs-1 fw-semibold text-center text-dark">
                                        Chandicha Ganpati Mitra Mandal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recently Added Table */}
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6">
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <ShowQrCode />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewDonatedProfile;
