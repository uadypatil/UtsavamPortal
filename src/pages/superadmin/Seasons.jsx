import React from 'react';
import EntityListPage from '../../components/superadmin/EntityListPage';
import { seasonsApi } from '../../services/endpoints/seasons';

const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

export default function Seasons() {
    return (
        <EntityListPage
            title="Seasons"
            icon="bi-calendar3-range"
            description="Festival seasons (e.g. Ganeshotsav 2026) that Events roll up under. ⚠️ Endpoint shape inferred from the platform's REST convention — verify against the live Swagger UI's Seasons section before relying on this in production (see services/endpoints/seasons.js)."
            api={seasonsApi}
            idField="id"
            searchKeys={['name']}
            statusField="status"
            statusValues={STATUS_VALUES}
            columns={[
                { key: 'name', label: 'Season Name' },
                { key: 'startDate', label: 'Start Date' },
                { key: 'endDate', label: 'End Date' },
            ]}
            formFields={[
                { name: 'name', label: 'Season Name', required: true, placeholder: 'e.g. Ganeshotsav 2026', col: 'col-12' },
                { name: 'startDate', label: 'Start Date', type: 'date', required: true, col: 'col-md-6' },
                { name: 'endDate', label: 'End Date', type: 'date', required: true, col: 'col-md-6' },
            ]}
            emptyStateHint="No seasons have been created yet. Events and donations are typically grouped under a season."
        />
    );
}
