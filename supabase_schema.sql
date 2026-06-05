-- 1. Create the voice_calls table
CREATE TABLE public.voice_calls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    call_id TEXT NOT NULL,
    caller_name TEXT,
    phone_number TEXT,
    address TEXT,
    transcript TEXT NOT NULL,
    call_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the appointments table
CREATE TABLE public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    voice_call_id UUID REFERENCES public.voice_calls(id),
    patient_name TEXT,
    phone_number TEXT,
    address TEXT,
    status TEXT DEFAULT 'pending',
    scheduled_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS Policies (assuming read access for authenticated users)
ALTER TABLE public.voice_calls ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to voice_calls" ON public.voice_calls FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to appointments" ON public.appointments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow update access to appointments" ON public.appointments FOR UPDATE USING (auth.role() = 'authenticated');
