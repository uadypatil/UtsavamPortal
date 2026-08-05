import React from 'react';

export function SkeletonText({ width = '100%', className = '' }) {
    return <div className={`ep-skeleton ep-skeleton-text ${className}`} style={{ width }} />;
}

export function SkeletonTitle({ width = '45%', className = '' }) {
    return <div className={`ep-skeleton ep-skeleton-title ${className}`} style={{ width }} />;
}

export function SkeletonAvatar({ size = 40, className = '' }) {
    return (
        <div
            className={`ep-skeleton ep-skeleton-avatar ${className}`}
            style={{ width: size, height: size }}
        />
    );
}

export function SkeletonCard({ className = '' }) {
    return <div className={`ep-skeleton ep-skeleton-card ${className}`} />;
}

/** A row of skeleton stat cards, sized like the dashboard KPI cards. */
export function SkeletonStatRow({ count = 3 }) {
    return (
        <div className="row">
            {Array.from({ length: count }).map((_, i) => (
                <div className="col-lg-4 col-md-6 col-sm-12 p-4" key={i}>
                    <SkeletonCard />
                </div>
            ))}
        </div>
    );
}

/** A skeleton table body — pass the real column count so widths line up. */
export function SkeletonTable({ rows = 5, columns = 3 }) {
    return (
        <table className="table">
            <tbody>
                {Array.from({ length: rows }).map((_, r) => (
                    <tr key={r}>
                        {Array.from({ length: columns }).map((__, c) => (
                            <td key={c}>
                                <div className="ep-skeleton ep-skeleton-row" style={{ width: c === 0 ? '40%' : '75%' }} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SkeletonCard;
