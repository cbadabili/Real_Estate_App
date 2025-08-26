import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { 
  botswanaDistricts, 
  getCityByName, 
  getWardsByCity,
  getAllCities,
  getDistrictNames 
} from '../data/botswanaGeography';

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
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [availableWards, setAvailableWards] = useState<string[]>([]);

  const [citySearch, setCitySearch] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const [stateSearch, setStateSearch] = useState('');
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [filteredStates, setFilteredStates] = useState<string[]>([]);

  const [wardSearch, setWardSearch] = useState('');


  // Filter cities based on search input
  useEffect(() => {
    if (citySearch.trim()) {
      const filtered = getAllCities().filter(city =>
        city.name.toLowerCase().includes(citySearch.toLowerCase())
      ).map(city => city.name);
      setFilteredCities(filtered.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setFilteredCities([]);
    }
  }, [citySearch]);

  // Filter districts based on search input
  useEffect(() => {
    if (stateSearch.trim()) {
      const filtered = getDistrictNames().filter(district =>
        district.toLowerCase().includes(stateSearch.toLowerCase())
      );
      setFilteredStates(filtered.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setFilteredStates([]);
    }
  }, [stateSearch]);

  // Auto-populate when city is selected
  useEffect(() => {
    if (selectedCity) {
      const cityData = getCityByName(selectedCity);
      if (cityData) {
        setSelectedState(cityData.district);
        setStateSearch(cityData.district);
        setAvailableWards(getWardsByCity(selectedCity));
      }
    } else {
      setSelectedState('');
      setStateSearch('');
      setAvailableWards([]);
      setSelectedWard('');
    }
  }, [selectedCity]);

  // Notify parent component of changes - prevent infinite loops
  useEffect(() => {
    // Only notify when we have meaningful data
    if (selectedCity && selectedState) {
      onLocationChange({
        city: selectedCity,
        state: selectedState,
        ward: selectedWard
      });
    }
  }, [selectedCity, selectedState, selectedWard]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setCitySearch(city);
    setShowCitySuggestions(false);
  };

  const handleCityInputChange = (value: string) => {
    setCitySearch(value);
    setSelectedCity(value);
    setShowCitySuggestions(true);
  };

  const handleStateSelect = (state: string) => {
    setSelectedState(state);
    setStateSearch(state);
    setShowStateSuggestions(false);
  };

  const handleStateInputChange = (value: string) => {
    setStateSearch(value);
    setSelectedState(value);
    setShowStateSuggestions(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <MapPin className="h-5 w-5 text-beedab-blue" />
        <h3 className="text-lg font-medium text-gray-900">Property Location</h3>
      </div>

      {/* City Input with Auto-suggestions */}
      <div className="relative">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          City *
        </label>
        <input
          type="text"
          value={citySearch}
          onChange={(e) => handleCityInputChange(e.target.value)}
          onFocus={() => setShowCitySuggestions(true)}
          onBlur={() => {
            // Delay hiding to allow click on suggestions
            setTimeout(() => setShowCitySuggestions(false), 200);
          }}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={placeholder.city || "Search cities..."}
        />

        {/* City Suggestions Dropdown */}
        {showCitySuggestions && filteredCities.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{city}</span>
                  <span className="text-sm text-gray-500">
                    {getCityByName(city)?.district}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* State/District - Auto-populated but now editable */}
      <div className="relative">
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          District *
        </label>
        <input
          type="text"
          value={stateSearch}
          onChange={(e) => handleStateInputChange(e.target.value)}
          onFocus={() => setShowStateSuggestions(true)}
          onBlur={() => {
            // Delay hiding to allow click on suggestions
            setTimeout(() => setShowStateSuggestions(false), 200);
          }}
          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={placeholder.state || "Search districts..."}
        />

        {/* State Suggestions Dropdown */}
        {showStateSuggestions && filteredStates.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredStates.map((state) => (
              <button
                key={state}
                onClick={() => handleStateSelect(state)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <span className="font-medium">{state}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Ward/Suburb Selection */}
        {showWards && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ward/Suburb
            </label>
            <div className="relative">
              <input
                type="text"
                value={wardSearch}
                onChange={(e) => setWardSearch(e.target.value)}
                placeholder={placeholder.ward || "Search wards..."}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {wardSearch && availableWards.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {availableWards
                    .filter(ward => ward.toLowerCase().includes(wardSearch.toLowerCase()))
                    .slice(0, 5)
                    .map((ward) => (
                      <button
                        key={ward}
                        onClick={() => {
                          setSelectedWard(ward);
                          setWardSearch(ward);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      >
                        {ward}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

      {/* Location Preview */}
      {selectedCity && selectedState && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Selected Location:</strong><br />
            {selectedWard && `${selectedWard}, `}{selectedCity}, {selectedState}
          </p>
          {!selectedCity.trim() || !selectedState.trim() ? (
            <p className="text-sm text-red-600 mt-1">
              Please ensure all location fields are properly filled.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GeographySelector;