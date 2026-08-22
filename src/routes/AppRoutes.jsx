import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../components/pages/website/Home";
import Dashboard from "../pages/admin/Dashboard";
import Base from "../components/pages/admin/Base";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import LogOut from "../components/LogOut";
import WebsiteEvents from "../components/pages/website/WebsiteEvents";
import GuideLines from "../components/pages/website/GuideLines";
import WebsiteContact from "../components/pages/website/WebsiteContact";
import Events from "../components/pages/admin/Events";
import EventsList from "../components/pages/admin/EventsList";
import ExpenseManager from "../components/pages/admin/ExpenseManager";
import ReceiptTemplateManager from "../components/pages/admin/ReceiptTemplateManager";
import DonorManager from "../components/pages/admin/DonorManager";
import DonationOversight from "../components/pages/admin/DonationOversight";
import EventManagerBase from "../components/pages/event_manager/EventManagerBase";
import EventManagerHome from "../pages/event-manager/EventManagerHome";
import LoadQrScreen from "../components/pages/event_manager/LoadQrScreen";
import EventManagerNewDonationForm from "../components/pages/event_manager/EventManagerNewDonationForm";
import ViewDonatedProfile from "../components/pages/event_manager/ViewDonatedProfile";
import EventManagerRevenueReport from "../components/pages/event_manager/EventManagerRevenueReport";
import EventManagerProfile from "../components/pages/event_manager/EventManagerProfile";
import NewEventManager from "../components/pages/event_manager/NewEventManager";
import DonerAnimatedReceipt from "../components/pages/website/DonarAnimatedReceipt";
import PrivacyPolicy from "../components/pages/legal/PrivacyPolicy";
import TermsOfUse from "../components/pages/legal/TermsOfUse";
import NotFound from "../pages/errors/404";
import CollectionExecutive from "../components/pages/admin/CollectionExecutive";
import AddDonationExecutive from "../components/pages/admin/AddDonationExecutive";
import UpdateDonationExecutive from "../components/pages/admin/UpdateDonationExecutive";
import PrivateRoute from "../components/PrivateRoute";

// Super Admin
import SuperAdminBase from "../components/pages/SUPER_ADMIN/SuperAdminBase";
import SuperAdminDashboard from "../pages/superadmin/Dashboard";
import SuperAdminUsers from "../pages/superadmin/Users";
import SuperAdminEventOrganizers from "../pages/superadmin/EventOrganizers";
import SuperAdminSeasons from "../pages/superadmin/Seasons";
import SuperAdminExpenseCategories from "../pages/superadmin/ExpenseCategories";
import SuperAdminExpenseApprovals from "../pages/superadmin/ExpenseApprovals";
import SuperAdminReports from "../pages/superadmin/Reports";
import SuperAdminEvents from "../pages/superadmin/Events";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Website */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<WebsiteEvents />} />
        <Route path="/guidelines" element={<GuideLines />} />
        <Route path="/contact" element={<WebsiteContact />} />
        <Route
          path="/doner/:donerid/receipt"
          element={<DonerAnimatedReceipt />}
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-use" element={<TermsOfUse />} />

        {/* Authentication */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<LogOut />} />

        {/* Super Admin */}
        <Route
          path="/superadmin"
          element={
            <PrivateRoute roles={["SUPER_ADMIN"]}>
              <SuperAdminBase />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUsers />} />
          <Route path="event-organizers" element={<SuperAdminEventOrganizers />} />
          <Route path="seasons" element={<SuperAdminSeasons />} />
          <Route path="expense-categories" element={<SuperAdminExpenseCategories />} />
          <Route path="expense-approvals" element={<SuperAdminExpenseApprovals />} />
          <Route path="reports" element={<SuperAdminReports />} />
          <Route path="events" element={<SuperAdminEvents />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute roles={["EVENT_ORGANIZER"]}>
              <Base />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="donationcollector" element={<CollectionExecutive />} />
          <Route path="addDCollector/:donationExecutiveId" element={<UpdateDonationExecutive />} />
          <Route path="addDCollector" element={<AddDonationExecutive />} />
          <Route path="expenses" element={<ExpenseManager />} />
          <Route path="receipt-template" element={<ReceiptTemplateManager />} />
          <Route path="donors" element={<DonorManager />} />
          <Route path="donations" element={<DonationOversight />} />
          <Route path="events/all" element={<EventsList />} />
          <Route path="events/new" element={<Events />} />
          <Route path="events/:eventId/edit" element={<Events />} />
          <Route path="event/:eventid/new" element={<NewEventManager />} />
        </Route>

        {/* Event Manager */}
        <Route
          path="/em"
          element={
            <PrivateRoute roles={["COLLECTION_EXECUTIVE"]}>
              <EventManagerBase />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<EventManagerHome />} />
          <Route path="revenue" element={<EventManagerHome />} />
          <Route path="loadqr" element={<LoadQrScreen />} />
          <Route
            path="donation/new"
            element={<EventManagerNewDonationForm />}
          />
          <Route path="doner/profile" element={<ViewDonatedProfile />} />
          <Route
            path="revenue/report"
            element={<EventManagerRevenueReport />}
          />
          <Route path="profile/me" element={<EventManagerProfile />} />
        </Route>

        {/* 404 error page */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
