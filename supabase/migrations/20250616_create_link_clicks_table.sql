-- Create a table to track link clicks
CREATE TABLE IF NOT EXISTS public.link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  page_source TEXT,
  user_id UUID REFERENCES auth.users(id),
  clicked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies to secure the table
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert link clicks (for anonymous tracking)
CREATE POLICY "Allow anyone to insert link clicks" 
  ON public.link_clicks 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Only allow authenticated users with admin role to select/view link clicks
CREATE POLICY "Allow admins to view link clicks" 
  ON public.link_clicks 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create index on commonly queried columns
CREATE INDEX IF NOT EXISTS link_clicks_url_idx ON public.link_clicks (url);
CREATE INDEX IF NOT EXISTS link_clicks_clicked_at_idx ON public.link_clicks (clicked_at);
CREATE INDEX IF NOT EXISTS link_clicks_user_id_idx ON public.link_clicks (user_id);

-- Add comment to the table
COMMENT ON TABLE public.link_clicks IS 'Tracks links clicked throughout the website';
