import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import AdminSidebar from '../includes/AdminSidebar';

function Reports() {
    const [events, setEvents] = useState([]);
    const printRef = useRef(); // ✅ Step 1: Ref for the table

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const fetchDashboardData = () => {
            setEvents([
                { id: 1, name: 'Bhandara', organizer: 'Smart Vidya Kala Mandir', revenue: 3949, location: 'College Road, Nashik' },
                { id: 2, name: 'Ganesh Mahotsav', organizer: 'Sanskriti Samiti', revenue: 5400, location: 'Canada Corner, Nashik' },
                { id: 3, name: 'Charity Event', organizer: 'Helping Hands Org', revenue: 2500, location: 'Indira Nagar, Nashik' },
            ]);
        };

        fetchDashboardData();
    }, []);

    const handlePrint = () => {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Report</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
        printWindow.document.write(`
        <style>
            @media print {
                .d-print-none {
                    display: none !important;
                }
                ::-webkit-scrollbar {
                    display: none;
                }
                    
            }
        </style>
    `);
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3">
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-semibold">Dashboard</h4>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-12 mb-2">
                    <div className="d-flex justify-content-end w-100">
                        <button className='btn btn-secondary' onClick={handlePrint}>
                            Print
                        </button>
                    </div>
                </div>

                {/* ✅ Wrap this in ref */}
                <div className="col-12 border-1 shadow rounded-4" ref={printRef}>
                    <div className="table-responsive w-100 rounded-4" style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                        <table className="table rounded-4 w-100">
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Event Name</th>
                                    <th>Event Organizer</th>
                                    <th>Event Revenue</th>
                                    <th>Event Location</th>
                                    <th className='d-print-none'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length > 0 ? (
                                    events.map((event, index) => (
                                        <tr key={event.id + index}>
                                            <td>{index + 1}</td>
                                            <td>{event.name}</td>
                                            <td>{event.organizer}</td>
                                            <td>{event.revenue}/-</td>
                                            <td>{event.location}</td>
                                            <td className='d-print-none'>
                                                <button className="btn btn-light btn-sm">manage</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No events available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}


// ✅ Reusable Card Component
function DashboardCard({ title, value }) {
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 p-4">
            <div className="card border shadow rounded-4 h-100">
                <div className="card-body text-center">
                    <h4>{title}</h4>
                    <h1 className="display-5 fw-semibold">{value}</h1>
                </div>
            </div>
        </div>
    );
}

export default Reports;
