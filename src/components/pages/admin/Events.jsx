import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import DurationSelector from '../../utils/DurationSelector';
import StyledQRCode from '../../utils/StyledQRCode';
import { load, save } from '../../../services/api';
import { base_url } from '../../../config/appConfig';
import { encryptData } from "../../utils/Encryption";
// import { useParams } from 'react-router-dom';

function Events() {
    // TODO: replace with the real event id (from route params or the logged-in
    // organizer's context) once that wiring is in place. Previously this line
    // read `const { id } = 3`, which always evaluated to `id = undefined`, so
    // `event_id` was silently missing from every save payload.
    const id = 3; // event id from route if available
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
        // const id  = useParams(); // event id from route if available
        // const id = 2; // event id from route if available
        const organizerId = 14;

        if (organizerId) {
            // http://localhost/eDengiSystem/Event/getBy/event_organizer_id/14/true
            const loadurl = `Event/getBy/event_organizer_id/${organizerId}`;
            console.log("Loading from URL:", loadurl);

            // Load existing event
            load(loadurl).then((data) => {
                console.log("Loaded event data:", data); // 🔍 print data to console
                data = data[0];
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
                    (async () => {
                        const encId = await encryptData(data.random_event_id);
                        setQrDataUrl(base_url + '/admin/event/' + encId + '/new');
                    })();
                    //     (async () => {
                    //         const enc = await encryptData(text);
                    //     })();
                    // encId = await encryptData(data.random_event_id);
                    // setQrDataUrl(base_url + '/admin/event/' + enc + '/new');
                }
            });
        }
    }, [id]);


    const handleSave = async () => {
        // Basic validation: ensure all fields are filled if more details are shown
        if (
            !eventName || !fromDate || !toDate ||
            (showMoreDetails && (!eventSubTitle || !eventDescription || !fromTime || !toTime || !destination || !contact1 || !mapLink))
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const payload = {
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
            event_id: id || null, // send null for create
            event_online_payment_qr: paymentQR // send file
        };

        const res = await save("Event/save", payload);
        if (res) {
            alert("Event saved successfully!");
        } else {
            alert("Failed to save event.");
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
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3">
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-semibold">Dashboard</h4>
                </div>
            </div>

            <div className="col-12 my-3">
                <button className='btn btn-success' onClick={handleSave}>Save</button>
            </div>

            <div className="row event-form-flex mt-5">
                <div className="col-lg-8 col-md-8 col-sm-12 border-1 shadow rounded-4 pb-5" style={{ height: '75dvh', overflowY: 'scroll' }}>
                    <div className="my-3">
                        <input
                            type="text"
                            className="form-control fw-semibold fs-4"
                            placeholder="Festival/ event name"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />


                        <DurationSelector
                            value={durationData.duration}
                            fromTime={durationData.fromTime}
                            toTime={durationData.toTime}
                            onChange={setDurationData}
                        />

                        <div className='mt-3'>
                            <label className='form-label'>From date</label>
                            <input
                                type="date"
                                className='form-control'
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>

                        <div className='mt-3'>
                            <label className='form-label'>To date</label>
                            <input
                                type="date"
                                className='form-control'
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        <div className='mt-3 w-100 text-end'>
                            <button
                                className='btn border-primary text-primary'
                                onClick={() => setShowMoreDetails(!showMoreDetails)}
                            >
                                {showMoreDetails ? "Hide Details" : "More Details"}
                            </button>
                        </div>
                    </div>

                    {showMoreDetails && (
                        <div className="mt-3">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Event Sub Title"
                                value={eventSubTitle}
                                onChange={(e) => setEventSubTitle(e.target.value)}
                            />
                            <textarea
                                className="form-control mb-2"
                                placeholder="Event Description"
                                value={eventDescription}
                                onChange={(e) => setEventDescription(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Destination"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Contact Number 1"
                                value={contact1}
                                onChange={(e) => setContact1(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="Contact Number 2"
                                value={contact2}
                                onChange={(e) => setContact2(e.target.value)}
                            />
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Map Link"
                                value={mapLink}
                                onChange={(e) => setMapLink(e.target.value)}
                            />
                            {/* Payment QR Code Upload */}
                            <div className='mt-3'>
                                <label className='form-label'>Payment QR Code</label>
                                <input
                                    type="file"
                                    className='form-control'
                                    accept="image/*"
                                    onChange={handleQRChange}
                                />
                                {paymentQRPreview && (
                                    <div className='mt-2'>
                                        <img src={paymentQRPreview} alt="QR Preview" style={{ width: '150px', borderRadius: '10px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="no-bg-important my-3">

                        <div className="d-flex gap-3 flex-direction-adjust mt-3">
                            <div className="card shadow flex-fill-1 p-4">
                                <h4>Event Managers</h4>
                                <h1 className='text-success'>0</h1>
                            </div>
                            <div className="card shadow flex-fill-1 p-4">
                                <h4>Receipts</h4>
                                <h1 className='text-success'>0</h1>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="col-lg-4 col-md-4 col-sm-12 p-2 border-1 shadow rounded-4">
                    <div className="image-events-fluid w-100">
                        <StyledQRCode qrData={qrDataUrl} />
                    </div>
                    <p className='text-center'>Event Manager Registration</p>
                </div>
            </div>
        </div >
    );
}

export default Events;
