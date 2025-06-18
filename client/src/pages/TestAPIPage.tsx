import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useMortgageCalculator } from '../hooks/useMortgageCalculator';
import { useNeighborhood } from '../hooks/useNeighborhood';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const TestAPIPage = () => {
  const [mortgageData, setMortgageData] = useState({
    loanAmount: 500000,
    interestRate: 6.5,
    loanTermYears: 30,
    downPayment: 100000
  });

  const { data: properties, isLoading: propertiesLoading, error: propertiesError } = useProperties({
    limit: 10,
    status: 'active'
  });

  const mortgageCalculation = useMortgageCalculator();
  const { data: neighborhoodData, isLoading: neighborhoodLoading } = useNeighborhood('78701');

  const handleCalculateMortgage = () => {
    mortgageCalculation.mutate(mortgageData);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">API Testing Dashboard</h1>
        
        {/* Properties Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Properties API</h2>
          {propertiesLoading && <LoadingSpinner />}
          {propertiesError && (
            <div className="text-red-600">Error: {propertiesError.message}</div>
          )}
          {properties && (
            <div>
              <p className="text-green-600 mb-2">✓ Successfully loaded {properties.length} properties</p>
              <div className="grid gap-4">
                {properties.slice(0, 3).map((property: any) => (
                  <div key={property.id} className="border border-neutral-200 rounded p-4">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-neutral-600">{property.city}, {property.state}</p>
                    <p className="text-lg font-bold text-primary-600">${property.price}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mortgage Calculator Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Mortgage Calculator API</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Loan Amount</label>
              <input
                type="number"
                value={mortgageData.loanAmount}
                onChange={(e) => setMortgageData(prev => ({ ...prev, loanAmount: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={mortgageData.interestRate}
                onChange={(e) => setMortgageData(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loan Term (Years)</label>
              <input
                type="number"
                value={mortgageData.loanTermYears}
                onChange={(e) => setMortgageData(prev => ({ ...prev, loanTermYears: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Down Payment</label>
              <input
                type="number"
                value={mortgageData.downPayment}
                onChange={(e) => setMortgageData(prev => ({ ...prev, downPayment: Number(e.target.value) }))}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md"
              />
            </div>
          </div>
          <button
            onClick={handleCalculateMortgage}
            disabled={mortgageCalculation.isPending}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {mortgageCalculation.isPending ? <LoadingSpinner size="sm" /> : 'Calculate'}
          </button>
          
          {mortgageCalculation.data && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="font-semibold text-green-800 mb-2">Calculation Results:</h3>
              <div className="grid grid-cols-2 gap-4">
                <p><strong>Monthly Payment:</strong> ${mortgageCalculation.data.monthlyPayment.toLocaleString()}</p>
                <p><strong>Total Interest:</strong> ${mortgageCalculation.data.totalInterest.toLocaleString()}</p>
                <p><strong>Total Payment:</strong> ${mortgageCalculation.data.totalPayment.toLocaleString()}</p>
                <p><strong>Principal:</strong> ${mortgageCalculation.data.principal.toLocaleString()}</p>
              </div>
            </div>
          )}
          
          {mortgageCalculation.error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">Error: {mortgageCalculation.error.message}</p>
            </div>
          )}
        </div>

        {/* Neighborhood Data Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Neighborhood Data API (ZIP: 78701)</h2>
          {neighborhoodLoading && <LoadingSpinner />}
          {neighborhoodData && (
            <div>
              <p className="text-green-600 mb-4">✓ Successfully loaded neighborhood data</p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Demographics</h3>
                  <p>Median Income: ${(neighborhoodData as any).demographics?.medianIncome?.toLocaleString()}</p>
                  <p>Population Density: {(neighborhoodData as any).demographics?.populationDensity}/sq mi</p>
                  <p>Average Age: {(neighborhoodData as any).demographics?.averageAge}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quality of Life</h3>
                  <p>Walk Score: {(neighborhoodData as any).walkScore}/100</p>
                  <p>Crime Index: {(neighborhoodData as any).crimeIndex}/10</p>
                  <p>Schools: {(neighborhoodData as any).schools?.length} nearby</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAPIPage;