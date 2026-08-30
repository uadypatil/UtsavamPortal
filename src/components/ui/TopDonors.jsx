import React from "react";

function TopDonorItem({ rank, donor, amount }) {
  return (
    <div className="ep-activity-item">
      {/* Rank */}
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          background: "#f1f5f9",
          fontWeight: 700,
          fontSize: "0.85rem",
          color: "#475569",
        }}
      >
        #{rank}
      </div>

      {/* Donor Icon */}
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: "38px",
          height: "38px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1, #4338ca)",
          color: "#fff",
          marginLeft: "10px",
        }}
      >
        <i className="bi bi-person-fill"></i>
      </div>

      {/* Donor Details */}
      <div className="flex-grow-1 ms-2">
        <div className="fw-semibold" style={{ fontSize: "0.9rem" }}>
          {donor?.name || "Unknown Donor"}
        </div>

        <div className="text-muted" style={{ fontSize: "0.78rem" }}>
          {donor?.contactNumber || "No contact number"}
        </div>
      </div>

      {/* Donation Amount */}
      <div
        className="fw-bold flex-shrink-0"
        style={{
          fontSize: "0.85rem",
          color: "#16a34a",
        }}
      >
        ₹{Number(amount || 0).toLocaleString("en-IN")}
      </div>
    </div>
  );
}

function TopDonors({ donors = [] }) {
  const topDonors = [...donors]
    .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
    .slice(0, 5);

  return (
    <div>
      {topDonors.length > 0 ? (
        topDonors.map((item, index) => (
          <TopDonorItem
            key={item._id || item.donor?._id || index}
            rank={index + 1}
            donor={item.donor || item}
            amount={item.amount || item.donationAmount}
          />
        ))
      ) : (
        <div
          className="text-center text-muted py-4"
          style={{ fontSize: "0.85rem" }}
        >
          <i className="bi bi-people fs-4 d-block mb-2"></i>
          No donors available
        </div>
      )}
    </div>
  );
}

export default TopDonors;
