import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import UserNavbar from '../includes/UserNavbar';

function UserBase() {
    return (
        <>
            <UserNavbar />
            <div className="" data-aos="fade-up">
                <Outlet /> {/* This will render nested route components */}
            </div>
        </>
    );
}

export default UserBase;
