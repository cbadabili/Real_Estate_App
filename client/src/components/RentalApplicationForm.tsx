
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Phone, Mail, MapPin, FileText, X } from 'lucide-react';

interface RentalApplicationFormProps {
  rentalId: number;
  onClose: () => void;
  onSubmit: (applicationData: any) => void;
}

const RentalApplicationForm = ({ rentalId, onClose, onSubmit }: RentalApplicationFormProps) => {
  const [formData, setFormData] = useState({
    employment_info: {
      employer: '',
      position: '',
      monthly_income: '',
      employment_duration: ''
    },
    references: [
      {
        name: '',
        relationship: '',
        contact: ''
      }
    ],
    personal_info: {
      emergency_contact: '',
      preferred_move_in_date: '',
      reason_for_moving: ''
    }
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/rentals/${rentalId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          application_data: {
            ...formData,
            employment_info: {
              ...formData.employment_info,
              monthly_income: parseFloat(formData.employment_info.monthly_income)
            }
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        onSubmit(data.data);
        onClose();
      } else {
        alert('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [...prev.references, { name: '', relationship: '', contact: '' }]
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Rental Application</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Employment Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <Briefcase className="h-5 w-5 text-beedab-blue mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employment_info.employer}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      employment_info: { ...prev.employment_info, employer: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position/Job Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employment_info.position}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      employment_info: { ...prev.employment_info, position: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Income (P)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.employment_info.monthly_income}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      employment_info: { ...prev.employment_info, monthly_income: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment Duration
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., 2 years"
                    value={formData.employment_info.employment_duration}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      employment_info: { ...prev.employment_info, employment_duration: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
              </div>
            </div>

            {/* References */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-beedab-blue mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">References</h3>
                </div>
                <button
                  type="button"
                  onClick={addReference}
                  className="text-beedab-blue hover:text-beedab-darkblue font-medium"
                >
                  Add Reference
                </button>
              </div>
              
              {formData.references.map((reference, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                    {formData.references.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeReference(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={reference.name}
                        onChange={(e) => updateReference(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Relationship
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Previous landlord"
                        value={reference.relationship}
                        onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Phone or email"
                        value={reference.contact}
                        onChange={(e) => updateReference(index, 'contact', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center mb-3">
                <FileText className="h-5 w-5 text-beedab-blue mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.personal_info.emergency_contact}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, emergency_contact: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Move-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.personal_info.preferred_move_in_date}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personal_info: { ...prev.personal_info, preferred_move_in_date: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Moving
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.personal_info.reason_for_moving}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    personal_info: { ...prev.personal_info, reason_for_moving: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-beedab-blue focus:border-beedab-blue"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-beedab-blue text-white rounded-md hover:bg-beedab-darkblue transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RentalApplicationForm;
