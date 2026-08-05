import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import NavbarCustom from '../includes/NavbarCustom';
import EventCard from '../../utils/EventCard';

import { fetchEvents } from '../../../services/api';

function WebsiteEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });

        const getEvents = async () => {
            const data = await fetchEvents();
            setEvents(data);
        };

        getEvents(); // initial load

        // Refresh every 1 second
        const interval = setInterval(getEvents, 5000);

        // Cleanup on unmount
        return () => clearInterval(interval);
    }, []);


    // const [events, setEvents] = useState([]);

    // useEffect(() => {
    //     AOS.init({ duration: 1000, once: true });

    //     // Local events array
    //     const localEvents = [
    //         {
    //             event_monetize_qr_path: 'uploads/images/events/online_qr_evt0001.jpeg',
    //             event_sub_title: 'Ganesh Utsav 2025',
    //             event_description: 'A grand celebration with cultural programs and decorations.',
    //             event_destination: 'Shree Ganesh Mandir, Pune',
    //             event_location_map_link: 'https://maps.google.com'
    //         },
    //         {
    //             event_monetize_qr_path: 'uploads/images/events/online_qr_evt0001.jpeg',
    //             event_sub_title: 'Diwali Mela',
    //             event_description: 'Festive stalls, fireworks, and music performances.',
    //             event_destination: 'Shivaji Nagar Ground, Mumbai',
    //             event_location_map_link: 'https://maps.google.com'
    //         }
    //     ];

    //     setEvents(localEvents);
    // }, []);


    return (
        <>
            <NavbarCustom />

            <div className="website-events-main-wrapper">
                <div className="container">
                    <div className="row mt-3 mx-2">
                        <div className="col-12">
                            <h1 className="text-center">Live Events</h1>
                        </div>
                    </div>

                    {/* SEARCH NEARBY EVENTS */}
                    <div className="row mt-3 card py-4 mx-2 shadow">
                        <div className="col-12">
                            <h3 className="text-center">Search nearby events</h3>
                        </div>
                        <div className="col-12 mt-3">
                            <div className="d-flex justify-content-center">
                                <div className="d-flex gap-4 w-75 search-nearby-events-fields">
                                    <select name="" id="" className="form-control" defaultValue="">
                                        <option value="" disabled>
                                            Select city name
                                        </option>
                                    </select>

                                    <select name="" id="" className="form-control" defaultValue="">
                                        <option value="" disabled>
                                            Select event name
                                        </option>
                                    </select>

                                    <button className="btn btn-success">Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Render cards dynamically */}
                <div className="container mt-3">
                    <div className="row justify-content-center">
                        {events.length > 0 ? (
                            events.map((event, index) => (
                                <EventCard
                                    key={index}
                                    image={event.event_monetize_qr_path} // image URL from API
                                    title={event.event_sub_title}
                                    description={event.event_description}
                                    address={event.event_destination}
                                    link={event.event_location_map_link}
                                />
                            ))
                        ) : (
                            <div className="text-center mt-4">
                                <p>No events found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default WebsiteEvents;
