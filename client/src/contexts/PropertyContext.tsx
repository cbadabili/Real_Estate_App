import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  listingType: 'mls' | 'fsbo';
  images: string[];
  features: string[];
  description: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

interface PropertyContextType {
  properties: Property[];
  savedProperties: string[];
  searchFilters: any;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  saveProperty: (id: string) => void;
  unsaveProperty: (id: string) => void;
  setSearchFilters: (filters: any) => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

interface PropertyProviderProps {
  children: ReactNode;
}

export const PropertyProvider: React.FC<PropertyProviderProps> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [savedProperties, setSavedProperties] = useState<string[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    priceRange: [0, 2000000],
    propertyType: 'all',
    bedrooms: 'any',
    bathrooms: 'any',
    listingType: 'all'
  });

  const addProperty = (property: Property) => {
    setProperties(prev => [...prev, property]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(prev => 
      prev.map(property => 
        property.id === id ? { ...property, ...updates } : property
      )
    );
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(property => property.id !== id));
  };

  const saveProperty = (id: string) => {
    setSavedProperties(prev => [...prev, id]);
  };

  const unsaveProperty = (id: string) => {
    setSavedProperties(prev => prev.filter(propertyId => propertyId !== id));
  };

  const value = {
    properties,
    savedProperties,
    searchFilters,
    addProperty,
    updateProperty,
    deleteProperty,
    saveProperty,
    unsaveProperty,
    setSearchFilters
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};