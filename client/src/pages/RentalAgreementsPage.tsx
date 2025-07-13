
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Download, Eye, Edit, Plus, Calendar } from 'lucide-react';

interface RentalAgreement {
  id: number;
  property: string;
  tenant_name?: string;
  landlord_name?: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit: number;
  status: 'active' | 'expired' | 'terminated' | 'draft';
  signed_date?: string;
  document_url?: string;
}

const RentalAgreementsPage = () => {
  const { user } = useAuth();
  const [agreements, setAgreements] = useState<RentalAgreement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'draft'>('all');

  useEffect(() => {
    fetchRentalAgreements();
  }, []);

  const fetchRentalAgreements = async () => {
    try {
      // Mock data
      const mockAgreements: RentalAgreement[] = [
        {
          id: 1,
          property: 'Apartment 2B - Gaborone CBD',
          tenant_name: user?.role === 'landlord' ? 'John Doe' : undefined,
          landlord_name: user?.role === 'renter' ? 'Jane Smith' : undefined,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          monthly_rent: 8500,
          security_deposit: 17000,
          status: 'active',
          signed_date: '2023-12-15',
          document_url: '#'
        },
        {
          id: 2,
          property: 'House 15 - Phakalane',
          tenant_name: user?.role === 'landlord' ? 'Mike Johnson' : undefined,
          landlord_name: user?.role === 'renter' ? 'Sarah Wilson' : undefined,
          start_date: '2023-06-01',
          end_date: '2023-12-31',
          monthly_rent: 12000,
          security_deposit: 24000,
          status: 'expired',
          signed_date: '2023-05-20',
          document_url: '#'
        }
      ];
      setAgreements(mockAgreements);
    } catch (error) {
      console.error('Error fetching rental agreements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgreements = agreements.filter(agreement => 
    filter === 'all' || agreement.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-200 bg-green-50 text-green-800';
      case 'expired': return 'border-red-200 bg-red-50 text-red-800';
      case 'terminated': return 'border-gray-200 bg-gray-50 text-gray-800';
      case 'draft': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Agreements</h1>
              <p className="text-gray-600">
                Manage your rental agreements and contracts
              </p>
            </div>
            {user?.role === 'landlord' && (
              <button className="flex items-center gap-2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                <Plus className="h-4 w-4" />
                New Agreement
              </button>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Agreements</div>
                <div className="text-2xl font-bold text-gray-900">{agreements.length}</div>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Active</div>
                <div className="text-2xl font-bold text-green-600">
                  {agreements.filter(a => a.status === 'active').length}
                </div>
              </div>
              <Calendar className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Expired</div>
                <div className="text-2xl font-bold text-red-600">
                  {agreements.filter(a => a.status === 'expired').length}
                </div>
              </div>
              <Calendar className="h-8 w-8 text-red-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Monthly Revenue</div>
                <div className="text-2xl font-bold text-blue-600">
                  P{agreements.filter(a => a.status === 'active').reduce((sum, a) => sum + a.monthly_rent, 0).toLocaleString()}
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            {['all', 'active', 'expired', 'draft'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption as any)}
                className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                  filter === filterOption
                    ? 'bg-beedab-blue text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        {/* Agreements List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
            </div>
          ) : filteredAgreements.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rental agreements</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No agreements found'
                  : `No ${filter} agreements`
                }
              </p>
            </div>
          ) : (
            filteredAgreements.map((agreement) => (
              <motion.div
                key={agreement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{agreement.property}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(agreement.status)}`}>
                        {agreement.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      {agreement.tenant_name && (
                        <div>
                          <span className="font-medium">Tenant:</span> {agreement.tenant_name}
                        </div>
                      )}
                      {agreement.landlord_name && (
                        <div>
                          <span className="font-medium">Landlord:</span> {agreement.landlord_name}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Term:</span> {new Date(agreement.start_date).toLocaleDateString()} - {new Date(agreement.end_date).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Monthly Rent:</span> P{agreement.monthly_rent.toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Security Deposit:</span> P{agreement.security_deposit.toLocaleString()}
                      </div>
                      {agreement.signed_date && (
                        <div>
                          <span className="font-medium">Signed:</span> {new Date(agreement.signed_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {agreement.document_url && (
                      <>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </>
                    )}
                    {(agreement.status === 'draft' || user?.role === 'landlord') && (
                      <button className="flex items-center gap-1 text-sm text-beedab-blue hover:text-beedab-darkblue px-3 py-1 rounded border border-beedab-blue hover:bg-beedab-blue hover:text-white">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RentalAgreementsPage;
