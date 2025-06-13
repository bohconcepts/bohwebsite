-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  bio TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'staff', 'viewer')),
  is_active BOOLEAN DEFAULT TRUE,
  employee_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin users can insert profiles
CREATE POLICY "Admins can insert profiles"
  ON public.profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admin users can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on profile update
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);

-- Create index on role for role-based queries
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);

-- Allow authenticated users to insert their own profile on signup
CREATE POLICY "Users can insert own profile on signup"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Special policy for the service role to manage all profiles
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles
  USING (auth.jwt() ->> 'role' = 'service_role');
