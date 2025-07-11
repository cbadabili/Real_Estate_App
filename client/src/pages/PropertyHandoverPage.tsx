
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, FileText, CheckCircle, Key, Users, Calendar, 
  Shield, Camera, ClipboardList, AlertCircle, Download,
  Upload, Phone, MessageCircle, Star, Award
} from 'lucide-react';

const PropertyHandoverPage = () => {
  const [selectedProperty, setSelectedProperty] = useState('');
  const [handoverStep, setHandoverStep] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const properties = [
    {
      id: '1',
      title: 'Modern 3BR House in Phakalane',
      address: '123 Phakalane Drive',
      buyer: 'John Smith',
      saleDate: '2024-01-15',
      handoverDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'Family Home in Extension 15',
      address: '456 Extension 15',
      buyer: 'Mike Brown',
      saleDate: '2024-01-10',
      handoverDate: '2024-01-18'
    }
  ];

  const handoverSteps = [
    {
      title: 'Pre-Handover Preparation',
      description: 'Prepare all documents and complete final inspections',
      items: [
        'Gather all property documents',
        'Complete final walk-through',
        'Arrange utility transfers',
        'Prepare keys and access cards',
        'Clean and maintain property',
        'Complete any agreed repairs'
      ]
    },
    {
      title: 'Document Verification',
      description: 'Verify all legal documents are in order',
      items: [
        'Title deed transfer completed',
        'Mortgage documents finalized',
        'Insurance policies transferred',
        'HOA documents (if applicable)',
        'Warranty documents provided',
        'Tax clearance certificates'
      ]
    },
    {
      title: 'Physical Handover',
      description: 'Conduct the actual property handover',
      items: [
        'Meet with buyer at property',
        'Conduct final inspection together',
        'Test all systems and appliances',
        'Provide all keys and access codes',
        'Hand over user manuals',
        'Complete handover checklist'
      ]
    },
    {
      title: 'Final Documentation',
      description: 'Complete all handover documentation',
      items: [
        'Sign handover certificate',
        'Provide contact information',
        'Transfer utility accounts',
        'Provide receipts and warranties',
        'Complete feedback forms',
        'Exchange contact details'
      ]
    }
  ];

  const checklistItems = [
    {
      category: 'Interior',
      items: [
        'All rooms clean and empty',
        'Light fixtures working',
        'Electrical outlets functional',
        'Plumbing systems working',
        'Windows and doors secure',
        'Flooring in good condition',
        'Built-in appliances working',
        'HVAC system operational'
      ]
    },
    {
      category: 'Exterior',
      items: [
        'Exterior walls and roof intact',
        'Gutters and downspouts clear',
        'Outdoor lighting functional',
        'Driveway and walkways clear',
        'Fence and gates secure',
        'Landscaping maintained',
        'Exterior appliances working',
        'Security systems operational'
      ]
    },
    {
      category: 'Utilities',
      items: [
        'Electricity meter reading recorded',
        'Water meter reading recorded',
        'Gas connections (if applicable)',
        'Internet/cable connections',
        'Trash service information',
        'Utility contact information',
        'Meter locations marked',
        'Shut-off valve locations marked'
      ]
    },
    {
      category: 'Documentation',
      items: [
        'All keys provided',
        'Garage door openers',
        'Security system codes',
        'Appliance manuals',
        'Warranty documents',
        'Service provider contacts',
        'HOA information',
        'Emergency contact numbers'
      ]
    }
  ];

  const handleCheckItem = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getCompletionPercentage = () => {
    const totalItems = checklistItems.reduce((sum, category) => sum + category.items.length, 0);
    const completedItems = Object.values(checkedItems).filter(Boolean).length;
    return totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Property Handover
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Complete the property transfer process with confidence and clarity
          </p>
        </div>

        {/* Property Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Select Property</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {properties.map((property) => (
              <div
                key={property.id}
                onClick={() => setSelectedProperty(property.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedProperty === property.id
                    ? 'border-beedab-blue bg-beedab-blue/5'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <h3 className="font-semibold text-neutral-900 mb-2">{property.title}</h3>
                <p className="text-neutral-600 text-sm mb-2">{property.address}</p>
                <div className="flex justify-between text-sm text-neutral-500">
                  <span>Buyer: {property.buyer}</span>
                  <span>Handover: {property.handoverDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedProperty && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Handover Process */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 mb-6">Handover Process</h2>
                
                <div className="space-y-6">
                  {handoverSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= handoverStep 
                            ? 'bg-beedab-blue text-white' 
                            : 'bg-neutral-200 text-neutral-600'
                        }`}>
                          {index < handoverStep ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="font-semibold text-neutral-900">{step.title}</h3>
                          <p className="text-neutral-600 text-sm mb-3">{step.description}</p>
                          <div className="space-y-2">
                            {step.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`step-${index}-item-${itemIndex}`}
                                  checked={checkedItems[`step-${index}-item-${itemIndex}`] || false}
                                  onChange={() => handleCheckItem(`step-${index}-item-${itemIndex}`)}
                                  className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                                />
                                <label
                                  htmlFor={`step-${index}-item-${itemIndex}`}
                                  className="text-sm text-neutral-700 cursor-pointer"
                                >
                                  {item}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {index < handoverSteps.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-8 bg-neutral-200"></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => setHandoverStep(Math.max(0, handoverStep - 1))}
                    disabled={handoverStep === 0}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous Step
                  </button>
                  <button
                    onClick={() => setHandoverStep(Math.min(handoverSteps.length - 1, handoverStep + 1))}
                    disabled={handoverStep === handoverSteps.length - 1}
                    className="px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Handover Checklist */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-neutral-900">Handover Checklist</h2>
                  <div className="text-sm text-neutral-600">
                    {Math.round(getCompletionPercentage())}% Complete
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-beedab-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getCompletionPercentage()}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-6">
                  {checklistItems.map((category, categoryIndex) => (
                    <div key={categoryIndex} className="border border-neutral-200 rounded-lg p-4">
                      <h3 className="font-semibold text-neutral-900 mb-3">{category.category}</h3>
                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`${category.category}-${itemIndex}`}
                              checked={checkedItems[`${category.category}-${itemIndex}`] || false}
                              onChange={() => handleCheckItem(`${category.category}-${itemIndex}`)}
                              className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                            />
                            <label
                              htmlFor={`${category.category}-${itemIndex}`}
                              className="text-sm text-neutral-700 cursor-pointer"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center">
                    <Download className="h-4 w-4 mr-2" />
                    Download Checklist
                  </button>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photos
                  </button>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Documents
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contact Buyer</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-neutral-600" />
                    <span className="text-neutral-700">John Smith</span>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Buyer
                  </button>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message Buyer
                  </button>
                </div>
              </div>

              {/* Professional Services */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Professional Help</h3>
                <div className="space-y-3">
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                    <Award className="h-4 w-4 mr-2" />
                    Legal Services
                  </button>
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Property Inspector
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Handover Tips
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Schedule the handover during daylight hours</li>
                  <li>• Test all systems and appliances together</li>
                  <li>• Keep all receipts and documentation</li>
                  <li>• Take photos of the property condition</li>
                  <li>• Exchange emergency contact information</li>
                  <li>• Provide neighborhood information</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyHandoverPage;
