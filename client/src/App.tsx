import { Route, Switch } from 'wouter';
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
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/properties" component={RealPropertiesPage} />
            <Route path="/rent" component={RentPage} />
            <Route path="/rent-out" component={RentOutPage} />
            <Route path="/buyer-seller-platform" component={BuyerSellerPlatformPage} />
            <Route path="/market-intelligence" component={MarketIntelligencePage} />
            <Route path="/secure-transactions" component={SecureTransactionsPage} />
            <Route path="/communication" component={CommunicationPage} />
            <Route path="/agent-network" component={AgentNetworkPage} />
            <Route path="/sample-properties" component={PropertiesPage} />
            <Route path="/map-search" component={MapSearchPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/property/:id" component={PropertyDetailsPage} />
            <Route path="/fsbo-dashboard" component={FSBODashboard} />
            <Route path="/create-property" component={CreatePropertyPage} />
            <Route path="/create-listing" component={CreateListingPage} />
            <Route path="/agent-dashboard" component={AgentDashboard} />
            <Route path="/test-api" component={TestAPIPage} />
          </Switch>
        </div>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;