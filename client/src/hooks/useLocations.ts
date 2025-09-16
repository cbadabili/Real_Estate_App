import { useQuery } from '@tanstack/react-query';

// Types for the location API responses
export interface District {
  id: number;
  code: string;
  name: string;
  type: string;
  region: string;
  population: number;
  area_km2: number;
  population_density: number;
  created_at: string;
  updated_at: string;
}

export interface Settlement {
  id: number;
  district_id: number;
  name: string;
  type: string;
  population: number;
  growth_rate?: number;
  latitude: number;
  longitude: number;
  post_code: string;
  is_major: boolean;
  created_at: string;
  updated_at: string;
}

export interface Ward {
  id: number;
  settlement_id: number;
  name: string;
  ward_number: string;
  constituency: string;
  population?: number;
  area_description?: string;
  created_at: string;
  updated_at: string;
}

export interface Plot {
  id: number;
  ward_id: number;
  settlement_id: number;
  plot_number?: string;
  street_name: string;
  street_number?: string;
  block_name?: string;
  full_address: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface DistrictsResponse {
  success: boolean;
  data: District[];
  count: number;
}

export interface SettlementsResponse {
  success: boolean;
  data: {
    district: District;
    settlements: Settlement[];
  };
  count: number;
}

export interface WardsResponse {
  success: boolean;
  data: {
    settlement: Settlement;
    district: District;
    wards: Ward[];
  };
  count: number;
}

export interface SearchResponse {
  success: boolean;
  data: {
    districts: District[];
    settlements: Array<{
      settlement: Settlement;
      district: District;
    }>;
    wards: Array<{
      ward: Ward;
      settlement: Settlement;
      district: District;
    }>;
    plots: Array<{
      plot: Plot;
      ward: Ward;
      settlement: Settlement;
      district: District;
    }>;
  };
  query: string;
  type: string;
  totalResults: number;
  limit: number;
}

// Hook to fetch all districts
export const useDistricts = () => {
  return useQuery<DistrictsResponse>({
    queryKey: ['districts'],
    queryFn: async () => {
      const response = await fetch('/api/locations/districts');
      if (!response.ok) {
        throw new Error('Failed to fetch districts');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

// Hook to fetch settlements for a specific district
export const useSettlements = (districtId?: number) => {
  return useQuery<SettlementsResponse>({
    queryKey: ['settlements', districtId],
    queryFn: async () => {
      if (!districtId) {
        throw new Error('District ID is required');
      }
      const response = await fetch(`/api/locations/districts/${districtId}/settlements`);
      if (!response.ok) {
        throw new Error('Failed to fetch settlements');
      }
      return response.json();
    },
    enabled: !!districtId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to fetch wards for a specific settlement
export const useWards = (settlementId?: number) => {
  return useQuery<WardsResponse>({
    queryKey: ['wards', settlementId],
    queryFn: async () => {
      if (!settlementId) {
        throw new Error('Settlement ID is required');
      }
      const response = await fetch(`/api/locations/settlements/${settlementId}/wards`);
      if (!response.ok) {
        throw new Error('Failed to fetch wards');
      }
      return response.json();
    },
    enabled: !!settlementId,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to search locations across all levels
export const useLocationSearch = (query: string, type: string = 'all', limit: number = 20) => {
  return useQuery<SearchResponse>({
    queryKey: ['location-search', query, type, limit],
    queryFn: async () => {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }
      const params = new URLSearchParams({
        q: query,
        type,
        limit: limit.toString(),
      });
      const response = await fetch(`/api/locations/search?${params}`);
      if (!response.ok) {
        throw new Error('Failed to search locations');
      }
      return response.json();
    },
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // Shorter cache for search results
  });
};

// Helper function to get settlement by name from search
export const useSettlementByName = (name: string) => {
  const { data: searchData, ...rest } = useLocationSearch(name, 'settlement', 5);
  
  const settlement = searchData?.data.settlements.find(
    s => s.settlement.name.toLowerCase() === name.toLowerCase()
  );
  
  return {
    data: settlement,
    ...rest,
  };
};

// Helper function to get district by name from search
export const useDistrictByName = (name: string) => {
  const { data: searchData, ...rest } = useLocationSearch(name, 'district', 5);
  
  const district = searchData?.data.districts.find(
    d => d.name.toLowerCase() === name.toLowerCase()
  );
  
  return {
    data: district,
    ...rest,
  };
};