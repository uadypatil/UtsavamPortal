import React, { useEffect, useMemo, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import useConfirm from '../../context/useConfirm';
import { apiErrorMessage } from '../../services/httpClient';

const PAGE_SIZE = 10;

/**
 * Generic, config-driven CRUD manager reused across every simple
 * Super-Admin entity screen (Users, Event Organizers, Seasons, Expense
 * Categories) so each one doesn't re-implement its own table, pagination,
 * modal and confirm-dialog wiring from scratch.
 *
 * Props:
 *  - title, icon, description: header copy
 *  - api: { list, create, update, remove?, setStatus? } from services/endpoints
 *  - idField: field name used as the row id (default "id")
 *  - columns: [{ key, label, render?(row) }]
 *  - formFields: [{ name, label, type, required, options?, placeholder? }]
 *  - searchKeys: string[] of row fields to match against the search box
 *  - statusField: field name holding the row's status, enables the
 *    activate/deactivate action (omit if the backend doesn't support it)
 *  - statusValues: { active: 'ACTIVE', inactive: 'INACTIVE' } — exact
 *    values the backend uses, so we never invent status strings
 *  - allowDelete: whether to render the delete action
 *  - emptyStateHint: shown when there are zero records
 */
export default function EntityListPage({
    title,
    icon = 'bi-table',
    description,
    api,
    idField = 'id',
    columns,
    formFields,
    searchKeys = [],
    statusField,
    statusValues,
    allowDelete = true,
    emptyStateHint = 'Records you create will show up here.',
}) {
    const toast = useToast();
    const confirm = useConfirm();

    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);

    const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
    const [form, setForm] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const load = async () => {
        setLoading(true);
        setLoadError('');
        try {
            const data = await api.list();
            const list = Array.isArray(data) ? data : data?.items || data?.results || [];
            setRows(list);
        } catch (error) {
            setLoadError(apiErrorMessage(error, `Unable to load ${title.toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
    useEffect(() => setPage(1), [search]);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return rows;
        return rows.filter((row) =>
            searchKeys.some((key) => String(row?.[key] ?? '').toLowerCase().includes(q))
        );
    }, [rows, search, searchKeys]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const openCreate = () => {
        const initial = {};
        formFields.forEach((f) => { initial[f.name] = f.defaultValue ?? ''; });
        setForm(initial);
        setFormErrors({});
        setModalMode('create');
    };

    const openEdit = (row) => {
        const initial = {};
        formFields.forEach((f) => { initial[f.name] = row?.[f.name] ?? ''; });
        setForm({ ...initial, [idField]: row[idField] });
        setFormErrors({});
        setModalMode('edit');
    };

    const closeModal = () => { setModalMode(null); setForm({}); setFormErrors({}); };

    const updateField = (name, value) => {
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        formFields.forEach((f) => {
            if (f.required && !String(form[f.name] ?? '').trim()) {
                errors[f.name] = `${f.label} is required.`;
            }
        });
        return errors;
    };

    const submit = async (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length) return;

        setSaving(true);
        try {
            const payload = { ...form };
            delete payload[idField];
            if (modalMode === 'create') {
                await api.create(payload);
                toast.success(`${title.replace(/s$/, '')} created successfully.`);
            } else {
                await api.update(form[idField], payload);
                toast.success(`${title.replace(/s$/, '')} updated successfully.`);
            }
            closeModal();
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to save changes.'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (row) => {
        const ok = await confirm({
            title: `Delete this ${title.replace(/s$/, '').toLowerCase()}?`,
            message: 'This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (!ok) return;
        setActionLoadingId(row[idField]);
        try {
            await api.remove(row[idField]);
            toast.success('Deleted successfully.');
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to delete this record.'));
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleToggleStatus = async (row) => {
        const isActive = row[statusField] === statusValues.active;
        const nextStatus = isActive ? statusValues.inactive : statusValues.active;
        const ok = await confirm({
            title: isActive ? 'Deactivate this record?' : 'Activate this record?',
            message: isActive
                ? 'It will no longer be able to access or appear in active flows.'
                : 'It will be re-enabled across the platform.',
            confirmText: isActive ? 'Deactivate' : 'Activate',
            variant: isActive ? 'warning' : 'success',
        });
        if (!ok) return;
        setActionLoadingId(row[idField]);
        try {
            await api.setStatus(row[idField], nextStatus);
            toast.success('Status updated.');
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to update status.'));
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
                    <div>
                        <h4 className="fw-bold mb-1 position-relative"><i className={`bi ${icon} me-2`}></i>{title}</h4>
                        {description && <p className="mb-0 opacity-90 position-relative">{description}</p>}
                    </div>
                    <button className="btn ep-action-btn ep-action-btn--indigo" onClick={openCreate}>
                        <i className="bi bi-plus-circle me-2" /> Add {title.replace(/s$/, '')}
                    </button>
                </div>
            </div>

            <div className="ep-chart-card">
                <div className="row g-3 align-items-end mb-4">
                    <div className="col-lg-8 col-md-6">
                        <label className="form-label fw-semibold">Search</label>
                        <div className="ep-search-box">
                            <i className="bi bi-search" />
                            <input
                                className="form-control"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button className="ep-search-clear" onClick={() => setSearch('')}>
                                    <i className="bi bi-x" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <button className="btn ep-refresh-btn w-100" onClick={load} disabled={loading}>
                            <i className={`bi ${loading ? 'bi-arrow-repeat ep-spin' : 'bi-arrow-clockwise'} me-2`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-5 text-center text-muted">
                        <span className="spinner-border spinner-border-sm me-2" /> Loading {title.toLowerCase()}...
                    </div>
                ) : loadError ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-exclamation-triangle me-2" />{loadError}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={load}>Retry</button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-inbox display-6 d-block mb-2" />
                        {rows.length === 0 ? emptyStateHint : 'No records match your search.'}
                    </div>
                ) : (
                    <>
                        <div className="table-responsive">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                        {columns.map((c) => <th key={c.key}>{c.label}</th>)}
                                        {statusField && <th>Status</th>}
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageRows.map((row) => {
                                        const isActive = statusField ? row[statusField] === statusValues.active : true;
                                        const rowBusy = actionLoadingId === row[idField];
                                        return (
                                            <tr key={row[idField]}>
                                                {columns.map((c) => (
                                                    <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>
                                                ))}
                                                {statusField && (
                                                    <td>
                                                        <span className={`ep-status ${isActive ? 'ep-status--active' : 'ep-status--disabled'}`}>
                                                            <span /> {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button className="btn ep-icon-btn ep-icon-btn--edit" title="Edit" onClick={() => openEdit(row)} disabled={rowBusy}>
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                        {statusField && (
                                                            <button
                                                                className={`btn ep-icon-btn ${isActive ? 'ep-icon-btn--disable' : 'ep-icon-btn--enable'}`}
                                                                title={isActive ? 'Deactivate' : 'Activate'}
                                                                onClick={() => handleToggleStatus(row)}
                                                                disabled={rowBusy}
                                                            >
                                                                <i className={`bi ${isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`} />
                                                            </button>
                                                        )}
                                                        {allowDelete && (
                                                            <button className="btn ep-icon-btn ep-icon-btn--delete" title="Delete" onClick={() => handleDelete(row)} disabled={rowBusy}>
                                                                <i className="bi bi-trash3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="ep-pagination">
                                <button className="ep-page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>
                                    <i className="bi bi-chevron-left" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button key={p} className={`ep-page-btn ${page === p ? 'ep-page-btn--active' : ''}`} onClick={() => setPage(p)}>
                                        {p}
                                    </button>
                                ))}
                                <button className="ep-page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalMode && (
                <div className="ep-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !saving && closeModal()}>
                    <div className="ep-modal">
                        <div className="ep-modal__header">
                            <div className="d-flex align-items-center gap-2">
                                <div className="ep-modal-icon"><i className={`bi ${icon}`} /></div>
                                <div>
                                    <h5 className="fw-bold mb-0">{modalMode === 'create' ? `Add ${title.replace(/s$/, '')}` : `Edit ${title.replace(/s$/, '')}`}</h5>
                                </div>
                            </div>
                            <button className="ep-modal-close" onClick={closeModal} disabled={saving}><i className="bi bi-x-lg" /></button>
                        </div>

                        <form onSubmit={submit} noValidate>
                            <div className="ep-modal__body">
                                <div className="row g-3">
                                    {formFields.map((f) => (
                                        <div className={f.col || 'col-12'} key={f.name}>
                                            <label className="form-label fw-semibold">
                                                {f.label}{f.required && <span className="text-danger ms-1">*</span>}
                                            </label>
                                            {f.type === 'select' ? (
                                                <select
                                                    className={`form-select ${formErrors[f.name] ? 'is-invalid' : ''}`}
                                                    value={form[f.name] ?? ''}
                                                    onChange={(e) => updateField(f.name, e.target.value)}
                                                >
                                                    <option value="" disabled>Select {f.label.toLowerCase()}</option>
                                                    {(f.options || []).map((opt) => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            ) : f.type === 'textarea' ? (
                                                <textarea
                                                    className={`form-control ${formErrors[f.name] ? 'is-invalid' : ''}`}
                                                    rows={3}
                                                    placeholder={f.placeholder}
                                                    value={form[f.name] ?? ''}
                                                    onChange={(e) => updateField(f.name, e.target.value)}
                                                />
                                            ) : (
                                                <input
                                                    type={f.type || 'text'}
                                                    className={`form-control ${formErrors[f.name] ? 'is-invalid' : ''}`}
                                                    placeholder={f.placeholder}
                                                    value={form[f.name] ?? ''}
                                                    disabled={f.disabledOnEdit && modalMode === 'edit'}
                                                    onChange={(e) => updateField(f.name, e.target.value)}
                                                />
                                            )}
                                            {formErrors[f.name] && <div className="invalid-feedback d-block">{formErrors[f.name]}</div>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="ep-modal__footer">
                                <button type="button" className="btn ep-modal-secondary" onClick={closeModal} disabled={saving}>Cancel</button>
                                <button type="submit" className="btn ep-action-btn ep-action-btn--indigo" disabled={saving}>
                                    {saving ? (
                                        <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                    ) : modalMode === 'create' ? 'Create' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
