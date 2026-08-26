import React, { useEffect, useState } from "react";
import { expensesApi } from "../../../services/endpoints/expenses";
import { expenseCategoriesApi } from "../../../services/endpoints/expenseCategories";
import { apiErrorMessage } from "../../../services/httpClient";
import { useToast } from "../../../context/ToastContext";
import useConfirm from "../../../context/useConfirm";
import useAuth from "../../../hooks/useAuth";

const STATUS_BADGE = {
  DRAFT: { label: "Draft", className: "ep-status--disabled" },
  SUBMITTED: { label: "Submitted", className: "ep-status--pending" },
  APPROVED: { label: "Approved", className: "ep-status--active" },
  REJECTED: { label: "Rejected", className: "ep-status--danger" },
  REVISION_REQUESTED: {
    label: "Revision Requested",
    className: "ep-status--pending",
  },
};

const PAYMENT_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
];

/**
 * Replaces the old "Expences Manager" sidebar item, which actually routed
 * to a dummy per-event table (EventManagers.jsx) with no relationship to
 * expenses at all. This is the real expense workflow:
 *   DRAFT -> (edit while draft) -> SUBMITTED -> APPROVED/REJECTED/REVISION_REQUESTED
 * Only DRAFT expenses can be edited or submitted, matching the backend's
 * state machine — the UI disables actions that don't apply rather than
 * showing every action always and letting the API reject it.
 */
export default function ExpenseManager() {
  const { user } = useAuth();
  const toast = useToast();
  const confirm = useConfirm();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit'
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [expenseData, categoryData] = await Promise.all([
        expensesApi.list({
          seasonId: user.seasonId || undefined,
          eventOrganizerId: user.id || undefined,
        }),
        expenseCategoriesApi.list({
          seasonId: user.seasonId || undefined,
          eventOrganizerId: user.id || undefined,
        }),
      ]);
      setExpenses(
        Array.isArray(expenseData) ? expenseData : expenseData?.items || [],
      );
      setCategories(
        Array.isArray(categoryData) ? categoryData : categoryData?.items || [],
      );
    } catch (error) {
      setLoadError(apiErrorMessage(error, "Unable to load expenses."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const openCreate = () => {
    setForm({ title: "", categoryId: "", amount: "", description: "", expenseDate:"" });
    setFormErrors({});
    setModalMode("create");
  };

  const openEdit = (expense) => {
    setForm({
      id: expense.id,
      title: expense.title || "",
      categoryId: expense.categoryId || "",
      amount: expense.amount ?? "",
      description: expense.description || "",
      expenseDate: expense.expenseDate || "",
    });
    setFormErrors({});
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setForm({});
    setFormErrors({});
  };

  const validate = () => {
    const errors = {};
    if (!form.title?.trim()) errors.title = "Title is required.";
    if (!form.categoryId) errors.categoryId = "Category is required.";
    if (!form.amount || Number(form.amount) <= 0)
      errors.amount = "Enter a valid amount.";
    return errors;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length) return;

    setSaving(true);
    try {
      const payload = {
        seasonId: user.seasonId || undefined,
        eventOrganizerId: user.id || undefined,
        title: form.title.trim(),
        categoryId: form.categoryId,
        amount: Number(form.amount),
        description: form.description?.trim() || "",
        expenseDate: form.expenseDate
      };
      if (modalMode === "create") {
        await expensesApi.create(payload);
        toast.success("Expense created as draft.");
      } else {
        await expensesApi.update(form.id, payload);
        toast.success("Draft expense updated.");
      }
      closeModal();
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Unable to save this expense."));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async (expense) => {
    const ok = await confirm({
      title: "Submit this expense for approval?",
      message:
        "Once submitted, you will not be able to edit it unless a Super Admin requests a revision.",
      confirmText: "Submit",
      variant: "success",
    });
    if (!ok) return;
    setBusyId(expense.id);
    try {
      await expensesApi.submit(expense.id);
      toast.success("Expense submitted for approval.");
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Unable to submit this expense."));
    } finally {
      setBusyId(null);
    }
  };

  const handlePaymentStatus = async (expense, paymentStatus) => {
    setBusyId(expense.id);
    try {
      await expensesApi.updatePaymentStatus(expense.id, paymentStatus);
      toast.success("Payment status updated.");
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Unable to update payment status."));
    } finally {
      setBusyId(null);
    }
  };

  const categoryName = (id) =>
    categories.find((c) => String(c.id) === String(id))?.categoryName || "—";

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h4 className="fw-bold mb-1 position-relative">
              <i className="bi bi-receipt-cutoff me-2" />
              Expense Management
            </h4>
            <p className="mb-0 opacity-90 position-relative">
              Track festival expenses from draft through approval and payment.
            </p>
          </div>
          <button
            className="btn ep-action-btn ep-action-btn--indigo"
            onClick={openCreate}
            disabled={categories.length === 0}
          >
            <i className="bi bi-plus-circle me-2" /> New Expense
          </button>
        </div>
      </div>

      {categories.length === 0 && !loading && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2" />
          No expense categories exist yet — a Super Admin needs to create at
          least one before expenses can be filed.
        </div>
      )}

      <div className="ep-chart-card">
        {loading ? (
          <div className="py-5 text-center text-muted">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading expenses...
          </div>
        ) : loadError ? (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-exclamation-triangle me-2" />
              {loadError}
            </span>
            <button className="btn btn-sm btn-outline-danger" onClick={load}>
              Retry
            </button>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-receipt display-6 d-block mb-2" />
            No expenses filed yet for this event.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => {
                  const badge = STATUS_BADGE[exp.status] || {
                    label: exp.status,
                    className: "ep-status--disabled",
                  };
                  const isDraft = exp.status === "DRAFT";
                  const isApproved = exp.status === "APPROVED";
                  const busy = busyId === exp.id;
                  return (
                    <tr key={exp.id || exp._id}>
                      <td className="fw-semibold">{exp.title}</td>
                      <td>
                        {exp.categoryName || categoryName(exp.categoryId)}
                      </td>
                      <td>₹{exp.amount?.$numberDecimal || "0"}</td>
                      <td>
                        <span className={`ep-status ${badge.className}`}>
                          <span />
                          {badge.label}
                        </span>
                      </td>
                      <td>
                        {isApproved ? (
                          <select
                            className="form-select form-select-sm"
                            style={{ minWidth: 110 }}
                            value={exp.paymentStatus || "PENDING"}
                            disabled={busy}
                            onChange={(e) =>
                              handlePaymentStatus(exp, e.target.value)
                            }
                          >
                            {PAYMENT_STATUS_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-muted small">—</span>
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {isDraft && (
                            <>
                              <button
                                className="btn ep-icon-btn ep-icon-btn--edit"
                                title="Edit draft"
                                onClick={() => openEdit(exp)}
                                disabled={busy}
                              >
                                <i className="bi bi-pencil" />
                              </button>
                              <button
                                className="btn ep-action-btn ep-action-btn--indigo btn-sm"
                                onClick={() => handleSubmitForApproval(exp)}
                                disabled={busy}
                              >
                                {busy ? "Submitting..." : "Submit"}
                              </button>
                            </>
                          )}
                          {exp.status === "REVISION_REQUESTED" && (
                            <button
                              className="btn ep-icon-btn ep-icon-btn--edit"
                              title="Revise and resubmit"
                              onClick={() => openEdit(exp)}
                              disabled={busy}
                            >
                              <i className="bi bi-pencil" />
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
        )}
      </div>

      {modalMode && (
        <div
          className="ep-modal-backdrop"
          onMouseDown={(e) =>
            e.target === e.currentTarget && !saving && closeModal()
          }
        >
          <div className="ep-modal">
            <div className="ep-modal__header">
              <div className="d-flex align-items-center gap-2">
                <div className="ep-modal-icon">
                  <i className="bi bi-receipt-cutoff" />
                </div>
                <h5 className="fw-bold mb-0">
                  {modalMode === "create"
                    ? "New Expense (Draft)"
                    : "Edit Draft Expense"}
                </h5>
              </div>
              <button
                className="ep-modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <form onSubmit={submit} noValidate>
              <div className="ep-modal__body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Title<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      className={`form-control ${formErrors.title ? "is-invalid" : ""}`}
                      value={form.title || ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                    />
                    {formErrors.title && (
                      <div className="invalid-feedback d-block">
                        {formErrors.title}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Category<span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.categoryId ? "is-invalid" : ""}`}
                      value={form.categoryId || ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, categoryId: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                    {formErrors.categoryId && (
                      <div className="invalid-feedback d-block">
                        {formErrors.categoryId}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Amount (₹)<span className="text-danger ms-1">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`form-control ${formErrors.amount ? "is-invalid" : ""}`}
                      value={form.amount ?? ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, amount: e.target.value }))
                      }
                    />
                    {formErrors.amount && (
                      <div className="invalid-feedback d-block">
                        {formErrors.amount}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Expense Date <span className="text-danger ms-1">*</span>
                    </label>

                    <input
                      type="date"
                      className={`form-control ${
                        formErrors.expenseDate ? "is-invalid" : ""
                      }`}
                      value={form.expenseDate ?? new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          expenseDate: e.target.value,
                        }))
                      }
                    />

                    {formErrors.expenseDate && (
                      <div className="invalid-feedback d-block">
                        {formErrors.expenseDate}
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">Notes</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description || ""}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="ep-modal__footer">
                <button
                  type="button"
                  className="btn ep-modal-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn ep-action-btn ep-action-btn--indigo"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : modalMode === "create"
                      ? "Save Draft"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
