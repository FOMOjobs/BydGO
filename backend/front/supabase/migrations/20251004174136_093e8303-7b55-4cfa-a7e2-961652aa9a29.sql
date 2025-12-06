-- Fix security issue: Restrict profiles table access
-- Remove overly permissive policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Add restrictive policy: Users can only view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Admin policy already exists and is correct:
-- "Admins can view all profiles" allows admins to see everything