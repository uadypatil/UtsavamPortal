import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { eventsApi } from "../../../services/endpoints/events";
import { apiErrorMessage } from "../../../services/httpClient";
import { useToast } from "../../../context/ToastContext";
import useConfirm from "../../../context/useConfirm";
import useAuth from "../../../hooks/useAuth";

const STATUS_VALUES = { active: true, inactive: false };

/**
 * Real Events list/CRUD for an organizer — replaces the old single-event
 * assumption (Events.jsx used to always edit event id 3). This screen
 * lists every event belonging to the signed-in organizer and hands off to
 * Events.jsx (now a create/edit form, routed at /admin/events/new and
 * /admin/events/:eventId/edit) for the actual create/edit UI, since that
 * form is already rich (QR generation, duration selector, etc.) and
 * shouldn't be duplicated here.
 */
export default function EventsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const confirm = useConfirm();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setLoadError("");
    try {
      const data = await eventsApi.list({
        eventOrganizerId: user.id || undefined,
        seasonId: user.seasonId || undefined,
      });
      const list = Array.isArray(data)
        ? data
        : data?.items || data?.results || [];
      setEvents(list);
    } catch (error) {
      setLoadError(apiErrorMessage(error, "Unable to load events."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter((e) =>
      (e.event_name || e.name || "").toLowerCase().includes(q),
    );
  }, [events, search]);

  const handleDelete = async (event) => {
    const ok = await confirm({
      title: "Delete this event?",
      message: `"${event.event_name || event.name}" will be permanently removed. This cannot be undone.`,
      confirmText: "Delete",
      variant: "danger",
    });
    if (!ok) return;
    setActionLoadingId(event.id);
    try {
      await eventsApi.remove(event.id);
      toast.success("Event deleted.");
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Unable to delete this event."));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleStatus = async (event) => {
    const isActive = event.isActive === STATUS_VALUES.active;
    const ok = await confirm({
      title: isActive ? "Deactivate this event?" : "Activate this event?",
      message: isActive
        ? "Donation collectors and donors will no longer see this event as active."
        : "This event will become active again.",
      confirmText: isActive ? "Deactivate" : "Activate",
      variant: isActive ? "warning" : "success",
    });
    if (!ok) return;
    setActionLoadingId(event.id);
    try {
      await eventsApi.setStatus(
        event.id,
        isActive ? STATUS_VALUES.inactive : STATUS_VALUES.active,
      );
      toast.success("Event status updated.");
      await load();
    } catch (error) {
      toast.error(apiErrorMessage(error, "Unable to update event status."));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      <div className="ep-festive-banner mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h4 className="fw-bold mb-1 position-relative">🪔 Events</h4>
            <p className="mb-0 opacity-90 position-relative">
              Manage every festival/event your Mandal runs — not limited to one.
            </p>
          </div>
          <button
            className="btn ep-action-btn ep-action-btn--indigo"
            onClick={() => navigate("/admin/events/new")}
          >
            <i className="bi bi-plus-circle me-2" /> New Event
          </button>
        </div>
      </div>

      <div className="ep-chart-card">
        <div className="row g-3 align-items-end mb-4">
          <div className="col-lg-8 col-md-6">
            <label className="form-label fw-semibold">Search Events</label>
            <div className="ep-search-box">
              <i className="bi bi-search" />
              <input
                className="form-control"
                placeholder="Search by event name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button
                  className="ep-search-clear"
                  onClick={() => setSearch("")}
                >
                  <i className="bi bi-x" />
                </button>
              )}
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <button
              className="btn ep-refresh-btn w-100"
              onClick={load}
              disabled={loading}
            >
              <i
                className={`bi ${loading ? "bi-arrow-repeat ep-spin" : "bi-arrow-clockwise"} me-2`}
              />{" "}
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-5 text-center text-muted">
            <span className="spinner-border spinner-border-sm me-2" />
            Loading events...
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
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-calendar-x display-6 d-block mb-2" />
            {events.length === 0
              ? "No events yet — create your first festival event."
              : "No events match your search."}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => {
                  const isActive = event.isActive === STATUS_VALUES.active;
                  const busy = actionLoadingId === event.id;
                  return (
                    <tr key={event.id}>
                      <td className="fw-semibold">{event.eventName}</td>
                      <td>
                        {event.startDate
                          ? new Date(event.startDate).toLocaleDateString(
                              "en-GB",
                            )
                          : "—"}
                      </td>

                      <td>
                        {event.endDate
                          ? new Date(event.endDate).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td>
                        <span
                          className={`ep-status ${isActive ? "ep-status--active" : "ep-status--disabled"}`}
                        >
                          <span /> {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button
                            className="btn ep-icon-btn ep-icon-btn--edit"
                            title="Edit"
                            onClick={() =>
                              navigate(`/admin/events/${event.id}/edit`)
                            }
                            disabled={busy}
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            className={`btn ep-icon-btn ${isActive ? "ep-icon-btn--disable" : "ep-icon-btn--enable"}`}
                            title={isActive ? "Deactivate" : "Activate"}
                            onClick={() => handleToggleStatus(event)}
                            disabled={busy}
                          >
                            <i
                              className={`bi ${isActive ? "bi-toggle-on" : "bi-toggle-off"}`}
                            />
                          </button>
                          <button
                            className="btn ep-icon-btn ep-icon-btn--delete"
                            title="Delete"
                            onClick={() => handleDelete(event)}
                            disabled={busy}
                          >
                            <i className="bi bi-trash3" />
                          </button>
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
    </div>
  );
}
