
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import NotificationDetail from './pages/NotificationDetail';
import ManagerHome from './pages/ManagerHome';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Services from './pages/Services';
import Bills from './pages/Bills';
import PaymentDetail from './pages/PaymentDetail';
import TransactionHistory from './pages/TransactionHistory';
import BuildingList from './pages/BuildingList';
import RoomList from './pages/RoomList';
import RequestHistory from './pages/RequestHistory';
import CreateRequest from './pages/CreateRequest';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen w-full max-w-md mx-auto bg-background-light shadow-2xl overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/bills" element={<Bills />} />
          <Route path="/payment-detail" element={<PaymentDetail />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/buildings" element={<BuildingList />} />
          <Route path="/buildings/:id" element={<RoomList />} />
          <Route path="/requests" element={<RequestHistory />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/:id" element={<NotificationDetail />} />
          <Route path="/manager-home" element={<ManagerHome />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;