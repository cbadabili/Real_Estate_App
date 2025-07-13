
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  UserCheck, 
  FileText, 
  DollarSign, 
  Home,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TenantScreeningPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/landlord/applications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setApplications(data.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const initiateScreening = async (applicationId: number) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}/screen`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        fetchApplications();
      }
    } catch (error) {
      console.error('Error initiating screening:', error);
    }
  };

  const screeningServices = [
    {
      title: 'Credit Report',
      description: 'Comprehensive credit history and score analysis',
      price: 150,
      features: ['Credit Score', 'Payment History', 'Outstanding Debts', 'Credit Utilization']
    },
    {
      title: 'Background Check',
      description: 'Criminal background and identity verification',
      price: 120,
      features: ['Criminal History', 'Identity Verification', 'Previous Addresses', 'Court Records']
    },
    {
      title: 'Employment Verification',
      description: 'Income and employment status confirmation',
      price: 80,
      features: ['Employment Status', 'Income Verification', 'Job Stability', 'Reference Checks']
    },
    {
      title: 'Reference Check',
      description: 'Previous landlord and personal references',
      price: 60,
      features: ['Landlord References', 'Personal References', 'Rental History', 'Character Assessment']
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tenant Screening</h1>
          <p className="text-gray-600">
            Comprehensive background checks and credit verification for reliable tenant selection
          </p>
        </div>

        {/* Screening Services */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Screening Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {screeningServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="text-center mb-4">
                  <Shield className="h-12 w-12 text-beedab-blue mx-auto mb-2" />
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                </div>
                <div className="text-center mb-4">
                  <span className="text-2xl font-bold text-beedab-blue">P{service.price}</span>
                  <span className="text-gray-500 text-sm">/applicant</span>
                </div>
                <ul className="space-y-2 mb-4">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-beedab-blue text-white py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
                  Select Service
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Applications Pending Screening</h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beedab-blue"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No applications pending screening</p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((application: any) => (
                <div key={application.application.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{application.rental.title}</h3>
                      <p className="text-sm text-gray-600">Applicant: {application.renter.name}</p>
                      <p className="text-sm text-gray-500">
                        Applied: {new Date(application.application.created_at).toLocaleDateString()}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            application.application.background_check_status === 'complete' 
                              ? 'bg-green-500' 
                              : application.application.background_check_status === 'in_progress'
                              ? 'bg-yellow-500'
                              : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs text-gray-600">Background Check</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            application.application.credit_report_status === 'complete' 
                              ? 'bg-green-500' 
                              : application.application.credit_report_status === 'in_progress'
                              ? 'bg-yellow-500'
                              : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs text-gray-600">Credit Report</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                        <Eye className="h-4 w-4 inline mr-1" />
                        View
                      </button>
                      {application.application.status === 'pending' && (
                        <button
                          onClick={() => initiateScreening(application.application.id)}
                          className="px-3 py-1 text-sm bg-beedab-blue text-white rounded hover:bg-beedab-darkblue"
                        >
                          Start Screening
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TenantScreeningPage;
