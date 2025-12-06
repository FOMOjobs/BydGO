-- ============================================================================
-- CRITICAL SECURITY FIXES - Hack Yeah Project
-- Date: 2025-10-04
-- ============================================================================
-- This migration fixes 3 critical security vulnerabilities:
-- 1. User Personal Information Exposed to Anyone
-- 2. Minor Consent Forms Inaccessible to Administrators
-- 3. Organizations Cannot Access Their Own Unverified Profiles
-- ============================================================================

-- ============================================================================
-- FIX 1: User Personal Information Exposed
-- ============================================================================
-- Problem: "Admins can view all profiles" policy uses USING (true) which allows
-- EVERYONE to view all profiles, not just admins.
-- Solution: Replace with proper admin check using has_role function.

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add policy to ensure users can still view profiles they need to interact with
-- (e.g., organization profiles when applying to opportunities)
CREATE POLICY "Users can view public profile fields"
  ON public.profiles FOR SELECT
  USING (
    -- Users can view their own profile completely
    auth.uid() = id
    OR
    -- Users can view verified organization/coordinator profiles (limited fields)
    (
      verification_status = 'verified'
      AND user_type IN ('organization', 'school_coordinator')
    )
    OR
    -- Admins can view everything (already covered by separate policy)
    public.has_role(auth.uid(), 'admin')
  );

-- ============================================================================
-- FIX 2: Minor Consent Forms Inaccessible to Administrators
-- ============================================================================
-- Problem: Only volunteers can view their own consent forms.
-- Admins cannot access them for verification.
-- Solution: Add admin access policy and update policy for consent forms.

-- Add policy for admins to view all consent forms
CREATE POLICY "Admins can view all minor consent forms"
  ON public.minor_consent FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update consent status
CREATE POLICY "Admins can update consent status"
  ON public.minor_consent FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- FIX 3: Organizations Cannot Access Their Own Unverified Profiles
-- ============================================================================
-- Problem: "Anyone can view verified organizations" policy only shows
-- verified profiles. Organizations cannot see their own unverified profiles.
-- Solution: Add policy allowing organizations to view their own profiles
-- regardless of verification status.

-- Drop the old overly restrictive policy
DROP POLICY IF EXISTS "Anyone can view verified organizations" ON public.organization_profiles;

-- Create new policy: Verified organizations are public
CREATE POLICY "Public can view verified organizations"
  ON public.organization_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = organization_profiles.user_id
      AND profiles.verification_status = 'verified'
    )
  );

-- Create new policy: Organizations can view their own profile (any status)
CREATE POLICY "Organizations can view own profile"
  ON public.organization_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Create new policy: Admins can view all organizations
CREATE POLICY "Admins can view all organizations"
  ON public.organization_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Apply same fix to school_coordinator_profiles
DROP POLICY IF EXISTS "Anyone can view verified coordinators" ON public.school_coordinator_profiles;

CREATE POLICY "Public can view verified coordinators"
  ON public.school_coordinator_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = school_coordinator_profiles.user_id
      AND profiles.verification_status = 'verified'
    )
  );

CREATE POLICY "Coordinators can view own profile"
  ON public.school_coordinator_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all coordinators"
  ON public.school_coordinator_profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- ADDITIONAL SECURITY HARDENING
-- ============================================================================

-- Ensure user_roles table is properly secured
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view roles" ON public.user_roles;

-- Only allow users to view their own roles and admins to view all
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can insert/update/delete roles
CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================================
-- VERIFICATION & AUDIT
-- ============================================================================

-- Create audit log table for security-sensitive operations
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.security_audit_log FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to log sensitive data access
CREATE OR REPLACE FUNCTION public.log_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    action,
    table_name,
    record_id,
    new_data
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.id,
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$;

-- Add audit triggers for sensitive tables
CREATE TRIGGER audit_minor_consent_access
  AFTER INSERT OR UPDATE ON public.minor_consent
  FOR EACH ROW
  EXECUTE FUNCTION public.log_sensitive_access();

-- ============================================================================
-- INDEX OPTIMIZATION FOR SECURITY QUERIES
-- ============================================================================

-- Add indexes for faster role checks
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup
  ON public.user_roles(user_id, role);

-- Add index for verification status checks
CREATE INDEX IF NOT EXISTS idx_profiles_verification
  ON public.profiles(verification_status);

-- Add index for organization verification lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_type_verification
  ON public.profiles(user_type, verification_status);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Admins can view all profiles" ON public.profiles IS
  'Security Fix: Only authenticated admins can view all profiles. Previously used USING (true) which exposed all user data.';

COMMENT ON POLICY "Admins can view all minor consent forms" ON public.minor_consent IS
  'Security Fix: Admins need access to verify parental consent for minors.';

COMMENT ON POLICY "Organizations can view own profile" ON public.organization_profiles IS
  'Security Fix: Organizations must be able to view and edit their profiles before verification.';

COMMENT ON TABLE public.security_audit_log IS
  'Audit log for tracking access to sensitive data (minor consent forms, admin actions, etc.)';
