import { IndianRupee, Users, PhoneOff, Calendar, UserPlus, MapPin, Building, ChevronRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 40000, queries: 124 },
  { name: 'Feb', revenue: 30000, queries: 118 },
  { name: 'Mar', revenue: 50000, queries: 130 },
  { name: 'Apr', revenue: 27800, queries: 115 },
  { name: 'May', revenue: 68900, queries: 242 },
  { name: 'Jun', revenue: 80000, queries: 250 },
];

export function RealEstateDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="New Leads" value="38" icon={UserPlus} trend="+15%" isPositive={true} />
        <StatCard title="Active Buyers" value="142" icon={Users} trend="+5%" isPositive={true} />
        <StatCard title="Site Visits Today" value="12" icon={MapPin} trend="+2 visits" isPositive={true} />
        <StatCard title="Properties Listed" value="45" icon={Building} trend="0" isPositive={true} isNeutral={true} />
        <StatCard title="Deals Closed" value="4" icon={CheckCircle2} trend="+1" isPositive={true} />
        <StatCard title="Revenue (MTD)" value="$450k" icon={IndianRupee} trend="+22%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display">Sales Pipeline Overview</h2>
            <select className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-google-blue">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenueRE" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c084fc" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c084fc" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c084fc" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenueRE)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="glass-card p-6 rounded-2xl border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h2 className="text-lg font-bold font-display">Pipeline Stages</h2>
          </div>
          <div className="flex-1 flex flex-col gap-4">
             {[
               { stage: 'New Lead', count: 45, color: 'bg-slate-500' },
               { stage: 'Contacted', count: 32, color: 'bg-google-blue' },
               { stage: 'Site Visit Scheduled', count: 18, color: 'bg-yellow-500' },
               { stage: 'Negotiation', count: 7, color: 'bg-orange-500' },
               { stage: 'Booking', count: 3, color: 'bg-google-red' },
             ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                      <span className="text-sm font-medium text-gray-700">{s.stage}</span>
                   </div>
                   <span className="font-bold text-gray-900 bg-gray-200 px-2 py-0.5 rounded">{s.count}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Property Leads List */}
      <div className="glass-card rounded-2xl border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display">Recent Active Leads</h2>
          <button className="text-sm font-medium text-google-blue hover:text-gray-900 transition-colors flex items-center gap-1">
            View All Leads <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Lead Name</th>
                <th className="px-6 py-4 font-medium">Property Interest</th>
                <th className="px-6 py-4 font-medium">Budget</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'John Doe', property: 'Sunset Villas - 3BHK', budget: '$450k', status: 'Site Visit Scheduled' },
                { name: 'Alice Smith', property: 'Downtown Apartments', budget: '$300k', status: 'Negotiation' },
                { name: 'Robert King', property: 'Ocean View Plot', budget: '$800k', status: 'Contacted' },
                { name: 'Mary Jane', property: 'Sunset Villas - 4BHK', budget: '$600k', status: 'New Lead' },
              ].map((lead, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4">{lead.property}</td>
                  <td className="px-6 py-4">{lead.budget}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full",
                      lead.status === 'Negotiation' ? "bg-orange-500/10 text-orange-400" :
                      lead.status === 'Site Visit Scheduled' ? "bg-google-blue/10 text-google-blue" :
                      lead.status === 'Contacted' ? "bg-slate-500/10 text-gray-700" :
                      "bg-green-500/10 text-green-400"
                    )}>
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

