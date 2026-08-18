import React, { useEffect, useState } from 'react';
import { expensesApi, expenseApprovalsApi } from '../../services/endpoints/expenses';
import { apiErrorMessage } from '../../services/httpClient';
import { useToast } from '../../context/ToastContext';
import useConfirm from '../../context/useConfirm';

// ⚠️ ASSUMPTION FLAG: the exact decision enum values (APPROVED / REJECTED /
// REVISION_REQUESTED) aren't spelled out in the available doc extract —
// the PDF only says the endpoint can "approve, reject, or request
// revision." Verify these three literal strings against the live Swagger
// schema before go-live; if they differ, this map is the only place to fix.
const DECISION_LABELS = {
    APPROVED: { label: 'Approve', variant: 'success', icon: 'bi-check-circle' },
    REJECTED: { label: 'Reject', variant: 'danger', icon: 'bi-x-circle' },
    REVISION_REQUESTED: { label: 'Request Revision', variant: 'warning', icon: 'bi-arrow-repeat' },
};

export default function ExpenseApprovals() {
    const toast = useToast();
    const confirm = useConfirm();

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [selected, setSelected] = useState(null); // expense object being reviewed
    const [audit, setAudit] = useState([]);
    const [auditLoading, setAuditLoading] = useState(false);
    const [decisionRemarks, setDecisionRemarks] = useState('');
    const [decisionBusy, setDecisionBusy] = useState(null);

    const load = async () => {
        setLoading(true);
        setLoadError('');
        try {
            // Only expenses awaiting Super Admin action belong in this queue.
            const data = await expensesApi.list({ status: 'SUBMITTED' });
            const list = Array.isArray(data) ? data : data?.items || data?.results || [];
            setExpenses(list);
        } catch (error) {
            setLoadError(apiErrorMessage(error, 'Unable to load pending expenses.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const openReview = async (expense) => {
        setSelected(expense);
        setDecisionRemarks('');
        setAudit([]);
        setAuditLoading(true);
        try {
            const trail = await expenseApprovalsApi.listByExpense(expense.id);
            setAudit(Array.isArray(trail) ? trail : trail?.items || []);
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to load the approval history for this expense.'));
        } finally {
            setAuditLoading(false);
        }
    };

    const handleDecision = async (decision) => {
        if (!selected) return;
        const meta = DECISION_LABELS[decision];
        const ok = await confirm({
            title: `${meta.label} this expense?`,
            message: decision === 'REJECTED'
                ? 'The organizer will be notified this expense was rejected.'
                : decision === 'REVISION_REQUESTED'
                    ? 'The organizer will be asked to revise and resubmit this expense.'
                    : 'This will mark the expense as approved and eligible for payment.',
            confirmText: meta.label,
            variant: meta.variant,
        });
        if (!ok) return;

        setDecisionBusy(decision);
        try {
            await expensesApi.decide(selected.id, { decision, remarks: decisionRemarks });
            toast.success(`Expense ${meta.label.toLowerCase()}d.`);
            setSelected(null);
            await load();
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Unable to record this decision.'));
        } finally {
            setDecisionBusy(null);
        }
    };

    return (
        <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
            <div className="ep-festive-banner mb-4">
                <h4 className="fw-bold mb-1 position-relative"><i className="bi bi-check2-square me-2" />Expense Approvals</h4>
                <p className="mb-0 opacity-90 position-relative">Expenses submitted by Event Organizers awaiting a Super Admin decision.</p>
            </div>

            <div className="ep-chart-card">
                {loading ? (
                    <div className="py-5 text-center text-muted"><span className="spinner-border spinner-border-sm me-2" />Loading pending expenses...</div>
                ) : loadError ? (
                    <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-exclamation-triangle me-2" />{loadError}</span>
                        <button className="btn btn-sm btn-outline-danger" onClick={load}>Retry</button>
                    </div>
                ) : expenses.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                        <i className="bi bi-check2-all display-6 d-block mb-2" />
                        Nothing pending — the approval queue is empty.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table align-middle">
                            <thead>
                                <tr>
                                    <th>Expense</th>
                                    <th>Organizer</th>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Submitted</th>
                                    <th className="text-end">Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((exp) => (
                                    <tr key={exp.id}>
                                        <td className="fw-semibold">{exp.title || exp.description || `#${exp.id}`}</td>
                                        <td>{exp.organizerName || exp.eventOrganizerName || '—'}</td>
                                        <td>{exp.categoryName || exp.category || '—'}</td>
                                        <td>{exp.amount != null ? `₹${exp.amount}` : '—'}</td>
                                        <td>{exp.submittedAt ? new Date(exp.submittedAt).toLocaleDateString() : '—'}</td>
                                        <td className="text-end">
                                            <button className="btn ep-action-btn ep-action-btn--indigo btn-sm" onClick={() => openReview(exp)}>
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selected && (
                <div className="ep-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && !decisionBusy && setSelected(null)}>
                    <div className="ep-modal" style={{ maxWidth: 640 }}>
                        <div className="ep-modal__header">
                            <div className="d-flex align-items-center gap-2">
                                <div className="ep-modal-icon"><i className="bi bi-receipt" /></div>
                                <h5 className="fw-bold mb-0">{selected.title || `Expense #${selected.id}`}</h5>
                            </div>
                            <button className="ep-modal-close" onClick={() => setSelected(null)}><i className="bi bi-x-lg" /></button>
                        </div>
                        <div className="ep-modal__body">
                            <div className="row g-3 mb-3">
                                <div className="col-md-6"><strong>Organizer:</strong> {selected.organizerName || selected.eventOrganizerName || '—'}</div>
                                <div className="col-md-6"><strong>Category:</strong> {selected.categoryName || selected.category || '—'}</div>
                                <div className="col-md-6"><strong>Amount:</strong> {selected.amount != null ? `₹${selected.amount}` : '—'}</div>
                                <div className="col-md-6"><strong>Status:</strong> {selected.status}</div>
                                {selected.description && <div className="col-12"><strong>Notes:</strong> {selected.description}</div>}
                            </div>

                            <div className="ep-form-section">
                                <div className="ep-form-section__title"><i className="bi bi-clock-history" /> Approval History</div>
                                {auditLoading ? (
                                    <div className="text-muted small"><span className="spinner-border spinner-border-sm me-2" />Loading history...</div>
                                ) : audit.length === 0 ? (
                                    <div className="text-muted small">No prior decisions recorded for this expense yet.</div>
                                ) : (
                                    <ul className="list-unstyled small mb-0">
                                        {audit.map((entry) => (
                                            <li key={entry.id} className="mb-2 pb-2 border-bottom">
                                                <strong>{entry.decision}</strong> by {entry.actedBy || entry.userName || 'a Super Admin'}
                                                {entry.createdAt && <> on {new Date(entry.createdAt).toLocaleString()}</>}
                                                {entry.remarks && <div className="text-muted">"{entry.remarks}"</div>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <label className="form-label fw-semibold">Remarks (optional, shared with the organizer)</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={decisionRemarks}
                                onChange={(e) => setDecisionRemarks(e.target.value)}
                                placeholder="Add context for your decision..."
                            />
                        </div>
                        <div className="ep-modal__footer flex-wrap">
                            <button type="button" className="btn ep-modal-secondary" onClick={() => setSelected(null)} disabled={!!decisionBusy}>Cancel</button>
                            <button className="btn ep-warning-btn" disabled={!!decisionBusy} onClick={() => handleDecision('REVISION_REQUESTED')}>
                                {decisionBusy === 'REVISION_REQUESTED' ? 'Submitting...' : 'Request Revision'}
                            </button>
                            <button className="btn ep-danger-btn" disabled={!!decisionBusy} onClick={() => handleDecision('REJECTED')}>
                                {decisionBusy === 'REJECTED' ? 'Submitting...' : 'Reject'}
                            </button>
                            <button className="btn ep-success-btn" disabled={!!decisionBusy} onClick={() => handleDecision('APPROVED')}>
                                {decisionBusy === 'APPROVED' ? 'Submitting...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
