import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronDown, ChevronUp, MapPin, Phone, User } from 'lucide-react';

interface VoiceCall {
  id: string;
  call_id: string;
  caller_name: string;
  phone_number: string;
  address: string;
  transcript: string;
  created_at: string;
}

export function VoiceCallsList() {
  const [calls, setCalls] = useState<VoiceCall[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();
  }, []);

  async function fetchCalls() {
    try {
      const { data, error } = await supabase
        .from('voice_calls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      // For demo purposes, if no data exists or table doesn't exist yet, we show mock data
      if (error || !data || data.length === 0) {
        setCalls([
          {
            id: 'mock-1',
            call_id: 'C1001',
            caller_name: 'John Doe',
            phone_number: '+1234567890',
            address: '1600 Amphitheatre Parkway, Mountain View, CA',
            transcript: 'Bot: Hello, this is CAZAI Medical Assistant. How can I help you today?\nJohn: I need to book an appointment with Dr. Smith for tomorrow.\nBot: I can help with that. What is your address for our records?\nJohn: 1600 Amphitheatre Parkway, Mountain View, CA.\nBot: Thank you. Your appointment request has been logged.',
            created_at: new Date().toISOString()
          }
        ]);
      } else {
        setCalls(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-6 text-center text-gray-500">Loading calls...</div>;

  return (
    <div className="glass-card rounded-2xl border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold font-display">Recent AI Voice Calls</h2>
        <p className="text-sm text-gray-500">Post-call transcripts processed by Supabase Edge Functions</p>
      </div>
      <div className="divide-y divide-gray-100">
        {calls.map((call) => (
          <div key={call.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-google-blue/10 text-google-blue flex items-center justify-center font-bold">
                  {call.caller_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{call.caller_name}</h3>
                  <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {call.phone_number || 'Unknown'}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {call.address || 'No address provided'}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400">
                  {new Date(call.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {expandedId === call.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </div>
            
            {expandedId === call.id && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Conversation Transcript</h4>
                <div className="space-y-2 text-sm text-gray-600 whitespace-pre-wrap font-mono text-xs">
                  {call.transcript}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
