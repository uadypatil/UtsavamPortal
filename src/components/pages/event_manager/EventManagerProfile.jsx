import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { donationsApi } from '../../../services/endpoints/donations';
import { apiErrorMessage } from '../../../services/httpClient';

/**
 * Previously showed hardcoded name/contact/stats and a "Logout" button
 * that just called browser-back (never actually cleared the session).
 * Now: real user identity from useAuth(), real stats derived from
 * GET /donations (no dedicated "my stats" endpoint is documented, so —
 * consistent with the Super Admin dashboard — this derives numbers from
 * the real list rather than inventing a summary call), and a Logout that
 * actually clears the session via useAuth().logout().
 */
function EventManagerProfile() {
    const navigate = useNavigate();
    const { getUser, logout } = useAuth();
    const user = getUser();
    const eventId = localStorage.getItem('eventId');

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    useEffect(() => {
        (async () => {
            setLoading(true);
            setError('');
            try {
                const params = {};
                if (eventId) params.eventId = eventId;
                if (user?.id) params.collectedBy = user.id;
                const data = await donationsApi.list(params);
                const list = Array.isArray(data) ? data : data?.items || [];
                setStats({
                    count: list.length,
                    total: list.reduce((sum, d) => sum + (Number(d.amount) || 0), 0),
                });
            } catch (e) {
                setError(apiErrorMessage(e, 'Unable to load your statistics.'));
            } finally {
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleBack = () => navigate('/em/dashboard');
    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 py-3 m-1">
            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <h2 className="mb-2">My Profile</h2>
                </div>
            </div>

            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6 col-md-6 col-sm-12 border-1 border-dark">
                    <div className="card">
                        <div className="card-body pb-0">
                            <p className='m-0 p-0 text-center'><small>Name</small></p>
                            <h4 className='text-center'>{user?.name || user?.username || '—'}</h4>

                            <p className='m-0 p-0 text-center'><small>Username</small></p>
                            <h5 className='text-center'>{user?.username || '—'}</h5>

                            {error ? (
                                <div className="alert alert-warning small mt-3">{error}</div>
                            ) : loading ? (
                                <div className="text-center text-muted py-3">
                                    <span className="spinner-border spinner-border-sm me-2" />Loading stats...
                                </div>
                            ) : (
                                <>
                                    <p className='m-0 p-0 text-center mt-2'><small>Registrations</small></p>
                                    <p className="display-4 fw-semibold text-center text-success">{stats?.count ?? 0}</p>

                                    <p className='m-0 p-0 text-center'><small>Collection</small></p>
                                    <p className="display-4 fw-semibold text-center text-danger">₹{stats?.total ?? 0}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row d-flex justify-content-center w-100 mx-0">
                <div className="col-lg-6">
                    <hr />
                    <div className="card">
                        <div className="card-body pb-3">
                            <p className='m-0 p-0'>
                                <a href='/privacy-policy' target="_blank" rel="noreferrer">Privacy Policy</a>
                            </p>
                            <p className='m-0 p-0'>
                                <a href='/terms-of-use' target="_blank" rel="noreferrer">Terms of Use</a>
                            </p>
                        </div>

                        <div className="card-body pb-3">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <button className='btn btn-secondary btn-sm' onClick={handleBack}>back</button>
                                </div>

                                <div>
                                    <button className='btn btn-light border-danger text-danger btn-sm' onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EventManagerProfile;
