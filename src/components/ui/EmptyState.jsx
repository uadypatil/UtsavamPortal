import React from 'react';

/**
 * <EmptyState icon="bi-receipt" title="No receipts yet"
 *   subtitle="Receipts you create will show up here."
 *   actionLabel="New Donation" onAction={() => navigate('/em/donation/new')} />
 */
function EmptyState({ icon = 'bi-inbox', title = 'Nothing here yet', subtitle, actionLabel, onAction }) {
    return (
        <div className="ep-empty-state">
            <div className="ep-empty-state-icon">
                <i className={`bi ${icon}`}></i>
            </div>
            <div className="ep-empty-state-title">{title}</div>
            {subtitle && <div className="ep-empty-state-subtitle">{subtitle}</div>}
            {actionLabel && onAction && (
                <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

export default EmptyState;
