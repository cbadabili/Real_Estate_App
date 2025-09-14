import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import PropertySearchPage from './pages/property/PropertySearchPage';
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
import SellListingWizard from './pages/SellListingWizard';
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
import TestMapPage from './pages/TestMapPage'; // Assuming this is a missing import

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
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRoles={["admin"]}><AdminPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/agent-dashboard" element={<ProtectedRoute><AgentDashboard /></ProtectedRoute>} />
            <Route path="/fsbo-dashboard" element={<ProtectedRoute><FSBODashboard /></ProtectedRoute>} />
            <Route path="/landlord-dashboard" element={<ProtectedRoute><LandlordDashboard /></ProtectedRoute>} />
            <Route path="/renter-dashboard" element={<ProtectedRoute><RenterDashboard /></ProtectedRoute>} />
            <Route path="/properties" element={<PropertySearchPage />} />
            <Route path="/properties/:id" element={<PropertyDetailsPage />} />
            <Route path="/create-listing" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
            <Route path="/my-properties" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
            <Route path="/rent" element={<RentPage />} />
            <Route path="/rent/:id" element={<RentalDetailsPage />} />
            <Route path="/rental-listing-wizard" element={<ProtectedRoute><RentalListingWizard /></ProtectedRoute>} />
            <Route path="/sell-listing-wizard" element={<ProtectedRoute><SellListingWizard /></ProtectedRoute>} />
            <Route path="/plots" element={<PlotsPage />} />
            <Route path="/auctions" element={<AuctionsPage />} />
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
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/schedule-viewing/:id" element={<ProtectedRoute><ScheduleViewingPage /></ProtectedRoute>} />
            <Route path="/contact-agent/:id" element={<ProtectedRoute><ContactAgentPage /></ProtectedRoute>} />
            <Route path="/handle-offers" element={<ProtectedRoute><HandleOffersPage /></ProtectedRoute>} />
            <Route path="/manage-showings" element={<ProtectedRoute><ManageShowingsPage /></ProtectedRoute>} />
            <Route path="/buy-map" element={<BuyMapPage />} />
            <Route path="/tenant-screening" element={<ProtectedRoute><TenantScreeningPage /></ProtectedRoute>} />
            <Route path="/rental-applications" element={<ProtectedRoute><RentalApplicationsPage /></ProtectedRoute>} />
            <Route path="/maintenance-requests" element={<ProtectedRoute><MaintenanceRequestsPage /></ProtectedRoute>} />
            <Route path="/maintenance-management" element={<ProtectedRoute><MaintenanceManagementPage /></ProtectedRoute>} />
            <Route path="/legal-transactions" element={<LegalTransactionsHub />} />
            <Route path="/professional-support" element={<ProfessionalSupportPage />} />
            <Route path="/marketplace/artisans" element={<ArtisansPage />} />
            <Route path="/marketplace/professionals" element={<ProfessionalsPage />} />
            <Route path="/marketplace/suppliers" element={<SuppliersPage />} />
            <Route path="/marketplace/training-providers" element={<TrainingProvidersPage />} />
            <Route path="/marketplace/register" element={<RegisterProviderPage />} />
            <Route path="/property-management" element={<PropertyManagementPage />} />
            <Route path="/services/property-management" element={<PropertyManagementPage />} />
            <Route path="/legal-services" element={<LegalServicesPage />} />
            <Route path="/financing" element={<FinancingPage />} />
            <Route path="/tenant-support" element={<TenantSupportPage />} />
            <Route path="/services/tenant-support" element={<TenantSupportPage />} />
            <Route path="/offers" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/buyer-journey/planning" element={<PlanningPage />} />
            <Route path="/searching" element={<SearchingPage />} />
            <Route path="/viewing" element={<ProtectedRoute><ViewingPage /></ProtectedRoute>} />
            <Route path="/market-intelligence" element={<MarketIntelligencePage />} />
            <Route path="/market-trends" element={<MarketTrendsPage />} />
            <Route path="/neighborhood-analytics" element={<NeighborhoodAnalyticsPage />} />
            <Route path="/investment-analytics" element={<InvestmentAnalyticsPage />} />
            <Route path="/property-valuation" element={<PropertyValuationPage />} />
            <Route path="/home-value-assessment" element={<HomeValueAssessmentPage />} />
            <Route path="/pricing-guide" element={<PricingGuidePage />} />
            <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
            <Route path="/legal-requirements" element={<LegalRequirementsPage />} />
            <Route path="/legal-document-templates" element={<LegalDocumentTemplatesPage />} />
            <Route path="/secure-transactions" element={<SecureTransactionsPage />} />
            <Route path="/transaction-management" element={<ProtectedRoute><TransactionManagementPage /></ProtectedRoute>} />
            <Route path="/transfer-process" element={<TransferProcessPage />} />
            <Route path="/property-handover" element={<ProtectedRoute><PropertyHandoverPage /></ProtectedRoute>} />
            <Route path="/rental-agreements" element={<ProtectedRoute><RentalAgreementsPage /></ProtectedRoute>} />
            <Route path="/agent-registration" element={<AgentRegistrationPage />} />
            <Route path="/agent-profile/:id" element={<AgentProfilePage />} />
            <Route path="/agent-rating" element={<ProtectedRoute><AgentRatingPage /></ProtectedRoute>} />
            <Route path="/bid/:id" element={<ProtectedRoute><BidPage /></ProtectedRoute>} />
            <Route path="/bid-registration" element={<ProtectedRoute><BidRegistrationPage /></ProtectedRoute>} />
            <Route path="/buyer-seller-platform" element={<BuyerSellerPlatformPage />} />
            <Route path="/service-provider-directory" element={<ServiceProviderDirectory />} />
            <Route path="/test-map" element={<TestMapPage />} />
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