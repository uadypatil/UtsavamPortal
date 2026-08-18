import React, { useEffect, useState } from 'react';
import { receiptTemplatesApi } from '../../../services/endpoints/receiptTemplates';
import { eventsApi } from '../../../services/endpoints/events';
import { apiErrorMessage } from '../../../services/httpClient';
import { useToast } from '../../../context/ToastContext';
import { COLORS } from '../../../constants/colors';

const STATUS_VALUES = { active: 'ACTIVE', inactive: 'INACTIVE' };

const DEFAULT_FORM = {
    headerTitle: 'Ganesh Utsav Mandal',
    footerNote: 'Thank you for your generous contribution.',
    primaryColor: COLORS.primary,
    showDonorAddress: true,
    showEventLogo: true,
};

/**
 * One receipt template per event (backend rule per Swagger doc:
 * "Create a receipt template for an event (one per event)"). This screen
 * therefore requires an event to be selected first, then either creates
 * the template (if none exists for that event yet) or edits the existing
 * one — never both. The preview panel renders straight from `form`, so
 * it always reflects the actual saved/editable template data instead of
 * a static mockup.
 */
export default function ReceiptTemplateManager() {
    const toast = useToast();
    const [events, setEvents] = useState([]);
    const [eventId, setEventId] = useState('');
    const [loadingEvents, setLoadingEvents] = useState(true);

    const [template, setTemplate] = useState(null); // existing template, if any
    const [form, setForm] = useState(DEFAULT_FORM);
    const [loadingTemplate, setLoadingTemplate] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const organizerId = localStorage.getItem('eventOrganizerId');

    useEffect(() => {
        (async () => {
            setLoadingEvents(true);
            try {
                const data = await eventsApi.list(organizerId ? { eventOrganizerId: organizerId } : undefined);
                setEvents(Array.isArray(data) ? data : data?.items || []);
            } catch (e) {
                setError(apiErrorMessage(e, 'Unable to load your events.'));
            } finally {
                setLoadingEvents(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selectEvent = async (id) => {
        setEventId(id);
        setTemplate(null);
        setForm(DEFAULT_FORM);
        if (!id) return;

        setLoadingTemplate(true);
        setError('');
        try {
            const data = await receiptTemplatesApi.getByEvent(id);
            if (data) {
                setTemplate(data);
                setForm({
                    headerTitle: data.headerTitle || DEFAULT_FORM.headerTitle,
                    footerNote: data.footerNote || DEFAULT_FORM.footerNote,
                    primaryColor: data.primaryColor || DEFAULT_FORM.primaryColor,
                    showDonorAddress: data.showDonorAddress ?? true,
                    showEventLogo: data.showEventLogo ?? true,
                });
            }
        } catch (e) {
            // A 404 here just means "no template yet for this event" —
            // that's a normal, expected state (not an error banner), so
            // the form simply stays on DEFAULT_FORM ready for creation.
            if (e?.response?.status !== 404) {
                setError(apiErrorMessage(e, 'Unable to load the receipt template for this event.'));
            }
        } finally {
            setLoadingTemplate(false);
        }
    };

    const save = async () => {
        if (!eventId) {
            toast.error('Select an event first.');
            return;
        }
        setSaving(true);
        try {
            const payload = { eventId, ...form };
            if (template) {
                await receiptTemplatesApi.update(template.id, payload);
                toast.success('Receipt template updated.');
            } else {
                const created = await receiptTemplatesApi.create(payload);
                setTemplate(created);
                toast.success('Receipt template created for this event.');
            }
        } catch (e) {
            toast.error(apiErrorMessage(e, 'Unable to save the receipt template.'));
        } finally {
            setSaving(false);
        }
    };

    const toggleActive = async () => {
        if (!template) return;
        const isActive = template.status === STATUS_VALUES.active;
        try {
            await receiptTemplatesApi.setStatus(template.id, isActive ? STATUS_VALUES.inactive : STATUS_VALUES.active);
            setTemplate((prev) => ({ ...prev, status: isActive ? STATUS_VALUES.inactive : STATUS_VALUES.active }));
            toast.success(`Template ${isActive ? 'deactivated' : 'activated'}.`);
        } catch (e) {
            toast.error(apiErrorMessage(e, 'Unable to update template status.'));
        }
    };

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-file-earmark-ruled me-2" />Receipt Template</h4>
                <p className="mb-0 opacity-90 position-relative">Configure how your event's digital donation receipt looks. One template per event.</p>
            </div>

            {error && <div className="alert alert-danger"><i className="bi bi-exclamation-triangle me-2" />{error}</div>}

            <div className="ep-chart-card mb-4">
                <label className="form-label fw-semibold">Select Event</label>
                <select className="form-select" disabled={loadingEvents} value={eventId} onChange={(e) => selectEvent(e.target.value)}>
                    <option value="">Choose an event...</option>
                    {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.event_name || ev.name}</option>)}
                </select>
                {events.length === 0 && !loadingEvents && (
                    <div className="text-muted small mt-2">No events yet — create one under "Events" first.</div>
                )}
            </div>

            {eventId && (
                loadingTemplate ? (
                    <div className="py-5 text-center text-muted"><span className="spinner-border spinner-border-sm me-2" />Loading template...</div>
                ) : (
                    <div className="row g-4">
                        <div className="col-lg-6">
                            <div className="ep-chart-card h-100">
                                <h6 className="fw-bold mb-3">Template Settings</h6>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Header Title</label>
                                    <input className="form-control" value={form.headerTitle} onChange={(e) => setForm((p) => ({ ...p, headerTitle: e.target.value }))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Footer Note</label>
                                    <textarea className="form-control" rows={2} value={form.footerNote} onChange={(e) => setForm((p) => ({ ...p, footerNote: e.target.value }))} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Accent Color</label>
                                    <input type="color" className="form-control form-control-color" value={form.primaryColor} onChange={(e) => setForm((p) => ({ ...p, primaryColor: e.target.value }))} />
                                </div>
                                <div className="form-check form-switch mb-2">
                                    <input className="form-check-input" type="checkbox" id="showDonorAddress" checked={form.showDonorAddress} onChange={(e) => setForm((p) => ({ ...p, showDonorAddress: e.target.checked }))} />
                                    <label className="form-check-label" htmlFor="showDonorAddress">Show donor address on receipt</label>
                                </div>
                                <div className="form-check form-switch mb-4">
                                    <input className="form-check-input" type="checkbox" id="showEventLogo" checked={form.showEventLogo} onChange={(e) => setForm((p) => ({ ...p, showEventLogo: e.target.checked }))} />
                                    <label className="form-check-label" htmlFor="showEventLogo">Show event/Mandal logo</label>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="btn ep-action-btn ep-action-btn--indigo" onClick={save} disabled={saving}>
                                        {saving ? 'Saving...' : template ? 'Save Changes' : 'Create Template'}
                                    </button>
                                    {template && (
                                        <button className={`btn ${template.status === STATUS_VALUES.active ? 'ep-warning-btn' : 'ep-success-btn'}`} onClick={toggleActive}>
                                            {template.status === STATUS_VALUES.active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="ep-chart-card h-100">
                                <h6 className="fw-bold mb-3">Live Preview</h6>
                                {/* Renders from the actual `form` state — not a static mockup. */}
                                <div className="border rounded-4 p-4 text-center" style={{ borderColor: form.primaryColor, background: '#fffdf7' }}>
                                    {form.showEventLogo && <div className="mb-2"><i className="bi bi-flower2" style={{ fontSize: 28, color: form.primaryColor }} /></div>}
                                    <h5 className="fw-bold" style={{ color: form.primaryColor }}>{form.headerTitle || 'Header Title'}</h5>
                                    <div className="text-muted small mb-3">Digital Donation Receipt</div>
                                    <div className="text-start small border-top border-bottom py-3 mb-3">
                                        <div className="d-flex justify-content-between"><span>Donor Name</span><span className="fw-semibold">Sample Donor</span></div>
                                        <div className="d-flex justify-content-between"><span>Amount</span><span className="fw-semibold">₹501</span></div>
                                        {form.showDonorAddress && <div className="d-flex justify-content-between"><span>Address</span><span className="fw-semibold text-truncate ms-2">Sample Address</span></div>}
                                        <div className="d-flex justify-content-between"><span>Receipt No.</span><span className="fw-semibold">Generated by server</span></div>
                                    </div>
                                    <div className="small text-muted">{form.footerNote}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
