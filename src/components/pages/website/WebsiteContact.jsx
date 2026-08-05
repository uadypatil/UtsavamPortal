import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Required for dropdowns & toggler
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import NavbarCustom from '../includes/NavbarCustom';
import EventCard from '../../utils/EventCard'
import GuideUtility from '../../utils/GuideUtility';
import ChatBot from '../../utils/ChatBot';


function WebsiteContact() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration in ms
            once: true,     // whether animation should happen only once
        });
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Message sent!');
    };

    return (
        <>
            <NavbarCustom />

            <div className="website-events-main-wrapper">
                <div className="container">
                    <div className="row mt-3 mx-2">
                        <div className="col-12">
                            <h1 className="text-center">
                                Contact Us
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container-fluid">

                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            {/* SEARCH NERABY EVENTS */}
                            <div className="row mt-3 card py-4 mx-2 shadow" style={{ height: '70dvh' }}>
                                <form
                                    onSubmit={handleSubmit}
                                    className="contact-form mx-auto p-3 animate__animated animate__fadeInUp"
                                    style={{ width: '100%', maxWidth: '600px' }}
                                >
                                    <h4 className="text-center mb-4">📬 Contact Us</h4>

                                    <div className="form-group mb-3">
                                        <label className="form-label">Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="4"
                                            placeholder="Your message"
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary px-4 py-2 shadow">
                                            Send Message ✉️
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            {/* SEARCH NEARBY EVENTS */}
                            <div
                                className="row mt-3 py-4 mx-2 shadow contact-info animate__animated animate__fadeInRight"
                                style={{
                                    height: '70dvh',
                                    background: '#f8f9fa',
                                    borderRadius: '12px',
                                    overflowY: 'auto',
                                    padding: '2rem',
                                }}
                            >
                                <h4 className="fw-bold text-primary mb-3">👤 UDAY PATIL</h4>

                                <ul className="list-unstyled fs-6">
                                    <li className="mb-2">
                                        <strong>Email:</strong> udaypatil@example.com
                                    </li>
                                    <li className="mb-2">
                                        <strong>Phone:</strong> +91 98765 43210
                                    </li>
                                    <li className="mb-2">
                                        <strong>Location:</strong> Jalgaon, Maharashtra, India
                                    </li>
                                    <li className="mb-2">
                                        <strong>LinkedIn:</strong>{' '}
                                        <a href="https://linkedin.com/in/udaypatil" target="_blank" rel="noreferrer">
                                            linkedin.com/in/udaypatil
                                        </a>
                                    </li>
                                    <li className="mb-2">
                                        <strong>GitHub:</strong>{' '}
                                        <a href="https://github.com/udaypatil" target="_blank" rel="noreferrer">
                                            github.com/udaypatil
                                        </a>
                                    </li>
                                </ul>

                            </div>
                        </div>

                    </div>
                </div>



            </div>


        </>
    );
}

export default WebsiteContact;