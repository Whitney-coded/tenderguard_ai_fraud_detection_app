import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Upload, FileText, User, LogOut, Plus, Clock, CheckCircle, AlertTriangle, Download, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SubscriptionStatus from '../components/SubscriptionStatus';

interface Document {
  id: string;
  file_name: string;
  file_size: number;
  file_type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

interface AnalysisResult {
  id: string;
  fileName: string;
  uploadDate: string;
  status: 'completed' | 'processing' | 'failed';
  riskScore: number;
  flaggedItems: number;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');

  // Mock analysis results for demonstration
  const [analysisResults] = useState<AnalysisResult[]>([
    {
      id: '1',
      fileName: 'Tender_Document_2025_001.pdf',
      uploadDate: '2025-01-15',
      status: 'completed',
      riskScore: 15,
      flaggedItems: 2
    },
    {
      id: '2',
      fileName: 'Construction_Proposal_ABC.pdf',
      uploadDate: '2025-01-14',
      status: 'completed',
      riskScore: 85,
      flaggedItems: 7
    },
    {
      id: '3',
      fileName: 'Service_Agreement_XYZ.pdf',
      uploadDate: '2025-01-13',
      status: 'processing',
      riskScore: 0,
      flaggedItems: 0
    }
  ]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (!user) return;

    setIsUploading(true);
    setUploadError('');
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
        }

        const allowedTypes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg',
          'image/png',
          'image/jpg'
        ];

        if (!allowedTypes.includes(file.type)) {
          throw new Error(`File ${file.name} has an unsupported format. Please use PDF, DOC, DOCX, or image files.`);
        }

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const newProgress = prev + Math.random() * 20;
            return newProgress > 90 ? 90 : newProgress;
          });
        }, 200);

        // Store document metadata in database
        const { data: documentData, error: dbError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            file_name: file.name,
            file_size: file.size,
            file_type: file.type,
            status: 'uploaded'
          })
          .select()
          .single();

        clearInterval(progressInterval);
        setUploadProgress(100);

        if (dbError) {
          throw new Error(`Failed to save document ${file.name}: ${dbError.message}`);
        }

        // Simulate processing
        setTimeout(async () => {
          await supabase
            .from('documents')
            .update({ status: 'processing' })
            .eq('id', documentData.id);

          // Simulate analysis completion
          setTimeout(async () => {
            await supabase
              .from('documents')
              .update({ status: 'completed' })
              .eq('id', documentData.id);

            fetchDocuments(); // Refresh the list
          }, 3000);
        }, 1000);
      }

      // Refresh documents list
      await fetchDocuments();
      
      setUploadProgress(0);
      alert(`${files.length} file(s) uploaded successfully! Analysis will begin shortly.`);
      
    } catch (error: any) {
      setUploadError(error.message);
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 30) return 'text-green-600';
    if (riskScore <= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (riskScore: number) => {
    if (riskScore <= 30) return 'bg-green-100';
    if (riskScore <= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TenderGuard AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <div className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-md">
                <User className="h-5 w-5 mr-2" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-700 hover:text-red-600 transition-colors px-3 py-2 rounded-md hover:bg-red-50"
              >
                <LogOut className="h-5 w-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Upload tender documents to analyze for potential fraud indicators using our advanced AI system
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Upload className="h-6 w-6 mr-2 text-indigo-600" />
                Upload Documents
              </h2>
              
              {uploadError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {uploadError}
                </div>
              )}
              
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50 scale-105'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-gray-600 mb-2">Processing documents...</p>
                    {uploadProgress > 0 && (
                      <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-indigo-100 p-4 rounded-full mb-4">
                      <Plus className="h-8 w-8 text-indigo-600" />
                    </div>
                    <p className="text-lg text-gray-600 mb-2">
                      Drag and drop your documents here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supports PDF, DOC, DOCX, and image files (max 10MB each)
                    </p>
                    <label className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 font-medium">
                      Choose Files
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                Recent Documents
              </h2>
              
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No documents uploaded yet</p>
                  <p className="text-sm text-gray-400">Upload your first document to get started with AI analysis</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 min-w-0 flex-1">
                          <div className="flex items-center">
                            {getStatusIcon(doc.status)}
                            <div className="ml-3 min-w-0 flex-1">
                              <p className="font-medium text-gray-900 truncate">
                                {doc.file_name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(doc.file_size)} • {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                            doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            doc.status === 'failed' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </span>
                          
                          {doc.status === 'completed' && (
                            <button className="text-indigo-600 hover:text-indigo-700 p-2 rounded-md hover:bg-indigo-50 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Analysis Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-indigo-600" />
                Analysis Results
              </h2>
              
              <div className="space-y-4">
                {analysisResults.map((result) => (
                  <div
                    key={result.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          {getStatusIcon(result.status)}
                          <span className="ml-2 font-medium text-gray-900">
                            {result.fileName}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(result.uploadDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {result.status === 'completed' && (
                          <>
                            <div className="text-center">
                              <div className={`text-sm font-medium ${getRiskColor(result.riskScore)}`}>
                                Risk: {result.riskScore}%
                              </div>
                              <div className="text-xs text-gray-500">
                                {result.flaggedItems} flags
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskBgColor(
                                result.riskScore
                              )} ${getRiskColor(result.riskScore)}`}
                            >
                              {result.riskScore <= 30 ? 'Low Risk' : 
                               result.riskScore <= 70 ? 'Medium Risk' : 'High Risk'}
                            </div>
                            <Link
                              to={`/analysis/${result.id}`}
                              className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                              View Report
                            </Link>
                          </>
                        )}
                        
                        {result.status === 'processing' && (
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Processing...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <SubscriptionStatus />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Documents Analyzed</span>
                  <span className="font-semibold text-gray-900">{documents.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Risk Score</span>
                  <span className="font-semibold text-green-600">22%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Processing Time</span>
                  <span className="font-semibold text-gray-900">2.3s avg</span>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the most out of TenderGuard AI with our comprehensive guides and support.
              </p>
              <div className="space-y-2">
                <Link
                  to="/demo"
                  className="block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  📚 User Guide
                </Link>
                <Link
                  to="/demo"
                  className="block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  🎥 Video Tutorials
                </Link>
                <Link
                  to="/demo"
                  className="block text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  💬 Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;