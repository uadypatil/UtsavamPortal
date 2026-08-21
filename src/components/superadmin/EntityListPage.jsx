import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../context/ToastContext';
import useConfirm from '../../context/useConfirm';
import { apiErrorMessage } from '../../services/httpClient';

const PAGE_SIZE = 10;

const isObj = (v) => v !== null && typeof v === 'object';

function extractList(response) {
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.data?.items)) return response.data.items;
    if (Array.isArray(response?.data?.results)) return response.data.results;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;
    return [];
}

function getRowId(row, idField) {
    if (!isObj(row)) return null;
    const value = row?.[idField] ?? row?.id ?? row?._id;
    return value === null || value === undefined || value === '' ? null : value;
}

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
    title = 'Records',
    icon = 'bi-table',
    description,
    api = {},
    idField = 'id',
    columns = [],
    formFields = [],
    searchKeys = [],
    statusField,
    statusValues = { active: 'ACTIVE', inactive: 'INACTIVE' },
    allowDelete = true,
    emptyStateHint = 'Records you create will show up here.',
}) {
    const toast = useToast();
    const confirm = useConfirm();

    // Keep a live reference to the latest `api` prop without making it a
    // dependency of callbacks/effects — parents often pass a brand-new
    // inline object every render, which would otherwise recreate `load`
    // on every render and retrigger the load effect in a loop.
    const apiRef = useRef(api);
    apiRef.current = api;

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

    const safeColumns = useMemo(
        () => (Array.isArray(columns) ? columns.filter((c) => isObj(c) && c.key) : []),
        [columns]
    );
    const safeFormFields = useMemo(
        () => (Array.isArray(formFields) ? formFields.filter((f) => isObj(f) && f.name) : []),
        [formFields]
    );

    const singularTitle = useMemo(() => {
        const t = String(title || 'Record').trim();
        return t.endsWith('s') ? t.slice(0, -1) : t;
    }, [title]);

    const canCreate = typeof api?.create === 'function';
    const canUpdate = typeof api?.update === 'function';
    const canRemove = allowDelete && typeof api?.remove === 'function';
    const canToggleStatus =
        !!statusField &&
        typeof api?.setStatus === 'function' &&
        statusValues?.active !== undefined &&
        statusValues?.inactive !== undefined;

    // Stable across renders regardless of api's identity — always calls
    // whatever api.list currently is via the ref.
    const load = useCallback(async () => {
        const listFn = apiRef.current?.list;

        if (typeof listFn !== 'function') {
            setRows([]);
            setLoadError('List API is not configured for this page.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setLoadError('');

        try {
            const response = await listFn();
            const safeRows = extractList(response).filter(isObj);
            setRows(safeRows);
        } catch (error) {
            setRows([]);
            setLoadError(apiErrorMessage(error, `Unable to load ${String(title || 'records').toLowerCase()}.`));
        } finally {
            setLoading(false);
        }
    }, [title]);

    useEffect(() => {
        load();
    }, [load]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const filtered = useMemo(() => {
        const safeRows = Array.isArray(rows) ? rows : [];
        const q = String(search || '').trim().toLowerCase();
        const keys = Array.isArray(searchKeys) ? searchKeys : [];

        if (!q || keys.length === 0) return safeRows;

        return safeRows.filter((row) =>
            keys.some((key) => {
                const value = row?.[key];
                return value !== null && value !== undefined
                    ? String(value).toLowerCase().includes(q)
                    : false;
            })
        );
    }, [rows, search, searchKeys]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    const pageRows = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page]
    );

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [page, totalPages]);

    const openCreate = () => {
        if (!canCreate) {
            toast.error(`Create is not available for ${String(title || 'records').toLowerCase()}.`);
            return;
        }

        const initial = {};
        safeFormFields.forEach((f) => {
            initial[f.name] = f.defaultValue ?? '';
        });

        setForm(initial);
        setFormErrors({});
        setModalMode('create');
    };

    const openEdit = (row) => {
        if (!canUpdate) {
            toast.error(`Editing is not available for ${String(title || 'records').toLowerCase()}.`);
            return;
        }

        const recordId = getRowId(row, idField);
        if (recordId === null) {
            toast.error('This record does not have a valid ID.');
            return;
        }

        const initial = {};
        safeFormFields.forEach((f) => {
            initial[f.name] = row?.[f.name] ?? '';
        });

        setForm({ ...initial, [idField]: recordId });
        setFormErrors({});
        setModalMode('edit');
    };

    const closeModal = () => {
        if (saving) return;
        setModalMode(null);
        setForm({});
        setFormErrors({});
    };

    const updateField = (name, value) => {
        if (!name) return;
        setForm((prev) => ({ ...prev, [name]: value }));
        setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errors = {};
        safeFormFields.forEach((f) => {
            if (!f.required) return;
            const value = form?.[f.name];
            if (value === null || value === undefined || String(value).trim() === '') {
                errors[f.name] = `${f.label || f.name} is required.`;
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
                const createFn = apiRef.current?.create;
                if (typeof createFn !== 'function') throw new Error('Create API is not configured.');
                await createFn(payload);
                toast.success(`${singularTitle} created successfully.`);
            } else {
                const updateFn = apiRef.current?.update;
                if (typeof updateFn !== 'function') throw new Error('Update API is not configured.');
                const recordId = form?.[idField];
                if (recordId === null || recordId === undefined || recordId === '') {
                    throw new Error('Cannot update a record without an ID.');
                }
                await updateFn(recordId, payload);
                toast.success(`${singularTitle} updated successfully.`);
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
        const recordId = getRowId(row, idField);
        if (recordId === null) {
            toast.error('This record does not have a valid ID.');
            return;
        }

        const removeFn = apiRef.current?.remove;
        if (!canRemove || typeof removeFn !== 'function') {
            toast.error('Delete API is not configured.');
            return;
        }

        const ok = await confirm({
            title: `Delete this ${singularTitle.toLowerCase()}?`,
            message: 'This action cannot be undone.',
            confirmText: 'Delete',
            variant: 'danger',
        });
        if (!ok) return;

        setActionLoadingId(String(recordId));
        try {
            await removeFn(recordId);
            toast.success('Deleted successfully.');
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to delete this record.'));
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleToggleStatus = async (row) => {
        const setStatusFn = apiRef.current?.setStatus;
        if (!canToggleStatus || typeof setStatusFn !== 'function') {
            toast.error('Status configuration is incomplete.');
            return;
        }

        const recordId = getRowId(row, idField);
        if (recordId === null) {
            toast.error('This record does not have a valid ID.');
            return;
        }

        const isActive = row?.[statusField] === statusValues.active;
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

        setActionLoadingId(String(recordId));
        try {
            await setStatusFn(recordId, nextStatus);
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
                    <button
                        type="button"
                        className="btn ep-action-btn ep-action-btn--indigo"
                        onClick={() => {
                            openCreate();
                        }}
                        disabled={saving || !canCreate}
                    >
                        <i className="bi bi-plus-circle me-2" />
                        Add {singularTitle}
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
                                <button type="button" className="ep-search-clear" onClick={() => setSearch('')}>
                                    <i className="bi bi-x" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6">
                        <button type="button" className="btn ep-refresh-btn w-100" onClick={load} disabled={loading}>
                            <i className={`bi ${loading ? 'bi-arrow-repeat ep-spin' : 'bi-arrow-clockwise'} me-2`} />
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="py-5 text-center text-muted">
                        <span className="spinner-border spinner-border-sm me-2" /> Loading {String(title || 'records').toLowerCase()}...
                    </div>
                ) : loadError ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-exclamation-triangle me-2" />{loadError}</span>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={load}>Retry</button>
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
                                        {safeColumns.map((c) => <th key={String(c.key)}>{c.label || c.key}</th>)}
                                        {statusField && <th>Status</th>}
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageRows.map((row, index) => {
                                        if (!isObj(row)) return null;

                                        const recordId = getRowId(row, idField);
                                        const reactKey = String(recordId ?? `row-${index}`);
                                        const isActive = statusField ? row?.[statusField] === statusValues?.active : true;
                                        const rowBusy = recordId !== null && actionLoadingId === String(recordId);

                                        return (
                                            <tr key={reactKey}>
                                                {safeColumns.map((c) => {
                                                    let content = '—';
                                                    try {
                                                        content = typeof c.render === 'function'
                                                            ? c.render(row) ?? '—'
                                                            : row?.[c.key] ?? '—';
                                                    } catch {
                                                        content = '—';
                                                    }
                                                    return <td key={`${reactKey}-${String(c.key)}`}>{content}</td>;
                                                })}
                                                {statusField && (
                                                    <td>
                                                        <span className={`ep-status ${isActive ? 'ep-status--active' : 'ep-status--disabled'}`}>
                                                            <span /> {isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                )}
                                                <td className="text-end">
                                                    <div className="d-flex justify-content-end gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn ep-icon-btn ep-icon-btn--edit"
                                                            title="Edit"
                                                            onClick={() => openEdit(row)}
                                                            disabled={rowBusy || saving || !canUpdate}
                                                        >
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                        {statusField && (
                                                            <button
                                                                type="button"
                                                                className={`btn ep-icon-btn ${isActive ? 'ep-icon-btn--disable' : 'ep-icon-btn--enable'}`}
                                                                title={isActive ? 'Deactivate' : 'Activate'}
                                                                onClick={() => handleToggleStatus(row)}
                                                                disabled={rowBusy || saving || !canToggleStatus}
                                                            >
                                                                <i className={`bi ${isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`} />
                                                            </button>
                                                        )}
                                                        {allowDelete && (
                                                            <button
                                                                type="button"
                                                                className="btn ep-icon-btn ep-icon-btn--delete"
                                                                title="Delete"
                                                                onClick={() => handleDelete(row)}
                                                                disabled={rowBusy || saving || !canRemove}
                                                            >
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
                                <button type="button" className="ep-page-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                    <i className="bi bi-chevron-left" />
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        type="button"
                                        key={p}
                                        className={`ep-page-btn ${page === p ? 'ep-page-btn--active' : ''}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button type="button" className="ep-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                                    <i className="bi bi-chevron-right" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalMode && (
                <div
                    className="ep-modal-backdrop"
                    onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) closeModal(); }}
                >
                    <div className="ep-modal" role="dialog" aria-modal="true">
                        <div className="ep-modal__header">
                            <div className="d-flex align-items-center gap-2">
                                <div className="ep-modal-icon"><i className={`bi ${icon}`} /></div>
                                <div>
                                    <h5 className="fw-bold mb-0">
                                        {modalMode === 'create' ? `Add ${singularTitle}` : `Edit ${singularTitle}`}
                                    </h5>
                                </div>
                            </div>
                            <button type="button" className="ep-modal-close" onClick={closeModal} disabled={saving}>
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <form onSubmit={submit} noValidate>
                            <div className="ep-modal__body">
                                <div className="row g-3">
                                    {safeFormFields.map((f) => {
                                        const fieldValue = form?.[f.name] ?? '';
                                        const fieldError = formErrors?.[f.name];

                                        return (
                                            <div className={f.col || 'col-12'} key={f.name}>
                                                <label className="form-label fw-semibold">
                                                    {f.label}{f.required && <span className="text-danger ms-1">*</span>}
                                                </label>
                                                {f.type === 'select' ? (
                                                    <select
                                                        className={`form-select ${fieldError ? 'is-invalid' : ''}`}
                                                        value={fieldValue}
                                                        disabled={f.disabledOnEdit && modalMode === 'edit'}
                                                        onChange={(e) => updateField(f.name, e.target.value)}
                                                    >
                                                        <option value="" disabled>
                                                            Select {String(f.label || f.name).toLowerCase()}
                                                        </option>
                                                        {(Array.isArray(f.options) ? f.options : [])
                                                            .filter(isObj)
                                                            .map((opt, i) => {
                                                                const optValue = opt.value ?? '';
                                                                return (
                                                                    <option
                                                                        key={optValue !== '' ? String(optValue) : `option-${i}`}
                                                                        value={optValue}
                                                                    >
                                                                        {opt.label ?? optValue ?? '—'}
                                                                    </option>
                                                                );
                                                            })}
                                                    </select>
                                                ) : f.type === 'textarea' ? (
                                                    <textarea
                                                        className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                                                        rows={f.rows || 3}
                                                        placeholder={f.placeholder || ''}
                                                        value={fieldValue}
                                                        disabled={f.disabledOnEdit && modalMode === 'edit'}
                                                        onChange={(e) => updateField(f.name, e.target.value)}
                                                    />
                                                ) : (
                                                    <input
                                                        type={f.type || 'text'}
                                                        className={`form-control ${fieldError ? 'is-invalid' : ''}`}
                                                        placeholder={f.placeholder || ''}
                                                        value={fieldValue}
                                                        disabled={f.disabledOnEdit && modalMode === 'edit'}
                                                        onChange={(e) => updateField(f.name, e.target.value)}
                                                    />
                                                )}
                                                {fieldError && <div className="invalid-feedback d-block">{fieldError}</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="ep-modal__footer">
                                <button type="button" className="btn ep-modal-secondary" onClick={closeModal} disabled={saving}>
                                    Cancel
                                </button>
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