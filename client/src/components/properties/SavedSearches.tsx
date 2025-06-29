import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Search, Trash2, Bell, Plus, Star } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface SavedSearchesProps {
  onLoadSearch: (search: any) => void;
  currentFilters: any;
  currentQuery: string;
  className?: string;
}

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters: any;
  alertsEnabled: boolean;
  createdAt: string;
  lastRun: string;
  resultCount: number;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({
  onLoadSearch,
  currentFilters,
  currentQuery,
  className = ''
}) => {
  const [savedSearches, setSavedSearches] = useLocalStorage<SavedSearch[]>('savedSearches', []);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [enableAlerts, setEnableAlerts] = useState(false);

  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;
    
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchName.trim(),
      query: currentQuery,
      filters: currentFilters,
      alertsEnabled: enableAlerts,
      createdAt: new Date().toISOString(),
      lastRun: new Date().toISOString(),
      resultCount: 0
    };
    
    setSavedSearches(prev => [newSearch, ...prev]);
    setSearchName('');
    setEnableAlerts(false);
    setShowSaveDialog(false);
  };

  const deleteSearch = (searchId: string) => {
    setSavedSearches(prev => prev.filter(s => s.id !== searchId));
  };

  const toggleAlerts = (searchId: string) => {
    setSavedSearches(prev => 
      prev.map(s => 
        s.id === searchId 
          ? { ...s, alertsEnabled: !s.alertsEnabled }
          : s
      )
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bookmark className="h-5 w-5 mr-2 text-beedab-blue" />
            Saved Searches
          </h3>
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center space-x-1 text-sm text-beedab-blue hover:text-beedab-darkblue"
          >
            <Plus className="h-4 w-4" />
            <span>Save Current</span>
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {savedSearches.length} saved searches
        </p>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-blue-50 border-b border-blue-200"
        >
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Save Current Search</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Search Name</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Houses in Gaborone under 2M"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableAlerts"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="h-4 w-4 text-beedab-blue focus:ring-beedab-blue border-gray-300 rounded"
              />
              <label htmlFor="enableAlerts" className="ml-2 text-sm text-gray-700">
                Email me when new properties match
              </label>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveCurrentSearch}
                disabled={!searchName.trim()}
                className="flex-1 bg-beedab-blue text-white py-2 px-3 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Search
              </button>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved Searches List */}
      <div className="p-4">
        {savedSearches.length === 0 ? (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No saved searches yet</p>
            <p className="text-gray-400 text-xs">Save your current search to access it later</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedSearches.map((search, index) => (
              <motion.div
                key={search.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {search.name}
                      </h4>
                      {search.alertsEnabled && (
                        <Bell className="h-3 w-3 text-orange-500" />
                      )}
                    </div>
                    {search.query && (
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        Query: "{search.query}"
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Saved {formatDate(search.createdAt)}</span>
                      <span>•</span>
                      <span>{search.resultCount} results</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => toggleAlerts(search.id)}
                      className={`p-1 rounded transition-colors ${
                        search.alertsEnabled
                          ? 'text-orange-500 hover:text-orange-600'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                    >
                      <Bell className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onLoadSearch(search)}
                  className="w-full mt-2 bg-gray-50 text-gray-700 py-1.5 px-3 rounded text-xs hover:bg-gray-100 transition-colors"
                >
                  Load Search
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};