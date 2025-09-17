
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Upload, Download, Eye, Trash2, Check, X,
  Folder, Search, Filter, Calendar, User, FileCheck,
  AlertCircle, Shield, Clock, Plus
} from 'lucide-react';

const DocumentsPage = () => {
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const folders = [
    { id: 'all', name: 'All Documents', count: 24 },
    { id: 'property-docs', name: 'Property Documents', count: 8 },
    { id: 'legal-docs', name: 'Legal Documents', count: 6 },
    { id: 'financial-docs', name: 'Financial Documents', count: 5 },
    { id: 'identification', name: 'Identification', count: 3 },
    { id: 'completed', name: 'Completed', count: 2 }
  ];

  const documents = [
    {
      id: 1,
      name: 'Title Deed - Phakalane Property',
      type: 'property-docs',
      format: 'PDF',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'verified',
      requiredFor: 'Property Transfer'
    },
    {
      id: 2,
      name: 'Sale Agreement',
      type: 'legal-docs',
      format: 'PDF',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'pending',
      requiredFor: 'Legal Documentation'
    },
    {
      id: 3,
      name: 'Bank Guarantee Letter',
      type: 'financial-docs',
      format: 'PDF',
      size: '856 KB',
      uploadDate: '2024-01-12',
      status: 'verified',
      requiredFor: 'Financial Arrangements'
    },
    {
      id: 4,
      name: 'Identity Document',
      type: 'identification',
      format: 'PDF',
      size: '1.2 MB',
      uploadDate: '2024-01-10',
      status: 'verified',
      requiredFor: 'Registration Process'
    },
    {
      id: 5,
      name: 'Municipal Clearance Certificate',
      type: 'property-docs',
      format: 'PDF',
      size: '945 KB',
      uploadDate: '2024-01-08',
      status: 'pending',
      requiredFor: 'Property Transfer'
    }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesFolder = selectedFolder === 'all' || doc.type === selectedFolder;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Document Manager</h1>
          <p className="text-xl text-neutral-600">
            Manage all your property transfer documents in one secure location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Document Categories</h2>
              <div className="space-y-2">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    onClick={() => setSelectedFolder(folder.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      selectedFolder === folder.id
                        ? 'bg-beedab-blue text-white'
                        : 'text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <Folder className="h-4 w-4 mr-2" />
                      {folder.name}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      selectedFolder === folder.id
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}>
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Upload Document</h3>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="w-full bg-beedab-blue text-white py-3 px-4 rounded-lg hover:bg-beedab-darkblue transition-colors flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Document
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent"
                  />
                </div>
                <button className="flex items-center px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Documents Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900">
                  {selectedFolder === 'all' ? 'All Documents' : folders.find(f => f.id === selectedFolder)?.name}
                </h2>
              </div>

              <div className="divide-y divide-neutral-200">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <FileText className="h-8 w-8 text-beedab-blue" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-neutral-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-1">
                            <span>{doc.format}</span>
                            <span>{doc.size}</span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {doc.uploadDate}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="text-xs text-neutral-600">Required for: {doc.requiredFor}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doc.status)}`}>
                            {doc.status === 'verified' ? 'Verified' : 
                             doc.status === 'pending' ? 'Pending Review' : 
                             doc.status === 'rejected' ? 'Rejected' : 'Unknown'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div className="p-12 text-center">
                  <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No documents found</h3>
                  <p className="text-neutral-600">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-neutral-900">Upload Document</h3>
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="text-neutral-400 hover:text-neutral-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Document Category
                  </label>
                  <select className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-beedab-blue focus:border-transparent">
                    <option value="">Select category...</option>
                    <option value="property-docs">Property Documents</option>
                    <option value="legal-docs">Legal Documents</option>
                    <option value="financial-docs">Financial Documents</option>
                    <option value="identification">Identification</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    File Upload
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-sm text-neutral-600">
                      Drop files here or <button className="text-beedab-blue hover:underline">browse</button>
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setUploadModalOpen(false)}
                    className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="flex-1 px-4 py-2 bg-beedab-blue text-white rounded-lg hover:bg-beedab-darkblue transition-colors">
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
