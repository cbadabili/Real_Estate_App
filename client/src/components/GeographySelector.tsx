import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin, Loader2 } from 'lucide-react';
import { 
  useDistricts, 
  useSettlements, 
  useWards, 
  useLocationSearch,
  District,
  Settlement,
  Ward
} from '../hooks/useLocations';

interface GeographySelectorProps {
  onLocationChange: (location: {
    state: string;
    city: string;
    ward: string;
  }) => void;
  className?: string;
  placeholder?: {
    state?: string;
    city?: string;
    ward?: string;
  };
  showWards?: boolean;
}

const GeographySelector: React.FC<GeographySelectorProps> = ({ 
  onLocationChange, 
  className = '',
  placeholder = {},
  showWards = true
}) => {
  // State for selected values
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // State for search inputs
  const [districtSearch, setDistrictSearch] = useState('');
  const [settlementSearch, setSettlementSearch] = useState('');
  const [wardSearch, setWardSearch] = useState('');

  // State for dropdown visibility
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);
  const [showSettlementSuggestions, setShowSettlementSuggestions] = useState(false);
  const [showWardSuggestions, setShowWardSuggestions] = useState(false);

  // API hooks
  const { data: districtsData, isLoading: loadingDistricts } = useDistricts();
  const { data: settlementsData, isLoading: loadingSettlements } = useSettlements(selectedDistrict?.id);
  const { data: wardsData, isLoading: loadingWards } = useWards(selectedSettlement?.id);

  // Search hooks for auto-suggestions
  const { data: districtSearchData } = useLocationSearch(
    districtSearch.length >= 2 ? districtSearch : '', 
    'district', 
    10
  );
  const { data: settlementSearchData } = useLocationSearch(
    settlementSearch.length >= 2 ? settlementSearch : '', 
    'settlement', 
    10
  );
  const { data: wardSearchData } = useLocationSearch(
    wardSearch.length >= 2 ? wardSearch : '', 
    'ward', 
    10
  );

  // Get filtered suggestions
  const filteredDistricts = districtSearchData?.data.districts || [];
  const filteredSettlements = settlementSearchData?.data.settlements.map(s => s.settlement) || [];
  const filteredWards = wardSearchData?.data.wards.map(w => w.ward) || [];

  // Reset dependent selections when parent changes
  useEffect(() => {
    if (selectedDistrict) {
      setSelectedSettlement(null);
      setSettlementSearch('');
      setSelectedWard(null);
      setWardSearch('');
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedSettlement) {
      setSelectedWard(null);
      setWardSearch('');
    }
  }, [selectedSettlement]);

  // Notify parent component of changes
  useEffect(() => {
    if (selectedDistrict && selectedSettlement) {
      onLocationChange({
        state: selectedDistrict.name,
        city: selectedSettlement.name,
        ward: selectedWard?.name || ''
      });
    }
  }, [selectedDistrict, selectedSettlement, selectedWard, onLocationChange]);

  // Handle district selection
  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setDistrictSearch(district.name);
    setShowDistrictSuggestions(false);
  };

  const handleDistrictInputChange = (value: string) => {
    setDistrictSearch(value);
    setShowDistrictSuggestions(true);
    
    // If the value exactly matches a district, select it
    const exactMatch = districtsData?.data.find(d => 
      d.name.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setSelectedDistrict(exactMatch);
    } else {
      setSelectedDistrict(null);
    }
  };

  // Handle settlement selection
  const handleSettlementSelect = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setSettlementSearch(settlement.name);
    setShowSettlementSuggestions(false);

    // Auto-select the district if not already selected
    if (!selectedDistrict && settlementsData?.data.district) {
      setSelectedDistrict(settlementsData.data.district);
      setDistrictSearch(settlementsData.data.district.name);
    }
  };

  const handleSettlementInputChange = (value: string) => {
    setSettlementSearch(value);
    setShowSettlementSuggestions(true);
    
    // If the value exactly matches a settlement, select it
    const exactMatch = settlementsData?.data.settlements.find(s => 
      s.name.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setSelectedSettlement(exactMatch);
    } else {
      setSelectedSettlement(null);
    }
  };

  // Handle ward selection
  const handleWardSelect = (ward: Ward) => {
    setSelectedWard(ward);
    setWardSearch(ward.name);
    setShowWardSuggestions(false);
  };

  const handleWardInputChange = (value: string) => {
    setWardSearch(value);
    setShowWardSuggestions(true);
    
    // If the value exactly matches a ward, select it
    const exactMatch = wardsData?.data.wards.find(w => 
      w.name.toLowerCase() === value.toLowerCase()
    );
    if (exactMatch) {
      setSelectedWard(exactMatch);
    } else {
      setSelectedWard(null);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-beedab-blue" />
        <h3 className="text-lg font-medium text-gray-900">Property Location</h3>
      </div>

      {/* District Input with Auto-suggestions */}
      <div className="relative">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          District *
        </label>
        <div className="relative">
          <input
            type="text"
            value={districtSearch}
            onChange={(e) => handleDistrictInputChange(e.target.value)}
            onFocus={() => setShowDistrictSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowDistrictSuggestions(false), 200);
            }}
            className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={placeholder.state || "Search districts..."}
          />
          {loadingDistricts && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* District Suggestions Dropdown */}
        {showDistrictSuggestions && filteredDistricts.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredDistricts.map((district) => (
              <button
                key={district.id}
                onClick={() => handleDistrictSelect(district)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{district.name}</span>
                  <span className="text-sm text-gray-500">
                    {district.type} • {district.region}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Settlement/City Input */}
      <div className="relative">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          City/Town/Village *
        </label>
        <div className="relative">
          <input
            type="text"
            value={settlementSearch}
            onChange={(e) => handleSettlementInputChange(e.target.value)}
            onFocus={() => setShowSettlementSuggestions(true)}
            onBlur={() => {
              setTimeout(() => setShowSettlementSuggestions(false), 200);
            }}
            className="w-full px-4 py-3 pr-10 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder={placeholder.city || "Search cities, towns, villages..."}
            disabled={!selectedDistrict}
          />
          {loadingSettlements && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
          )}
        </div>

        {/* Settlement Suggestions Dropdown */}
        {showSettlementSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {/* Show district settlements if we have them */}
            {settlementsData?.data.settlements.map((settlement) => (
              <button
                key={settlement.id}
                onClick={() => handleSettlementSelect(settlement)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{settlement.name}</span>
                  <span className="text-sm text-gray-500">
                    {settlement.type} • Pop: {settlement.population.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
            
            {/* Show search results if we have them */}
            {filteredSettlements.map((settlement) => (
              <button
                key={`search-${settlement.id}`}
                onClick={() => handleSettlementSelect(settlement)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-t border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{settlement.name}</span>
                  <span className="text-sm text-gray-500">
                    {settlement.type} • Pop: {settlement.population.toLocaleString()}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ward/Suburb Selection */}
      {showWards && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ward/Suburb
          </label>
          <div className="relative">
            <input
              type="text"
              value={wardSearch}
              onChange={(e) => handleWardInputChange(e.target.value)}
              onFocus={() => setShowWardSuggestions(true)}
              onBlur={() => {
                setTimeout(() => setShowWardSuggestions(false), 200);
              }}
              placeholder={placeholder.ward || "Search wards..."}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedSettlement}
            />
            {loadingWards && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
          </div>

          {/* Ward Suggestions Dropdown */}
          {showWardSuggestions && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {/* Show settlement wards if we have them */}
              {wardsData?.data.wards.map((ward) => (
                <button
                  key={ward.id}
                  onClick={() => handleWardSelect(ward)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ward.name}</span>
                    <span className="text-sm text-gray-500">{ward.ward_number}</span>
                  </div>
                </button>
              ))}
              
              {/* Show search results if we have them */}
              {filteredWards.map((ward) => (
                <button
                  key={`search-${ward.id}`}
                  onClick={() => handleWardSelect(ward)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-t border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{ward.name}</span>
                    <span className="text-sm text-gray-500">{ward.ward_number}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Location Preview */}
      {selectedDistrict && selectedSettlement && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected Location:</strong><br />
            {selectedWard && `${selectedWard.name}, `}{selectedSettlement.name}, {selectedDistrict.name}
          </p>
          {selectedSettlement && (
            <p className="text-xs text-blue-600 mt-1">
              {selectedSettlement.type} • Population: {selectedSettlement.population.toLocaleString()} • {selectedDistrict.region}
            </p>
          )}
        </div>
      )}

      {/* Loading state */}
      {loadingDistricts && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Loading districts...</span>
        </div>
      )}
    </div>
  );
};

export default GeographySelector;