
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, Home, MapPin, TrendingUp } from 'lucide-react';

interface PropertyValuationData {
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareMeters: number;
  yearBuilt: number;
  condition: string;
}

interface ValuationResult {
  estimatedValue: number;
  confidenceLevel: string;
  priceRange: {
    low: number;
    high: number;
  };
  comparableProperties: number;
}

export default function PropertyValuationTool() {
  const [propertyData, setPropertyData] = useState<PropertyValuationData>({
    address: '',
    propertyType: 'house',
    bedrooms: 3,
    bathrooms: 2,
    squareMeters: 120,
    yearBuilt: 2010,
    condition: 'good'
  });

  const [valuation, setValuation] = useState<ValuationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateValuation = async () => {
    setIsCalculating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock valuation calculation based on property data
    const baseValue = 800000; // Base value in BWP
    const bedroomMultiplier = propertyData.bedrooms * 50000;
    const bathroomMultiplier = propertyData.bathrooms * 30000;
    const sizeMultiplier = propertyData.squareMeters * 4000;
    const ageAdjustment = Math.max(0, (2024 - propertyData.yearBuilt) * -2000);
    
    const conditionMultiplier = {
      excellent: 1.15,
      good: 1.0,
      fair: 0.85,
      poor: 0.7
    }[propertyData.condition] || 1.0;

    const estimatedValue = Math.round(
      (baseValue + bedroomMultiplier + bathroomMultiplier + sizeMultiplier + ageAdjustment) * conditionMultiplier
    );

    setValuation({
      estimatedValue,
      confidenceLevel: 'High',
      priceRange: {
        low: Math.round(estimatedValue * 0.9),
        high: Math.round(estimatedValue * 1.1)
      },
      comparableProperties: Math.floor(Math.random() * 20) + 5
    });

    setIsCalculating(false);
  };

  const handleInputChange = (field: keyof PropertyValuationData, value: string | number) => {
    setPropertyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Property Valuation Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                value={propertyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter property address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type</Label>
              <select
                id="propertyType"
                value={propertyData.propertyType}
                onChange={(e) => handleInputChange('propertyType', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={propertyData.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={propertyData.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="squareMeters">Size (m²)</Label>
              <Input
                id="squareMeters"
                type="number"
                value={propertyData.squareMeters}
                onChange={(e) => handleInputChange('squareMeters', parseInt(e.target.value))}
                min="20"
                max="2000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={propertyData.yearBuilt}
                onChange={(e) => handleInputChange('yearBuilt', parseInt(e.target.value))}
                min="1950"
                max="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Property Condition</Label>
              <select
                id="condition"
                value={propertyData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={calculateValuation}
            disabled={isCalculating || !propertyData.address}
            className="w-full"
          >
            {isCalculating ? 'Calculating...' : 'Calculate Property Value'}
          </Button>

          {/* Valuation Results */}
          {valuation && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Valuation Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(valuation.estimatedValue)}
                  </div>
                  <div className="text-sm text-gray-600">Estimated Value</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-lg font-semibold text-green-600">
                    {valuation.confidenceLevel}
                  </div>
                  <div className="text-sm text-gray-600">Confidence Level</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-sm font-medium">
                    {formatCurrency(valuation.priceRange.low)} - {formatCurrency(valuation.priceRange.high)}
                  </div>
                  <div className="text-sm text-gray-600">Price Range</div>
                </div>

                <div className="text-center p-4 bg-white rounded-lg shadow">
                  <div className="text-lg font-semibold">
                    {valuation.comparableProperties}
                  </div>
                  <div className="text-sm text-gray-600">Comparable Properties</div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> This is an automated estimate for informational purposes only. 
                  For accurate valuations, please consult with a certified property appraiser.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
