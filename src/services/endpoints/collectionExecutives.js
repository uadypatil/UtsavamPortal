// src/services/endpoints/collectionExecutives.js — /collection-executives
// Replaces the legacy CollectionExecutive/getBy/event_id and
// CollectionExecutive/save calls (non-REST backend) with the documented
// REST contract. `list` accepts { eventId } as a query filter so callers
// can keep scoping to the current event the way the old getBy/event_id
// call did.
import { createRestResource } from './resource';
export const collectionExecutivesApi = createRestResource('/collection-executives');
