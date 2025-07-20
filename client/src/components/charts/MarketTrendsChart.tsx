
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface MarketData {
  month: string;
  avgPrice: number;
  sales: number;
  priceChange: number;
}

export default function MarketTrendsChart() {
  const [marketData] = useState<MarketData[]>([
    { month: 'Jan', avgPrice: 750000, sales: 45, priceChange: 2.1 },
    { month: 'Feb', avgPrice: 762000, sales: 52, priceChange: 1.6 },
    { month: 'Mar', avgPrice: 758000, sales: 48, priceChange: -0.5 },
    { month: 'Apr', avgPrice: 771000, sales: 61, priceChange: 1.7 },
    { month: 'May', avgPrice: 785000, sales: 58, priceChange: 1.8 },
    { month: 'Jun', avgPrice: 792000, sales: 64, priceChange: 0.9 },
  ]);

  const [selectedMetric, setSelectedMetric] = useState<'price' | 'sales'>('price');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMaxValue = () => {
    if (selectedMetric === 'price') {
      return Math.max(...marketData.map(d => d.avgPrice));
    }
    return Math.max(...marketData.map(d => d.sales));
  };

  const maxValue = getMaxValue();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Market Trends
        </CardTitle>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedMetric('price')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMetric === 'price' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Average Prices
          </button>
          <button
            onClick={() => setSelectedMetric('sales')}
            className={`px-3 py-1 rounded text-sm ${
              selectedMetric === 'sales' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Sales Volume
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 flex items-end justify-between gap-2 border-b border-gray-200 pb-2">
            {marketData.map((data, index) => {
              const value = selectedMetric === 'price' ? data.avgPrice : data.sales;
              const height = (value / maxValue) * 200;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center mb-2">
                    <div
                      className="bg-blue-500 w-8 rounded-t transition-all duration-300"
                      style={{ height: `${height}px` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">{data.month}</div>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold">
                {selectedMetric === 'price' 
                  ? formatCurrency(marketData[marketData.length - 1].avgPrice)
                  : marketData[marketData.length - 1].sales
                }
              </div>
              <div className="text-sm text-gray-600">
                Current {selectedMetric === 'price' ? 'Avg Price' : 'Monthly Sales'}
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="flex items-center justify-center gap-1">
                {marketData[marketData.length - 1].priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-lg font-semibold ${
                  marketData[marketData.length - 1].priceChange >= 0 
                    ? 'text-green-500' 
                    : 'text-red-500'
                }`}>
                  {marketData[marketData.length - 1].priceChange}%
                </span>
              </div>
              <div className="text-sm text-gray-600">Monthly Change</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-semibold">
                {marketData.reduce((sum, data) => sum + data.sales, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Sales (6 months)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
