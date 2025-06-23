import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  AlertCircle,
  Download,
  Eye
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  status: 'uploading' | 'uploaded' | 'error';
  url?: string;
  category: 'deed' | 'id' | 'proof_of_income' | 'bank_statement' | 'other';
}

interface DocumentUploaderProps {
  propertyId?: string;
  userId?: string;
  onDocumentUploaded?: (document: Document) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  className?: string;
}

/**
 * Feature: Document Management System
 * Addresses pain point: Paper-based documentation and manual verification processes
 * Supports drag-and-drop upload, categorization, and document verification
 */
export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  propertyId,
  userId,
  onDocumentUploaded,
  maxFiles = 10,
  allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  className = ''
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

  // TODO: Implement actual file upload to server/cloud storage
  const uploadFile = async (file: File, category: Document['category']): Promise<Document> => {
    const document: Document = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date(),
      status: 'uploading',
      category
    };

    setDocuments(prev => [...prev, document]);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[document.id] || 0;
        const newProgress = Math.min(currentProgress + 10, 100);
        
        if (newProgress === 100) {
          clearInterval(uploadInterval);
          setDocuments(prevDocs => 
            prevDocs.map(doc => 
              doc.id === document.id 
                ? { ...doc, status: 'uploaded', url: URL.createObjectURL(file) }
                : doc
            )
          );
          setUploadProgress(prev => {
            const { [document.id]: _, ...rest } = prev;
            return rest;
          });
        }
        
        return { ...prev, [document.id]: newProgress };
      });
    }, 200);

    return { ...document, status: 'uploaded', url: URL.createObjectURL(file) };
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (validateFile(file)) {
        uploadFile(file, 'other');
      }
    });
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (validateFile(file)) {
        uploadFile(file, 'other');
      }
    });
  };

  const validateFile = (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      alert(`File type .${fileExtension} is not allowed`);
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB limit');
      return false;
    }

    if (documents.length >= maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return false;
    }

    return true;
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image className="h-6 w-6" />;
    if (type.includes('pdf')) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const documentCategories = [
    { value: 'deed', label: 'Title Deed' },
    { value: 'id', label: 'Identity Document' },
    { value: 'proof_of_income', label: 'Proof of Income' },
    { value: 'bank_statement', label: 'Bank Statement' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? 'border-beedab-blue bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload Documents
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop files here, or click to select files
        </p>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          accept={allowedTypes.map(type => `.${type}`).join(',')}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="bg-beedab-blue text-white px-6 py-2 rounded-lg hover:bg-beedab-darkblue cursor-pointer inline-block"
        >
          Choose Files
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Supported formats: {allowedTypes.join(', ')} (Max 10MB each)
        </p>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-medium text-gray-900">Uploaded Documents</h4>
          
          {documents.map((document) => (
            <motion.div
              key={document.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
            >
              <div className="flex-shrink-0 text-gray-500">
                {getFileIcon(document.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {document.name}
                  </p>
                  {document.status === 'uploaded' && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {document.status === 'error' && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{formatFileSize(document.size)}</span>
                  <span>{document.uploadDate.toLocaleDateString()}</span>
                  <select
                    value={document.category}
                    onChange={(e) => {
                      const newCategory = e.target.value as Document['category'];
                      setDocuments(prev =>
                        prev.map(doc =>
                          doc.id === document.id ? { ...doc, category: newCategory } : doc
                        )
                      );
                    }}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    {documentCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Upload Progress */}
                {document.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-beedab-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress[document.id] || 0}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Uploading... {uploadProgress[document.id] || 0}%
                    </p>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2">
                {document.status === 'uploaded' && document.url && (
                  <>
                    <button
                      onClick={() => window.open(document.url, '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Preview"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={document.url}
                      download={document.name}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </>
                )}
                <button
                  onClick={() => removeDocument(document.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Document Requirements */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-blue-900 mb-2">Required Documents</h5>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Title deed or proof of ownership</li>
          <li>• Valid identity document</li>
          <li>• Proof of income (for buyers)</li>
          <li>• Recent bank statements</li>
          <li>• Property compliance certificates</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUploader;