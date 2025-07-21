
import React from 'react';

interface ChartProps {
  title: string;
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area';
  height?: number;
  color?: string;
  showLegend?: boolean;
  xKey?: string;
  yKey?: string;
}

const BaseChart: React.FC<ChartProps> = ({
  title,
  data,
  type,
  height = 300,
  color = '#3B82F6',
  showLegend = true,
  xKey = 'x',
  yKey = 'y'
}) => {
  // This would integrate with a charting library like Chart.js or Recharts
  // For now, showing a placeholder implementation
  
  return (
    <div className="w-full">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="text-2xl text-gray-400 mb-2">📊</div>
          <p className="text-gray-600">
            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} data points
          </p>
        </div>
      </div>
      {showLegend && (
        <div className="mt-2 flex justify-center">
          <div className="flex items-center text-sm text-gray-600">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: color }}
            />
            Data Series
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseChart;
