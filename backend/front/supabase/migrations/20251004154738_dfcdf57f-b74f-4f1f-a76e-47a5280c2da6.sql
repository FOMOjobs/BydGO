-- Create applications table for volunteer opportunity applications
CREATE TABLE public.volunteer_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id TEXT NOT NULL,
  volunteer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  attendance_marked BOOLEAN DEFAULT FALSE,
  attended BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('application', 'reminder', 'certificate', 'message', 'system')),
  read BOOLEAN DEFAULT FALSE,
  related_application_id UUID REFERENCES public.volunteer_applications(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.volunteer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Applications RLS Policies
CREATE POLICY "Users can view own applications"
  ON public.volunteer_applications FOR SELECT
  USING (auth.uid() = volunteer_id);

CREATE POLICY "Users can insert own applications"
  ON public.volunteer_applications FOR INSERT
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Users can update own applications"
  ON public.volunteer_applications FOR UPDATE
  USING (auth.uid() = volunteer_id);

-- Notifications RLS Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at on applications
CREATE TRIGGER update_volunteer_applications_updated_at
  BEFORE UPDATE ON public.volunteer_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_applications_volunteer ON public.volunteer_applications(volunteer_id);
CREATE INDEX idx_applications_opportunity ON public.volunteer_applications(opportunity_id);
CREATE INDEX idx_applications_status ON public.volunteer_applications(status);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;