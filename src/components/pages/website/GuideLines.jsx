import { React, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Required for dropdowns & toggler
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import NavbarCustom from '../includes/NavbarCustom';
import EventCard from '../../utils/EventCard'
import GuideUtility from '../../utils/GuideUtility';
import ChatBot from '../../utils/ChatBot';


function GuideLines() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration in ms
            once: true,     // whether animation should happen only once
        });
    }, []);

    return (
        <>
            <NavbarCustom />

            <div className="website-events-main-wrapper">
                <div className="container">
                    <div className="row mt-3 mx-2">
                        <div className="col-12">
                            <h1 className="text-center">
                                Guidelines to use e-pavti book
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">

                    <div className="row">
                        <GuideUtility />

                        {/* <ChatBot /> */}
                    </div>
                </div>



            </div>


        </>
    );
}

export default GuideLines;