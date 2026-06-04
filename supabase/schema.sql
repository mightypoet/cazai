-- Core & Auth Tables
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('superadmin', 'medical', 'realestate', 'personal')),
  business_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own data" ON public.users FOR ALL USING (auth.uid() = id);

CREATE TABLE public.voice_agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  call_duration INTEGER,
  transcript TEXT,
  lead_qualified BOOLEAN DEFAULT false,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.voice_agent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own voice logs" ON public.voice_agent_logs FOR ALL USING (auth.uid() = user_id);

-- Medical Workspace Tables
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own patients" ON public.patients FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  specialization TEXT,
  consultation_fee NUMERIC,
  availability JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own doctors" ON public.doctors FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  patient_id UUID REFERENCES public.patients(id) NOT NULL,
  doctor_id UUID REFERENCES public.doctors(id) NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT CHECK (status IN ('Inquiry', 'Scheduled', 'Consultation Done', 'Follow Up', 'Closed')) DEFAULT 'Inquiry',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own appointments" ON public.appointments FOR ALL USING (auth.uid() = user_id);

-- Real Estate Workspace Tables
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  price NUMERIC,
  location TEXT,
  status TEXT CHECK (status IN ('Available', 'Sold')) DEFAULT 'Available',
  owner_details JSONB,
  image_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own properties" ON public.properties FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.re_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  budget NUMERIC,
  property_type TEXT,
  location_preference TEXT,
  pipeline_stage TEXT CHECK (pipeline_stage IN ('New Lead', 'Contacted', 'Site Visit Scheduled', 'Negotiation', 'Booking', 'Sold')) DEFAULT 'New Lead',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.re_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own leads" ON public.re_leads FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.site_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  lead_id UUID REFERENCES public.re_leads(id) NOT NULL,
  property_id UUID REFERENCES public.properties(id) NOT NULL,
  visit_time TIMESTAMP WITH TIME ZONE NOT NULL,
  agent_assigned TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own site visits" ON public.site_visits FOR ALL USING (auth.uid() = user_id);

-- Personal Assistant Workspace Tables
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('Todo', 'In Progress', 'Done')) DEFAULT 'Todo',
  priority TEXT CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  meeting_time TIMESTAMP WITH TIME ZONE NOT NULL,
  platform TEXT CHECK (platform IN ('Meet', 'Zoom')),
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own meetings" ON public.meetings FOR ALL USING (auth.uid() = user_id);

CREATE TABLE public.smart_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.smart_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can access their own smart notes" ON public.smart_notes FOR ALL USING (auth.uid() = user_id);
