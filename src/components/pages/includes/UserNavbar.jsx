import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../../assets/logo.png';

const NAV_ITEMS = [
    { to: '/em/dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
    { to: '/em/revenue/report', label: 'Revenue Report', icon: 'bi-graph-up-arrow' },
    { to: '/em/profile/me', label: 'My Profile', icon: 'bi-person-circle' },
];

function UserNavbar() {
    const location = useLocation();

    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-dark ep-glass-navbar m-2 rounded-5 px-3">
                <div className="container-fluid">
                    {/* Brand / Logo */}
                    <Link className="navbar-brand d-lg-none" to="/em/dashboard">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ width: '100px', height: 'auto' }} />
                    </Link>

                    {/* Toggler for small screens */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarResponsive"
                        aria-controls="navbarResponsive"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse justify-content-between" id="navbarResponsive">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            {NAV_ITEMS.map((item) => (
                                <li className="nav-item" key={item.to}>
                                    <Link
                                        className={`nav-link text-white ${location.pathname === item.to ? 'active' : ''}`}
                                        to={item.to}
                                    >
                                        <i className={`bi ${item.icon} me-2`}></i>{item.label}
                                    </Link>
                                </li>
                            ))}
                            <li className="nav-item">
                                <Link className="nav-link text-white" to="/logout">
                                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                                </Link>
                            </li>
                        </ul>

                        {/* Logo (visible on large screens) */}
                        <div className="d-none d-lg-block bg-white rounded-3 px-2 py-1">
                            <img src={logo} alt="Logo" className="img-fluid" style={{ width: '110px', height: 'auto' }} />
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default UserNavbar;
