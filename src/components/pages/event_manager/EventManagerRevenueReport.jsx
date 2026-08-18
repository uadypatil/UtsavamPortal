import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import * as XLSX from 'xlsx';
import EmptyState from '../../ui/EmptyState';
import { donationsApi } from '../../../services/endpoints/donations';
import { apiErrorMessage } from '../../../services/httpClient';

function EventManagerRevenueReport() {
    const eventId = localStorage.getItem('eventId');

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [showFilters, setShowFilters] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [name, setName] = useState('');
    const tableRef = useRef(null);

    const load = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await donationsApi.list(eventId ? { eventId } : undefined);
            const list = Array.isArray(data) ? data : data?.items || data?.results || [];
            setDonations(list);
        } catch (error) {
            setLoadError(apiErrorMessage(error, 'Unable to load your donation records.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const toggleFilters = () => setShowFilters(prev => !prev);

    const filteredData = useMemo(() => {
        return donations.filter(item => {
            const itemDate = item.createdAt ? new Date(item.createdAt).toISOString().split('T')[0] : '';
            const fromMatch = fromDate ? itemDate >= fromDate : true;
            const toMatch = toDate ? itemDate <= toDate : true;
            const nameMatch = name ? (item.donorName || '').toLowerCase().includes(name.toLowerCase()) : true;
            return fromMatch && toMatch && nameMatch;
        });
    }, [donations, fromDate, toDate, name]);

    // Safer than overwriting document.body.innerHTML (the previous
    // implementation did that and force-reloaded the page afterwards) —
    // opens a separate print window instead, matching the pattern already
    // used elsewhere in the admin module.
    const handlePrint = () => {
        const printContents = tableRef.current.innerHTML;
        const printWindow = window.open('', '', 'height=700,width=900');
        printWindow.document.write('<html><head><title>Revenue Report</title>');
        printWindow.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">');
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const handleExportToExcel = () => {
        const table = tableRef.current.querySelector('table');
        const wb = XLSX.utils.table_to_book(table);
        XLSX.writeFile(wb, 'RevenueReport.xlsx');
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
                            <button className="btn btn-primary w-100" onClick={() => { /* filtering is already live via useMemo above */ }}>Apply</button>
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

                {loading ? (
                    <div className="text-center text-muted py-5"><span className="spinner-border spinner-border-sm me-2" />Loading donations...</div>
                ) : loadError ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center m-3">
                        <span><i className="bi bi-exclamation-triangle me-2" />{loadError}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={load}>Retry</button>
                    </div>
                ) : filteredData.length === 0 ? (
                    <EmptyState icon="bi-search" title="No records found" subtitle="Try adjusting your filters." />
                ) : (
                    <div className="ep-datatable-scroll" style={{ maxHeight: '60dvh' }} ref={tableRef}>
                        <table className="ep-table">
                            <thead>
                                <tr>
                                    <th>Receipt No</th>
                                    <th>Name</th>
                                    <th>Amount</th>
                                    <th>Date Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-muted">#{item.receiptNumber}</td>
                                        <td className="fw-medium">{item.donorName || '—'}</td>
                                        <td>₹{item.amount}</td>
                                        <td className="text-muted">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '—'}</td>
                                        <td>
                                            <Link to={`/doner/${item.receiptNumber}/receipt`} target="_blank" className="btn border-primary text-primary btn-sm">
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
