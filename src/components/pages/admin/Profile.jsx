import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import AdminSidebar from '../includes/AdminSidebar';

function Profile() {


    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <div className="wrap-content h-100 w-100 border-3 border-secondary shadow rounded-5 p-3">
            <div className="row">
                <div className="col-12">
                    <h4 className="fw-semibold">Profile</h4>
                </div>
            </div>

            <div className="row d-flex justify-content-center w-100">
                <div className="col-lg-6 col-md-6 col-sm-6 col-6 border-1 border-dark">
                    <div className="card">
                        <div className="card-body">
                            <h4>
                                About Application
                            </h4>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus, quod! Harum deserunt culpa pariatur reiciendis ipsam ut atque? Impedit id obcaecati quaerat quibusdam consequuntur ab sed reiciendis quas, nihil vel cum at necessitatibus, placeat cumque laudantium nemo molestiae assumenda dolore debitis laborum tempora soluta? Laboriosam eligendi velit dolorum dicta repellat?</p>
                            <p>
                                Explore website:
                            </p>
                            <p>
                                <a href="">sdfas.google.com</a>
                            </p>
                        </div>
                    </div>
                    <p></p>
                </div>
            </div>

            <div className="row d-flex justify-content-center w-100">
                <div className="col-lg-6">
                    <hr />
                    <div className="card">
                        <div className="card-body">
                            <h4>
                                Developers
                            </h4>
                            
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

// ✅ Reusable Card Component
function DashboardCard({ title, value }) {
    return (
        <div className="col-lg-4 col-md-6 col-sm-12 p-4">
            <div className="card border shadow rounded-4 h-100">
                <div className="card-body text-center">
                    <h4>{title}</h4>
                    <h1 className="display-5 fw-semibold">{value}</h1>
                </div>
            </div>
        </div>
    );
}

export default Profile;
