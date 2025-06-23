import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export interface MortgageCalculationData {
  loanAmount: number;
  interestRate: number;
  loanTermYears: number;
  downPayment?: number;
}

export interface MortgageCalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  principal: number;
}

export const useMortgageCalculator = () => {
  return useMutation({
    mutationFn: async (data: MortgageCalculationData): Promise<MortgageCalculationResult> => {
      const response = await fetch('/api/mortgage/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Trigger contextual ad for mortgage calculation
      const event = new CustomEvent('mortgageCalculated');
      window.dispatchEvent(event);
    }
  });
};