import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../../App.css';
import NavbarCustom from '../includes/NavbarCustom';

/**
 * Real Privacy Policy page — previously both dead links in
 * EventManagerProfile.jsx (href="") and the SignUp.jsx consent checkboxes
 * pointed nowhere. This is written as a genuine application privacy
 * document with clearly marked placeholders for organization-specific
 * legal details (registered entity name, grievance contact, etc.) that
 * only the platform owner/legal counsel can fill in — this is not a
 * substitute for legal review before go-live.
 */
export default function PrivacyPolicy() {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <>
            <NavbarCustom />
            <div className="container py-5" style={{ maxWidth: 860 }} data-aos="fade-up">
                <h1 className="fw-bold mb-2">Privacy Policy</h1>
                <p className="text-muted mb-4">Last updated: <em>[Insert Date]</em></p>

                <div className="alert alert-warning small">
                    <i className="bi bi-exclamation-triangle me-2" />
                    This document contains placeholders (in brackets) that must be completed by
                    Utsavam's operating organization and reviewed by qualified legal counsel before
                    publication. It is not, by itself, a substitute for legal advice.
                </div>

                <h2 className="h5 fw-bold mt-4">1. Who We Are</h2>
                <p>
                    Utsavam ("we", "us", "the Platform") is operated by <strong>[Insert Legal Entity
                    Name]</strong>, based in <strong>[Insert Registered Address]</strong>. This policy
                    explains how we collect, use, and protect information when you use our website and
                    applications.
                </p>

                <h2 className="h5 fw-bold mt-4">2. Who This Policy Covers</h2>
                <p>This policy applies to three kinds of people who interact with the Platform:</p>
                <ul>
                    <li><strong>Registered users</strong> — Event Organizers (Mandal administrators), Donation Collectors, and platform staff who create an account.</li>
                    <li><strong>Donors</strong> — individuals who make a donation through a Donation Collector. Donors generally do not create an account or log in; their information is entered on their behalf by a collector, with their consent, at the time of donation.</li>
                    <li><strong>Website visitors</strong> — anyone browsing our public pages without registering.</li>
                </ul>

                <h2 className="h5 fw-bold mt-4">3. Information We Collect</h2>
                <p>Depending on how you use the Platform, we may collect:</p>
                <ul>
                    <li><strong>Account information:</strong> name, username, email, phone number, and role, for registered users.</li>
                    <li><strong>Donor information:</strong> full name, contact number, email, and address, collected by a Donation Collector at the time of donation for receipt, accounting, and event-reporting purposes.</li>
                    <li><strong>Donation records:</strong> amount, payment mode, transaction reference, and a system-generated receipt number.</li>
                    <li><strong>Usage information:</strong> basic technical data such as browser type and access times, used to keep the Platform secure and functioning correctly.</li>
                </ul>
                <p>We do not knowingly collect more information than is necessary for these purposes.</p>

                <h2 className="h5 fw-bold mt-4">4. How We Use Information</h2>
                <ul>
                    <li>To create and issue donation receipts.</li>
                    <li>To maintain accurate accounting and event/expense records for Event Organizers.</li>
                    <li>To operate donor-facing features, such as a shareable digital receipt.</li>
                    <li>To secure accounts and prevent misuse of the Platform.</li>
                    <li>To comply with applicable legal and regulatory obligations.</li>
                </ul>

                <h2 className="h5 fw-bold mt-4">5. Digital Receipts and QR Codes</h2>
                <p>
                    A donation receipt is identified by a system-generated receipt number, which may be
                    shared as a QR code or link so a donor can view or download their own receipt. This
                    identifier does not itself grant access to any account, and viewing a receipt does
                    not create or modify any donation. We do not embed authentication tokens, internal
                    database identifiers, or unnecessary personal information inside QR codes.
                </p>

                <h2 className="h5 fw-bold mt-4">6. Sharing of Information</h2>
                <p>
                    We do not sell personal information. Information may be visible to the Event
                    Organizer and Donation Collectors of the specific event a donor contributed to, as
                    necessary to issue receipts and maintain records, and to platform administrators as
                    necessary to operate and secure the Platform.
                </p>

                <h2 className="h5 fw-bold mt-4">7. Data Retention</h2>
                <p>
                    We retain donation and account records for as long as necessary to fulfil the
                    purposes described in this policy and to meet applicable accounting or legal
                    retention requirements. <em>[Insert specific retention periods once determined.]</em>
                </p>

                <h2 className="h5 fw-bold mt-4">8. Your Rights</h2>
                <p>
                    Depending on applicable law, you may have rights to access, correct, or request
                    deletion of your information. To exercise these rights, contact us at{' '}
                    <strong>[Insert Contact Email]</strong>.
                </p>

                <h2 className="h5 fw-bold mt-4">9. Security</h2>
                <p>
                    We use reasonable technical and organizational measures to protect information
                    against unauthorized access, alteration, or loss. No system can guarantee absolute
                    security, and we encourage account holders to use strong, unique passwords.
                </p>

                <h2 className="h5 fw-bold mt-4">10. Changes to This Policy</h2>
                <p>We may update this policy from time to time. Material changes will be reflected by updating the "Last updated" date above.</p>

                <h2 className="h5 fw-bold mt-4">11. Contact Us</h2>
                <p>Questions about this policy can be sent to <strong>[Insert Contact Email]</strong>.</p>
            </div>
        </>
    );
}
