
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Calendar, Receipt, AlertCircle, CheckCircle } from 'lucide-react';

interface RentPayment {
  id: number;
  property: string;
  amount: number;
  due_date: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_date?: string;
  payment_method?: string;
  receipt_url?: string;
}

const RentPaymentsPage = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<RentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<RentPayment | null>(null);

  useEffect(() => {
    fetchRentPayments();
  }, []);

  const fetchRentPayments = async () => {
    try {
      // Mock data for tenant rent payments
      const mockPayments: RentPayment[] = [
        {
          id: 1,
          property: 'Apartment 2B - Gaborone CBD',
          amount: 8500,
          due_date: '2024-01-01',
          status: 'paid',
          payment_date: '2023-12-28',
          payment_method: 'Bank Transfer',
          receipt_url: '#'
        },
        {
          id: 2,
          property: 'Apartment 2B - Gaborone CBD',
          amount: 8500,
          due_date: '2024-02-01',
          status: 'pending'
        },
        {
          id: 3,
          property: 'Apartment 2B - Gaborone CBD',
          amount: 8500,
          due_date: '2023-12-01',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'border-green-200 bg-green-50 text-green-800';
      case 'pending': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'overdue': return 'border-red-200 bg-red-50 text-red-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Calendar className="h-4 w-4 text-yellow-600" />;
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const handlePayNow = (payment: RentPayment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Rent Payments</h1>
          <p className="text-gray-600">
            View and manage your rent payment history
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Next Payment Due</div>
                <div className="text-lg font-bold text-gray-900">P8,500</div>
                <div className="text-sm text-gray-500">February 1, 2024</div>
              </div>
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Total Paid This Year</div>
                <div className="text-lg font-bold text-green-600">P8,500</div>
                <div className="text-sm text-gray-500">1 payment</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600">Outstanding Balance</div>
                <div className="text-lg font-bold text-red-600">P8,500</div>
                <div className="text-sm text-gray-500">1 overdue payment</div>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-8 text-center">
                <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">Your payment history will appear here</p>
              </div>
            ) : (
              payments.map((payment) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6"
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
                        <h4 className="text-lg font-medium text-gray-900">{payment.property}</h4>
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
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          P{payment.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {payment.status === 'paid' && payment.receipt_url && (
                          <button className="text-sm text-beedab-blue hover:text-beedab-darkblue">
                            View Receipt
                          </button>
                        )}
                        {(payment.status === 'pending' || payment.status === 'overdue') && (
                          <button
                            onClick={() => handlePayNow(payment)}
                            className="bg-beedab-blue text-white px-4 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors text-sm"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Make Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <div className="text-gray-900">{selectedPayment.property}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="text-2xl font-bold text-gray-900">P{selectedPayment.amount.toLocaleString()}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                    <option>Bank Transfer</option>
                    <option>Credit Card</option>
                    <option>Mobile Money</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RentPaymentsPage;
