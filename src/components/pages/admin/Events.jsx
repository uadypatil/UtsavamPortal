import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AOS from "aos";
import "aos/dist/aos.css";
import "../../../App.css";
import { eventsApi } from "../../../services/endpoints/events";
import { apiErrorMessage } from "../../../services/httpClient";
import { useToast } from "../../../context/ToastContext";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

/**
 * Event create/edit form.
 * Fields on CreateEventInput:
 *   seasonId, eventName, organizingMandalName, eventOrganizerId,
 *   description, startDate, endDate.
 * seasonId + eventOrganizerId come from the authenticated user (useAuth()),
 * never hardcoded. If either is missing, save is blocked with a clear error.
 */
function Events() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const isEditing = !!eventId;

  const seasonId = user?.seasonId;
  const eventOrganizerId = user?.id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  // Form States
  const [eventName, setEventName] = useState("");
  const [organizingMandalName, setOrganizingMandalName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (!isEditing) {
      setLoading(false);
      return; // creating a new event — nothing to load
    }

    setLoading(true);
    eventsApi
      .get(eventId)
      .then((data) => {
        if (data) {
          setEventName(data.eventName || "");
          setOrganizingMandalName(data.organizingMandalName || "");
          setDescription(data.description || "");
          setStartDate(data.startDate ? data.startDate.substring(0, 10) : "");
          setEndDate(data.endDate ? data.endDate.substring(0, 10) : "");
        }
      })
      .catch((error) => {
        toast.error(apiErrorMessage(error, "Unable to load this event."));
      })
      .finally(() => setLoading(false));
  }, [eventId, isEditing]);

  const handleSave = async () => {
    if (!eventName || !startDate || !endDate) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!seasonId || !eventOrganizerId) {
      // Deliberately does NOT fall back to a hardcoded id — saving
      // without a real season/organizer would attach this event
      // to the wrong owner.
      toast.error(
        "Your session is missing season/organizer info. Please sign in again.",
      );
      return;
    }

    console.log(eventOrganizerId)
    const payload = {
      seasonId,
      eventName,
      organizingMandalName: organizingMandalName || undefined,
      eventOrganizerId,
      description: description || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    setSaving(true);
    try {
      if (isEditing) {
        await eventsApi.update(eventId, payload);
        toast.success("Event updated successfully!");
      } else {
        const created = await eventsApi.create(payload);
        toast.success("Event created successfully!");
        if (created?.id)
          navigate(`/admin/events/${created.id}/edit`, { replace: true });
      }
    } catch (error) {
      toast.error(apiErrorMessage(error, "Failed to save event."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">
      {/* Page Header */}
      <div className="ep-festive-banner mb-4" data-aos="fade-up">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h4 className="fw-bold mb-1 position-relative">
              🪔 {isEditing ? "Edit Event" : "Create Event"}
            </h4>
            <p className="mb-0 opacity-90 position-relative">
              {isEditing
                ? "Update your festival event details."
                : "Create a new Ganpati festival event."}
            </p>
          </div>

          <button
            type="button"
            className="btn ep-action-btn ep-action-btn--indigo px-4"
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check2-circle me-2"></i>Save Event
              </>
            )}
          </button>
        </div>
      </div>

      {/* Event Form */}
      <div className="row g-4">
        <div className="col-12" data-aos="fade-up">
          <div className="ep-chart-card">
            {/* Section Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h6 className="fw-bold mb-1">
                  <i className="bi bi-calendar-event me-2"></i>
                  Event Details
                </h6>

                <span className="text-muted small">
                  Configure your festival event information.
                </span>
              </div>

              <span className="ep-badge ep-badge--indigo">
                <i className="bi bi-pencil-square me-1"></i>
                Event
              </span>
            </div>

            {/* Event Name */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Festival / Event Name
              </label>

              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter festival or event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            {/* Organizing Mandal */}
            <div className="mb-4">
              <label className="form-label fw-semibold">
                Organizing Mandal Name
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter organizing mandal name"
                value={organizingMandalName}
                onChange={(e) => setOrganizingMandalName(e.target.value)}
              />
            </div>

            {/* Dates */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Start Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">End Date</label>

                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="form-label fw-semibold">Description</label>

              <textarea
                className="form-control"
                rows="4"
                placeholder="Describe your festival event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Statistics */}
      <div className="row g-4 mt-1">
        <div className="col-md-6 col-sm-12" data-aos="fade-up">
          <div className="ep-stat-mini ep-stat-mini--teal">
            <div className="ep-stat-mini__icon">
              <i className="bi bi-people-fill"></i>
            </div>

            <div>
              <span className="text-muted small d-block">Event Managers</span>

              <h3 className="fw-bold mb-0">0</h3>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-sm-12" data-aos="fade-up">
          <div className="ep-stat-mini ep-stat-mini--indigo">
            <div className="ep-stat-mini__icon">
              <i className="bi bi-receipt"></i>
            </div>

            <div>
              <span className="text-muted small d-block">Receipts</span>

              <h3 className="fw-bold mb-0">0</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Events;
