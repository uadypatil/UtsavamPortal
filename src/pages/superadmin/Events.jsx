import React, { useEffect, useState } from 'react';
import EntityListPage from '../../components/superadmin/EntityListPage';
import { eventsApi } from '../../services/endpoints/events';
import { seasonsApi } from '../../services/endpoints/seasons';

// isActive on IEvent is a boolean, not a status string — the shared
// setStatus() (PATCH .../status {status}) assumes an enum like
// ACTIVE/INACTIVE, so it doesn't map cleanly here. No statusField is
// passed below; wire it up once the backend's activate/deactivate
// payload shape for Events is confirmed.
export default function Events() {
    const [seasons, setSeasons] = useState([]);

    useEffect(() => {
        seasonsApi
            .list()
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.data || res?.items || res?.results || [];
                setSeasons(Array.isArray(list) ? list : []);
            })
            .catch(() => setSeasons([]));
    }, []);

    const seasonOptions = seasons.map((s) => ({
        value: s.id ?? s._id,
        label: s.seasonName ?? s.name ?? String(s.id ?? s._id),
    }));

    const seasonNameById = Object.fromEntries(seasonOptions.map((o) => [String(o.value), o.label]));

    return (
        <EntityListPage
            title="Events"
            icon="bi-calendar-event"
            description="Events run under a Season. Create an Event here, then use its ID when creating the Event Organizer for it."
            api={eventsApi}
            idField="id"
            searchKeys={['eventName', 'organizingMandalName']}
            columns={[
                { key: 'eventName', label: 'Event Name' },
                { key: 'organizingMandalName', label: 'Organizing Mandal' },
                {
                    key: 'seasonId',
                    label: 'Season',
                    render: (row) => seasonNameById[String(row.seasonId)] || row.seasonId || '—',
                },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
            ]}
            formFields={[
                {
                    name: 'seasonId', label: 'Season', type: 'select', required: true, col: 'col-md-6',
                    options: seasonOptions,
                },
                { name: 'eventName', label: 'Event Name', required: true, col: 'col-md-6' },
                { name: 'organizingMandalName', label: 'Organizing Mandal Name', col: 'col-md-6' },
                { name: 'referenceBy', label: 'Reference By (User ID)', col: 'col-md-6' },
                { name: 'startDate', label: 'Start Date', type: 'date', required: true, col: 'col-md-6' },
                { name: 'endDate', label: 'End Date', type: 'date', required: true, col: 'col-md-6' },
                { name: 'donationUpiQrCode1', label: 'Donation UPI QR Code 1 (URL)', col: 'col-md-6' },
                { name: 'donationUpiQrCode2', label: 'Donation UPI QR Code 2 (URL)', col: 'col-md-6' },
                { name: 'description', label: 'Description', type: 'textarea', col: 'col-12' },
            ]}
            emptyStateHint="No events yet. Create one, then attach Event Organizers to it."
        />
    );
}
