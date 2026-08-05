import React, {  } from 'react';

const DurationSelector = ({ value, fromTime, toTime, onChange }) => {
    const handleDurationChange = (e) => {
        onChange({
            duration: e.target.value,
            fromTime,
            toTime
        });
    };

    const handleFromTimeChange = (e) => {
        onChange({
            duration: value,
            fromTime: e.target.value,
            toTime
        });
    };

    const handleToTimeChange = (e) => {
        onChange({
            duration: value,
            fromTime,
            toTime: e.target.value
        });
    };

    return (
        <div>
            <select
                className="form-select text-success mt-3"
                value={value}
                onChange={handleDurationChange}
            >
                <option value="" disabled>Select Duration</option>
                <option value="Full Day">Full Day</option>
                <option value="Custom">Custom Time</option>
            </select>

            {value === 'Custom' && (
                <div className="mt-3">
                    <input
                        type="time"
                        name="from_time"
                        className="form-control mb-2"
                        placeholder="From time"
                        value={fromTime}
                        onChange={handleFromTimeChange}
                    />
                    <input
                        type="time"
                        name="to_time"
                        className="form-control"
                        placeholder="To time"
                        value={toTime}
                        onChange={handleToTimeChange}
                    />
                </div>
            )}
        </div>
    );
};

export default DurationSelector;
