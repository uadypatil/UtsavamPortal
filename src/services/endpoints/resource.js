// src/services/endpoints/resource.js
//
// Every entity in the Swagger doc (Users, EventOrganizers, Events, Donors,
// CollectionExecutives, ExpenseCategories...) follows the same REST shape:
//   POST   /{resource}            create
//   GET    /{resource}            list (with query params for filters)
//   GET    /{resource}/{id}       get by id
//   PATCH  /{resource}/{id}       update
//   DELETE /{resource}/{id}       soft delete
//   PATCH  /{resource}/{id}/status  activate/deactivate
// This factory avoids re-writing that boilerplate eight times. Endpoints
// that deviate from this shape (Donations, Expenses, ReceiptTemplates)
// compose this plus their own extra methods.

import http, { unwrap } from '../httpClient';

export function createRestResource(basePath) {
  return {
    list: async (params) => {
      const { data } = await http.get(basePath, { params });
      return unwrap({ data });
    },
    get: async (id) => {
      const { data } = await http.get(`${basePath}/${id}`);
      return unwrap({ data });
    },
    create: async (payload) => {
      const { data } = await http.post(basePath, payload);
      return unwrap({ data });
    },
    update: async (id, payload) => {
      const { data } = await http.patch(`${basePath}/${id}`, payload);
      return unwrap({ data });
    },
    remove: async (id) => {
      const { data } = await http.delete(`${basePath}/${id}`);
      return unwrap({ data });
    },
    setStatus: async (id, status) => {
      const { data } = await http.patch(`${basePath}/${id}/status`, { status });
      return unwrap({ data });
    },
    updateActivation: async (id, isActive) => {
      const { data } = await http.patch(
        `${basePath}/${id}/status`,
        { isActive }
      );

      return unwrap({ data });
    },
  };
}
