import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Edge handler for Vani/Edesy post-call webhooks
serve(async (req) => {
  try {
    const payload = await req.json()
    
    // Extract transcript and other fields based on Edesy payload format
    const call_id = payload.call_id || 'unknown';
    const transcript = payload.transcript || '';
    const phone_number = payload.customer_phone || payload.phone_number || '';
    
    // Simplistic extraction (in reality you might use an LLM or specific fields from the payload)
    const caller_name = payload.customer_name || 'Unknown Patient';
    const address = payload.extracted_address || payload.address || '';
    const isBooking = payload.intent === 'booking' || transcript.toLowerCase().includes('book') || transcript.toLowerCase().includes('schedule');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Insert into voice_calls table
    const { data: callData, error: callError } = await supabase
      .from('voice_calls')
      .insert({
        call_id,
        caller_name,
        phone_number,
        address,
        transcript,
        call_status: payload.status || 'completed'
      })
      .select()
      .single();

    if (callError) throw callError;

    // 2. If it was a booking, insert into appointments
    if (isBooking && callData) {
      await supabase.from('appointments').insert({
        voice_call_id: callData.id,
        patient_name: caller_name,
        phone_number,
        address,
        status: 'pending'
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Call processed successfully" }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }
})
