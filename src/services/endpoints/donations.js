// src/services/endpoints/donations.js — /donations
//
// Deliberately NOT built on createRestResource: donations have no create-
// time id (the server generates the receipt number), no DELETE per the
// Swagger doc, and several extra read/transition endpoints instead.
import http, { unwrap } from "../httpClient";

const BASE = "/donations";

export const donationsApi = {
  /** List/filter donations. `params` can include eventId, status, donorId,
   * date range, etc. — pass whatever filters the calling screen supports;
   * unsupported keys are simply ignored server-side. */
  list: async (params) => {
    const { data } = await http.get(BASE, { params });
    return unwrap({ data });
  },

  get: async (id) => {
    const { data } = await http.get(`${BASE}/${id}`);
    return unwrap({ data });
  },

  /** Server generates the receipt number — never invent one client-side. */
  create: async (payload) => {
    const { data } = await http.post(BASE, payload);
    return unwrap({ data });
  },

  /** Only allowed while the donation isn't completed/refunded — the
   * backend enforces this; the UI should disable the edit action once a
   * donation's status makes it non-editable rather than relying solely on
   * the API rejecting it. */
  update: async (id, payload) => {
    const { data } = await http.patch(`${BASE}/${id}`, payload);
    return unwrap({ data });
  },

  /** State-machine-enforced transition. Only pass statuses the current
   * donation's status actually allows moving to — the UI should compute
   * the valid next-status set from the donation's current status rather
   * than offering every status unconditionally. */
  setStatus: async (id, status) => {
    const { data } = await http.patch(`${BASE}/${id}/status`, { status });
    return unwrap({ data });
  },

  getByReceiptNumber: async (receiptNumber) => {
    const { data } = await http.get(
      `${BASE}/receipt/${encodeURIComponent(receiptNumber)}`,
    );
    return unwrap({ data });
  },

  getSummary: async (eventId) => {
    const { data } = await http.get(`${BASE}/summary/${eventId}`);
    return unwrap({ data });
  },

  filter: async (seasonId, eventId, collectionExecutiveId) => {
    const query = new URLSearchParams();

    if (seasonId) query.append("seasonId", seasonId);
    if (eventId) query.append("eventId", eventId);
    if (collectionExecutiveId) {
      query.append("collectionExecutiveId", collectionExecutiveId);
    }

    const { data } = await http.get(`${BASE}/filter?${query.toString()}`);

    return unwrap({ data });
  },
};
