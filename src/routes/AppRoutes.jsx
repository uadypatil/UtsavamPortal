import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../components/pages/website/Home";
import Dashboard from "../pages/admin/Dashboard";
import Base from "../components/pages/admin/Base";
import Report from "../components/pages/admin/Reports";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import LogOut from "../components/LogOut";
import WebsiteEvents from "../components/pages/website/WebsiteEvents";
import GuideLines from "../components/pages/website/GuideLines";
import WebsiteContact from "../components/pages/website/WebsiteContact";
import Events from "../components/pages/admin/Events";
import EventManagers from "../components/pages/admin/EventManagers";
import EventManagerBase from "../components/pages/event_manager/EventManagerBase";
import EventManagerHome from "../pages/event-manager/EventManagerHome";
import LoadQrScreen from "../components/pages/event_manager/LoadQrScreen";
import EventManagerNewDonationForm from "../components/pages/event_manager/EventManagerNewDonationForm";
import ViewDonatedProfile from "../components/pages/event_manager/ViewDonatedProfile";
import EventManagerRevenueReport from "../components/pages/event_manager/EventManagerRevenueReport";
import EventManagerProfile from "../components/pages/event_manager/EventManagerProfile";
import NewEventManager from "../components/pages/event_manager/NewEventManager";
import DonerAnimatedReceipt from "../components/pages/website/DonarAnimatedReceipt";
import NotFound from "../pages/errors/404";
import CollectionExecutive from "../components/pages/admin/CollectionExecutive";
import AddDonationExecutive from "../components/pages/admin/AddDonationExecutive";
import UpdateDonationExecutive from "../components/pages/admin/UpdateDonationExecutive";
// import PrivateRoute from "../components/PrivateRoute";

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

        {/* Authentication */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<LogOut />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            // <PrivateRoute>
            <Base />
            // </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reports" element={<Report />} />
          <Route path="donationcollector" element={<CollectionExecutive />} />
          <Route path="addDCollector/:donationExecutiveId" element={<UpdateDonationExecutive />} />
          <Route path="addDCollector" element={<AddDonationExecutive />} />
          <Route path="expencemanager" element={<EventManagers />} />
          <Route path="events/all" element={<Events />} />
          <Route path="event/:eventid/new" element={<NewEventManager />} />
        </Route>

        {/* Event Manager */}
        <Route
          path="/em"
          element={
            // <PrivateRoute>
            <EventManagerBase />
            // </PrivateRoute>
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