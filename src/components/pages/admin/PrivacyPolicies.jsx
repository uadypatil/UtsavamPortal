import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const  PrivacyPolicies = () => {
  return (
    <div className="container py-4 py-md-5">
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4 p-md-5">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-2">Privacy Policy</h1>
            <p className="text-muted mb-0">Last updated: August 29, 2026</p>
          </div>

          {/* Introduction */}
          <section className="mb-4">
            <h4 className="fw-bold">1. Introduction</h4>
            <p className="text-muted">
              Welcome to Utsavam. We respect your privacy and are committed to
              protecting the personal information you provide while using our
              application and services.
            </p>
            <p className="text-muted">
              This Privacy Policy explains how we collect, use, store, and
              protect information when you use the Utsavam application.
            </p>
          </section>

          {/* Information Collection */}
          <section className="mb-4">
            <h4 className="fw-bold">2. Information We Collect</h4>
            <p className="text-muted">
              Depending on how you use the application, we may collect the
              following information:
            </p>

            <ul className="text-muted">
              <li className="mb-2">
                Name and contact information such as mobile number.
              </li>
              <li className="mb-2">
                Account information including username and authentication
                details.
              </li>
              <li className="mb-2">
                Event, organizer, and collection executive information.
              </li>
              <li className="mb-2">Donor information and donation details.</li>
              <li className="mb-2">
                Payment-related information required to record donations.
              </li>
              <li className="mb-2">
                Receipt and transaction information generated through the
                application.
              </li>
              <li className="mb-2">
                Technical information such as browser, device, and application
                usage information.
              </li>
            </ul>
          </section>

          {/* Use of Information */}
          <section className="mb-4">
            <h4 className="fw-bold">3. How We Use Your Information</h4>
            <p className="text-muted">
              Information collected through Utsavam may be used for the
              following purposes:
            </p>

            <ul className="text-muted">
              <li className="mb-2">To create and manage user accounts.</li>
              <li className="mb-2">
                To manage events, organizers, collection executives, and donors.
              </li>
              <li className="mb-2">
                To record and manage donation transactions.
              </li>
              <li className="mb-2">
                To generate and maintain donation receipts.
              </li>
              <li className="mb-2">
                To provide reports and administrative functionality.
              </li>
              <li className="mb-2">
                To maintain application security and prevent unauthorized
                access.
              </li>
              <li className="mb-2">
                To improve application performance and reliability.
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section className="mb-4">
            <h4 className="fw-bold">4. Data Security</h4>
            <p className="text-muted">
              We take reasonable technical and organizational measures to
              protect the information stored within the application against
              unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p className="text-muted">
              Authentication and authorization mechanisms are used to restrict
              access to application features and data according to user roles
              and permissions.
            </p>
          </section>

          {/* Data Sharing */}
          <section className="mb-4">
            <h4 className="fw-bold">5. Sharing of Information</h4>
            <p className="text-muted">
              We do not sell or rent personal information to third parties.
              Information may only be shared when necessary to:
            </p>

            <ul className="text-muted">
              <li className="mb-2">
                Provide or maintain application functionality.
              </li>
              <li className="mb-2">
                Process services required by the application.
              </li>
              <li className="mb-2">
                Comply with applicable laws or legal requirements.
              </li>
              <li className="mb-2">
                Protect the rights, security, and integrity of the application
                and its users.
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="mb-4">
            <h4 className="fw-bold">6. Cookies and Local Storage</h4>
            <p className="text-muted">
              Utsavam may use browser storage technologies such as cookies,
              local storage, or IndexedDB to maintain application preferences,
              authentication information, cached application data, and improve
              application performance.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-4">
            <h4 className="fw-bold">7. Data Retention</h4>
            <p className="text-muted">
              We retain information for as long as necessary to provide the
              application's services, maintain appropriate records, comply with
              legal obligations, and resolve disputes.
            </p>
          </section>

          {/* User Rights */}
          <section className="mb-4">
            <h4 className="fw-bold">8. Your Rights</h4>
            <p className="text-muted">
              Depending on applicable laws and the nature of your account, you
              may have rights regarding your personal information, including
              requesting access, correction, or deletion of certain information.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-4">
            <h4 className="fw-bold">9. Children's Privacy</h4>
            <p className="text-muted">
              Utsavam is not intended to knowingly collect personal information
              from children without appropriate authorization or consent.
            </p>
          </section>

          {/* Third Party Services */}
          <section className="mb-4">
            <h4 className="fw-bold">10. Third-Party Services</h4>
            <p className="text-muted">
              The application may use third-party services for hosting, database
              management, authentication, payment processing, communication,
              analytics, or other operational requirements. Such services may
              process information according to their own privacy policies.
            </p>
          </section>

          {/* Changes */}
          <section className="mb-4">
            <h4 className="fw-bold">11. Changes to This Privacy Policy</h4>
            <p className="text-muted">
              We may update this Privacy Policy from time to time to reflect
              changes in the application, services, or applicable legal
              requirements. Updated versions will be made available through the
              application or website.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h4 className="fw-bold">12. Contact Us</h4>
            <p className="text-muted mb-1">
              If you have questions, concerns, or requests regarding this
              Privacy Policy, please contact the Utsavam support team.
            </p>

            <p className="fw-semibold mb-0">Utsavam Support</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicies;
