import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import DurationSelector from '../../utils/DurationSelector';
import StyledQRCode from '../../utils/StyledQRCode';
import { eventsApi } from '../../../services/endpoints/events';
import { apiErrorMessage } from '../../../services/httpClient';
import { useToast } from '../../../context/ToastContext';
import { base_url } from '../../../config/appConfig';
import { encryptData } from "../../utils/Encryption";
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Event create/edit form. Previously this always operated on a single
 * hardcoded event (`const id = 3`) and a hardcoded `organizerId = 14` —
 * meaning the organizer could never manage more than one festival/year.
 * Now:
 *  - `eventId` comes from the route (/admin/events/:eventId/edit); absent
 *    means "create new event" (see routes/AppRoutes.jsx).
 *  - `eventOrganizerId` comes from the authenticated organizer's stored
 *    profile rather than a literal constant. If that value isn't present
 *    yet (e.g. the login response doesn't carry it), this intentionally
 *    does NOT fall back to a hardcoded id — it blocks save with a clear
 *    error instead of silently attaching the wrong organizer's event.
 * The list/browse experience (multiple events) now lives in EventsList.jsx,
 * reached from the sidebar's "Event" item.
 */
function Events() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const isEditing = !!eventId;
    const organizerId = localStorage.getItem('eventOrganizerId');

    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [durationData, setDurationData] = useState({
        duration: '',
        fromTime: '',
        toTime: ''
    });

    // Form States
    const [eventName, setEventName] = useState('');
    const [eventSubTitle, setEventSubTitle] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromTime, setFromTime] = useState('');
    const [toTime, setToTime] = useState('');
    const [destination, setDestination] = useState('');
    const [contact1, setContact1] = useState('');
    const [contact2, setContact2] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [duration, setDuration] = useState('');
    const [randomEventId, setRandomEventId] = useState('');
    const [showMoreDetails, setShowMoreDetails] = useState(false);
    const [paymentQR, setPaymentQR] = useState(null);
    const [paymentQRPreview, setPaymentQRPreview] = useState('');
    const [qrDataUrl, setQrDataUrl] = useState('');


    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        if (!isEditing) {
            setLoading(false);
            return; // creating a new event — nothing to load
        }

        setLoading(true);
        eventsApi.get(eventId).then((data) => {
            if (data) {
                setEventName(data.event_name || '');
                setEventSubTitle(data.event_sub_title || '');
                setEventDescription(data.event_description || '');
                setFromDate(data.event_date_from || '');
                setToDate(data.event_date_to || '');
                setFromTime(data.event_time_from || '');
                setToTime(data.event_time_to || '');
                setDestination(data.event_destination || '');
                setContact1(data.event_contact_number_1 || '');
                setContact2(data.event_contact_number_2 || '');
                setMapLink(data.event_location_map_link || '');
                setDuration(data.duration || '');
                setDurationData(prev => ({
                    ...prev,
                    fromTime: data.event_time_from,
                    toTime: data.event_time_to,
                }));

                setPaymentQR(null);
                setPaymentQRPreview('');
                setRandomEventId(data.random_event_id);
                if (data.random_event_id) {
                    (async () => {
                        const encId = await encryptData(data.random_event_id);
                        setQrDataUrl(base_url + '/admin/event/' + encId + '/new');
                    })();
                }
            }
        }).catch((error) => {
            toast.error(apiErrorMessage(error, 'Unable to load this event.'));
        }).finally(() => setLoading(false));
    }, [eventId, isEditing]);


    const handleSave = async () => {
        // Basic validation: ensure all fields are filled if more details are shown
        if (
            !eventName || !fromDate || !toDate ||
            (showMoreDetails && (!eventSubTitle || !eventDescription || !fromTime || !toTime || !destination || !contact1 || !mapLink))
        ) {
            toast.error("Please fill all required fields.");
            return;
        }

        if (!organizerId) {
            // Deliberately does NOT fall back to a hardcoded organizer id —
            // saving without one would attach this event to whichever
            // organizer the backend happens to default to.
            toast.error("Your organizer profile isn't available in this session. Please sign in again.");
            return;
        }

        const payload = {
            event_organizer_id: organizerId,
            event_name: eventName,
            event_sub_title: eventSubTitle,
            event_description: eventDescription,
            event_date_from: fromDate,
            event_date_to: toDate,
            event_time_from: fromTime,
            event_time_to: toTime,
            event_destination: destination,
            event_contact_number_1: contact1,
            event_contact_number_2: contact2,
            event_location_map_link: mapLink,
            duration: duration,
            random_event_id: randomEventId,
            event_online_payment_qr: paymentQR // send file
        };

        setSaving(true);
        try {
            if (isEditing) {
                await eventsApi.update(eventId, payload);
                toast.success("Event updated successfully!");
            } else {
                const created = await eventsApi.create(payload);
                toast.success("Event created successfully!");
                if (created?.id) navigate(`/admin/events/${created.id}/edit`, { replace: true });
            }
        } catch (error) {
            toast.error(apiErrorMessage(error, 'Failed to save event.'));
        } finally {
            setSaving(false);
        }
    };

    const handleQRChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentQR(file);
            setPaymentQRPreview(URL.createObjectURL(file));
        }
    };
return (
    <div className="wrap-content h-auto w-100 border-3 border-secondary shadow rounded-5 p-3 p-md-4">

        {/* Page Header */}
        <div className="ep-festive-banner mb-4" data-aos="fade-up">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div>
                    <h4 className="fw-bold mb-1 position-relative">
                        🪔 {isEditing ? 'Edit Event' : 'Create Event'}
                    </h4>
                    <p className="mb-0 opacity-90 position-relative">
                        {isEditing ? 'Update your festival event details.' : 'Create a new Ganpati festival event.'}
                    </p>
                </div>

                <button
                    type="button"
                    className="btn ep-action-btn ep-action-btn--indigo px-4"
                    onClick={handleSave}
                    disabled={saving || loading}
                >
                    {saving ? (
                        <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                    ) : (
                        <><i className="bi bi-check2-circle me-2"></i>Save Event</>
                    )}
                </button>
            </div>
        </div>

        {/* Main Event Area */}
        <div className="row g-4">

            {/* Event Form */}
            <div
                className="col-lg-8 col-md-7 col-sm-12"
                data-aos="fade-up"
            >
                <div className="ep-chart-card h-100">

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

                    {/* Duration */}
                    <div className="mb-4">
                        <label className="form-label fw-semibold">
                            <i className="bi bi-clock me-1"></i>
                            Event Duration
                        </label>

                        <DurationSelector
                            value={durationData.duration}
                            fromTime={durationData.fromTime}
                            toTime={durationData.toTime}
                            onChange={setDurationData}
                        />
                    </div>

                    {/* Dates */}
                    <div className="row g-3">

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                From Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                To Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                    </div>

                    {/* More Details */}
                    <div className="d-flex justify-content-end mt-4">
                        <button
                            type="button"
                            className="btn ep-outline-btn"
                            onClick={() => setShowMoreDetails(!showMoreDetails)}
                        >
                            <i
                                className={`bi ${
                                    showMoreDetails
                                        ? 'bi-chevron-up'
                                        : 'bi-chevron-down'
                                } me-2`}
                            ></i>

                            {showMoreDetails
                                ? 'Hide Additional Details'
                                : 'Show Additional Details'}
                        </button>
                    </div>

                    {/* Additional Details */}
                    {showMoreDetails && (
                        <div className="ep-details-section mt-4 pt-4">

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Event Subtitle
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter event subtitle"
                                    value={eventSubTitle}
                                    onChange={(e) =>
                                        setEventSubTitle(e.target.value)
                                    }
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Event Description
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Describe your festival event"
                                    value={eventDescription}
                                    onChange={(e) =>
                                        setEventDescription(e.target.value)
                                    }
                                />
                            </div>

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Destination
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Event destination"
                                        value={destination}
                                        onChange={(e) =>
                                            setDestination(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Map Link
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Google Maps link"
                                        value={mapLink}
                                        onChange={(e) =>
                                            setMapLink(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Contact Number 1
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Primary contact number"
                                        value={contact1}
                                        onChange={(e) =>
                                            setContact1(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">
                                        Contact Number 2
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Secondary contact number"
                                        value={contact2}
                                        onChange={(e) =>
                                            setContact2(e.target.value)
                                        }
                                    />
                                </div>

                            </div>

                            {/* Payment QR */}
                            <div className="mt-4">
                                <label className="form-label fw-semibold">
                                    <i className="bi bi-qr-code me-1"></i>
                                    Payment QR Code
                                </label>

                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleQRChange}
                                />

                                {paymentQRPreview && (
                                    <div className="mt-3">
                                        <div className="small text-muted mb-2">
                                            QR Preview
                                        </div>

                                        <div className="ep-qr-preview">
                                            <img
                                                src={paymentQRPreview}
                                                alt="QR Preview"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                </div>
            </div>

            {/* QR / Registration Card */}
            <div
                className="col-lg-4 col-md-5 col-sm-12"
                data-aos="fade-up"
            >
                <div className="ep-chart-card h-100 d-flex flex-column">

                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h6 className="fw-bold mb-1">
                                Event Manager Registration
                            </h6>

                            <span className="text-muted small">
                                Scan this QR code to register.
                            </span>
                        </div>

                        <span className="ep-badge ep-badge--teal">
                            <i className="bi bi-qr-code"></i>
                        </span>
                    </div>

                    <div className="ep-qr-container flex-grow-1 d-flex align-items-center justify-content-center">
                        <StyledQRCode qrData={qrDataUrl} />
                    </div>

                    <div className="text-center mt-3">
                        <span className="text-muted small">
                            Event Manager Registration QR
                        </span>
                    </div>

                </div>
            </div>

        </div>

        {/* Event Statistics */}
        <div className="row g-4 mt-1">

            <div
                className="col-md-6 col-sm-12"
                data-aos="fade-up"
            >
                <div className="ep-stat-mini ep-stat-mini--teal">
                    <div className="ep-stat-mini__icon">
                        <i className="bi bi-people-fill"></i>
                    </div>

                    <div>
                        <span className="text-muted small d-block">
                            Event Managers
                        </span>

                        <h3 className="fw-bold mb-0">
                            0
                        </h3>
                    </div>
                </div>
            </div>

            <div
                className="col-md-6 col-sm-12"
                data-aos="fade-up"
            >
                <div className="ep-stat-mini ep-stat-mini--indigo">
                    <div className="ep-stat-mini__icon">
                        <i className="bi bi-receipt"></i>
                    </div>

                    <div>
                        <span className="text-muted small d-block">
                            Receipts
                        </span>

                        <h3 className="fw-bold mb-0">
                            0
                        </h3>
                    </div>
                </div>
            </div>

        </div>

    </div>
);
}

export default Events;
