import React, { useEffect, useState } from 'react';
import EntityListPage from '../../components/superadmin/EntityListPage';
import { eventOrganizersApi } from '../../services/endpoints/eventOrganizers';
import { seasonsApi } from '../../services/endpoints/seasons';
import { eventsApi } from '../../services/endpoints/events';

const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

export default function EventOrganizers() {
    const [seasons, setSeasons] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        seasonsApi
            .list()
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.data || res?.items || res?.results || [];
                setSeasons(Array.isArray(list) ? list : []);
            })
            .catch(() => setSeasons([]));

        eventsApi
            .list()
            .then((res) => {
                const list = Array.isArray(res) ? res : res?.data || res?.items || res?.results || [];
                setEvents(Array.isArray(list) ? list : []);
            })
            .catch(() => setEvents([]));
    }, []);

    const seasonOptions = seasons.map((s) => ({
        value: s.id ?? s._id,
        label: s.seasonName ?? s.name ?? String(s.id ?? s._id),
    }));

    // All events shown for now — filter this list client-side by the
    // selected seasonId once EntityListPage supports field-change
    // callbacks; today its formFields options are static per render.
    const eventOptions = events.map((e) => ({
        value: e.id ?? e._id,
        label: e.eventName ?? String(e.id ?? e._id),
    }));

    return (
        <EntityListPage
            title="Event Organizers"
            icon="bi-shop"
            description="Mandals registered on the platform as Event Organizers."
            api={eventOrganizersApi}
            idField="id"
            searchKeys={['mandalName', 'name', 'contactPerson', 'email', 'phone']}
            statusField="status"
            statusValues={STATUS_VALUES}
            columns={[
                { key: 'fullName', label: 'Full Name' },
                { key: 'username', label: 'Username' },
                { key: 'contactNumber', label: 'Contact Number' },
                { key: 'email', label: 'Email' },
            ]}
            formFields={[
                { name: 'seasonId', label: 'Season', type: 'select', required: true, col: 'col-md-6', options: seasonOptions },
                { name: 'eventId', label: 'Event', type: 'select', required: true, col: 'col-md-6', options: eventOptions },

                { name: 'fullName', label: 'Full Name', required: true, col: 'col-md-6' },
                { name: 'username', label: 'Username', required: true, col: 'col-md-6' },

                { name: 'password', label: 'Password', type: 'password', required: true, col: 'col-md-6' },
                { name: 'contactNumber', label: 'Contact Number', required: true, col: 'col-md-6' },

                { name: 'email', label: 'Email', type: 'email', col: 'col-md-6' },
                { name: 'address', label: 'Address', type: 'textarea', col: 'col-12' },
            ]}
            emptyStateHint="No Event Organizers/Mandals have registered yet."
        />
    );
}
