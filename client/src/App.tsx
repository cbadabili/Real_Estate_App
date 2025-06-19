import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import PropertiesPage from './pages/PropertiesPage';
import RealPropertiesPage from './pages/RealPropertiesPage';
import RentPage from './pages/RentPage';
import RentOutPage from './pages/RentOutPage';
import BuyerSellerPlatformPage from './pages/BuyerSellerPlatformPage';
import MarketIntelligencePage from './pages/MarketIntelligencePage';
import SecureTransactionsPage from './pages/SecureTransactionsPage';
import CommunicationPage from './pages/CommunicationPage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import MapSearchPage from './pages/MapSearchPage';
import ProfilePage from './pages/ProfilePage';
import FSBODashboard from './pages/FSBODashboard';
import CreateListingPage from './pages/CreateListingPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AgentDashboard from './pages/AgentDashboard';
import TestAPIPage from './pages/TestAPIPage';
import DashboardPage from './pages/DashboardPage';
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/properties" element={<RealPropertiesPage />} />
              <Route path="/rent" element={<RentPage />} />
              <Route path="/rent-out" element={<RentOutPage />} />
              <Route path="/buyer-seller-platform" element={<BuyerSellerPlatformPage />} />
              <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
              <Route path="/secure-transactions" element={<SecureTransactionsPage />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/agent-network" element={<AgentNetworkPage />} />
              <Route path="/sample-properties" element={<PropertiesPage />} />
              <Route path="/map-search" element={<MapSearchPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/fsbo-dashboard" element={<FSBODashboard />} />
              <Route path="/create-property" element={<CreatePropertyPage />} />
              <Route path="/create-listing" element={<CreateListingPage />} />
              <Route path="/agent-dashboard" element={<AgentDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/test-api" element={<TestAPIPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;