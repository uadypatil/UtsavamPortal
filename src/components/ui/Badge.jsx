import React from 'react';

/**
 * <Badge tone="success">Paid</Badge>
 * tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'indigo'
 */
function Badge({ tone = 'neutral', icon, children }) {
    return (
        <span className={`ep-badge ep-badge--${tone}`}>
            {icon && <i className={`bi ${icon}`}></i>}
            {children}
        </span>
    );
}

export default Badge;
