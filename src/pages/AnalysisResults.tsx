import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Shield, ArrowLeft, AlertTriangle, CheckCircle, FileText, Download, Share } from 'lucide-react';

const AnalysisResults = () => {
  const { id } = useParams();

  // Mock analysis data
  const analysisData = {
    id: id,
    fileName: 'Tender_Document_2025_001.pdf',
    uploadDate: '2025-01-15',
    analysisDate: '2025-01-15T10:30:00Z',
    overallRisk: 15,
    status: 'completed',
    summary: {
      totalPages: 45,
      documentsAnalyzed: 1,
      flaggedItems: 2,
      confidence: 95.7
    },
    findings: [
      {
        type: 'low',
        category: 'Document Consistency',
        description: 'Minor formatting inconsistencies detected in section 3.2',
        severity: 'Low',
        recommendation: 'Review formatting standards for future submissions'
      },
      {
        type: 'low',
        category: 'Data Validation',
        description: 'One contact phone number format differs from standard',
        severity: 'Low',
        recommendation: 'Verify contact information accuracy'
      }
    ],
    riskFactors: [
      { category: 'Document Authenticity', score: 95, status: 'pass' },
      { category: 'Financial Data Consistency', score: 92, status: 'pass' },
      { category: 'Contact Information', score: 88, status: 'pass' },
      { category: 'Signature Verification', score: 97, status: 'pass' },
      { category: 'Template Compliance', score: 85, status: 'pass' }
    ]
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TenderGuard AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Analysis Report</h1>
              <p className="text-gray-600">{analysisData.fileName}</p>
              <p className="text-sm text-gray-500">
                Analyzed on {new Date(analysisData.analysisDate).toLocaleDateString()} at{' '}
                {new Date(analysisData.analysisDate).toLocaleTimeString()}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskColor(100 - analysisData.overallRisk)}`}>
                  {100 - analysisData.overallRisk}%
                </div>
                <div className="text-sm text-gray-500">Trust Score</div>
              </div>
              
              <div className="flex space-x-2">
                <button className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analysisData.summary.totalPages}</p>
                  <p className="text-sm text-gray-600">Pages Analyzed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analysisData.summary.confidence}%</p>
                  <p className="text-sm text-gray-600">Confidence Level</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analysisData.summary.flaggedItems}</p>
                  <p className="text-sm text-gray-600">Items Flagged</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{analysisData.overallRisk}%</p>
                  <p className="text-sm text-gray-600">Risk Level</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Risk Assessment</h2>
              
              <div className="space-y-4">
                {analysisData.riskFactors.map((factor, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{factor.category}</span>
                      <span className={`text-sm font-medium ${getRiskColor(factor.score)}`}>
                        {factor.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          factor.score >= 80 ? 'bg-green-500' :
                          factor.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${factor.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Findings</h2>
              
              {analysisData.findings.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg mb-2">No issues detected</p>
                  <p className="text-gray-500">This document appears to be authentic and trustworthy.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysisData.findings.map((finding, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                          <span className="font-medium text-gray-900">{finding.category}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{finding.description}</p>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">
                          <strong>Recommendation:</strong> {finding.recommendation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Assessment</h3>
              
              <div className={`p-4 rounded-lg mb-4 ${getRiskBgColor(100 - analysisData.overallRisk)}`}>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-gray-900">Low Risk Document</p>
                    <p className="text-sm text-gray-600">
                      This document shows minimal fraud indicators
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Authenticity Score</span>
                  <span className="text-sm font-medium text-green-600">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Time</span>
                  <span className="text-sm font-medium text-gray-900">2.3 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Data Points Analyzed</span>
                  <span className="text-sm font-medium text-gray-900">247</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Document Approved</p>
                    <p className="text-xs text-gray-600">Ready for tender process</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 rounded-full p-1 mr-3 mt-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Minor Review</p>
                    <p className="text-xs text-gray-600">Address formatting issues</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Archive Report</p>
                    <p className="text-xs text-gray-600">Save for compliance records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;