import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Shield, Upload } from 'lucide-react';
import DocumentUploader from '../components/DocumentUploader';

const DocumentsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm"
        >
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-beedab-blue/10 rounded-full mb-4">
                <FileText className="h-8 w-8 text-beedab-blue" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Document Management</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Securely upload and manage all your property-related documents. 
                Keep everything organized for smooth transactions.
              </p>
            </div>

            <DocumentUploader 
              propertyId="sample-property"
              userId="sample-user"
              className="mb-8"
            />

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Secure Storage</h3>
                </div>
                <p className="text-blue-800 text-sm">
                  All documents are encrypted and stored securely with bank-level security protocols.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <Upload className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-semibold text-green-900">Easy Access</h3>
                </div>
                <p className="text-green-800 text-sm">
                  Access your documents anywhere, anytime. Share with agents, lawyers, and banks instantly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentsPage;