-- Create a table for newsletter subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed BOOLEAN DEFAULT FALSE,
  confirmation_token UUID DEFAULT uuid_generate_v4(),
  unsubscribe_token UUID DEFAULT uuid_generate_v4()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers(email);

-- Set up Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow anonymous users to insert new subscribers (for the public subscription form)
CREATE POLICY "Allow anonymous insert" ON newsletter_subscribers
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to select all subscribers (for admin purposes)
CREATE POLICY "Allow authenticated select" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update subscribers (for admin purposes)
CREATE POLICY "Allow authenticated update" ON newsletter_subscribers
  FOR UPDATE TO authenticated
  USING (true);

-- Allow authenticated users to delete subscribers (for admin purposes)
CREATE POLICY "Allow authenticated delete" ON newsletter_subscribers
  FOR DELETE TO authenticated
  USING (true);
