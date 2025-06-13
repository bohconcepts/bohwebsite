-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  archived BOOLEAN DEFAULT FALSE NOT NULL
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS contacts_email_idx ON public.contacts (email);

-- Create index on read status for filtering
CREATE INDEX IF NOT EXISTS contacts_read_idx ON public.contacts (read);

-- Create index on archived status for filtering
CREATE INDEX IF NOT EXISTS contacts_archived_idx ON public.contacts (archived);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Only authenticated users with admin role can view contacts
CREATE POLICY "Allow admins to view contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Only authenticated users with admin role can insert contacts
CREATE POLICY "Allow admins to insert contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Only authenticated users with admin role can update contacts
CREATE POLICY "Allow admins to update contacts" 
  ON public.contacts 
  FOR UPDATE 
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Only authenticated users with admin role can delete contacts
CREATE POLICY "Allow admins to delete contacts" 
  ON public.contacts 
  FOR DELETE 
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Allow anonymous users to insert contacts (for contact form submissions)
CREATE POLICY "Allow anonymous to insert contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (auth.role() = 'anon');

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
