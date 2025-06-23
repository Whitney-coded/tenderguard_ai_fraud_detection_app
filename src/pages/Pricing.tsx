import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Check, ArrowLeft, Zap, Crown, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { REVENUECAT_CONFIG, createAppUserId } from '../lib/revenuecat';
import MobileMenu from '../components/MobileMenu';

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // For web-based RevenueCat integration, we'll redirect to a payment page
      // In a real implementation, you'd integrate with your payment processor
      // and then verify the purchase with RevenueCat
      
      const appUserId = createAppUserId(user.id);
      
      // For now, we'll simulate a purchase flow
      // In production, you'd integrate with Stripe, PayPal, or another payment processor
      // and then verify the receipt with RevenueCat
      
      alert(`Starting subscription process for user: ${appUserId}\n\nIn production, this would redirect to your payment processor.`);
      
      // Simulate successful purchase
      setTimeout(() => {
        navigate('/success?product=standard_package');
      }, 2000);

    } catch (err) {
      console.error('Subscription error:', err);
      setError('Failed to start subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    'Unlimited document analysis',
    'Advanced AI fraud detection',
    'Detailed risk assessment reports',
    'Real-time processing (2.3s average)',
    '99.7% accuracy guarantee',
    'Priority customer support',
    'API access for integrations',
    'Compliance reporting tools',
    'Data export capabilities',
    'Team collaboration features'
  ];

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
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Home
              </Link>
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <MobileMenu isAuthenticated={!!user} />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium mb-6">
            <Crown className="h-4 w-4 mr-2" />
            Simple, Transparent Pricing
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with TenderGuard AI and protect your organization from fraudulent tender documents
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                <Star className="h-4 w-4 mr-1" />
                Most Popular
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200 p-8 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
              
              <div className="relative">
                <div className="text-center mb-8">
                  <div className="bg-indigo-100 p-3 rounded-xl w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-indigo-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {REVENUECAT_CONFIG.PRODUCTS.STANDARD_PACKAGE.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {REVENUECAT_CONFIG.PRODUCTS.STANDARD_PACKAGE.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-5xl font-bold text-gray-900">R100</span>
                    <span className="text-xl text-gray-500 ml-1">/month</span>
                  </div>
                  <p className="text-sm text-gray-500">Billed monthly • Cancel anytime</p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-100 p-1 rounded-full mr-3">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  
                  <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? 'Processing...' : user ? 'Subscribe Now' : 'Sign Up & Subscribe'}
                  </button>
                  
                  <p className="text-center text-sm text-gray-500">
                    🔒 Secure payment • 30-day money-back guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">Trusted by organizations worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm font-medium">Bank-Grade Security</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2 text-green-600" />
              <span className="text-sm font-medium">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              <span className="text-sm font-medium">99.7% Accuracy</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel my subscription anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial available?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with TenderGuard AI, we'll refund your payment in full.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How accurate is the fraud detection?
              </h3>
              <p className="text-gray-600">
                Our AI system maintains a 99.7% accuracy rate, continuously improving through machine learning and regular updates.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What file formats are supported?
              </h3>
              <p className="text-gray-600">
                We support PDF, DOC, DOCX, and common image formats (JPG, PNG). Files can be up to 10MB each.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;