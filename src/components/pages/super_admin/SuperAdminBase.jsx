import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import '../../../App.css';
import SuperAdminSidebar from '../includes/SuperAdminSidebar';

const SuperAdminBase = () => {
    return (
        <div className="wrapper d-flex ep-mesh-bg">
            <SuperAdminSidebar />

            <main className="main-wrapper flex-grow-1">
                <Outlet />
            </main>
        </div>
    );
}

export default SuperAdminBase;
