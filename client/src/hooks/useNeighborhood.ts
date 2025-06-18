import { useQuery } from '@tanstack/react-query';

export interface NeighborhoodData {
  zipCode: string;
  demographics: {
    medianIncome: number;
    populationDensity: number;
    averageAge: number;
  };
  schools: Array<{
    name: string;
    rating: number;
    distance: number;
  }>;
  amenities: Array<{
    name: string;
    type: string;
    distance: number;
  }>;
  walkScore: number;
  crimeIndex: number;
}

export const useNeighborhood = (zipCode: string) => {
  return useQuery({
    queryKey: ['/api/neighborhoods', zipCode],
    enabled: !!zipCode && zipCode.length >= 5,
  });
};