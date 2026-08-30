import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logo from '../../../assets/UtsavamLogoMain.png';
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
    { to: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: 'events/all', label: 'Events', icon: 'bi-calendar-event' },
    { to: 'donationcollector', label: 'Donation Collectors', icon: 'bi-people-fill' },
    { to: 'donors', label: 'Donors', icon: 'bi-person-hearts' },
    { to: 'donations', label: 'Donations & Reports', icon: 'bi-cash-coin' },
    { to: 'expense-categories', label: 'Expense Categories', icon: 'bi-receipt-cutoff' },
    { to: 'expenses', label: 'Expenses', icon: 'bi-receipt-cutoff' },
    // { to: 'receipt-template', label: 'Receipt Template', icon: 'bi-file-earmark-ruled' },
    // { to: 'profile', label: 'Profile', icon: 'bi-person' },
];

function AdminSidebar() {
    const location = useLocation();
    const isActive = (to) => location.pathname.includes(to);

    return (
        <>
            {/* Toggle Button - Only visible on small screens */}
            <button
                className="btn btn-sm btn-primary d-lg-none m-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSidebar"
                aria-controls="offcanvasSidebar"
                style={{ height: '35px', width: '60px' }}
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Sidebar for large screens */}
            <div className="text-white m-2 rounded rounded-5 admin-sidebar ep-glass-sidebar d-none d-lg-block" style={{ position: 'fixed' }}>
                <div className="mb-2 d-flex justify-content-center text-center w-100 pt-4" style={{ flexDirection: 'column' }}>
                    <div className="mx-auto rounded-4" style={{ background: 'rgba(255,255,255,0.9)', width: 'fit-content' }}>
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: 160 }} />
                    </div>
                </div>

                <ul className="nav flex-column p-3 gap-1">
                    {NAV_ITEMS.map((item) => (
                        <li className="nav-item" key={item.to}>
                            <Link className={`ep-nav-link ${isActive(item.to) ? 'active' : ''}`} to={item.to}>
                                <i className={`bi ${item.icon}`}></i> {item.label}
                            </Link>
                        </li>
                    ))}
                    <li className="nav-item mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Link className="ep-nav-link" to="policies">
                            <i className="bi bi-shield"></i> Privacy Policies
                        </Link>
                    </li>
                    <li className="nav-item" >
                        <Link className="ep-nav-link" to="/logout">
                            <i className="bi bi-box-arrow-right"></i> Logout
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Offcanvas Sidebar for small screens */}
            <div
                className="offcanvas offcanvas-start d-lg-none ep-glass-sidebar"
                tabIndex="-1"
                id="offcanvasSidebar"
                aria-labelledby="offcanvasSidebarLabel"
            >
                <div className="offcanvas-header" style={{ height: '50px' }}>
                    <h5 className="offcanvas-title text-white" id="offcanvasSidebarLabel">Menu</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-4 d-flex justify-content-center text-center w-100" style={{ flexDirection: 'column' }}>
                        <div className="mx-auto p-2 rounded-4" style={{ background: 'rgba(255,255,255,0.9)', width: 'fit-content' }}>
                            <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: 140 }} />
                        </div>
                    </div>

                    <ul className="nav flex-column gap-1">
                        {NAV_ITEMS.map((item) => (
                            <li className="nav-item" key={item.to}>
                                <Link className={`ep-nav-link ${isActive(item.to) ? 'active' : ''}`} to={item.to}>
                                    <i className={`bi ${item.icon}`}></i> {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="nav-item mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Link className="ep-nav-link" to="/policies">
                                <i className="bi bi-shild"></i> Privacy Policies
                            </Link>
                        </li>
                        <li className="nav-item mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <Link className="ep-nav-link" to="/logout">
                                <i className="bi bi-box-arrow-right"></i> Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default AdminSidebar;
