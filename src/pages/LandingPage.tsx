import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileCheck, Brain, Zap, ArrowRight, CheckCircle, Play, Sparkles, TrendingUp, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <Shield className="h-8 w-8 text-indigo-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">TenderGuard AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/signin"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        {/* Official Bolt Badge - Repositioned for better mobile/desktop compatibility */}
        <div className="fixed top-20 right-4 z-40 sm:top-24 sm:right-6">
          <a
            href="https://bolt.new/"
            target="_blank"
            rel="noopener noreferrer"
            className="block transform hover:scale-105 transition-transform duration-300 ease-in-out"
            style={{
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'manipulation'
            }}
          >
            <img
              src="/black_circle_360x360 (1) copy.png"
              alt="Powered by Bolt.new"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-2xl hover:shadow-3xl transition-shadow duration-300"
            />
          </a>
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6 animate-fade-in-up">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Fraud Detection
            </div>

            {/* Main Heading - Centered and more readable */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight max-w-5xl mx-auto">
              <span className="block">AI Powered Tender</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                Fraud Detection
              </span>
            </h1>

            {/* Subheading - More readable size */}
            <p className="text-lg sm:text-xl md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Protect your organization from fraudulent tender documents with our 
              <span className="font-semibold text-indigo-600"> advanced AI analysis system</span>. 
              Get instant insights and detailed reports on document authenticity.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 shadow-lg">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">99.7% Accuracy</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 shadow-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">2.3s Analysis</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-6 py-3 shadow-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
                <span className="text-sm font-semibold text-gray-700">10K+ Documents</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 max-w-md mx-auto">
              <Link
                to="/demo"
                className="group bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className="group border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                View Pricing
                <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">Bank-Grade Security</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                <span className="text-sm font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2 text-purple-600" />
                <span className="text-sm font-medium">Advanced AI</span>
              </div>
            </div>
          </div>

          {/* Hero Image/Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20 scale-105"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-gray-600 font-medium hidden sm:block">TenderGuard AI Dashboard</div>
                  </div>
                </div>
                <div className="p-4 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6 rounded-2xl border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 p-2 sm:p-3 rounded-xl">
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-green-600">95%</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Trust Score</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Document authenticity verified</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-2xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 p-2 sm:p-3 rounded-xl">
                          <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-blue-600">2.3s</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Analysis Time</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Lightning fast processing</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-2xl border border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 p-2 sm:p-3 rounded-xl">
                          <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                        </div>
                        <span className="text-xl sm:text-2xl font-bold text-purple-600">247</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Data Points</h3>
                      <p className="text-xs sm:text-sm text-gray-600">Comprehensive analysis</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Recent Analysis</h4>
                      <span className="text-xs sm:text-sm text-green-600 font-medium">✓ Completed</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center min-w-0 flex-1">
                          <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">Tender_Document_2025_001.pdf</span>
                        </div>
                        <span className="text-xs sm:text-sm text-green-600 font-medium ml-2">Low Risk</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center min-w-0 flex-1">
                          <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 mr-2 sm:mr-3 flex-shrink-0" />
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">Construction_Proposal_ABC.pdf</span>
                        </div>
                        <span className="text-xs sm:text-sm text-yellow-600 font-medium ml-2">Medium Risk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Explainer Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See TenderGuard AI in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how our AI technology analyzes tender documents and detects fraud in real-time
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gray-900 relative">
                {/* Video Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-6 mb-4 inline-block">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      How TenderGuard AI Works
                    </h3>
                    <p className="text-indigo-100 mb-6">
                      3-minute overview of our fraud detection process
                    </p>
                    <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center">
                      <Play className="h-5 w-5 mr-2" />
                      Watch Demo Video
                    </button>
                  </div>
                </div>
                
                {/* Video overlay with gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="absolute top-4 left-10 w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="absolute top-4 left-16 w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              
              {/* Video stats */}
              <div className="bg-white p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">99.7%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">2.3s</div>
                    <div className="text-sm text-gray-600">Analysis Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">10K+</div>
                    <div className="text-sm text-gray-600">Documents Analyzed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Fraud Detection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leverage cutting-edge AI technology to analyze tender documents with unprecedented accuracy
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                <Brain className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Advanced machine learning algorithms analyze document patterns, inconsistencies, and anomalies with 99.7% accuracy.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                <Zap className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Results</h3>
              <p className="text-gray-600">
                Get comprehensive fraud analysis reports within seconds of uploading your tender documents.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                <FileCheck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detailed Reports</h3>
              <p className="text-gray-600">
                Receive actionable insights and recommendations to help you make informed decisions about tender authenticity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, secure, and efficient document analysis in three steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Upload Document</h3>
              <p className="text-gray-600">
                Securely upload your tender documents in PDF, DOC, or image format
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI engine analyzes the document for fraud indicators and anomalies
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Get Results</h3>
              <p className="text-gray-600">
                Receive detailed analysis report with recommendations and risk assessment
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose TenderGuard AI?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Bank-Grade Security</h3>
                    <p className="text-gray-600">Your documents are encrypted and processed with enterprise-level security</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">99.7% Accuracy</h3>
                    <p className="text-gray-600">Industry-leading fraud detection accuracy backed by continuous learning AI</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Processing</h3>
                    <p className="text-gray-600">Get results in seconds, not hours or days</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">24/7 Support</h3>
                    <p className="text-gray-600">Round-the-clock customer support and system monitoring</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white text-center">
                <Shield className="h-16 w-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Protect Your Organization</h3>
                <p className="text-indigo-100">
                  Join thousands of organizations already using TenderGuard AI to secure their tender processes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Secure Your Tender Process?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Start your subscription today and experience the power of AI-driven fraud detection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/pricing"
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              View Pricing
            </Link>
            <Link
              to="/demo"
              className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Book a Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-indigo-600" />
              <span className="ml-2 text-lg font-bold text-gray-900">TenderGuard AI</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 TenderGuard AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;