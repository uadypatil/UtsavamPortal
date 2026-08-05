import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api_url from '../../config/apiConfig';

const EventCard = ({ image, title, description, address, link }) => {
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 p-3">
            <div className="card shadow h-100 rounded-0">
                <div className="card-img-top p-3 bg-light text-center">
                    <img src={`${api_url}/uploads/images/events/` + image} alt={title} className="img-fluid" />
                </div>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">{description}</p>
                    <p className="card-text">
                        <span className="fw-semibold">Address:</span> {address}
                    </p>
                    <p className="card-text">
                        <a href={link} target="_blank" rel="noopener noreferrer">Follow link</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
