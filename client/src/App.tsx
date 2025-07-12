import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PropertiesPage from './pages/PropertiesPage';
import RealPropertiesPage from './pages/RealPropertiesPage';
import { PlotsPage } from './pages/PlotsPage';
import RentPage from './pages/RentPage';
import RentOutPage from './pages/RentOutPage';
import RentalsPage from './pages/RentalsPage';
import RentalDetailsPage from './pages/RentalDetailsPage';
import BuyerSellerPlatformPage from './pages/BuyerSellerPlatformPage';
import MarketIntelligencePage from './pages/MarketIntelligencePage';
import SecureTransactionsPage from './pages/SecureTransactionsPage';
import CommunicationPage from './pages/CommunicationPage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import MapSearchPage from './pages/MapSearchPage';
import ProfilePage from './pages/ProfilePage';
import LegalServicesPage from './pages/services/LegalServicesPage';
import FinancingPage from './pages/services/FinancingPage';
import PlanningPage from './pages/buyer-journey/PlanningPage';
import SearchingPage from './pages/buyer-journey/SearchingPage';
import ViewingPage from './pages/buyer-journey/ViewingPage';
import OffersPage from './pages/buyer-journey/OffersPage';
import BidRegistrationPage from './pages/BidRegistrationPage';
import ScheduleViewingPage from './pages/ScheduleViewingPage';
import FSBODashboard from './pages/FSBODashboard';
import CreateListingPage from './pages/CreateListingPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import AgentDashboard from './pages/AgentDashboard';
import MyPropertiesPage from './pages/MyPropertiesPage';
import TestAPIPage from './pages/TestAPIPage';
import AuthTestPage from './pages/AuthTestPage';
import AgentProfilePage from './pages/AgentProfilePage';
import ContactAgentPage from './pages/ContactAgentPage';
import AuctionsPage from './pages/AuctionsPage';
import ServicesPage from './pages/ServicesPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import BidPage from './pages/BidPage';
import PricingGuidePage from './pages/PricingGuidePage';
import ManageShowingsPage from './pages/ManageShowingsPage';
import HandleOffersPage from './pages/HandleOffersPage';
import PropertyHandoverPage from './pages/PropertyHandoverPage';
import AgentRegistrationPage from './pages/AgentRegistrationPage';
import AgentRatingPage from './pages/AgentRatingPage';
import HomeValueAssessmentPage from './pages/HomeValueAssessmentPage';
import PrepareHomePage from './pages/PrepareHomePage';
import LegalRequirementsPage from './pages/LegalRequirementsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <AuthProvider>
            <PropertyProvider>
              <div className="min-h-screen bg-neutral-50">
                <OfflineIndicator />
                <Navbar />
                <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/properties" element={<RealPropertiesPage />} />
            <Route path="/plots" element={<PlotsPage />} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/rent-out" element={<RentOutPage />} />
            <Route path="/buyer-seller-platform" element={<BuyerSellerPlatformPage />} />
            <Route path="/platform" element={<BuyerSellerPlatformPage />} />
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
        <Route path="/my-properties" element={<MyPropertiesPage />} />
            <Route path="/services/legal" element={<LegalServicesPage />} />
            <Route path="/services/financing" element={<FinancingPage />} />
            <Route path="/buyer-journey/planning" element={<PlanningPage />} />
          <Route path="/buyer-journey/searching" element={<SearchingPage />} />
          <Route path="/buyer-journey/viewing" element={<ViewingPage />} />
          <Route path="/buyer-journey/offers" element={<OffersPage />} />

          {/* Auction routes */}
          <Route path="/auctions/:id/register" element={<BidRegistrationPage />} />

          {/* Viewing routes */}
          <Route path="/properties/:id/schedule-viewing" element={<ScheduleViewingPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
              <Route path="/bid/:id" element={<BidPage />} />
              <Route path="/services" element={<ServicesPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/test-api" element={<TestAPIPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth-test" element={<AuthTestPage />} />
            <Route path="/agent-profile/:id" element={<AgentProfilePage />} />
            <Route path="/contact-agent/:id" element={<ContactAgentPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRoles={['admin', 'super_admin']}>
                  <AdminPage />
                </ProtectedRoute>
              } 
            />
          <Route path="/pricing-guide" element={<PricingGuidePage />} />
          <Route path="/manage-showings" element={<ManageShowingsPage />} />
          <Route path="/handle-offers" element={<HandleOffersPage />} />
              <Route path="/property-handover" element={<PropertyHandoverPage />} />
              <Route path="/agent-registration" element={<AgentRegistrationPage />} />
              <Route path="/rate-agent/:agentId" element={<AgentRatingPage />} />
              <Route path="/home-value-assessment" element={<HomeValueAssessmentPage />} />
              <Route path="/prepare-home" element={<PrepareHomePage />} />
              <Route path="/legal-requirements" element={<LegalRequirementsPage />} />
          <Route path="/transfer-process" element={<PropertyHandoverPage />} />
              </Routes>
              </div>
            </PropertyProvider>
          </AuthProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;