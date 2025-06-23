import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, ArrowRight, Download, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { REVENUECAT_CONFIG } from '../lib/revenuecat';

const Success = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  const [subscriptionData, setSubscriptionData] = useState(null);

  const product = productId === 'standard_package' 
    ? REVENUECAT_CONFIG.PRODUCTS.STANDARD_PACKAGE 
    : null;

  useEffect(() => {
    // In a real implementation, you'd fetch the actual subscription data
    // from RevenueCat or your database here
    if (product) {
      setSubscriptionData({
        product_name: product.name,
        price: product.price,
        billing_period: product.billing_period,
        next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        status: 'active'
      });
    }
  }, [product]);

  if (!user || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Invalid subscription or user not found.</p>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

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
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 p-4 rounded-full w-fit mx-auto mb-6">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to TenderGuard AI!
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your subscription has been activated successfully. You now have full access to our AI-powered fraud detection system.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Subscription Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription Details</h2>
            
            {subscriptionData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-medium text-gray-900">{subscriptionData.product_name}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium text-gray-900">{subscriptionData.price}/month</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Next Billing Date</span>
                  <span className="font-medium text-gray-900">{subscriptionData.next_billing_date}</span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Customer ID</span>
                  <span className="font-mono text-sm text-gray-500">{user.id.slice(0, 8)}...</span>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What's Next?</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                  <ArrowRight className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Start Analyzing Documents</h3>
                  <p className="text-gray-600 text-sm">Upload your first tender document to see our AI fraud detection in action.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                  <Download className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Download Reports</h3>
                  <p className="text-gray-600 text-sm">Generate detailed PDF reports for compliance and record-keeping.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Schedule a Demo</h3>
                  <p className="text-gray-600 text-sm">Book a personalized demo to learn about advanced features and integrations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            You Now Have Access To
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <Shield className="h-8 w-8 text-indigo-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced AI Detection</h3>
              <p className="text-gray-600 text-sm">99.7% accuracy in fraud detection with continuous learning algorithms</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Analysis</h3>
              <p className="text-gray-600 text-sm">Get comprehensive reports in under 3 seconds</p>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                <Download className="h-8 w-8 text-purple-600 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Detailed Reports</h3>
              <p className="text-gray-600 text-sm">Export professional reports for compliance and auditing</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            to="/dashboard"
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-flex items-center"
          >
            Start Using TenderGuard AI
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          
          <p className="mt-4 text-gray-600">
            Need help getting started?{' '}
            <Link to="/demo" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Book a demo
            </Link>{' '}
            or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;