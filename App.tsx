import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import ManagerHome from './pages/ManagerHome';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen w-full max-w-md mx-auto bg-background-light shadow-2xl overflow-hidden relative">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/manager-home" element={<ManagerHome />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;