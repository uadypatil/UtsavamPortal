import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Required for dropdowns & toggler
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';


function addEventForm() {
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration in ms
            once: true,     // whether animation should happen only once
        });
    }, []);
    
    return (
        <div className="sign-in-container rounded-5">
            <form action="">
                <h1 className='mt-4 text-white text-center'>Sign Up</h1>

                <div className="row my-5 mx-5 px-5">
                    <div className="col-12">
                        <label htmlFor="" className='form-label'>Username</label>
                        <input type="text" name="username" id="" placeholder='Please enter username' className='form-control' required />
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="" className='form-label'>Password</label>
                        <input type="password" name="password" id="" placeholder='Please enter password' className='form-control' required />
                    </div>

                    <div className="col-12 mt-4">
                        <div className="d-flex gap-2">
                            <input type="checkbox" name="" id="confirmMe" className='form-check' required />
                            <label htmlFor="" className='form-label'>By checking, I confirm to be logged in!</label>
                        </div>
                    </div>

                    <div className="col-12 mt-4 text-center">
                        <button className='btn btn-success '>
                            Submit
                        </button>
                    </div>

                    <div className="col-12 mt-4">
                        <label htmlFor="" className='form-label'>Don't have account, <a href="/signup">sign up</a> now!</label>

                    </div>
                </div>
            </form>
        </div>
    );
}

export default addEventForm;