import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface RevenueCatWebhookEvent {
  api_version: string;
  event: {
    type: string;
    id: string;
    app_user_id: string;
    original_app_user_id: string;
    product_id: string;
    period_type: string;
    purchased_at_ms: number;
    expiration_at_ms?: number;
    environment: string;
    entitlement_id?: string;
    entitlement_ids?: string[];
    is_family_share: boolean;
    country_code: string;
    app_id: string;
    offer_code?: string;
    currency: string;
    price: number;
    price_in_purchased_currency: number;
    subscriber_attributes: Record<string, any>;
    store: string;
    takehome_percentage: number;
    tax_percentage: number;
    commission_percentage: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify webhook authenticity (you'll need to implement this based on RevenueCat's webhook verification)
    const webhookSecret = Deno.env.get('REVENUECAT_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('RevenueCat webhook secret not configured')
    }

    // Parse the webhook payload
    const payload: RevenueCatWebhookEvent = await req.json()
    console.log('RevenueCat webhook received:', payload.event.type)

    // Extract user ID from app_user_id (remove prefix)
    const appUserId = payload.event.app_user_id
    const supabaseUserId = appUserId.replace('tenderguard_', '')

    // Handle different event types
    switch (payload.event.type) {
      case 'INITIAL_PURCHASE':
      case 'RENEWAL':
      case 'PRODUCT_CHANGE':
        await handleSubscriptionEvent(supabase, payload, supabaseUserId, 'active')
        break
      
      case 'CANCELLATION':
        await handleSubscriptionEvent(supabase, payload, supabaseUserId, 'canceled')
        break
      
      case 'EXPIRATION':
        await handleSubscriptionEvent(supabase, payload, supabaseUserId, 'expired')
        break
      
      case 'BILLING_ISSUE':
        await handleSubscriptionEvent(supabase, payload, supabaseUserId, 'past_due')
        break
      
      default:
        console.log(`Unhandled event type: ${payload.event.type}`)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('RevenueCat webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function handleSubscriptionEvent(
  supabase: any,
  payload: RevenueCatWebhookEvent,
  userId: string,
  status: string
) {
  const event = payload.event

  // Upsert RevenueCat customer
  await supabase
    .from('revenuecat_customers')
    .upsert({
      user_id: userId,
      app_user_id: event.app_user_id,
      original_app_user_id: event.original_app_user_id,
      updated_at: new Date().toISOString()
    })

  // Upsert subscription
  await supabase
    .from('revenuecat_subscriptions')
    .upsert({
      user_id: userId,
      app_user_id: event.app_user_id,
      product_id: event.product_id,
      entitlement_id: event.entitlement_id,
      status: status,
      purchased_at: new Date(event.purchased_at_ms).toISOString(),
      expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      environment: event.environment,
      store: event.store,
      currency: event.currency,
      price: event.price,
      updated_at: new Date().toISOString()
    })

  // Log the purchase event
  await supabase
    .from('revenuecat_purchases')
    .insert({
      user_id: userId,
      app_user_id: event.app_user_id,
      product_id: event.product_id,
      event_type: payload.event.type,
      event_id: event.id,
      purchased_at: new Date(event.purchased_at_ms).toISOString(),
      expires_at: event.expiration_at_ms ? new Date(event.expiration_at_ms).toISOString() : null,
      price: event.price,
      currency: event.currency,
      store: event.store,
      environment: event.environment
    })
}