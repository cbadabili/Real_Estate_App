import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  listingType?: string;
  status?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'price' | 'date' | 'size' | 'bedrooms';
  sortOrder?: 'asc' | 'desc';
}

export const useProperties = (filters?: PropertyFilters) => {
  const queryParams = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
  }

  const queryString = queryParams.toString();
  const url = `/api/properties${queryString ? `?${queryString}` : ''}`;

  return useQuery({
    queryKey: ['/api/properties', filters],
    queryFn: async () => {
      const response = await fetch(url, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    },
  });
};

export const useProperty = (id: number) => {
  return useQuery({
    queryKey: ['/api/properties', id],
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: any) =>
      apiRequest('/api/properties', {
        method: 'POST',
        body: propertyData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      apiRequest(`/api/properties/${id}`, {
        method: 'PUT',
        body: updates,
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      queryClient.invalidateQueries({ queryKey: ['/api/properties', id] });
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) =>
      apiRequest(`/api/properties/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
    },
  });
};

export const useUserProperties = (userId: number) => {
  return useQuery({
    queryKey: ['/api/users', userId, 'properties'],
    enabled: !!userId,
  });
};