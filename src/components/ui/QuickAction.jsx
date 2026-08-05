import React from 'react';
import { Link } from 'react-router-dom';

/**
 * <QuickAction to="/em/donation/new" icon="bi-plus-circle" label="New Donation" tone="indigo" />
 */
function QuickAction({ to, icon, label, tone = 'indigo' }) {
    const tints = {
        indigo: 'linear-gradient(135deg, #6366f1, #4338ca)',
        teal: 'linear-gradient(135deg, #14b8a6, #0f766e)',
        amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
        rose: 'linear-gradient(135deg, #fb7185, #e11d48)',
    };

    return (
        <Link to={to} className="ep-quick-action">
            <div className="ep-quick-action-icon" style={{ background: tints[tone] || tints.indigo }}>
                <i className={`bi ${icon}`}></i>
            </div>
            <span className="fw-semibold">{label}</span>
        </Link>
    );
}

export default QuickAction;
