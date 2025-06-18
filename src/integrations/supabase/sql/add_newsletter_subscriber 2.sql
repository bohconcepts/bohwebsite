-- Function to add a newsletter subscriber with explicit tokens
-- This function runs with security definer permissions to bypass RLS
CREATE OR REPLACE FUNCTION add_newsletter_subscriber(
  p_email TEXT,
  p_confirmed BOOLEAN DEFAULT FALSE,
  p_confirmation_token UUID DEFAULT uuid_generate_v4(),
  p_unsubscribe_token UUID DEFAULT uuid_generate_v4()
) RETURNS VOID AS $$
BEGIN
  -- Insert the new subscriber
  INSERT INTO newsletter_subscribers (
    email,
    confirmed,
    confirmation_token,
    unsubscribe_token
  ) VALUES (
    p_email,
    p_confirmed,
    p_confirmation_token,
    p_unsubscribe_token
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
