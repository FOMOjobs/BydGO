-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('volunteer', 'organization', 'school_coordinator');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'verified', 'rejected');

-- Create enum for user roles (for admin system)
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create enum for consent status
CREATE TYPE public.consent_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type user_type NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  phone TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  verification_status verification_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create organization_profiles table
CREATE TABLE public.organization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  organization_name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  address TEXT NOT NULL,
  website TEXT,
  verification_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_coordinator_profiles table
CREATE TABLE public.school_coordinator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  school_address TEXT,
  authorization_document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create minor_consent table (for volunteers under 18)
CREATE TABLE public.minor_consent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  consent_document_url TEXT,
  parent_email TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  parent_phone TEXT,
  status consent_status DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_coordinator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.minor_consent ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles RLS (only admins can manage roles)
CREATE POLICY "Anyone can view roles"
  ON public.user_roles FOR SELECT
  USING (true);

-- Organization profiles RLS
CREATE POLICY "Anyone can view verified organizations"
  ON public.organization_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = organization_profiles.user_id
      AND profiles.verification_status = 'verified'
    )
  );

CREATE POLICY "Organizations can update own profile"
  ON public.organization_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Organizations can insert own profile"
  ON public.organization_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- School coordinator profiles RLS
CREATE POLICY "Anyone can view verified coordinators"
  ON public.school_coordinator_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = school_coordinator_profiles.user_id
      AND profiles.verification_status = 'verified'
    )
  );

CREATE POLICY "Coordinators can update own profile"
  ON public.school_coordinator_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Coordinators can insert own profile"
  ON public.school_coordinator_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Minor consent RLS
CREATE POLICY "Volunteers can view own consent"
  ON public.minor_consent FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Volunteers can insert own consent"
  ON public.minor_consent FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

-- Create function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to check if user is minor (under 18)
CREATE OR REPLACE FUNCTION public.is_minor(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXTRACT(YEAR FROM AGE(date_of_birth)) < 18
  FROM public.profiles
  WHERE id = user_id
$$;

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_type, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'volunteer')::user_type,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_organization_profiles_updated_at
  BEFORE UPDATE ON public.organization_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_school_coordinator_profiles_updated_at
  BEFORE UPDATE ON public.school_coordinator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();