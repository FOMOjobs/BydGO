-- Phase 5: Chat System Tables
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(volunteer_id, organization_id, opportunity_id)
);

CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view conversations they're part of"
  ON public.conversations FOR SELECT
  USING (auth.uid() = volunteer_id OR auth.uid() = organization_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id OR auth.uid() = organization_id);

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
        AND (auth.uid() = volunteer_id OR auth.uid() = organization_id)
    ) OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = conversation_id
        AND (auth.uid() = volunteer_id OR auth.uid() = organization_id)
    )
  );

CREATE POLICY "Users can update their messages"
  ON public.messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations
      WHERE id = messages.conversation_id
        AND (auth.uid() = volunteer_id OR auth.uid() = organization_id)
    )
  );

-- Phase 6: Certificates Table
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id uuid NOT NULL REFERENCES public.volunteer_applications(id) ON DELETE CASCADE,
  opportunity_title text NOT NULL,
  organization_name text NOT NULL,
  issue_date date NOT NULL DEFAULT CURRENT_DATE,
  hours_completed numeric NOT NULL,
  certificate_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(application_id)
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for certificates
CREATE POLICY "Volunteers can view own certificates"
  ON public.certificates FOR SELECT
  USING (auth.uid() = volunteer_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert certificates"
  ON public.certificates FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update existing tables to allow admin access
CREATE POLICY "Admins can view all applications"
  ON public.volunteer_applications FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update applications"
  ON public.volunteer_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Admins can update all profiles"
  ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update organizations"
  ON public.organization_profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Indexes for performance
CREATE INDEX idx_conversations_volunteer ON public.conversations(volunteer_id);
CREATE INDEX idx_conversations_organization ON public.conversations(organization_id);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);
CREATE INDEX idx_certificates_volunteer ON public.certificates(volunteer_id);
CREATE INDEX idx_certificates_application ON public.certificates(application_id);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;