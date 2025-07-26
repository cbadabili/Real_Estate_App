
import React from 'react';
import { PROPERTY_TYPES, PROPERTY_TYPE_LABELS } from '../../../shared/schema';

interface PropertyTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  showAllOption?: boolean;
}

export const PropertyTypeSelector: React.FC<PropertyTypeSelectorProps> = ({
  value,
  onChange,
  className = '',
  placeholder = 'Select Property Type',
  showAllOption = false
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue focus:border-transparent ${className}`}
    >
      <option value="">{placeholder}</option>
      {showAllOption && <option value="all">All Types</option>}
      {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
        <option key={key} value={key}>{label}</option>
      ))}
    </select>
  );
};

export default PropertyTypeSelector;
