// src/services/endpoints/receiptTemplates.js — /receipt-templates
// One template per event: create is a POST (not per-id), fetch is by
// eventId rather than by the template's own id.
import http, { unwrap } from '../httpClient';

const BASE = '/receipt-templates';

export const receiptTemplatesApi = {
  create: async (payload) => {
    const { data } = await http.post(BASE, payload);
    return unwrap({ data });
  },
  getByEvent: async (eventId) => {
    const { data } = await http.get(`${BASE}/event/${eventId}`);
    return unwrap({ data });
  },
  update: async (id, payload) => {
    const { data } = await http.patch(`${BASE}/${id}`, payload);
    return unwrap({ data });
  },
  setStatus: async (id, status) => {
    const { data } = await http.patch(`${BASE}/${id}/status`, { status });
    return unwrap({ data });
  },
};
