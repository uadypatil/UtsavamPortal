import React, { useEffect, } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Must be included globally (not imported twice)
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import ShowQrCode from '../../utils/ShowQrCode';
import { useNavigate } from 'react-router-dom';

function LoadQrScreen() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration in ms
            once: true,     // whether animation should happen only once
        });
    }, []);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1); // Go back one step in history
    };



    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1 mt-3">
            {/* Top Header */}
            <div className="row d-flex justify-content-center w-100 mx-0 h-100">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <h3 className="mb-2 text-center">
                        Scan this qr to get receipt
                    </h3>
                </div>
            </div>

            <ShowQrCode value={"asdfasdf"} />


            <div className="d-flex w-100 justify-content-center">
                <button className='btn btn-secondary' onClick={handleBack}>back</button>
            </div>
        </div>
    );
}

export default LoadQrScreen;
