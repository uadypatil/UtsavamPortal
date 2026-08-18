import React from 'react';
import EntityListPage from '../../components/superadmin/EntityListPage';
import { usersApi } from '../../services/endpoints/users';

// Statuses left generic (ACTIVE/INACTIVE) — the exact enum the backend
// uses isn't in the doc extract; confirm against the live API and adjust
// STATUS_VALUES below only (EntityListPage itself needs no changes).
const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

export default function Users() {
    return (
        <EntityListPage
            title="Users"
            icon="bi-person-badge"
            description="Super Admin and Affiliate accounts for the platform."
            api={usersApi}
            idField="id"
            searchKeys={['name', 'username', 'email', 'role']}
            statusField="status"
            statusValues={STATUS_VALUES}
            columns={[
                { key: 'name', label: 'Name' },
                { key: 'username', label: 'Username' },
                { key: 'email', label: 'Email' },
                {
                    key: 'role',
                    label: 'Role',
                    render: (row) => (
                        <span className="ep-avatar ep-avatar--indigo" style={{ width: 'auto', padding: '4px 10px', borderRadius: 20 }}>
                            {row.role === 'super_admin' ? 'Super Admin' : row.role === 'affiliate' ? 'Affiliate' : row.role || '—'}
                        </span>
                    ),
                },
            ]}
            formFields={[
                { name: 'name', label: 'Full Name', required: true, col: 'col-md-6' },
                { name: 'username', label: 'Username', required: true, col: 'col-md-6', disabledOnEdit: true },
                { name: 'email', label: 'Email', type: 'email', required: true, col: 'col-md-6' },
                {
                    name: 'role', label: 'Role', type: 'select', required: true, col: 'col-md-6',
                    options: [
                        { value: 'super_admin', label: 'Super Admin' },
                        { value: 'affiliate', label: 'Affiliate' },
                    ],
                },
                { name: 'password', label: 'Password', type: 'password', placeholder: 'Leave blank to keep current password when editing', col: 'col-12' },
            ]}
            emptyStateHint="No Super Admin or Affiliate accounts have been created yet."
        />
    );
}
