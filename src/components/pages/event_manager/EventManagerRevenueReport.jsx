import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../App.css";
import * as XLSX from "xlsx";
import EmptyState from "../../ui/EmptyState";
import { donationsApi } from "../../../services/endpoints/donations";
import { apiErrorMessage } from "../../../services/httpClient";
import useAuth from "../../../hooks/useAuth";

function EventManagerRevenueReport() {
  const eventId = localStorage.getItem("eventId");
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [name, setName] = useState("");
  const tableRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await donationsApi.filter({
        eventId: user.eventId,
        seasonId: user.seasonId,
        collectionExecutiveId: user.id,
      });
      const list = Array.isArray(data)
        ? data
        : data?.items || data?.results || [];
      setDonations(list);
    } catch (error) {
      setLoadError(
        apiErrorMessage(error, "Unable to load your donation records."),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFilters = () => setShowFilters((prev) => !prev);

  const filteredData = useMemo(() => {
    return donations.filter((item) => {
      const itemDate = item.donation.createdAt
        ? new Date(item.donation.createdAt).toISOString().split("T")[0]
        : "";
      const fromMatch = fromDate ? itemDate >= fromDate : true;
      const toMatch = toDate ? itemDate <= toDate : true;
      const nameMatch = name
        ? (item.donorName || "").toLowerCase().includes(name.toLowerCase())
        : true;
      return fromMatch && toMatch && nameMatch;
    });
  }, [donations, fromDate, toDate, name]);

  // Safer than overwriting document.body.innerHTML (the previous
  // implementation did that and force-reloaded the page afterwards) —
  // opens a separate print window instead, matching the pattern already
  // used elsewhere in the admin module.
  const handlePrint = () => {
    const table = tableRef.current?.querySelector("table");

    if (!table) return;

    const clonedTable = table.cloneNode(true);

    // Remove the last column from header
    clonedTable.querySelectorAll("tr").forEach((row) => {
      row.lastElementChild?.remove();
    });

    const printWindow = window.open("", "", "height=700,width=900");

    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Revenue Report</title>

          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
            rel="stylesheet"
          />

          <style>
            @page {
              size: A4 portrait;
              margin: 12mm;
            }

            @media print {
              .table {
                width: 100%;
                border-collapse: collapse !important;
              }

              .table-bordered {
                border: 1px solid #dee2e6 !important;
              }

              .table-bordered > :not(caption) > * > * {
                border-width: 1px !important;
                border-color: #dee2e6 !important;
              }

              .table th,
              .table td {
                vertical-align: middle;
              }

              thead {
                display: table-header-group;
              }

              tr {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>

        <body>
          <div class="container-fluid">
            ${clonedTable.outerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleExportToExcel = () => {
    const table = tableRef.current.querySelector("table");
    const wb = XLSX.utils.table_to_book(table);
    XLSX.writeFile(wb, "RevenueReport.xlsx");
  };

  return (
    <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <div>
          <h4 className="fw-bold mb-0">Revenue Report</h4>
          <span className="text-muted small">
            {filteredData.length} receipt{filteredData.length !== 1 ? "s" : ""}{" "}
            found
          </span>
        </div>
        <button
          className="btn btn-sm btn-primary rounded-pill px-3"
          onClick={toggleFilters}
        >
          <i className={`bi ${showFilters ? "bi-x-lg" : "bi-funnel"} me-1`}></i>
          {showFilters ? "Close Filter" : "Filter"}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="ep-card p-3 mb-3" data-aos="fade-down">
          <div className="row g-3 align-items-end">
            <div className="col-md-3 col-sm-6">
              <label className="form-label small fw-semibold">From Date</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="col-md-3 col-sm-6">
              <label className="form-label small fw-semibold">To Date</label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 col-sm-8">
              <label className="form-label small fw-semibold">Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Search by donor name"
              />
            </div>
            <div className="col-md-2 col-sm-4">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  /* filtering is already live via useMemo above */
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="ep-datatable-card" data-aos="fade-up">
        <div className="ep-datatable-toolbar">
          <h6 className="fw-bold mb-0">Recently Added</h6>
          <div className="dropdown">
            <button
              className="btn btn-secondary btn-sm dropdown-toggle rounded-pill px-3"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-download me-1"></i> Export
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="btn btn-light w-100 mb-2"
                  onClick={handlePrint}
                >
                  <i className="bi bi-printer me-2"></i>Print
                </button>
              </li>
              <li>
                <button
                  className="btn btn-light w-100"
                  onClick={handleExportToExcel}
                >
                  <i className="bi bi-file-earmark-excel me-2"></i>Excel
                </button>
              </li>
            </ul>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted py-5">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading donations...
          </div>
        ) : loadError ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center m-3">
            <span>
              <i className="bi bi-exclamation-triangle me-2" />
              {loadError}
            </span>
            <button className="btn btn-sm btn-outline-danger" onClick={load}>
              Retry
            </button>
          </div>
        ) : filteredData.length === 0 ? (
          <EmptyState
            icon="bi-search"
            title="No records found"
            subtitle="Try adjusting your filters."
          />
        ) : (
          <div
            className="ep-datatable-scroll"
            style={{ maxHeight: "60dvh" }}
            ref={tableRef}
          >
            <table className="ep-table table table-bordered table-striped table-hover">
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
                    <td className="text-muted">
                      {item.donation.receiptNumber}
                    </td>
                    <td className="fw-medium">{item.donorName || "—"}</td>
                    <td>₹{item.donationAmount}</td>
                    <td className="text-muted">
                      {item.donation.createdAt
                        ? new Date(item.donation.createdAt).toLocaleString()
                        : "—"}
                    </td>
                    <td>
                      <Link
                        to={`/doner/${item.donation.receiptNumber}/receipt`}
                        target="_blank"
                        className="btn border-primary text-primary btn-sm"
                      >
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
