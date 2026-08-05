import { React } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './components/pages/website/Home'
import Dashboard from './pages/admin/Dashboard';
import Base from './components/pages/admin/Base';
import Profile from './components/pages/admin/Profile';
import Report from './components/pages/admin/Reports';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import UserBase from './components/pages/user/UserBase';
import UserHome from './components/pages/user/UserHome';
import PrivateRoute from './components/PrivateRoute';
import LogOut from './components/LogOut';
import WebsiteEvents from './components/pages/website/WebsiteEvents';
import GuideLines from './components/pages/website/GuideLines';
import WebsiteContact from './components/pages/website/WebsiteContact';
import Events from './components/pages/admin/Events';
import EventManagers from './components/pages/admin/EventManagers';
import EventManagerBase from './components/pages/event_manager/EventManagerBase';
import EventManagerHome from './pages/event-manager/EventManagerHome';
import LoadQrScreen from './components/pages/event_manager/LoadQrScreen';
import EventManagerNewDonationForm from './components/pages/event_manager/EventManagerNewDonationForm';
import ViewDonatedProfile from './components/pages/event_manager/ViewDonatedProfile';
import EventManagerRevenueReport from './components/pages/event_manager/EventManagerRevenueReport';
import EventManagerProfile from './components/pages/event_manager/EventManagerProfile';
import NewEventManager from './components/pages/event_manager/NewEventManager';
import DonerAnimatedReceipt from './components/pages/website/DonarAnimatedReceipt';
import { ToastProvider } from './context/ToastContext';
import { ConfirmDialogProvider } from './context/ConfirmDialogContext';

function App() {

  return (
    <ToastProvider>
    <ConfirmDialogProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<WebsiteEvents />} />
          <Route path="/guidelines" element={<GuideLines />} />
          <Route path="/contact" element={<WebsiteContact />} />
          <Route path="doner/:donerid/receipt" element={<DonerAnimatedReceipt />} />

          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/logout' element={<LogOut />} />

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
            <Route path="events/managers" element={<EventManagers />} />
            <Route path="events/all" element={<Events />} />
            <Route path="event/:eventid/new" element={<NewEventManager />} />
          </Route>

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
            <Route path="donation/new" element={<EventManagerNewDonationForm />} />
            <Route path="doner/profile" element={<ViewDonatedProfile />} />
            <Route path="revenue/report" element={<EventManagerRevenueReport />} />
            <Route path="profile/me" element={<EventManagerProfile />} />
          </Route>

        </Routes>
      </Router>
    </ConfirmDialogProvider>
    </ToastProvider>
  )
}

export default App
