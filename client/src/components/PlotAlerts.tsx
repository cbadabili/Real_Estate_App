import React, { useState } from 'react';
import { Bell, MapPin, Trash2, Plus, CheckCircle } from 'lucide-react';

interface PlotAlert {
  id: string;
  location: string;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;
  sizeUnit: 'm²' | 'hectares';
  plotType?: 'residential' | 'farm' | 'commercial';
  serviced?: boolean;
  email: string;
  phone?: string;
  active: boolean;
  createdAt: string;
}

interface PlotAlertsProps {
  alerts: PlotAlert[];
  onCreateAlert: (alert: Omit<PlotAlert, 'id' | 'createdAt' | 'active'>) => void;
  onDeleteAlert: (alertId: string) => void;
  onToggleAlert: (alertId: string, active: boolean) => void;
  className?: string;
}

/**
 * Plot Alerts/Notifications Component
 * Users can subscribe to location-based alerts for new plot listings
 * Supports filtering by location, price, size, type, and service status
 * Integrates with stubbed notification API: /api/notifications/newPlotAlert
 */
export const PlotAlerts: React.FC<PlotAlertsProps> = ({
  alerts,
  onCreateAlert,
  onDeleteAlert,
  onToggleAlert,
  className = ""
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    location: '',
    maxPrice: '',
    minSize: '',
    maxSize: '',
    sizeUnit: 'm²' as const,
    plotType: '',
    serviced: false,
    email: '',
    phone: ''
  });

  const popularLocations = [
    'Mogoditshane Block 5',
    'Manyana Plateau', 
    'Mahalapye',
    'Pitsane',
    'Gaborone',
    'Francistown',
    'Lobatse',
    'Kanye',
    'Serowe',
    'Maun'
  ];

  const handleCreateAlert = () => {
    if (!newAlert.location || !newAlert.email) {
      alert('Location and email are required');
      return;
    }

    const alertData: Omit<PlotAlert, 'id' | 'createdAt' | 'active'> = {
      location: newAlert.location,
      maxPrice: newAlert.maxPrice ? Number(newAlert.maxPrice) : undefined,
      minSize: newAlert.minSize ? Number(newAlert.minSize) : undefined,
      maxSize: newAlert.maxSize ? Number(newAlert.maxSize) : undefined,
      sizeUnit: newAlert.sizeUnit,
      plotType: newAlert.plotType as PlotAlert['plotType'] || undefined,
      serviced: newAlert.serviced || undefined,
      email: newAlert.email,
      phone: newAlert.phone || undefined
    };

    onCreateAlert(alertData);

    // Reset form
    setNewAlert({
      location: '',
      maxPrice: '',
      minSize: '',
      maxSize: '',
      sizeUnit: 'm²',
      plotType: '',
      serviced: false,
      email: '',
      phone: ''
    });
    setShowCreateForm(false);
  };

  const formatAlertDescription = (alert: PlotAlert) => {
    const parts = [`New plots in ${alert.location}`];

    if (alert.maxPrice) {
      parts.push(`under BWP ${alert.maxPrice.toLocaleString()}`);
    }

    if (alert.minSize || alert.maxSize) {
      const sizeRange = alert.minSize && alert.maxSize 
        ? `${alert.minSize}-${alert.maxSize} ${alert.sizeUnit}`
        : alert.minSize 
          ? `${alert.minSize}+ ${alert.sizeUnit}`
          : `up to ${alert.maxSize} ${alert.sizeUnit}`;
      parts.push(sizeRange);
    }

    if (alert.plotType) {
      parts.push(alert.plotType);
    }

    if (alert.serviced) {
      parts.push('serviced plots only');
    }

    return parts.join(', ');
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-beedab-blue" />
          <h3 className="text-lg font-semibold text-gray-900">Plot Alerts</h3>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      </div>

      {/* Create Alert Form */}
      {showCreateForm && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">
          <h4 className="font-medium text-gray-900">Create New Alert</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <select
                value={newAlert.location}
                onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">Select Location</option>
                {popularLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price (BWP)
              </label>
              <input
                type="number"
                value={newAlert.maxPrice}
                onChange={(e) => setNewAlert({ ...newAlert, maxPrice: e.target.value })}
                placeholder="200000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Size
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={newAlert.minSize}
                  onChange={(e) => setNewAlert({ ...newAlert, minSize: e.target.value })}
                  placeholder="900"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                />
                <select
                  value={newAlert.sizeUnit}
                  onChange={(e) => setNewAlert({ ...newAlert, sizeUnit: e.target.value as 'm²' | 'hectares' })}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
                >
                  <option value="m²">m²</option>
                  <option value="hectares">hectares</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plot Type
              </label>
              <select
                value={newAlert.plotType}
                onChange={(e) => setNewAlert({ ...newAlert, plotType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              >
                <option value="">Any Type</option>
                <option value="residential">Residential</option>
                <option value="farm">Farm Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={newAlert.email}
                onChange={(e) => setNewAlert({ ...newAlert, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone (Optional)
              </label>
              <input
                type="tel"
                value={newAlert.phone}
                onChange={(e) => setNewAlert({ ...newAlert, phone: e.target.value })}
                placeholder="71234567"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-beedab-blue"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newAlert.serviced}
                onChange={(e) => setNewAlert({ ...newAlert, serviced: e.target.checked })}
                className="mr-2 h-4 w-4 text-beedab-blue rounded focus:ring-beedab-blue"
              />
              <span className="text-sm">Only serviced plots</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateAlert}
              className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors"
            >
              Create Alert
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No active alerts</p>
            <p className="text-sm">Create an alert to get notified of new plots</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-lg p-4 ${alert.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {formatAlertDescription(alert)}
                    </span>
                    {alert.active && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Notifications to: {alert.email}
                    {alert.phone && ` • ${alert.phone}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created {alert.createdAt}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleAlert(alert.id, !alert.active)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      alert.active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {alert.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Information Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> You'll receive email notifications when new plots matching your criteria are listed. 
          SMS notifications are available if you provide a phone number.
        </p>
      </div>
    </div>
  );
};