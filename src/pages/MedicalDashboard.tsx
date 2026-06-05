import { Activity, Clock, FileCheck, IndianRupee, Users, PhoneOff, Calendar, UserPlus, FileText, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VoiceCallsList } from '../components/VoiceCallsList';
import { AppointmentsList } from '../components/AppointmentsList';

const data = [
  { name: 'Mon', revenue: 4000, appointments: 24 },
  { name: 'Tue', revenue: 3000, appointments: 18 },
  { name: 'Wed', revenue: 5000, appointments: 30 },
  { name: 'Thu', revenue: 2780, appointments: 15 },
  { name: 'Fri', revenue: 6890, appointments: 42 },
  { name: 'Sat', revenue: 8000, appointments: 50 },
  { name: 'Sun', revenue: 3490, appointments: 20 },
];

export function MedicalDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Appointments" value="42" icon={Clock} trend="+12%" isPositive={true} />
        <StatCard title="Pending / Waitlist" value="8" icon={Activity} trend="-2%" isPositive={false} />
        <StatCard title="Completed Consultations" value="28" icon={FileCheck} trend="+5%" isPositive={true} />
        <StatCard title="Revenue (Today)" value="$4,250" icon={IndianRupee} trend="+18%" isPositive={true} />
        <StatCard title="New Patients" value="15" icon={UserPlus} trend="+22%" isPositive={true} />
        <StatCard title="Missed Calls" value="3" icon={PhoneOff} trend="-1" isPositive={true} isNeutral={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display">Revenue Overview</h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-google-blue">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Voice Assistant Status */}
        <div className="glass-card p-6 rounded-2xl border-gray-100 flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-google-blue/10 rounded-full blur-[50px] group-hover:bg-google-blue/20 transition-all"></div>
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-lg font-bold font-display">AI Voice Agent</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-google-green animate-pulse"></span>
              <span className="text-xs font-semibold text-google-green">Active</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 relative z-10">
            <div className="w-16 h-16 rounded-full glass-panel border-google-blue/30 flex items-center justify-center animate-[spin_10s_linear_infinite]">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-google-blue to-google-red flex items-center justify-center animate-[spin_10s_linear_infinite_reverse]">
                <PhoneOff className="w-5 h-5 text-gray-900" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">142</p>
              <p className="text-sm text-gray-500">Calls Handled Today</p>
            </div>
          </div>
          
          <div className="mt-6 space-y-3 relative z-10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Appointments Booked</span>
              <span className="font-semibold text-gray-900">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Enquiries Answered</span>
              <span className="font-semibold text-gray-900">82</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transferred to Human</span>
              <span className="font-semibold text-gray-900">15</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <VoiceCallsList />
        <AppointmentsList />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, isPositive, isNeutral }: any) {
  return (
    <div className="glass-card p-6 rounded-2xl border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-lg bg-gray-50">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        <span className={cn(
          "text-xs font-bold px-2.5 py-1 rounded-full",
          isNeutral ? "bg-slate-500/10 text-gray-500" :
          isPositive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
        )}>
          {trend}
        </span>
      </div>
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900 font-display tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

