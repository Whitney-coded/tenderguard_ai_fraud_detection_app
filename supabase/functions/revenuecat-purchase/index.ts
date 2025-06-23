import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    })

    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { productId, receiptData, platform } = await req.json()

    if (!productId || !receiptData) {
      throw new Error('Missing required fields: productId, receiptData')
    }

    // Create app user ID for RevenueCat
    const appUserId = `tenderguard_${user.id}`

    // Call RevenueCat API to verify purchase
    const revenueCatApiKey = Deno.env.get('REVENUECAT_SECRET_KEY')
    if (!revenueCatApiKey) {
      throw new Error('RevenueCat API key not configured')
    }

    const revenueCatResponse = await fetch(
      `https://api.revenuecat.com/v1/subscribers/${appUserId}/receipts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${revenueCatApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_user_id: appUserId,
          fetch_token: receiptData,
          product_id: productId,
          platform: platform || 'web'
        }),
      }
    )

    if (!revenueCatResponse.ok) {
      const errorData = await revenueCatResponse.text()
      throw new Error(`RevenueCat API error: ${revenueCatResponse.status} - ${errorData}`)
    }

    const purchaseData = await revenueCatResponse.json()

    // Store purchase information in our database
    const { error: dbError } = await supabase
      .from('revenuecat_customers')
      .upsert({
        user_id: user.id,
        app_user_id: appUserId,
        original_app_user_id: appUserId,
        updated_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        customer_info: purchaseData.subscriber,
        app_user_id: appUserId
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Purchase verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})