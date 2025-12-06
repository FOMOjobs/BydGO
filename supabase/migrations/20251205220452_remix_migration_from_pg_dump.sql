CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'moderator',
    'user'
);


--
-- Name: consent_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.consent_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: user_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_type AS ENUM (
    'volunteer',
    'organization',
    'school_coordinator'
);


--
-- Name: verification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;


--
-- Name: is_minor(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_minor(user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXTRACT(YEAR FROM AGE(date_of_birth)) < 18
  FROM public.profiles
  WHERE id = user_id
$$;


--
-- Name: log_sensitive_access(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_sensitive_access() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
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


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.certificates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    volunteer_id uuid NOT NULL,
    application_id uuid NOT NULL,
    opportunity_title text NOT NULL,
    organization_name text NOT NULL,
    issue_date date DEFAULT CURRENT_DATE NOT NULL,
    hours_completed numeric NOT NULL,
    certificate_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: conversations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    volunteer_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    opportunity_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    conversation_id uuid NOT NULL,
    sender_id uuid NOT NULL,
    content text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: minor_consent; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.minor_consent (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    volunteer_id uuid NOT NULL,
    consent_document_url text,
    parent_email text NOT NULL,
    parent_name text NOT NULL,
    parent_phone text,
    status public.consent_status DEFAULT 'pending'::public.consent_status,
    submitted_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone,
    reviewed_by uuid
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type text NOT NULL,
    read boolean DEFAULT false,
    related_application_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT notifications_type_check CHECK ((type = ANY (ARRAY['application'::text, 'reminder'::text, 'certificate'::text, 'message'::text, 'system'::text])))
);


--
-- Name: organization_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organization_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    organization_name text NOT NULL,
    logo_url text,
    description text,
    address text NOT NULL,
    website text,
    verification_document_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    user_type public.user_type NOT NULL,
    first_name text,
    last_name text,
    bio text,
    phone text,
    date_of_birth date,
    avatar_url text,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: school_coordinator_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.school_coordinator_profiles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    school_name text NOT NULL,
    school_address text,
    authorization_document_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: security_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.security_audit_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action text NOT NULL,
    table_name text NOT NULL,
    record_id uuid,
    old_data jsonb,
    new_data jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role DEFAULT 'user'::public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: volunteer_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.volunteer_applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    opportunity_id text NOT NULL,
    volunteer_id uuid NOT NULL,
    status text DEFAULT 'pending'::text,
    applied_at timestamp with time zone DEFAULT now(),
    notes text,
    attendance_marked boolean DEFAULT false,
    attended boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT volunteer_applications_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text, 'completed'::text, 'cancelled'::text])))
);


--
-- Name: certificates certificates_application_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_application_id_key UNIQUE (application_id);


--
-- Name: certificates certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_pkey PRIMARY KEY (id);


--
-- Name: conversations conversations_volunteer_id_organization_id_opportunity_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_volunteer_id_organization_id_opportunity_id_key UNIQUE (volunteer_id, organization_id, opportunity_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: minor_consent minor_consent_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minor_consent
    ADD CONSTRAINT minor_consent_pkey PRIMARY KEY (id);


--
-- Name: minor_consent minor_consent_volunteer_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minor_consent
    ADD CONSTRAINT minor_consent_volunteer_id_key UNIQUE (volunteer_id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: organization_profiles organization_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_pkey PRIMARY KEY (id);


--
-- Name: organization_profiles organization_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_user_id_key UNIQUE (user_id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: school_coordinator_profiles school_coordinator_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_coordinator_profiles
    ADD CONSTRAINT school_coordinator_profiles_pkey PRIMARY KEY (id);


--
-- Name: school_coordinator_profiles school_coordinator_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_coordinator_profiles
    ADD CONSTRAINT school_coordinator_profiles_user_id_key UNIQUE (user_id);


--
-- Name: security_audit_log security_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: volunteer_applications volunteer_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_pkey PRIMARY KEY (id);


--
-- Name: idx_applications_opportunity; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_opportunity ON public.volunteer_applications USING btree (opportunity_id);


--
-- Name: idx_applications_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_status ON public.volunteer_applications USING btree (status);


--
-- Name: idx_applications_volunteer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_volunteer ON public.volunteer_applications USING btree (volunteer_id);


--
-- Name: idx_certificates_application; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_application ON public.certificates USING btree (application_id);


--
-- Name: idx_certificates_volunteer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_certificates_volunteer ON public.certificates USING btree (volunteer_id);


--
-- Name: idx_conversations_organization; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_organization ON public.conversations USING btree (organization_id);


--
-- Name: idx_conversations_volunteer; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversations_volunteer ON public.conversations USING btree (volunteer_id);


--
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (conversation_id);


--
-- Name: idx_messages_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_created ON public.messages USING btree (created_at DESC);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (read);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_profiles_user_type_verification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_user_type_verification ON public.profiles USING btree (user_type, verification_status);


--
-- Name: idx_profiles_verification; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_profiles_verification ON public.profiles USING btree (verification_status);


--
-- Name: idx_user_roles_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_roles_lookup ON public.user_roles USING btree (user_id, role);


--
-- Name: minor_consent audit_minor_consent_access; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER audit_minor_consent_access AFTER INSERT OR UPDATE ON public.minor_consent FOR EACH ROW EXECUTE FUNCTION public.log_sensitive_access();


--
-- Name: conversations update_conversations_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: organization_profiles update_organization_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_organization_profiles_updated_at BEFORE UPDATE ON public.organization_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: school_coordinator_profiles update_school_coordinator_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_school_coordinator_profiles_updated_at BEFORE UPDATE ON public.school_coordinator_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: volunteer_applications update_volunteer_applications_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_volunteer_applications_updated_at BEFORE UPDATE ON public.volunteer_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: certificates certificates_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.volunteer_applications(id) ON DELETE CASCADE;


--
-- Name: certificates certificates_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.certificates
    ADD CONSTRAINT certificates_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_organization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: conversations conversations_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversations
    ADD CONSTRAINT conversations_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_conversation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: minor_consent minor_consent_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minor_consent
    ADD CONSTRAINT minor_consent_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES auth.users(id);


--
-- Name: minor_consent minor_consent_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.minor_consent
    ADD CONSTRAINT minor_consent_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_related_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_related_application_id_fkey FOREIGN KEY (related_application_id) REFERENCES public.volunteer_applications(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: organization_profiles organization_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organization_profiles
    ADD CONSTRAINT organization_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: school_coordinator_profiles school_coordinator_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.school_coordinator_profiles
    ADD CONSTRAINT school_coordinator_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: security_audit_log security_audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.security_audit_log
    ADD CONSTRAINT security_audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: volunteer_applications volunteer_applications_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.volunteer_applications
    ADD CONSTRAINT volunteer_applications_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: certificates Admins can insert certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert certificates" ON public.certificates FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can manage roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can update all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: volunteer_applications Admins can update applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update applications" ON public.volunteer_applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: minor_consent Admins can update consent status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update consent status" ON public.minor_consent FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: organization_profiles Admins can update organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update organizations" ON public.organization_profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: volunteer_applications Admins can view all applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all applications" ON public.volunteer_applications FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: school_coordinator_profiles Admins can view all coordinators; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all coordinators" ON public.school_coordinator_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: minor_consent Admins can view all minor consent forms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all minor consent forms" ON public.minor_consent FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: organization_profiles Admins can view all organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all organizations" ON public.organization_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: profiles Admins can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: security_audit_log Admins can view audit logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view audit logs" ON public.security_audit_log FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: school_coordinator_profiles Coordinators can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Coordinators can insert own profile" ON public.school_coordinator_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: school_coordinator_profiles Coordinators can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Coordinators can update own profile" ON public.school_coordinator_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: school_coordinator_profiles Coordinators can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Coordinators can view own profile" ON public.school_coordinator_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: organization_profiles Organizations can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can insert own profile" ON public.organization_profiles FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: organization_profiles Organizations can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can update own profile" ON public.organization_profiles FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: organization_profiles Organizations can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Organizations can view own profile" ON public.organization_profiles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: school_coordinator_profiles Public can view verified coordinators; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view verified coordinators" ON public.school_coordinator_profiles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = school_coordinator_profiles.user_id) AND (profiles.verification_status = 'verified'::public.verification_status)))));


--
-- Name: organization_profiles Public can view verified organizations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Public can view verified organizations" ON public.organization_profiles FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = organization_profiles.user_id) AND (profiles.verification_status = 'verified'::public.verification_status)))));


--
-- Name: conversations Users can create conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can create conversations" ON public.conversations FOR INSERT WITH CHECK (((auth.uid() = volunteer_id) OR (auth.uid() = organization_id)));


--
-- Name: volunteer_applications Users can insert own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own applications" ON public.volunteer_applications FOR INSERT WITH CHECK ((auth.uid() = volunteer_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: messages Users can send messages in their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can send messages in their conversations" ON public.messages FOR INSERT WITH CHECK (((auth.uid() = sender_id) AND (EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND ((auth.uid() = conversations.volunteer_id) OR (auth.uid() = conversations.organization_id)))))));


--
-- Name: volunteer_applications Users can update own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own applications" ON public.volunteer_applications FOR UPDATE USING ((auth.uid() = volunteer_id));


--
-- Name: notifications Users can update own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: messages Users can update their messages; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their messages" ON public.messages FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND ((auth.uid() = conversations.volunteer_id) OR (auth.uid() = conversations.organization_id))))));


--
-- Name: conversations Users can view conversations they're part of; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view conversations they're part of" ON public.conversations FOR SELECT USING (((auth.uid() = volunteer_id) OR (auth.uid() = organization_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: messages Users can view messages in their conversations; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view messages in their conversations" ON public.messages FOR SELECT USING (((EXISTS ( SELECT 1
   FROM public.conversations
  WHERE ((conversations.id = messages.conversation_id) AND ((auth.uid() = conversations.volunteer_id) OR (auth.uid() = conversations.organization_id))))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: volunteer_applications Users can view own applications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own applications" ON public.volunteer_applications FOR SELECT USING ((auth.uid() = volunteer_id));


--
-- Name: notifications Users can view own notifications; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view public profile fields; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view public profile fields" ON public.profiles FOR SELECT USING (((auth.uid() = id) OR ((verification_status = 'verified'::public.verification_status) AND (user_type = ANY (ARRAY['organization'::public.user_type, 'school_coordinator'::public.user_type]))) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: minor_consent Volunteers can insert own consent; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Volunteers can insert own consent" ON public.minor_consent FOR INSERT WITH CHECK ((auth.uid() = volunteer_id));


--
-- Name: certificates Volunteers can view own certificates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Volunteers can view own certificates" ON public.certificates FOR SELECT USING (((auth.uid() = volunteer_id) OR public.has_role(auth.uid(), 'admin'::public.app_role)));


--
-- Name: minor_consent Volunteers can view own consent; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Volunteers can view own consent" ON public.minor_consent FOR SELECT USING ((auth.uid() = volunteer_id));


--
-- Name: certificates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

--
-- Name: conversations; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

--
-- Name: minor_consent; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.minor_consent ENABLE ROW LEVEL SECURITY;

--
-- Name: notifications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: organization_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.organization_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: school_coordinator_profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.school_coordinator_profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: security_audit_log; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: volunteer_applications; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


