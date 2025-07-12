
import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, AlertCircle, Scale, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LegalRequirementsPage: React.FC = () => {
  const navigate = useNavigate();

  const requirements = [
    {
      title: 'Property Title Deed',
      description: 'Ensure you have a clear and valid title deed for your property.',
      status: 'required',
      documents: ['Original title deed', 'Certified copy', 'Survey plan']
    },
    {
      title: 'Compliance Certificate',
      description: 'Obtain building compliance certificates from relevant authorities.',
      status: 'required',
      documents: ['Building approval', 'Occupancy certificate', 'Health certificate']
    },
    {
      title: 'Tax Clearance',
      description: 'Ensure all property taxes are paid up to date.',
      status: 'required',
      documents: ['Tax clearance certificate', 'Recent tax receipts', 'Council rates clearance']
    },
    {
      title: 'Transfer Documents',
      description: 'Prepare all necessary transfer documentation.',
      status: 'recommended',
      documents: ['Deed of sale', 'Power of attorney', 'Identity documents']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 text-gray-500 hover:text-beedab-blue"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Requirements</h1>
              <p className="text-gray-600">Ensure compliance with Botswana property laws and regulations</p>
            </div>
          </div>

          <div className="space-y-6">
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    req.status === 'required' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {req.status === 'required' ? (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{req.title}</h3>
                    <p className="text-gray-600 mb-4">{req.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Required Documents:</h4>
                      <ul className="space-y-1">
                        {req.documents.map((doc, docIndex) => (
                          <li key={docIndex} className="flex items-center text-sm text-gray-600">
                            <FileText className="h-4 w-4 mr-2 text-gray-400" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Scale className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Need Legal Assistance?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Our network of qualified conveyancers and legal professionals can help ensure all your documentation is in order.
            </p>
            <button className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue transition-colors">
              Find Legal Services
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LegalRequirementsPage;
