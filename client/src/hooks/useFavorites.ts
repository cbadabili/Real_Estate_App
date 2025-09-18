import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analytics } from '../lib/analytics';

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  image?: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    setIsLoading(true);
    try {
      if (user) {
        // Load from server for authenticated users
        const response = await fetch('/api/users/favorites', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFavorites(data.favoriteIds || []);
          setFavoriteProperties(data.properties || []);
        } else if (response.status === 401) {
          // Handle unauthorized access - clear local favorites and redirect or show message
          setFavorites([]);
          setFavoriteProperties([]);
          // Optionally, you could redirect to login or show an error message
          console.warn('Unauthorized access to favorites. User token might be invalid.');
        }
      } else {
        // Load from localStorage for guest users
        const stored = localStorage.getItem('favorites');
        if (stored) {
          const favoriteIds = JSON.parse(stored);
          setFavorites(favoriteIds);
          // Fetch property details for favorites
          if (favoriteIds.length > 0) {
            await fetchFavoriteProperties(favoriteIds);
          }
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Ensure state is reset if an error occurs during loading
      setFavorites([]);
      setFavoriteProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFavoriteProperties = async (favoriteIds: string[]) => {
    try {
      const response = await fetch('/api/properties/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: favoriteIds }),
      });

      if (response.ok) {
        const properties = await response.json();
        setFavoriteProperties(properties);
      }
    } catch (error) {
      console.error('Error fetching favorite properties:', error);
    }
  };

  const addToFavorites = async (propertyId: string) => {
    try {
      const newFavorites = [...favorites, propertyId];
      setFavorites(newFavorites);

      if (user) {
        // Save to server
        await fetch('/api/users/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ propertyId }),
        });
      } else {
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }

      // Track analytics
      analytics.propertyFavorited(propertyId, 'add');

      // Refresh favorite properties
      await loadFavorites();
    } catch (error) {
      console.error('Error adding to favorites:', error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  const removeFromFavorites = async (propertyId: string) => {
    try {
      const newFavorites = favorites.filter(id => id !== propertyId);
      setFavorites(newFavorites);

      if (user) {
        // Remove from server
        await fetch(`/api/users/favorites/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
      } else {
        // Update localStorage
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
      }

      // Track analytics
      analytics.propertyFavorited(propertyId, 'remove');

      // Update favorite properties
      setFavoriteProperties(props => props.filter(p => p.id !== propertyId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
      // Revert on error
      setFavorites(favorites);
    }
  };

  const toggleFavorite = async (propertyId: string) => {
    if (isFavorite(propertyId)) {
      await removeFromFavorites(propertyId);
    } else {
      await addToFavorites(propertyId);
    }
  };

  const isFavorite = (propertyId: string): boolean => {
    return favorites.includes(propertyId);
  };

  const clearAllFavorites = async () => {
    try {
      setFavorites([]);
      setFavoriteProperties([]);

      if (user) {
        await fetch('/api/users/favorites/clear', {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
      } else {
        localStorage.removeItem('favorites');
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  };

  return {
    favorites,
    favoriteProperties,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    refreshFavorites: loadFavorites
  };
};