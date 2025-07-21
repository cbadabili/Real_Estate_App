
import React from 'react';

interface ChartDataPoint {
  [key: string]: any;
}

interface ChartProps {
  title: string;
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'scatter';
  height?: number;
  color?: string | string[];
  showLegend?: boolean;
  xKey?: string;
  yKey?: string;
  className?: string;
  showTooltip?: boolean;
  animation?: boolean;
}

const BaseChart: React.FC<ChartProps> = ({
  title,
  data,
  type,
  height = 300,
  color = '#3B82F6',
  showLegend = true,
  xKey = 'x',
  yKey = 'y',
  className = '',
  showTooltip = true,
  animation = true
}) => {
  const getChartIcon = () => {
    switch (type) {
      case 'line': return '📈';
      case 'bar': return '📊';
      case 'pie': 
      case 'donut': return '🥧';
      case 'area': return '📈';
      case 'scatter': return '🎯';
      default: return '📊';
    }
  };

  const getColorArray = () => {
    if (Array.isArray(color)) return color;
    return [color, '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
  };

  const colors = getColorArray();

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div 
        className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
        style={{ height: `${height}px` }}
      >
        <div className="text-center">
          <div className="text-3xl mb-2">{getChartIcon()}</div>
          <p className="text-gray-700 font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)} Chart
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {data.length} data points
          </p>
          {data.length > 0 && (
            <div className="mt-3 text-xs text-gray-600">
              <p>X-Axis: {xKey} | Y-Axis: {yKey}</p>
              {showTooltip && <p>Tooltip: Enabled</p>}
              {animation && <p>Animation: Enabled</p>}
            </div>
          )}
        </div>
      </div>
      {showLegend && data.length > 0 && (
        <div className="mt-3 flex justify-center flex-wrap gap-4">
          {data.slice(0, 5).map((item, index) => (
            <div key={index} className="flex items-center text-sm text-gray-600">
              <div 
                className="w-3 h-3 rounded mr-2"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              {item[xKey] || `Series ${index + 1}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaseChart;
