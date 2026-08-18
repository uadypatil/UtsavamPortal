import React from 'react';
import EntityListPage from '../../components/superadmin/EntityListPage';
import { eventOrganizersApi } from '../../services/endpoints/eventOrganizers';

// Only statuses the backend is documented to support are used — the
// Swagger extract confirms activate/deactivate (PATCH .../status) but
// doesn't enumerate a "pending/rejected" onboarding workflow, so this
// intentionally does NOT invent those states. If the backend later adds
// an onboarding-approval status, extend STATUS_VALUES and the column
// below rather than the shared EntityListPage.
const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

export default function EventOrganizers() {
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
                { key: 'mandalName', label: 'Mandal', render: (r) => r.mandalName || r.name || '—' },
                { key: 'contactPerson', label: 'Contact Person' },
                { key: 'phone', label: 'Phone' },
                { key: 'email', label: 'Email' },
            ]}
            formFields={[
                { name: 'mandalName', label: 'Mandal Name', required: true, col: 'col-md-6' },
                { name: 'contactPerson', label: 'Contact Person', required: true, col: 'col-md-6' },
                { name: 'phone', label: 'Phone Number', required: true, col: 'col-md-6' },
                { name: 'email', label: 'Email', type: 'email', required: true, col: 'col-md-6' },
                { name: 'address', label: 'Address', type: 'textarea', col: 'col-12' },
            ]}
            emptyStateHint="No Event Organizers/Mandals have registered yet."
        />
    );
}
