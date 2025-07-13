
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { DollarSign, Calendar, AlertCircle, CheckCircle, Clock, Download } from 'lucide-react';

interface RentPayment {
  id: number;
  tenant_name: string;
  property: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_date?: string;
  payment_method?: string;
}

const RentCollectionPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    fetchRentPayments();
  }, []);

  const fetchRentPayments = async () => {
    try {
      // Mock data for landlord rent collection
      const mockPayments: RentPayment[] = [
        {
          id: 1,
          tenant_name: 'John Doe',
          property: 'Apartment 2B - Gaborone CBD',
          amount: 8500,
          due_date: '2024-01-01',
          status: 'paid',
          payment_date: '2023-12-28',
          payment_method: 'Bank Transfer'
        },
        {
          id: 2,
          tenant_name: 'Jane Smith',
          property: 'House 15 - Phakalane',
          amount: 12000,
          due_date: '2024-01-01',
          status: 'pending'
        },
        {
          id: 3,
          tenant_name: 'Mike Johnson',
          property: 'Townhouse 3 - Extension 12',
          amount: 6500,
          due_date: '2023-12-15',
          status: 'overdue'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error fetching rent payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => 
    filter === 'all' || payment.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'border-green-200 bg-green-50 text-green-800';
      case 'pending': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'overdue': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = filteredPayments.filter(p => p.status === 'paid').reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = filteredPayments.filter(p => p.status === 'pending').reduce((sum, payment) => sum + payment.amount, 0);
  const overdueAmount = filteredPayments.filter(p => p.status === 'overdue').reduce((sum, payment) => sum + payment.amount, 0);

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rent Collection</h1>
              <p className="text-gray-600">
                Track and manage rent payments from your tenants
              </p>
            </div>
            <button className="flex items-center gap-2 bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Rent</div>
                <div className="text-2xl font-bold text-gray-900">P{totalAmount.toLocaleString()}</div>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Collected</div>
                <div className="text-2xl font-bold text-green-600">P{paidAmount.toLocaleString()}</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600">P{pendingAmount.toLocaleString()}</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Overdue</div>
                <div className="text-2xl font-bold text-red-600">P{overdueAmount.toLocaleString()}</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex gap-2">
            {['all', 'paid', 'pending', 'overdue'].map((filterOption) => (
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

        {/* Payments List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rent payments</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'No payments found'
                  : `No ${filter} payments`
                }
              </p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{payment.tenant_name}</h3>
                      <p className="text-gray-600">{payment.property}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                        <span>Due: {new Date(payment.due_date).toLocaleDateString()}</span>
                        {payment.payment_date && (
                          <>
                            <span>•</span>
                            <span>Paid: {new Date(payment.payment_date).toLocaleDateString()}</span>
                          </>
                        )}
                        {payment.payment_method && (
                          <>
                            <span>•</span>
                            <span>{payment.payment_method}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      P{payment.amount.toLocaleString()}
                    </div>
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

export default RentCollectionPage;
