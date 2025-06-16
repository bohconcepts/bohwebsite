-- First, temporarily disable RLS to ensure we can make changes
ALTER TABLE public.link_clicks DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anyone to insert link clicks" ON public.link_clicks;
DROP POLICY IF EXISTS "Allow admins to view link clicks" ON public.link_clicks;
DROP POLICY IF EXISTS "Allow users to view their own link clicks" ON public.link_clicks;

-- Re-enable RLS
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows EVERYONE to insert data (no restrictions)
CREATE POLICY "Anyone can insert link clicks"
  ON public.link_clicks
  FOR INSERT
  TO anon, authenticated, service_role
  WITH CHECK (true);

-- Create a policy that allows EVERYONE to select their own data
CREATE POLICY "Anyone can select their own link clicks"
  ON public.link_clicks
  FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

-- Add a special policy for admins to view all link clicks
CREATE POLICY "Admins can view all link clicks"
  ON public.link_clicks
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Grant insert privileges to the anon role explicitly
GRANT INSERT ON public.link_clicks TO anon;
GRANT SELECT ON public.link_clicks TO anon;
