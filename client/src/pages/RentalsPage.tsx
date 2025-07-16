import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

interface Rental {
  id: number;
  title: string;
  description?: string;
  price: number;
  location: string;
  city: string;
  district?: string;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
  furnished: boolean;
  pet_friendly: boolean;
  parking: boolean;
  garden: boolean;
  security: boolean;
  air_conditioning: boolean;
  internet: boolean;
  utilities_included: boolean;
  available_date?: string;
  lease_duration?: number;
  deposit_amount?: number;
  property_size?: number;
  images?: string;
  status: string;
}

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/rentals');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setRentals(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch rentals');
      }
    } catch (err) {
      console.error('Error fetching rentals:', err);
      setError('Failed to load rentals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Rentals</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchRentals}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rental Properties</h1>
          <Button onClick={() => window.location.href = '/rental-listing-wizard'}>
            List Your Property
          </Button>
        </div>

        {rentals.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">No rental properties available</h2>
            <p className="text-gray-500 mt-2">Check back later for new listings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map((rental) => (
              <Card key={rental.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{rental.title}</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-3">
                    {formatPrice(rental.price)}/month
                  </p>
                  <div className="text-sm text-gray-600 mb-3">
                    <p>📍 {rental.location}, {rental.city}</p>
                    <p>🛏️ {rental.bedrooms} bed • 🚿 {rental.bathrooms} bath</p>
                    <p>🏠 {rental.property_type}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {rental.furnished && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Furnished
                      </span>
                    )}
                    {rental.pet_friendly && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        Pet Friendly
                      </span>
                    )}
                    {rental.parking && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        Parking
                      </span>
                    )}
                    {rental.utilities_included && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        Utilities Included
                      </span>
                    )}
                  </div>

                  {rental.description && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                      {rental.description}
                    </p>
                  )}

                  <Button 
                    className="w-full"
                    onClick={() => window.location.href = `/rental/${rental.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}