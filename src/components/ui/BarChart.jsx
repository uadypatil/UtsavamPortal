import React from 'react';

/**
 * <BarChart data={[{ label: 'Mon', value: 4200 }, ...]} />
 * Pure CSS bars (no chart library) — height is scaled relative to the max value.
 */
function BarChart({ data = [], formatValue = (v) => v }) {
    const max = Math.max(...data.map((d) => d.value), 1);

    return (
        <div className="ep-bar-chart">
            {data.map((d, i) => (
                <div className="ep-bar-col" key={i} title={`${d.label}: ${formatValue(d.value)}`}>
                    <div
                        className="ep-bar"
                        style={{ height: `${Math.max((d.value / max) * 100, 3)}%` }}
                    />
                    <div className="ep-bar-label">{d.label}</div>
                </div>
            ))}
        </div>
    );
}

export default BarChart;
