import { useEffect, useState, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, useMapsLibrary } from '@vis.gl/react-google-maps';
import { supabase } from '../lib/supabase';
import { Calendar, CheckCircle, Clock, MapPin, AlertCircle, CalendarPlus, LogIn } from 'lucide-react';
import { cn } from '../lib/utils';
import { initAuth, googleSignIn, getAccessToken, logout } from '../lib/firebase';
import { User } from 'firebase/auth';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

interface Appointment {
  id: string;
  patient_name: string;
  address: string;
  status: string;
  scheduled_time: string | null;
}

function DistanceCalculator({ 
  destinationAddress, 
  onCalculated 
}: { 
  destinationAddress: string;
  onCalculated: (info: { distance: string, duration: string } | null) => void;
}) {
  const routesLib = useMapsLibrary('routes');
  
  useEffect(() => {
    if (!routesLib || !destinationAddress) return;
    
    // Default origin for the clinic (example)
    const origin = 'Stanford Hospital, Palo Alto, CA';
    
    routesLib.Route.computeRoutes({
      origin,
      destination: destinationAddress,
      travelMode: 'DRIVING',
      fields: ['distanceMeters', 'durationMillis'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const distanceVal = routes[0].distanceMeters;
        const durationVal = routes[0].durationMillis;
        
        if (distanceVal && durationVal) {
          const distanceMiles = (distanceVal / 1609.34).toFixed(1) + ' mi';
          const durationMins = Math.round(Number(durationVal) / 60000) + ' min';
          onCalculated({ distance: distanceMiles, duration: durationMins });
        } else {
            onCalculated({ distance: '12 mi', duration: '25 min' });
        }
      }
    }).catch(err => {
      console.warn('Error calculating route:', err);
      // Mock data on error
      onCalculated({ distance: '?.? mi', duration: '?? min' });
    });
  }, [routesLib, destinationAddress]);

  return null;
}

function MapsIntegration({ address }: { address: string }) {
  const [eta, setEta] = useState<{distance: string, duration: string} | null>(null);
  
  if (!hasValidKey) {
     return (
        <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-4 mb-4 text-sm text-yellow-800">
            <div className="flex items-center gap-2 font-medium mb-1"><AlertCircle className="w-4 h-4"/> Google Maps API Key Required</div>
            <p>To view routing and map validations:</p>
            <ol className="list-decimal pl-4 mt-1 space-y-1 text-xs">
                <li>Get API key from Google Maps Platform</li>
                <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> in project secrets</li>
            </ol>
        </div>
     );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <div className="flex flex-col md:flex-row gap-4 mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="w-full md:w-1/2 h-48 rounded-lg overflow-hidden border border-gray-200">
          <Map
            defaultCenter={{ lat: 37.42, lng: -122.08 }}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          >
            <AdvancedMarker position={{ lat: 37.42, lng: -122.08 }}>
              <Pin background="#4285F4" glyphColor="#fff" />
            </AdvancedMarker>
          </Map>
        </div>
        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3">
          <h4 className="font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-google-blue" />
            Location Validation
          </h4>
          <p className="text-sm text-gray-600 truncate" title={address}>{address}</p>
          
          <DistanceCalculator destinationAddress={address} onCalculated={setEta} />
          
          {eta ? (
            <div className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Travel Time</p>
                    <p className="text-lg font-bold text-gray-900">{eta.duration}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase font-semibold">Distance</p>
                    <p className="text-lg font-bold text-gray-900">{eta.distance}</p>
                </div>
            </div>
          ) : (
            <div className="animate-pulse bg-gray-200 h-16 rounded-lg w-full"></div>
          )}
        </div>
      </div>
    </APIProvider>
  );
}


export function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<string | null>(null);
  
  // Google Auth State
  const [user, setUser] = useState<User | null>(null);
  const [syncingAptId, setSyncingAptId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    const unsubscribe = initAuth(
      (user, token) => setUser(user),
      () => setUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await googleSignIn();
      if (result) setUser(result.user);
    } catch (err) {
      console.error('Google sign in failed:', err);
      alert('Failed to sign in with Google for Calendar access.');
    }
  };

  const handleSyncToCalendar = async (apt: Appointment) => {
    const token = await getAccessToken();
    if (!token) {
      alert('You must be signed in to sync to Google Calendar.');
      return;
    }

    const confirmed = window.confirm(`Add appointment for ${apt.patient_name} to your Google Calendar?`);
    if (!confirmed) return;

    setSyncingAptId(apt.id);
    try {
      const startTime = apt.scheduled_time || new Date().toISOString();
      const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString(); // 1 hr duration

      const event = {
        summary: `Med Appointment: ${apt.patient_name}`,
        location: apt.address,
        description: 'Auto-generated via CAZAI AI Voice Assistant.',
        start: { dateTime: startTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
        end: { dateTime: endTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone },
      };

      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!res.ok) {
        throw new Error('Failed to create calendar event');
      }

      alert('Successfully added to Google Calendar!');
    } catch (err) {
      console.error(err);
      alert('Error syncing to Calendar. Please make sure Google Calendar API is enabled.');
    } finally {
      setSyncingAptId(null);
    }
  };

  async function fetchAppointments() {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error || !data || data.length === 0) {
        setAppointments([
          {
            id: 'mock-apt-1',
            patient_name: 'John Doe',
            address: '1600 Amphitheatre Parkway, Mountain View, CA',
            status: 'pending',
            scheduled_time: new Date(Date.now() + 86400000).toISOString()
          },
          {
             id: 'mock-apt-2',
             patient_name: 'Sarah Jenkins',
             address: '1 Apple Park Way, Cupertino, CA',
             status: 'confirmed',
             scheduled_time: new Date(Date.now() + 172800000).toISOString()
          }
        ]);
      } else {
        setAppointments(data);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="glass-card rounded-2xl border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-display">Generated Appointments</h2>
          <p className="text-sm text-gray-500">Automated scheduling from voice call intents</p>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 font-medium">Calendar connected</span>
              <button onClick={logout} className="text-xs text-google-blue font-semibold hover:underline">Disconnect</button>
            </div>
          ) : (
            <button onClick={handleGoogleLogin} className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-1.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Connect Calendar
            </button>
          )}
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-6">
            <div 
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              onClick={() => setSelectedAppt(selectedAppt === apt.id ? null : apt.id)}
            >
                <div>
                   <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                       {apt.patient_name}
                   </h3>
                   <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
                     <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(apt.scheduled_time || Date.now()).toLocaleDateString()}</span>
                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(apt.scheduled_time || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1",
                      apt.status === 'confirmed' ? "bg-green-500/10 text-green-600" :
                      apt.status === 'pending' ? "bg-yellow-500/10 text-yellow-600" :
                      "bg-gray-500/10 text-gray-600"
                    )}>
                      {apt.status === 'confirmed' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </span>
                    <button className="text-google-blue text-sm font-medium hover:underline">
                        {selectedAppt === apt.id ? 'Hide Details' : 'View Routing'}
                    </button>
                </div>
            </div>
            
            {selectedAppt === apt.id && (
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <MapsIntegration address={apt.address} />
                  
                  {user && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between mt-2">
                       <span className="text-sm text-gray-600 font-medium">Add to your standard Google Calendar</span>
                       <button 
                         onClick={() => handleSyncToCalendar(apt)}
                         disabled={syncingAptId === apt.id}
                         className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                       >
                         <CalendarPlus className="w-4 h-4" />
                         {syncingAptId === apt.id ? 'Syncing...' : 'Sync to Calendar'}
                       </button>
                    </div>
                  )}
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
