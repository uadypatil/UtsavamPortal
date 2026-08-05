import React from 'react';

/**
 * <ActivityItem icon="bi-receipt" tone="indigo" title="New receipt #142" subtitle="Anishq Shubhashish · ₹500" time="2m ago" />
 */
function ActivityItem({ icon, tone = 'indigo', title, subtitle, time }) {
    const tints = {
        indigo: 'linear-gradient(135deg, #6366f1, #4338ca)',
        teal: 'linear-gradient(135deg, #14b8a6, #0f766e)',
        amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
        rose: 'linear-gradient(135deg, #fb7185, #e11d48)',
    };

    return (
        <div className="ep-activity-item">
            <div className="ep-activity-dot" style={{ background: tints[tone] || tints.indigo }}>
                <i className={`bi ${icon}`}></i>
            </div>
            <div className="flex-grow-1">
                <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{title}</div>
                <div className="text-muted" style={{ fontSize: '0.8rem' }}>{subtitle}</div>
            </div>
            {time && <div className="text-muted flex-shrink-0" style={{ fontSize: '0.75rem' }}>{time}</div>}
        </div>
    );
}

export default ActivityItem;
