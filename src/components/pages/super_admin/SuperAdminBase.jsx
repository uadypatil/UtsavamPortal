import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import SuperAdminSidebar from '../includes/SuperAdminSidebar';

function SuperAdminBase() {
    return (
        <div className="wrapper d-flex ep-mesh-bg">
            <SuperAdminSidebar />
            <div className="main-wrapper flex-grow-1" data-aos="fade-up">
                <Outlet />
            </div>
        </div>
    );
}

export default SuperAdminBase;
