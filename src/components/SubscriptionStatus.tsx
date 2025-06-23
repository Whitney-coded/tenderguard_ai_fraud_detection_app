import React, { useState, useEffect } from 'react';
import { Crown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  product_id: string;
  status: string;
  expires_at: string | null;
  price: number;
  currency: string;
}

const SubscriptionStatus = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('user_active_subscriptions')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      } else {
        setSubscription(data);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <span className="text-gray-600">Loading subscription status...</span>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
          <div>
            <p className="text-yellow-800 font-medium">No Active Subscription</p>
            <p className="text-yellow-700 text-sm">
              Subscribe to unlock unlimited document analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'past_due':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'canceled':
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never expires';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Crown className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Subscription Status</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Plan</span>
          <span className="font-medium text-gray-900">Standard Package</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Price</span>
          <span className="font-medium text-gray-900">
            {subscription.currency} {subscription.price}/month
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status</span>
          <div className="flex items-center">
            {getStatusIcon(subscription.status)}
            <span className="ml-2 font-medium text-gray-900">
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
        </div>

        {subscription.expires_at && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {subscription.status === 'active' ? 'Next Billing' : 'Expires'}
            </span>
            <span className="font-medium text-gray-900">
              {formatDate(subscription.expires_at)}
            </span>
          </div>
        )}
      </div>

      {subscription.status !== 'active' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Reactivate Subscription
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;