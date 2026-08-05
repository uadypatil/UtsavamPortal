// NewEventModal.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../app.css';
import { Modal, Button } from 'react-bootstrap';

const NewEventModal = ({ show, handleClose }) => {
    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            animation={true} // enables fade animation
        >
            <Modal.Header closeButton>
                <Modal.Title>Create New Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Your form or content here */}
                <p>Event creation form will go here.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="success">
                    Save Event
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default NewEventModal;
