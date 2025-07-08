
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Camera, CheckCircle, AlertCircle,
  Star, User, Phone, MessageCircle, FileText, Calculator,
  Home, Ruler, Wrench, Shield
} from 'lucide-react';

const ViewingPage = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewingType, setViewingType] = useState('physical');
  const [evaluationChecklist, setEvaluationChecklist] = useState({
    exterior: false,
    interior: false,
    plumbing: false,
    electrical: false,
    structural: false,
    neighborhood: false
  });

  const scheduledViewings = [
    {
      id: 1,
      property: "Modern 3BR House in Phakalane",
      date: "2024-01-15",
      time: "10:00 AM",
      type: "Physical Viewing",
      agent: "John Mogapi",
      status: "confirmed",
      address: "Plot 123, Phakalane Estate"
    },
    {
      id: 2,
      property: "Luxury Villa in Broadhurst",
      date: "2024-01-16",
      time: "2:00 PM",
      type: "Virtual Tour",
      agent: "Sarah Kgomo",
      status: "pending",
      address: "Plot 456, Broadhurst"
    }
  ];

  const evaluationCriteria = [
    {
      category: "Exterior",
      items: [
        "Roof condition",
        "External walls",
        "Windows and doors",
        "Garden/yard condition",
        "Fencing and security"
      ]
    },
    {
      category: "Interior",
      items: [
        "Room sizes and layout",
        "Flooring condition",
        "Wall condition",
        "Natural lighting",
        "Storage space"
      ]
    },
    {
      category: "Systems",
      items: [
        "Plumbing functionality",
        "Electrical systems",
        "HVAC systems",
        "Water pressure",
        "Internet connectivity"
      ]
    },
    {
      category: "Neighborhood",
      items: [
        "Safety and security",
        "Proximity to amenities",
        "Transportation access",
        "Noise levels",
        "Future development plans"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Property Viewing & Evaluation
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Schedule viewings and evaluate properties with our comprehensive checklist
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Scheduled Viewings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Scheduled Viewings</h2>
              
              <div className="space-y-4">
                {scheduledViewings.map(viewing => (
                  <div key={viewing.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-neutral-900">{viewing.property}</h3>
                        <div className="flex items-center text-neutral-600 text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {viewing.address}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        viewing.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {viewing.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-neutral-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {viewing.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {viewing.time}
                      </div>
                      <div className="flex items-center">
                        <Camera className="h-4 w-4 mr-2" />
                        {viewing.type}
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        {viewing.agent}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      <button className="bg-beedab-blue text-white px-4 py-2 rounded-lg text-sm hover:bg-beedab-darkblue transition-colors">
                        View Details
                      </button>
                      <button className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm hover:bg-neutral-50 transition-colors">
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Schedule New Viewing
              </button>
            </div>

            {/* Evaluation Checklist */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">Property Evaluation Checklist</h2>
              
              <div className="space-y-6">
                {evaluationCriteria.map((category, index) => (
                  <div key={index} className="border border-neutral-200 rounded-lg p-4">
                    <h3 className="font-semibold text-neutral-900 mb-3">{category.category}</h3>
                    <div className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <label key={itemIndex} className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-neutral-300 text-beedab-blue focus:ring-beedab-blue mr-3"
                          />
                          <span className="text-neutral-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <button className="flex-1 bg-beedab-blue text-white py-3 px-4 rounded-lg font-medium hover:bg-beedab-darkblue transition-colors">
                  Save Evaluation
                </button>
                <button className="flex-1 border border-neutral-300 text-neutral-700 py-3 px-4 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Viewing
                </button>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
                  <Camera className="h-4 w-4 mr-2" />
                  Virtual Tour
                </button>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Property Calculator
                </button>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Documents
                </button>
              </div>
            </div>

            {/* Professional Services */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Professional Services</h3>
              <div className="space-y-4">
                <div className="border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">Property Inspector</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1">4.9</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Professional property inspection services
                  </p>
                  <button className="w-full bg-beedab-blue text-white py-2 px-3 rounded text-sm hover:bg-beedab-darkblue transition-colors">
                    Book Inspection
                  </button>
                </div>

                <div className="border border-neutral-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-neutral-900">Property Valuer</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm ml-1">4.8</span>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 mb-3">
                    Get accurate property valuation
                  </p>
                  <button className="w-full bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
                    Book Valuation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewingPage;
