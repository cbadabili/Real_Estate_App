import React from 'react';
import { UnifiedMap } from '../maps/UnifiedMap';

interface Property {
  id: number | string;
  title: string;
  latitude: number;
  longitude: number;
  price: number;
  propertyType?: string;
  address?: string;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  description?: string;
}

interface PropertyMapProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  className?: string;
  height?: string;
  selectedProperty?: Property | null;
}

export const PropertyMap: React.FC<PropertyMapProps> = (props) => {
  return (
    <UnifiedMap
      {...props}
      showControls={true}
      showPropertyCount={true}
    />
  );
};

export default PropertyMap;