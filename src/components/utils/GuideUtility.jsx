import { React } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../App.css';

function GuideUtility() {

    return (
        <>

            <div className="col-lg-4">
                {/* SEARCH NERABY EVENTS */}
                <div className="row mt-3 card py-4 mx-2 shadow" style={{ height: '70dvh' }}>
                    <ul className='' style={{ listStyleType: 'none' }}>
                        <li>
                            <h5>Event Organizer</h5>
                            <ul style={{ listStyleType: 'none' }}>
                                <li>
                                    <a href="#organizer">
                                        create account/ sign in
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Create Event
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Dashboard
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Generating Reports
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Managing Event Mangers
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Reviewing Revenues
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <h5>Event Manager</h5>
                            <ul style={{ listStyleType: 'none' }}>
                                <li>
                                    <a href="#manager">
                                        create account/ sign in
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Generate Receipt
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Generate qr & share Receipt
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Trace Revenue
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <h5>Doner</h5>
                            <ul style={{ listStyleType: 'none' }}>
                                <li>
                                    <a href="#doner">
                                        Donate
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        Generate Animated Receipt
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        share Receipt
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>

                </div>
            </div>

            <div className="col-lg-8">
                {/* SEARCH NERABY EVENTS */}
                <div className="row mt-3 card py-4 mx-2 shadow" style={{ height: '70dvh', overflowY: 'scroll' }}>
                    <div className="col-12">
                        <h3 className="text-center">
                            Common Guidelines
                        </h3>

                        <div className="" style={{ height: '' }}>

                            <div className="guide-3 h-100" id="doner">
                                <h4>Doner Guidelines</h4>
                                <p>
                                    As a donor, your contributions support cultural, religious, and festival-based events. The e-Pavti Book system ensures a seamless, transparent donation process with digital receipts that you can proudly share.
                                </p>
                                <p>
                                    <strong>Step 1: Donate</strong> - Approach an Event Manager at the event or use the provided link/QR code to record your donation. Provide your name, phone number, amount, and any optional details like purpose or address.
                                </p>
                                <p>
                                    <strong>Step 2: Receive Receipt</strong> - After donation entry, you'll instantly get a unique link or QR code to your animated, theme-based digital receipt. View it online via the link on any device.
                                </p>
                                <p>
                                    <strong>Step 3: Share Your Contribution</strong> - Download the receipt or share it directly on social media platforms like WhatsApp, Instagram, or Facebook. This promotes community engagement and showcases your support for the event.
                                </p>
                                <p>
                                    <strong>Additional Tips:</strong> - Ensure your contact details are accurate for future updates. Receipts are secure and traceable, reducing paper usage while maintaining transparency. If issues arise, contact the Event Manager or Organizer via the event dashboard.
                                </p>
                            </div>

                            <div className="guide-2 mt-5" id="manager">
                                <h4>Event Manager Guidelines</h4>
                                <p>
                                    Event Managers play a key role in collecting donations efficiently during events. Use the e-Pavti Book system to record contributions securely and generate shareable receipts on-the-go.
                                </p>
                                <p>
                                    <strong>Step 1: Register and Access</strong> - Scan the event-specific QR code provided by the Organizer to register or log in. You'll gain access only to your assigned event dashboard.
                                </p>
                                <p>
                                    <strong>Step 2: Record Donations</strong> - Enter donor details including name, phone, amount, purpose, and address via the simple form. The system validates inputs to prevent errors and assigns a unique receipt number automatically.
                                </p>
                                <p>
                                    <strong>Step 3: Generate and Share Receipts</strong> - Instantly create animated, event-themed digital receipts. Share the unique link or QR code with the donor via SMS, email, or directly. Donors can download or post on social media.
                                </p>
                                <p>
                                    <strong>Step 4: Track Revenue</strong> - Monitor real-time donation lists and totals in your dashboard. Report any discrepancies to the Organizer for approval or analytics.
                                </p>
                                <p>
                                    <strong>Additional Tips:</strong> - Ensure a stable internet connection for real-time syncing. Use mobile-responsive interface for on-site use. Maintain donor privacy by not sharing sensitive data without consent.
                                </p>
                            </div>

                            <div className="guide-1 mt-5" id='organizer'>
                                <h4>Event Organizer Guide Lines</h4>
                                <p>
                                    As an Event Organizer, the e-Pavti Book system empowers you to manage events digitally, from creation to revenue tracking, ensuring transparency and efficiency.
                                </p>
                                <p>
                                    <strong>Step 1: Create Account and Log In</strong> - Register on the platform and log in to access your Organizer dashboard. Admins can approve your account if needed.
                                </p>
                                <p>
                                    <strong>Step 2: Create Event</strong> - Fill in event details like name, date, theme, and description. The system auto-generates a unique QR code for Event Manager registration.
                                </p>
                                <p>
                                    <strong>Step 3: Manage Event Managers</strong> - Share the QR code with your team. Approve or block registrations via the dashboard to control access.
                                </p>
                                <p>
                                    <strong>Step 4: Dashboard and Reports</strong> - Track total donations, donor lists, and event statistics in real-time. Generate comprehensive reports for revenues and analytics. Review all entries for accuracy.
                                </p>
                                <p>
                                    <strong>Additional Tips:</strong> - Customize receipt themes to match your event for better engagement. Use the centralized database for audits. For multiple events, create separate QR codes to avoid overlap. Contact Admin for system-wide issues.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GuideUtility
