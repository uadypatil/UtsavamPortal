import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';
import api_url from '../../config/apiConfig';
import { useToast } from '../../context/ToastContext';
import logo from '../../assets/logo.png';

function SignUp() {
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState({
        // Event Manager fields
        event_id: 'EVISCNSK001',
        event_manager_name: '',
        event_manager_contact_number: '',
        username: '',
        password: '',
        agreement: false,

        // Doner fields
        event_organizer_name: '',
        event_organizer_contact: '',
        doner_username: '',
        doner_password: '',
        doner_agreement: false
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showDonerPassword, setShowDonerPassword] = useState(false);
    const [submittingManager, setSubmittingManager] = useState(false);
    const [submittingDoner, setSubmittingDoner] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.event_manager_name) newErrors.event_manager_name = 'Please enter the organizer name.';
        if (!formData.event_manager_contact_number) newErrors.event_manager_contact_number = 'Enter valid 10-digit contact.';
        if (!formData.username) newErrors.username = 'Please create a username.';
        if (!formData.password) newErrors.password = 'Please create a password.';
        if (!formData.agreement) newErrors.agreement = 'You must agree before submitting.';
        return newErrors;
    };

    const validateDoner = () => {
        const newErrors = {};
        if (!formData.event_organizer_name) newErrors.event_organizer_name = 'Please enter the full name.';
        if (!formData.event_organizer_contact) newErrors.event_organizer_contact = 'Please enter a contact number.';
        if (!formData.doner_username) newErrors.doner_username = 'Please create a username.';
        if (!formData.doner_password) newErrors.doner_password = 'Please create a password.';
        if (!formData.doner_agreement) newErrors.doner_agreement = 'You must agree before submitting.';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        const fieldValue = type === 'checkbox' ? checked : type === 'file' ? files[0] : value;
        setFormData((prev) => ({ ...prev, [name]: fieldValue }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    useEffect(() => {
        AOS.init({ duration: 900, once: true });
    }, []);

    const redirectRef = useRef(null);
    const [showForm, setShowForm] = useState(false);
    const [showDonerForm, setDonerShowForm] = useState(false);

    const loadEventForm = () => {
        redirectRef.current.style.display = 'none';
        setShowForm(true);
    };

    const loadDonerForm = () => {
        redirectRef.current.style.display = 'none';
        setDonerShowForm(true);
    };

    const goBackToSelection = () => {
        setShowForm(false);
        setDonerShowForm(false);
        setErrors({});
        if (redirectRef.current) redirectRef.current.style.display = 'flex';
    };

    // HANDLE SUBMIT FOR ADD EVENT MANAGER FORM
    const handleEventManagerSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmittingManager(true);
        try {
            const response = await axios.post(api_url + 'EventManager/save', {
                event_id: formData.event_id,
                event_manager_name: formData.event_manager_name,
                event_manager_contact_number: formData.event_manager_contact_number,
                username: formData.username,
                password: formData.password,
            });

            if (response.data.status == "success") {
                toast.success('Sign up successful! Please sign in.');
                navigate('/signin');
            } else {
                toast.error('Failed to sign up. Please try again.');
                console.log(response.data);
            }
        } catch (error) {
            console.error('API error:', error);
            toast.error('Something went wrong. Please check your details and try again.');
        } finally {
            setSubmittingManager(false);
        }
    };

    const handleDonerSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateDoner();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setSubmittingDoner(true);
        try {
            // Was pointed at a hardcoded localhost URL that didn't match the app's
            // configured API host — now uses the same api_url as everything else.
            const response = await axios.post(api_url + 'EventOrganizer/save', {
                organizer_name: formData.event_organizer_name,
                organizer_contact_number: formData.event_organizer_contact,
                username: formData.doner_username,
                password: formData.doner_password,
            });

            if (response.data.status === 'success') {
                toast.success('Sign up successful! Please sign in.');
                navigate('/signin');
            } else {
                toast.error('Sign up failed. Please try again.');
            }
        } catch (error) {
            console.error('API error:', error);
            toast.error('An error occurred during signup.');
        } finally {
            setSubmittingDoner(false);
        }
    };

    const renderAddEventForm = () => (
        <div className="ep-glass-card overflow-hidden" data-aos="zoom-in-up">
            <div className="ep-festive-accent-bar"></div>
            <div className="p-4 p-md-5" style={{ maxHeight: '82dvh', overflowY: 'auto' }}>
                <button type="button" className="btn btn-sm btn-light mb-3" onClick={goBackToSelection}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                </button>
                <h1 className="h3 fw-bold text-center mb-1">Register Event Manager</h1>
                <p className="text-muted text-center mb-4">Create login credentials to manage this event's receipts</p>

                <form onSubmit={handleEventManagerSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Full Name</label>
                        <input
                            type="text"
                            name="event_manager_name"
                            value={formData.event_manager_name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={`form-control ${errors.event_manager_name ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.event_manager_name && <div className="ep-field-error">{errors.event_manager_name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contact Number</label>
                        <input
                            type="text"
                            name="event_manager_contact_number"
                            value={formData.event_manager_contact_number}
                            onChange={handleChange}
                            placeholder="Enter 10-digit contact number"
                            className={`form-control ${errors.event_manager_contact_number ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.event_manager_contact_number && <div className="ep-field-error">{errors.event_manager_contact_number}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Create Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className={`form-control ${errors.username ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.username && <div className="ep-field-error">{errors.username}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Create Password</label>
                        <div className="ep-input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Choose a password"
                                className={`form-control ${errors.password ? 'ep-field-invalid' : ''}`}
                            />
                            <button type="button" className="ep-input-icon-btn" tabIndex={-1}
                                onClick={() => setShowPassword((s) => !s)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {errors.password && <div className="ep-field-error">{errors.password}</div>}
                    </div>

                    <div className="mb-3 d-flex gap-2 align-items-start">
                        <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="form-check-input mt-1" />
                        <label className="form-label mb-0">I agree to the terms and confirm my details are accurate.</label>
                    </div>
                    {errors.agreement && <div className="ep-field-error mb-2">{errors.agreement}</div>}

                    <button type="submit" className="btn btn-festive w-100 py-2 mt-2" disabled={submittingManager}>
                        {submittingManager ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                        ) : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );

    const renderAddDonerForm = () => (
        <div className="ep-glass-card overflow-hidden" data-aos="zoom-in-up">
            <div className="ep-festive-accent-bar"></div>
            <div className="p-4 p-md-5" style={{ maxHeight: '82dvh', overflowY: 'auto' }}>
                <button type="button" className="btn btn-sm btn-light mb-3" onClick={goBackToSelection}>
                    <i className="bi bi-arrow-left me-1"></i> Back
                </button>
                <h1 className="h3 fw-bold text-center mb-1">Register Event Organizer</h1>
                <p className="text-muted text-center mb-4">Set up your organizer account for this festival</p>

                <form onSubmit={handleDonerSubmit} noValidate>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Full Name</label>
                        <input
                            type="text"
                            name="event_organizer_name"
                            value={formData.event_organizer_name}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            className={`form-control ${errors.event_organizer_name ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.event_organizer_name && <div className="ep-field-error">{errors.event_organizer_name}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Contact Number</label>
                        <input
                            type="text"
                            name="event_organizer_contact"
                            value={formData.event_organizer_contact}
                            onChange={handleChange}
                            placeholder="Enter contact number"
                            className={`form-control ${errors.event_organizer_contact ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.event_organizer_contact && <div className="ep-field-error">{errors.event_organizer_contact}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Username</label>
                        <input
                            type="text"
                            name="doner_username"
                            value={formData.doner_username}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            className={`form-control ${errors.doner_username ? 'ep-field-invalid' : ''}`}
                        />
                        {errors.doner_username && <div className="ep-field-error">{errors.doner_username}</div>}
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="ep-input-group">
                            <input
                                type={showDonerPassword ? 'text' : 'password'}
                                name="doner_password"
                                value={formData.doner_password}
                                onChange={handleChange}
                                placeholder="Choose a password"
                                className={`form-control ${errors.doner_password ? 'ep-field-invalid' : ''}`}
                            />
                            <button type="button" className="ep-input-icon-btn" tabIndex={-1}
                                onClick={() => setShowDonerPassword((s) => !s)}
                                aria-label={showDonerPassword ? 'Hide password' : 'Show password'}>
                                <i className={`bi ${showDonerPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                            </button>
                        </div>
                        {errors.doner_password && <div className="ep-field-error">{errors.doner_password}</div>}
                    </div>

                    <div className="mb-3 d-flex gap-2 align-items-start">
                        <input
                            type="checkbox"
                            name="doner_agreement"
                            checked={formData.doner_agreement}
                            onChange={handleChange}
                            className="form-check-input mt-1"
                        />
                        <label className="form-label mb-0">I agree to the terms and confirm my details are accurate.</label>
                    </div>
                    {errors.doner_agreement && <div className="ep-field-error mb-2">{errors.doner_agreement}</div>}

                    <button type="submit" className="btn btn-festive w-100 py-2 mt-2" disabled={submittingDoner}>
                        {submittingDoner ? (
                            <><span className="spinner-border spinner-border-sm me-2"></span>Submitting...</>
                        ) : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );

    return (
        <div className="ep-festive-bg d-flex align-items-center justify-content-center py-5 px-3">
            {!showForm && !showDonerForm && (
                <div className="ep-glass-card p-4 p-md-5" ref={redirectRef} style={{ maxWidth: 720 }} data-aos="fade-up">
                    <div className="text-center mb-4">
                        <img src={logo} alt="ePavti Book" style={{ width: 120 }} />
                        <h1 className="h3 fw-bold mt-3 mb-1">Create an Account</h1>
                        <p className="text-muted">Choose how you'll be using ePavti Book</p>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div
                                onClick={loadDonerForm}
                                className="card border-0 shadow-sm text-center h-100 ep-transition"
                                style={{ cursor: 'pointer' }}
                                role="button"
                                data-aos="fade-right"
                            >
                                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                                    <i className="bi bi-person-badge" style={{ fontSize: '2rem', color: 'var(--ep-festive-vermilion)' }}></i>
                                    <p className="text-muted mb-1 mt-3">Register As</p>
                                    <h5 className="fw-bold mb-0">Event Organizer</h5>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div
                                onClick={loadEventForm}
                                className="card border-0 shadow-sm text-center h-100 ep-transition"
                                style={{ cursor: 'pointer' }}
                                role="button"
                                data-aos="fade-left"
                            >
                                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                                    <i className="bi bi-person-workspace" style={{ fontSize: '2rem', color: 'var(--ep-festive-vermilion)' }}></i>
                                    <p className="text-muted mb-1 mt-3">Register As</p>
                                    <h5 className="fw-bold mb-0">Event Manager</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-muted mt-4 mb-0">
                        Already have an account? <Link to="/signin" className="fw-semibold">Sign in</Link>
                    </p>
                </div>
            )}

            {showForm && <div style={{ width: '100%', maxWidth: 560 }}>{renderAddEventForm()}</div>}
            {showDonerForm && <div style={{ width: '100%', maxWidth: 560 }}>{renderAddDonerForm()}</div>}
        </div>
    );
}

export default SignUp;
