
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Phone, 
  Mail, 
  FileText, 
  MessageCircle, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Home,
  DollarSign,
  Lock,
  Users,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface TenantResource {
  title: string;
  description: string;
  details: string;
}

interface SupportResources {
  tenantRights: TenantResource[];
  legalRequirements: TenantResource[];
  contactInfo: {
    helpline: string;
    email: string;
    officeHours: string;
  };
}

interface ComplaintForm {
  subject: string;
  description: string;
  category: string;
  propertyId: string;
}

const TenantSupportPage: React.FC = () => {
  const [resources, setResources] = useState<SupportResources | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState<ComplaintForm>({
    subject: '',
    description: '',
    category: '',
    propertyId: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('/api/tenant-support/resources');
        if (response.ok) {
          const data = await response.json();
          setResources(data.data);
        }
      } catch (error) {
        console.error('Error fetching support resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleComplaintSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/tenant-support/complaint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(complaintForm),
      });

      if (response.ok) {
        const data = await response.json();
        setSubmitMessage('Complaint submitted successfully! Reference: ' + data.data.referenceNumber);
        setComplaintForm({ subject: '', description: '', category: '', propertyId: '' });
        setShowComplaintForm(false);
      } else {
        setSubmitMessage('Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Error submitting complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beedab-blue mx-auto"></div>
          <p className="text-neutral-600 mt-4">Loading support resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Tenant Support</h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Your rights, our support. Get help with rental issues and know your tenant rights.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 text-center"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">File a Complaint</h3>
            <p className="text-neutral-600 mb-4 text-sm">Report issues with your rental property or landlord</p>
            <button
              onClick={() => setShowComplaintForm(true)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              File Complaint
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 text-center"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Live Chat</h3>
            <p className="text-neutral-600 mb-4 text-sm">Get instant help from our support team</p>
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-neutral-200 text-center"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Emergency Line</h3>
            <p className="text-neutral-600 mb-4 text-sm">24/7 emergency support hotline</p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Call Now
            </button>
          </motion.div>
        </div>

        {/* Tenant Rights */}
        {resources && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200"
            >
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <Shield className="h-6 w-6 text-beedab-blue mr-3" />
                  Your Tenant Rights
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {resources.tenantRights.map((right, index) => (
                  <div key={index} className="border-l-4 border-beedab-blue bg-blue-50 p-4 rounded">
                    <h4 className="font-semibold text-neutral-900 mb-2">{right.title}</h4>
                    <p className="text-neutral-700 text-sm mb-2">{right.description}</p>
                    <p className="text-neutral-600 text-xs">{right.details}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm border border-neutral-200"
            >
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-xl font-semibold text-neutral-900 flex items-center">
                  <FileText className="h-6 w-6 text-green-600 mr-3" />
                  Legal Requirements
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {resources.legalRequirements.map((requirement, index) => (
                  <div key={index} className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
                    <h4 className="font-semibold text-neutral-900 mb-2">{requirement.title}</h4>
                    <p className="text-neutral-700 text-sm mb-2">{requirement.description}</p>
                    <p className="text-neutral-600 text-xs">{requirement.details}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Contact Information */}
        {resources && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-beedab-blue to-beedab-darkblue rounded-2xl p-8 text-white text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-6">Need Immediate Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 rounded-lg p-4">
                <Phone className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Helpline</h4>
                <p className="text-blue-100">{resources.contactInfo.helpline}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Mail className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-blue-100">{resources.contactInfo.email}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <Clock className="h-8 w-8 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Office Hours</h4>
                <p className="text-blue-100">{resources.contactInfo.officeHours}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {submitMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              submitMessage.includes('successfully') 
                ? 'bg-green-100 border border-green-300 text-green-700'
                : 'bg-red-100 border border-red-300 text-red-700'
            }`}
          >
            <div className="flex items-center">
              {submitMessage.includes('successfully') ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertTriangle className="h-5 w-5 mr-2" />
              )}
              {submitMessage}
            </div>
          </motion.div>
        )}

        {/* Complaint Form Modal */}
        {showComplaintForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-lg w-full p-6"
            >
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">File a Complaint</h3>
              <form onSubmit={handleComplaintSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={complaintForm.category}
                    onChange={(e) => setComplaintForm({ ...complaintForm, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="maintenance">Maintenance Issues</option>
                    <option value="harassment">Harassment</option>
                    <option value="illegal_entry">Illegal Entry</option>
                    <option value="deposit">Security Deposit</option>
                    <option value="rent">Rent Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={complaintForm.subject}
                    onChange={(e) => setComplaintForm({ ...complaintForm, subject: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                    placeholder="Please provide detailed information about your complaint"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowComplaintForm(false)}
                    className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Complaint'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantSupportPage;
