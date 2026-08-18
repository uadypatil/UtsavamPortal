// src/services/endpoints/seasons.js — /seasons
//
// ⚠️ ASSUMPTION FLAG: the Swagger PDF's "Seasons" section header was visible
// in the doc's table of contents but its individual endpoint rows were cut
// off in the page render provided. Every other top-level entity in this
// API (Users, EventOrganizers, Events, Donors, CollectionExecutives,
// ExpenseCategories) follows the identical REST shape:
//   POST /{resource}, GET /{resource}, GET/{id}, PATCH/{id}, DELETE/{id},
//   PATCH/{id}/status
// so this module follows that same convention as the most defensible
// inference. Before relying on this in production, open the live Swagger
// UI's "Seasons" section (the same page this PDF was exported from) and
// confirm the exact paths/payload — if it differs (e.g. no DELETE, or a
// different status field), update this file only; every screen that
// imports `seasonsApi` will pick up the fix automatically.
import { createRestResource } from './resource';
export const seasonsApi = createRestResource('/seasons');
