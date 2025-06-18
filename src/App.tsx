import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import MapSearchPage from './pages/MapSearchPage';
import FSBODashboard from './pages/FSBODashboard';
import CreateListingPage from './pages/CreateListingPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AgentDashboard from './pages/AgentDashboard';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <div className="min-h-screen bg-neutral-50">
          <Navbar />
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/map-search" element={<MapSearchPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/fsbo-dashboard" element={<FSBODashboard />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;