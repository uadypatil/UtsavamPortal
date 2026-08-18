// src/services/endpoints/expenses.js — /expenses, /expense-approvals
//
// Expense state machine (per Swagger doc):
//   POST /expenses                -> created as DRAFT
//   PATCH /expenses/{id}          -> edit while DRAFT
//   POST /expenses/{id}/submit    -> DRAFT -> SUBMITTED
//   POST /expenses/{id}/decision  -> SUBMITTED -> APPROVED|REJECTED|REVISION_REQUESTED
//                                     (Super Admin only)
//   PATCH /expenses/{id}/payment-status -> once APPROVED
// The frontend should treat these as the only legal transitions and
// disable actions that don't apply to the expense's current status,
// rather than presenting every action all the time and letting the
// backend reject invalid ones.
import http, { unwrap } from '../httpClient';

const BASE = '/expenses';

export const expensesApi = {
  list: async (params) => {
    const { data } = await http.get(BASE, { params });
    return unwrap({ data });
  },
  get: async (id) => {
    const { data } = await http.get(`${BASE}/${id}`);
    return unwrap({ data });
  },
  /** Always creates as DRAFT — there is no "publish directly" option. */
  create: async (payload) => {
    const { data } = await http.post(BASE, payload);
    return unwrap({ data });
  },
  /** Only valid while the expense is still DRAFT. */
  update: async (id, payload) => {
    const { data } = await http.patch(`${BASE}/${id}`, payload);
    return unwrap({ data });
  },
  submit: async (id) => {
    const { data } = await http.post(`${BASE}/${id}/submit`);
    return unwrap({ data });
  },
  /** Super Admin only — the UI must not render this action for any other
   * role, but the real gate is the backend rejecting it for non-admins. */
  decide: async (id, { decision, remarks } = {}) => {
    const { data } = await http.post(`${BASE}/${id}/decision`, { decision, remarks });
    return unwrap({ data });
  },
  updatePaymentStatus: async (id, paymentStatus) => {
    const { data } = await http.patch(`${BASE}/${id}/payment-status`, { paymentStatus });
    return unwrap({ data });
  },
};

export const expenseApprovalsApi = {
  listByExpense: async (expenseId) => {
    const { data } = await http.get(`/expense-approvals/by-expense/${expenseId}`);
    return unwrap({ data });
  },
  get: async (id) => {
    const { data } = await http.get(`/expense-approvals/${id}`);
    return unwrap({ data });
  },
};
