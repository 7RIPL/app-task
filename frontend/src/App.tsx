import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppContent from './components/AppContent';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </Router>
  );
};

export default App;