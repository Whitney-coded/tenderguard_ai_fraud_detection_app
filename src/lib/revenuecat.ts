// RevenueCat configuration and utilities
export const REVENUECAT_CONFIG = {
  // You'll need to provide these
  PUBLIC_API_KEY: import.meta.env.VITE_REVENUECAT_PUBLIC_KEY || '',
  APP_USER_ID_PREFIX: 'tenderguard_',
  
  // Product configuration
  PRODUCTS: {
    STANDARD_PACKAGE: {
      id: 'prod0e96234594', // Your provided product ID
      name: 'Standard Package',
      description: 'Full access to TenderGuard AI fraud detection',
      price: 'R100.00',
      currency: 'ZAR',
      billing_period: 'monthly'
    }
  },
  
  // Entitlement identifiers
  ENTITLEMENTS: {
    PREMIUM_ACCESS: 'premium_access',
    DOCUMENT_ANALYSIS: 'document_analysis',
    UNLIMITED_UPLOADS: 'unlimited_uploads'
  }
} as const;

// RevenueCat API types
export interface RevenueCatCustomer {
  app_user_id: string;
  original_app_user_id: string;
  original_application_version: string;
  original_purchase_date: string;
  first_seen: string;
  last_seen: string;
  management_url: string;
  subscriber: {
    entitlements: Record<string, any>;
    subscriptions: Record<string, any>;
    non_subscriptions: Record<string, any>;
  };
}

export interface RevenueCatPurchase {
  product_id: string;
  purchase_date: string;
  expires_date?: string;
  is_sandbox: boolean;
  original_purchase_date: string;
  store: string;
  unsubscribe_detected_at?: string;
  billing_issues_detected_at?: string;
}

// Utility functions
export const createAppUserId = (supabaseUserId: string): string => {
  return `${REVENUECAT_CONFIG.APP_USER_ID_PREFIX}${supabaseUserId}`;
};

export const extractSupabaseUserId = (appUserId: string): string => {
  return appUserId.replace(REVENUECAT_CONFIG.APP_USER_ID_PREFIX, '');
};

// RevenueCat API client for frontend
export class RevenueCatClient {
  private apiKey: string;
  private baseUrl = 'https://api.revenuecat.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`RevenueCat API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCustomerInfo(appUserId: string): Promise<RevenueCatCustomer> {
    return this.makeRequest(`/subscribers/${appUserId}`);
  }

  async createPurchase(appUserId: string, productId: string, receiptData: string) {
    return this.makeRequest(`/subscribers/${appUserId}/receipts`, {
      method: 'POST',
      body: JSON.stringify({
        app_user_id: appUserId,
        fetch_token: receiptData,
        product_id: productId,
      }),
    });
  }
}

// Initialize RevenueCat client
export const revenueCatClient = new RevenueCatClient(REVENUECAT_CONFIG.PUBLIC_API_KEY);