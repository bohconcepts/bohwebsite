import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Get environment variables with fallbacks for development
const SUPABASE_URL = "https://krbkwdkluhyxpgddnqwr.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

// This endpoint uses the service role key to bypass RLS
// It should only be used for this specific purpose
const serviceClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const { data: existingSubscriber } = await serviceClient
      .from('newsletter_subscribers')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (existingSubscriber) {
      return res.status(409).json({ error: 'This email is already subscribed to our newsletter' });
    }

    // Insert new subscriber
    const { data, error } = await serviceClient
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        confirmed: false,
      })
      .select('unsubscribe_token')
      .single();

    if (error) {
      console.error('Error inserting subscriber:', error);
      return res.status(500).json({ error: 'Failed to subscribe' });
    }

    // Return success with the unsubscribe token
    return res.status(200).json({ 
      success: true, 
      unsubscribe_token: data.unsubscribe_token 
    });
  } catch (error) {
    console.error('Error in newsletter subscription API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
