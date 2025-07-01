import { useState } from 'react';
import { Shield, MapPin, Plus, Filter } from 'lucide-react';
import PlotSearchFilters from '../components/PlotSearchFilters';
import PlotListingCard from '../components/PlotListingCard';
import InteractiveMap from '../components/InteractiveMap';

const PlotsPage = () => {
  const [plots, setPlots] = useState([
    {
      id: '1',
      title: 'Residential Plot in Mogoditshane Block 5',
      location: 'Mogoditshane Block 5',
      size: 1000,
      sizeUnit: 'm²',
      price: 85000,
      currency: 'BWP',
      plotType: 'residential',
      hasWater: true,
      hasElectricity: true,
      serviced: true,
      description: 'Prime residential plot in established area. All utilities available, tarred road access. Close to schools and shopping centers.',
      contactPhone: '71234567',
      contactWhatsApp: '71234567',
      sellerName: 'Thabo Mogami',
      images: [],
      postedDate: '2 days ago',
      featured: true
    },
    {
      id: '2',
      title: 'Farm Land - Mahalapye District',
      location: 'Mahalapye',
      size: 5,
      sizeUnit: 'hectares',
      price: 120000,
      currency: 'BWP',
      plotType: 'farm',
      hasWater: false,
      hasElectricity: false,
      serviced: false,
      description: 'Excellent farming land suitable for cattle ranching or crop farming. Good soil quality, seasonal access road.',
      contactPhone: '72345678',
      sellerName: 'Keabetswe Mthombeni',
      images: [],
      postedDate: '1 week ago'
    },
    {
      id: '3',
      title: 'Commercial Plot - Pitsane Junction',
      location: 'Pitsane',
      size: 2000,
      sizeUnit: 'm²',
      price: 150000,
      currency: 'BWP',
      plotType: 'commercial',
      hasWater: true,
      hasElectricity: true,
      serviced: true,
      description: 'Strategic commercial plot at busy junction. Perfect for retail or service business. High visibility location.',
      contactPhone: '73456789',
      contactWhatsApp: '73456789',
      sellerName: 'Neo Seretse',
      images: [],
      postedDate: '3 days ago'
    }
  ]);
  const [filteredPlots, setFilteredPlots] = useState(plots);
  const [currentFilters, setCurrentFilters] = useState({
    location: '',
    minSize: null,
    maxSize: null,
    sizeUnit: 'm²',
    minPrice: null,
    maxPrice: null,
    plotType: 'all',
    hasWater: null,
    hasElectricity: null,
    serviced: null
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const mapLocations = [
    {
      id: 'mogoditshane',
      name: 'Mogoditshane Block 5',
      coordinates: [25.85, -24.65],
      plotCount: 12,
      averagePrice: 90000,
      popularSize: '900-1000m²',
      description: 'Popular residential area with good infrastructure'
    },
    {
      id: 'mahalapye',
      name: 'Mahalapye',
      coordinates: [26.18, -23.10],
      plotCount: 8,
      averagePrice: 110000,
      popularSize: '4-6 hectares',
      description: 'Agricultural area with good farming potential'
    },
    {
      id: 'pitsane',
      name: 'Pitsane',
      coordinates: [25.73, -24.90],
      plotCount: 5,
      averagePrice: 140000,
      popularSize: '1500-2000m²',
      description: 'Growing commercial and residential area'
    }
  ];

  const handleFiltersChange = (filters) => {
    setCurrentFilters(filters);
    
    let filtered = plots.filter(plot => {
      if (filters.location && plot.location !== filters.location) return false;
      if (filters.plotType !== 'all' && plot.plotType !== filters.plotType) return false;
      if (filters.minPrice && plot.price < filters.minPrice) return false;
      if (filters.maxPrice && plot.price > filters.maxPrice) return false;
      if (filters.hasWater === true && !plot.hasWater) return false;
      if (filters.hasElectricity === true && !plot.hasElectricity) return false;
      if (filters.serviced === true && !plot.serviced) return false;
      
      // Size filtering with unit conversion
      if (filters.minSize || filters.maxSize) {
        let plotSizeInM2 = plot.sizeUnit === 'hectares' ? plot.size * 10000 : plot.size;
        let minSizeInM2 = filters.sizeUnit === 'hectares' && filters.minSize ? filters.minSize * 10000 : filters.minSize;
        let maxSizeInM2 = filters.sizeUnit === 'hectares' && filters.maxSize ? filters.maxSize * 10000 : filters.maxSize;
        
        if (minSizeInM2 && plotSizeInM2 < minSizeInM2) return false;
        if (maxSizeInM2 && plotSizeInM2 > maxSizeInM2) return false;
      }
      
      return true;
    });
    
    setFilteredPlots(filtered);
  };

  const handleContact = (contactInfo) => {
    console.log('Contact initiated:', contactInfo);
    // Track contact events for analytics
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location.id);
    setCurrentFilters({ ...currentFilters, location: location.name });
    setActiveTab('browse');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Plots & Land</h1>
              <p className="text-gray-600 mt-1">Find your perfect plot in Botswana's prime locations</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-sm text-green-600">
                <Shield className="h-4 w-4" />
                <span>Verified Listings Available</span>
              </div>
              <button
                onClick={() => setShowListingForm(true)}
                className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                List Your Plot
              </button>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-8 mt-6">
            {[
              { id: 'browse', label: 'Browse Plots', icon: Filter },
              { id: 'map', label: 'Map View', icon: MapPin },
              { id: 'sell', label: 'Sell Your Plot', icon: Plus }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 py-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? 'border-beedab-blue text-beedab-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <PlotSearchFilters 
                onFiltersChange={handleFiltersChange}
                className="sticky top-8"
              />
            </div>
            
            {/* Plots Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredPlots.length} plots found
                </h2>
                <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue">
                  <option>Sort by: Most Recent</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Size: Largest First</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPlots.map(plot => (
                  <PlotListingCard
                    key={plot.id}
                    plot={plot}
                    onContact={handleContact}
                  />
                ))}
              </div>
              
              {filteredPlots.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No plots found</h3>
                  <p className="text-gray-500">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            locations={mapLocations}
            onLocationClick={handleLocationClick}
            selectedLocation={selectedLocation}
          />
        )}

        {activeTab === 'sell' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">List Your Plot</h2>
            <p className="text-gray-600 mb-4">Complete the form below to list your plot for sale.</p>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Residential Plot in Mogoditshane Block 5 - 1000m²"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    <option value="">Select Location</option>
                    {mapLocations.map(location => (
                      <option key={location.id} value={location.name}>{location.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Size *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Size"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    />
                    <select
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    >
                      <option value="m²">m²</option>
                      <option value="hectares">hectares</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (BWP) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 85000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plot Type *
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    <option value="residential">Residential</option>
                    <option value="farm">Farm Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                      />
                      <span className="text-sm">Water Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                      />
                      <span className="text-sm">Electricity Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
                      />
                      <span className="text-sm">Fully Serviced Plot</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your plot - location details, nearby amenities, access roads, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., 71234567"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="Same as phone or different"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-beedab-blue text-white px-6 py-3 rounded-lg hover:bg-beedab-darkblue transition-colors"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlotsPage;