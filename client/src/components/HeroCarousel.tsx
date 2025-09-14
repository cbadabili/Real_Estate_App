
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square } from 'lucide-react';

interface HeroProperty {
  id: number;
  title: string;
  price: number;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  heroSlot: {
    id: number;
    position: number;
    starts_at: number;
    ends_at: number;
  };
}

const HeroCarousel = () => {
  const [heroProperties, setHeroProperties] = useState<HeroProperty[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroProperties();
  }, []);

  useEffect(() => {
    if (heroProperties.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroProperties.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(timer);
    }
  }, [heroProperties.length]);

  const fetchHeroProperties = async () => {
    try {
      const response = await fetch('/api/hero');
      const data = await response.json();
      if (data.success) {
        setHeroProperties(data.data);
      }
    } catch (error) {
      console.error('Error fetching hero properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProperties.length) % heroProperties.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <div className="relative h-96 bg-gray-200 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue"></div>
        </div>
      </div>
    );
  }

  if (heroProperties.length === 0) {
    return null; // Don't show carousel if no hero properties
  }

  const currentProperty = heroProperties[currentSlide];

  return (
    <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentProperty.images?.[0] || '/placeholder-property.jpg'}
          alt={currentProperty.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      </div>

      {/* Navigation Arrows */}
      {heroProperties.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="p-6 text-white w-full">
          <div className="flex items-center mb-2">
            <span className="bg-beedab-blue px-2 py-1 rounded text-sm font-medium mr-3">
              Featured
            </span>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              {currentProperty.location}, {currentProperty.city}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">{currentProperty.title}</h2>
          
          <div className="flex items-center space-x-4 mb-3">
            {currentProperty.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                {currentProperty.bedrooms}
              </div>
            )}
            {currentProperty.bathrooms > 0 && (
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                {currentProperty.bathrooms}
              </div>
            )}
            {currentProperty.area > 0 && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                {currentProperty.area}m²
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold">
              BWP {currentProperty.price.toLocaleString()}
            </div>
            <button
              onClick={() => window.location.href = `/properties/${currentProperty.id}`}
              className="bg-beedab-blue hover:bg-beedab-darkblue text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      {heroProperties.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroProperties.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroCarousel;
