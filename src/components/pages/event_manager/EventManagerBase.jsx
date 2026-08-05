import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import UserNavbar from '../includes/UserNavbar';

function EventManagerBase() {
    return (
        <>
            <UserNavbar />
            <div className="ep-mesh-bg" style={{ minHeight: '100vh' }}>
                <div className="container py-3" data-aos="fade-up">
                    <Outlet /> {/* This will render nested route components */}
                </div>
            </div>
        </>
    );
}

export default EventManagerBase;
