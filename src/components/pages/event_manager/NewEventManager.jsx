import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { decryptData } from '../../utils/Encryption'; // adjust path as needed

function NewEventManager() {
    const { eventid } = useParams(); // get the encoded event ID from route
    const [decodedEventId, setDecodedEventId] = useState(null);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        if (eventid) {
            try {
                const decoded = decryptData(eventid);
                setDecodedEventId(decoded);
                console.log("Decoded Event ID:", decoded);
            } catch (error) {
                console.error("Error decoding event ID:", error);
            }
        }
    }, [eventid]);

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3">
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-semibold">Dashboard</h4>
                    {decodedEventId && <p>Event ID: {decodedEventId}</p>}
                </div>
            </div>
        </div>
    );
}


export default NewEventManager;