// src/services/endpoints/expenseCategories.js — /expense-categories
// No PATCH .../status documented for this resource, so setStatus from the
// generic factory is unused here — leaving it available in case the
// backend adds one rather than special-casing the factory.
import { createRestResource } from './resource';
export const expenseCategoriesApi = createRestResource('/expense-categories');
