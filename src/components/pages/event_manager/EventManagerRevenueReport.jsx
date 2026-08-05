import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import * as XLSX from 'xlsx';
import EmptyState from '../../ui/EmptyState';

function EventManagerRevenueReport() {
    const [showFilters, setShowFilters] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [name, setName] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const tableRef = useRef(null);

    const dummyData = [
        { id: '101', name: 'Anishq Shubhashish', amount: '1001/-', datetime: '2025-08-10T10:11:00' },
        { id: '102', name: 'Riya Kulkarni', amount: '750/-', datetime: '2025-08-11T11:25:00' },
        { id: '103', name: 'Ramesh Jadhav', amount: '550/-', datetime: '2025-08-12T12:14:00' },
        { id: '104', name: 'Anishq Shubhashish', amount: '2000/-', datetime: '2025-08-13T09:30:00' }
    ];

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        setFilteredData(dummyData); // Load all by default
    }, []);

    const toggleFilters = () => setShowFilters(prev => !prev);

    const handlePrint = () => {
        const printContents = tableRef.current.innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // restore page after print
    };

    const handleExportToExcel = () => {
        const table = tableRef.current.querySelector('table');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, 'RevenueReport.xlsx');
    };

    const handleFilter = () => {
        const filtered = dummyData.filter(item => {
            const itemDate = new Date(item.datetime).toISOString().split('T')[0];
            const fromMatch = fromDate ? itemDate >= fromDate : true;
            const toMatch = toDate ? itemDate <= toDate : true;
            const nameMatch = name ? item.name.toLowerCase().includes(name.toLowerCase()) : true;
            return fromMatch && toMatch && nameMatch;
        });

        setFilteredData(filtered);
    };

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <div>
                    <h4 className="fw-bold mb-0">Revenue Report</h4>
                    <span className="text-muted small">{filteredData.length} receipt{filteredData.length !== 1 ? 's' : ''} found</span>
                </div>
                <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={toggleFilters}>
                    <i className={`bi ${showFilters ? 'bi-x-lg' : 'bi-funnel'} me-1`}></i>
                    {showFilters ? 'Close Filter' : 'Filter'}
                </button>
            </div>

            {/* Filter Section */}
            {showFilters && (
                <div className="ep-card p-3 mb-3" data-aos="fade-down">
                    <div className="row g-3 align-items-end">
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label small fw-semibold">From Date</label>
                            <input type="date" className="form-control" value={fromDate} onChange={e => setFromDate(e.target.value)} />
                        </div>
                        <div className="col-md-3 col-sm-6">
                            <label className="form-label small fw-semibold">To Date</label>
                            <input type="date" className="form-control" value={toDate} onChange={e => setToDate(e.target.value)} />
                        </div>
                        <div className="col-md-4 col-sm-8">
                            <label className="form-label small fw-semibold">Name</label>
                            <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="Search by donor name" />
                        </div>
                        <div className="col-md-2 col-sm-4">
                            <button className="btn btn-primary w-100" onClick={handleFilter}>Apply</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Section */}
            <div className="ep-datatable-card" data-aos="fade-up">
                <div className="ep-datatable-toolbar">
                    <h6 className="fw-bold mb-0">Recently Added</h6>
                    <div className="dropdown">
                        <button className="btn btn-secondary btn-sm dropdown-toggle rounded-pill px-3" data-bs-toggle="dropdown">
                            <i className="bi bi-download me-1"></i> Export
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li><button className="btn btn-light w-100 mb-2" onClick={handlePrint}><i className="bi bi-printer me-2"></i>Print</button></li>
                            <li><button className="btn btn-light w-100" onClick={handleExportToExcel}><i className="bi bi-file-earmark-excel me-2"></i>Excel</button></li>
                        </ul>
                    </div>
                </div>

                {filteredData.length === 0 ? (
                    <EmptyState icon="bi-search" title="No records found" subtitle="Try adjusting your filters." />
                ) : (
                    <div className="ep-datatable-scroll" style={{ maxHeight: '60dvh' }} ref={tableRef}>
                        <table className="ep-table">
                            <thead>
                                <tr>
                                    <th>Reg. No</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Date Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="text-muted">#{item.id}</td>
                                        <td className="fw-medium">{item.name}</td>
                                        <td>₹{item.amount}</td>
                                        <td className="text-muted">{new Date(item.datetime).toLocaleString()}</td>
                                        <td>
                                            <Link to="/em/doner/profile" className="btn border-primary text-primary btn-sm">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventManagerRevenueReport;
