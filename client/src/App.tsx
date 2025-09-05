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
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import { PlotsPage } from './pages/PlotsPage';
import RentPage from './pages/RentPage';
import RentalDetailsPage from './pages/RentalDetailsPage';
import BuyerSellerPlatformPage from './pages/BuyerSellerPlatformPage';
import MarketIntelligencePage from './pages/MarketIntelligencePage';
import SecureTransactionsPage from './pages/SecureTransactionsPage';
import CommunicationPage from './pages/CommunicationPage';
import AgentNetworkPage from './pages/AgentNetworkPage';
import MapSearchPage from './pages/MapSearchPage';
import ProfilePage from './pages/ProfilePage';
import LegalServicesPage from './pages/services/LegalServicesPage';
import LegalDocumentTemplatesPage from './pages/LegalDocumentTemplatesPage';
import FinancingPage from './pages/services/FinancingPage';
import PlanningPage from './pages/buyer-journey/PlanningPage';
import SearchingPage from './pages/buyer-journey/SearchingPage';
import ViewingPage from './pages/buyer-journey/ViewingPage';
import OffersPage from './pages/buyer-journey/OffersPage';
import BidRegistrationPage from './pages/BidRegistrationPage';
import ScheduleViewingPage from './pages/ScheduleViewingPage';
import FSBODashboard from './pages/FSBODashboard';
import CreateListingPage from './pages/CreateListingPage';
import AgentDashboard from './pages/AgentDashboard';
import MyPropertiesPage from './pages/MyPropertiesPage';
import AgentProfilePage from './pages/AgentProfilePage';
import ContactAgentPage from './pages/ContactAgentPage';
import AuctionsPage from './pages/AuctionsPage';
import ServicesPage from './pages/ServicesPage';
import MarketplacePage from './pages/MarketplacePage';
import ProfessionalsPage from "./pages/marketplace/ProfessionalsPage";
import SuppliersPage from "./pages/marketplace/SuppliersPage";
import ArtisansPage from './pages/marketplace/ArtisansPage';
import TrainingProvidersPage from './pages/marketplace/TrainingProvidersPage';
import RegisterProviderPage from './pages/marketplace/RegisterProviderPage';
import DocumentsPage from './pages/DocumentsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import AdminTestPage from './pages/AdminTestPage';
import { AuthProvider } from './contexts/AuthContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import BidPage from './pages/BidPage';
import PricingGuidePage from './pages/PricingGuidePage';
import ManageShowingsPage from './pages/ManageShowingsPage';
import HandleOffersPage from './pages/HandleOffersPage';
import PropertyHandoverPage from './pages/PropertyHandoverPage';
import TransferProcessPage from './pages/TransferProcessPage';
import AgentRegistrationPage from './pages/AgentRegistrationPage';
import AgentRatingPage from './pages/AgentRatingPage';
import HomeValueAssessmentPage from './pages/HomeValueAssessmentPage';
import LegalRequirementsPage from './pages/LegalRequirementsPage';
import RentalListingWizard from './pages/RentalListingWizard';
import LandlordDashboard from './pages/LandlordDashboard';
import RenterDashboard from './pages/RenterDashboard';
import RentalApplicationsPage from './pages/RentalApplicationsPage';
import TenantScreeningPage from './pages/TenantScreeningPage';
import MaintenanceManagementPage from './pages/MaintenanceManagementPage';
import MaintenanceRequestsPage from './pages/MaintenanceRequestsPage';
import TransactionManagementPage from './pages/TransactionManagementPage';

import RentalAgreementsPage from './pages/RentalAgreementsPage';
import PropertyManagementPage from './pages/services/PropertyManagementPage';
import TenantSupportPage from './pages/services/TenantSupportPage';
//importing missing pages
import PropertyValuationPage from './pages/PropertyValuationPage';
import ProfessionalSupportPage from './pages/ProfessionalSupportPage';
import EnhancedSearchPage from './pages/EnhancedSearchPage';
import MarketTrendsPage from './pages/MarketTrendsPage';
import NeighborhoodAnalyticsPage from './pages/NeighborhoodAnalyticsPage';
import InvestmentAnalyticsPage from './pages/InvestmentAnalyticsPage';
import MarketInsightsHub from './pages/MarketInsightsHub';
import LegalTransactionsHub from './pages/LegalTransactionsHub';
import ServiceProviderDirectory from './pages/ServiceProviderDirectory';

import BuyMapPage from './pages/BuyMapPage';

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
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            {/* Properties Routes */}
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailsPage />} />
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-properties" 
            element={
              <ProtectedRoute>
                <MyPropertiesPage />
              </ProtectedRoute>
            } 
          />

          {/* Rent Routes */}
          <Route path="/rent" element={<RentPage />} />
          <Route path="/rental/:id" element={<RentalDetailsPage />} />
          <Route path="/rental-applications" element={<RentalApplicationsPage />} />
          <Route path="/rental-agreements" element={<RentalAgreementsPage />} />
          <Route path="/tenant-screening" element={<TenantScreeningPage />} />
            <Route path="/rental-listing-wizard" element={<RentalListingWizard />} />
            <Route path="/rental-listing-wizard/:id" element={<RentalListingWizard />} />
            <Route path="/rent/create-listing" element={<RentalListingWizard />} />
            <Route path="/rent/edit/:id" element={<RentalListingWizard />} />
            <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
            <Route path="/dashboard/renter" element={<RenterDashboard />} />
            <Route path="/maintenance-management" element={<MaintenanceManagementPage />} />
            <Route path="/maintenance-requests" element={<MaintenanceRequestsPage />} />

            <Route path="/buyer-seller-platform" element={<BuyerSellerPlatformPage />} />
            <Route path="/platform" element={<BuyerSellerPlatformPage />} />
            <Route path="/market-intelligence" element={<MarketInsightsHub />} />
            <Route path="/market-insights" element={<MarketInsightsHub />} />
            <Route path="/secure-transactions" element={<SecureTransactionsPage />} />
            <Route path="/communication" element={<CommunicationPage />} />
            <Route path="/messaging" element={<CommunicationPage />} />
            <Route path="/video-calls" element={<CommunicationPage />} />
            <Route path="/document-sharing" element={<CommunicationPage />} />
            <Route path="/group-chat" element={<CommunicationPage />} />
            <Route path="/agent-network" element={<AgentNetworkPage />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            <Route path="/enhanced-search" element={<EnhancedSearchPage />} />
            <Route path="/admin-test" element={<AdminTestPage />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  </ToastProvider>
</QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;