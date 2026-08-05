import React from 'react';

/**
 * <StatCard title="Today's Revenue" value="₹36,483" icon="bi-currency-rupee" tone="teal"
 *   trend={{ direction: 'up', label: '+12% vs yesterday' }} />
 * tone: 'indigo' | 'teal' | 'amber' | 'rose'
 * trend.direction: 'up' | 'down'
 */
function StatCard({ title, value, icon, tone = 'indigo', trend }) {
    return (
        <div className={`ep-stat-card ep-stat-card--${tone}`}>
            {icon && (
                <div className="ep-stat-icon">
                    <i className={`bi ${icon}`}></i>
                </div>
            )}
            <div className="ep-stat-label">{title}</div>
            <div className="ep-stat-value">{value}</div>
            {trend && (
                <div className={`ep-stat-trend ep-stat-trend--${trend.direction}`}>
                    <i className={`bi ${trend.direction === 'up' ? 'bi-arrow-up-right' : 'bi-arrow-down-right'}`}></i>
                    {trend.label}
                </div>
            )}
        </div>
    );
}

export default StatCard;
