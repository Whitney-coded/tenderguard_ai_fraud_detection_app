/*
  # RevenueCat Integration Schema

  1. New Tables
    - `revenuecat_customers`
      - Links Supabase users to RevenueCat app user IDs
    - `revenuecat_subscriptions`
      - Stores subscription status and details
    - `revenuecat_purchases`
      - Logs all purchase events for audit trail

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
*/

-- RevenueCat customers table
CREATE TABLE IF NOT EXISTS revenuecat_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_user_id text UNIQUE NOT NULL,
  original_app_user_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RevenueCat subscriptions table
CREATE TABLE IF NOT EXISTS revenuecat_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_user_id text NOT NULL,
  product_id text NOT NULL,
  entitlement_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'expired', 'past_due', 'paused')),
  purchased_at timestamptz NOT NULL,
  expires_at timestamptz,
  environment text NOT NULL DEFAULT 'production',
  store text NOT NULL DEFAULT 'web',
  currency text NOT NULL DEFAULT 'ZAR',
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RevenueCat purchases table (audit log)
CREATE TABLE IF NOT EXISTS revenuecat_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_user_id text NOT NULL,
  product_id text NOT NULL,
  event_type text NOT NULL,
  event_id text UNIQUE NOT NULL,
  purchased_at timestamptz NOT NULL,
  expires_at timestamptz,
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'ZAR',
  store text NOT NULL DEFAULT 'web',
  environment text NOT NULL DEFAULT 'production',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE revenuecat_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenuecat_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenuecat_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for revenuecat_customers
CREATE POLICY "Users can manage own RevenueCat customer data"
  ON revenuecat_customers
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for revenuecat_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON revenuecat_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON revenuecat_subscriptions
  FOR ALL
  TO service_role;

-- RLS Policies for revenuecat_purchases
CREATE POLICY "Users can view own purchases"
  ON revenuecat_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage purchases"
  ON revenuecat_purchases
  FOR ALL
  TO service_role;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS revenuecat_customers_user_id_idx ON revenuecat_customers(user_id);
CREATE INDEX IF NOT EXISTS revenuecat_customers_app_user_id_idx ON revenuecat_customers(app_user_id);
CREATE INDEX IF NOT EXISTS revenuecat_subscriptions_user_id_idx ON revenuecat_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS revenuecat_subscriptions_status_idx ON revenuecat_subscriptions(status);
CREATE INDEX IF NOT EXISTS revenuecat_purchases_user_id_idx ON revenuecat_purchases(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER revenuecat_customers_updated_at
  BEFORE UPDATE ON revenuecat_customers
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER revenuecat_subscriptions_updated_at
  BEFORE UPDATE ON revenuecat_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create view for active subscriptions (fixed column conflict)
CREATE OR REPLACE VIEW user_active_subscriptions AS
SELECT 
  s.id,
  s.user_id,
  s.app_user_id,
  s.product_id,
  s.entitlement_id,
  s.status,
  s.purchased_at,
  s.expires_at,
  s.environment,
  s.store,
  s.currency,
  s.price,
  s.created_at,
  s.updated_at
FROM revenuecat_subscriptions s
JOIN revenuecat_customers c ON s.app_user_id = c.app_user_id
WHERE s.status = 'active' 
  AND (s.expires_at IS NULL OR s.expires_at > now());

-- Grant access to the view
GRANT SELECT ON user_active_subscriptions TO authenticated;