import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';

const FeedbackForm = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    email: '',
    feedbackType: '',
    message: '',
    agreement: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Please enter your full name.';
    if (!formData.contactNumber.match(/^\d{10}$/)) newErrors.contactNumber = 'Enter a valid 10-digit contact number.';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Enter a valid email address.';
    if (!formData.feedbackType) newErrors.feedbackType = 'Please select a feedback type.';
    if (!formData.message) newErrors.message = 'Please enter your message.';
    if (!formData.agreement) newErrors.agreement = 'You must agree before submitting.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Feedback submitted:', formData);
      setSubmitted(true);
      setErrors({});
      // Optionally reset form
      setFormData({
        fullName: '',
        contactNumber: '',
        email: '',
        feedbackType: '',
        message: '',
        agreement: false,
      });
    } else {
      setErrors(validationErrors);
      setSubmitted(false);
    }
  };

  return (
    <div className="formbody" data-aos="fade-up">
      <form onSubmit={handleSubmit} className="registration-form" noValidate>
        <h2 className="mb-4">Give Your Feedback</h2>

        <div className="form-group mb-3">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-control"
          />
          {errors.fullName && <span className="error text-danger">{errors.fullName}</span>}
        </div>

        <div className="form-group mb-3">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="form-control"
          />
          {errors.contactNumber && <span className="error text-danger">{errors.contactNumber}</span>}
        </div>

        <div className="form-group mb-3">
          <label>Email (optional)</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <span className="error text-danger">{errors.email}</span>}
        </div>

        <div className="form-group mb-3">
          <label>Feedback Type</label>
          <select
            name="feedbackType"
            value={formData.feedbackType}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Type</option>
            <option value="Suggestion">Suggestion</option>
            <option value="Complaint">Complaint</option>
            <option value="Appreciation">Appreciation</option>
            <option value="Other">Other</option>
          </select>
          {errors.feedbackType && <span className="error text-danger">{errors.feedbackType}</span>}
        </div>

        <div className="form-group mb-3">
          <label>Feedback Message</label>
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="form-control"
          />
          {errors.message && <span className="error text-danger">{errors.message}</span>}
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="agreement"
            checked={formData.agreement}
            onChange={handleChange}
            id="agreementCheck"
          />
          <label className="form-check-label" htmlFor="agreementCheck">
            I agree that the feedback provided is genuine and constructive.
          </label>
          {errors.agreement && <span className="error text-danger d-block">{errors.agreement}</span>}
        </div>

        <div className="form-group">
          <button type="submit" className="btn btn-primary">Submit Feedback</button>
        </div>

        {submitted && <div className="alert alert-success mt-3">Thank you! Your feedback has been submitted.</div>}
      </form>
    </div>
  );
};

export default FeedbackForm;
