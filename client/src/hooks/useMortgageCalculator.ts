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
    mutationFn: (data: MortgageCalculationData): Promise<MortgageCalculationResult> =>
      apiRequest('/api/mortgage/calculate', {
        method: 'POST',
        body: data,
      }),
  });
};