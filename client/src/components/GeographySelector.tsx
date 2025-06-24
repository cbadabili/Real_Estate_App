import React, { useState, useEffect } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { 
  botswanaDistricts, 
  getCityByName, 
  getWardsByCity,
  getAllCities,
  getAllDistricts 
} from '../data/botswanaGeography';

interface GeographySelectorProps {
  onLocationChange: (location: {
    city: string;
    state: string;
    ward?: string;
  }) => void;
  initialCity?: string;
  initialState?: string;
  initialWard?: string;
  className?: string;
}

export const GeographySelector: React.FC<GeographySelectorProps> = ({
  onLocationChange,
  initialCity = '',
  initialState = '',
  initialWard = '',
  className = ''
}) => {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedWard, setSelectedWard] = useState(initialWard);
  
  const [availableWards, setAvailableWards] = useState<string[]>([]);
  
  const [citySearch, setCitySearch] = useState(initialCity);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  
  const [stateSearch, setStateSearch] = useState(initialState);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [filteredStates, setFilteredStates] = useState<string[]>([]);



  // Filter cities based on search input
  useEffect(() => {
    if (citySearch.trim()) {
      const filtered = getAllCities().filter(city =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      );
      setFilteredCities(filtered.slice(0, 10)); // Limit to 10 suggestions
    } else {
      setFilteredCities([]);
    }
  }, [citySearch]);

  // Filter districts based on search input
  useEffect(() => {
    if (stateSearch.trim()) {
      const filtered = getAllDistricts().filter(district =>
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
        setSelectedState(cityData.district.name);
        setStateSearch(cityData.district.name);
        setAvailableWards(cityData.city.wards);
      }
    } else {
      setSelectedState('');
      setStateSearch('');
      setAvailableWards([]);
      setSelectedWard('');
    }
  }, [selectedCity]);

  // Notify parent component of changes
  useEffect(() => {
    if (selectedCity && selectedState) {
      onLocationChange({
        city: selectedCity,
        state: selectedState,
        ward: selectedWard
      });
    }
  }, [selectedCity, selectedState, selectedWard, onLocationChange]);

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
          placeholder="Start typing city name..."
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
                    {getCityByName(city)?.district.name}
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
          placeholder="Select city first or type district name..."
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

      {/* Ward/Area - Enhanced with comprehensive options but optional */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Ward/Area
        </label>
        {availableWards.length > 0 ? (
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Select ward/area (optional)</option>
            {availableWards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter ward/area (optional)"
          />
        )}
      </div>

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