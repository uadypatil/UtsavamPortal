import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import logo from '../../../assets/UtsavamLogoMain.png';

import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
    {
        to: '/superadmin/dashboard',
        label: 'Dashboard',
        icon: 'bi-speedometer2',
    },
    {
        to: '/superadmin/seasons',
        label: 'Seasons',
        icon: 'bi-calendar3-range',
  },
  {
        to: '/superadmin/events',
        label: 'Events',
        icon: 'bi-calendar-event',
    },
    {
        to: '/superadmin/users',
        label: 'Users',
        icon: 'bi-person-badge',
    },
    {
        to: '/superadmin/event-organizers',
        label: 'Event Organizers',
        icon: 'bi-shop',
    },
    {
        to: '/superadmin/expense-categories',
        label: 'Expense Categories',
        icon: 'bi-tags',
    },
    {
        to: '/superadmin/expense-approvals',
        label: 'Expense Approvals',
        icon: 'bi-check2-square',
    },
    {
        to: '/superadmin/reports',
        label: 'Platform Reports',
        icon: 'bi-graph-up-arrow',
    },
];

function SuperAdminSidebar() {
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/superadmin/dashboard') {
            return location.pathname === path;
        }

        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                className="btn btn-sm btn-primary d-lg-none m-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasSidebarSuper"
                aria-controls="offcanvasSidebarSuper"
                style={{
                    height: '35px',
                    width: '60px',
                }}
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Desktop Sidebar */}
            <aside
                className="text-white m-2 rounded rounded-5 admin-sidebar ep-glass-sidebar d-none d-lg-block"
                style={{
                    position: 'fixed',
                }}
            >
                {/* Logo */}
                <div
                    className="mb-2 d-flex justify-content-center text-center w-100 pt-4"
                    style={{
                        flexDirection: 'column',
                    }}
                >
                    <div
                        className="mx-auto rounded-4"
                        style={{
                            background: 'rgba(255,255,255,0.9)',
                            width: 'fit-content',
                        }}
                    >
                        <img
                            src={logo}
                            alt="Utsavam"
                            className="img-fluid"
                            style={{
                                maxWidth: 160,
                            }}
                        />
                    </div>

                    <span className="text-white-50 small mt-2">
                        Super Admin
                    </span>
                </div>

                {/* Navigation */}
                <ul className="nav flex-column p-3 gap-1">
                    {NAV_ITEMS.map((item) => (
                        <li
                            className="nav-item"
                            key={item.to}
                        >
                            <Link
                                className={`ep-nav-link ${
                                    isActive(item.to)
                                        ? 'active'
                                        : ''
                                }`}
                                to={item.to}
                            >
                                <i className={`bi ${item.icon}`}></i>

                                <span className="ms-1">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    ))}

                    {/* Logout */}
                    <li
                        className="nav-item mt-3 pt-3"
                        style={{
                            borderTop:
                                '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Link
                            className="ep-nav-link"
                            to="/logout"
                        >
                            <i className="bi bi-box-arrow-right"></i>

                            <span className="ms-1">
                                Logout
                            </span>
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Mobile Sidebar */}
            <div
                className="offcanvas offcanvas-start d-lg-none ep-glass-sidebar"
                tabIndex="-1"
                id="offcanvasSidebarSuper"
                aria-labelledby="offcanvasSidebarSuperLabel"
            >
                <div
                    className="offcanvas-header"
                    style={{
                        height: '50px',
                    }}
                >
                    <h5
                        className="offcanvas-title text-white"
                        id="offcanvasSidebarSuperLabel"
                    >
                        Menu
                    </h5>

                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>

                <div className="offcanvas-body">
                    {/* Mobile Logo */}
                    <div
                        className="mb-4 d-flex justify-content-center text-center w-100"
                        style={{
                            flexDirection: 'column',
                        }}
                    >
                        <div
                            className="mx-auto p-2 rounded-4"
                            style={{
                                background:
                                    'rgba(255,255,255,0.9)',
                                width: 'fit-content',
                            }}
                        >
                            <img
                                src={logo}
                                alt="Utsavam"
                                className="img-fluid"
                                style={{
                                    maxWidth: 140,
                                }}
                            />
                        </div>

                        <span className="text-white-50 small mt-2">
                            Super Admin
                        </span>
                    </div>

                    {/* Mobile Navigation */}
                    <ul className="nav flex-column gap-1">
                        {NAV_ITEMS.map((item) => (
                            <li
                                className="nav-item"
                                key={item.to}
                            >
                                <Link
                                    className={`ep-nav-link ${
                                        isActive(item.to)
                                            ? 'active'
                                            : ''
                                    }`}
                                    to={item.to}
                                    data-bs-dismiss="offcanvas"
                                >
                                    <i
                                        className={`bi ${item.icon}`}
                                    ></i>

                                    <span className="ms-1">
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}

                        {/* Logout */}
                        <li
                            className="nav-item mt-3 pt-3"
                            style={{
                                borderTop:
                                    '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            <Link
                                className="ep-nav-link"
                                to="/logout"
                            >
                                <i className="bi bi-box-arrow-right"></i>

                                <span className="ms-1">
                                    Logout
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default SuperAdminSidebar;
