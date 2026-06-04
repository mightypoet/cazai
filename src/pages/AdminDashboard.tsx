import { Users, Server, IndianRupee, CreditCard, Activity, ArrowUpRight, Search } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', active: 120 },
  { name: 'Feb', active: 180 },
  { name: 'Mar', active: 250 },
  { name: 'Apr', active: 310 },
  { name: 'May', active: 450 },
  { name: 'Jun', active: 520 },
];

export function AdminDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="5,240" icon={Users} trend="+124 this week" isPositive={true} />
        <StatCard title="Active Businesses" value="842" icon={Server} trend="+18 this week" isPositive={true} />
        <StatCard title="MRR" value="$142,500" icon={IndianRupee} trend="+8.5%" isPositive={true} />
        <StatCard title="Voice API Usage" value="1.2M mins" icon={Activity} trend="+15% limit" isPositive={false} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display">Active User Growth</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  itemStyle={{ color: '#111827' }}
                />
                <Area type="monotone" dataKey="active" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorActive)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Alerts */}
        <div className="glass-card p-6 rounded-2xl border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold font-display">System Alerts</h2>
          </div>
          <div className="flex-1 flex flex-col gap-4">
             <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-100 flex gap-3">
                <CreditCard className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                   <h4 className="font-semibold text-sm text-red-400">Payment Failures</h4>
                   <p className="text-xs mt-1 text-red-200/70">12 accounts had failed renewals today. Retrying tomorrow.</p>
                </div>
             </div>
             <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 flex gap-3">
                <Activity className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                   <h4 className="font-semibold text-sm text-yellow-400">Voice API Quota</h4>
                   <p className="text-xs mt-1 text-yellow-200/70">Usage is at 85% of monthly limit. Consider scaling infrastructure.</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Tenant Management */}
      <div className="glass-card rounded-2xl border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold font-display">Recent Business Accounts</h2>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Search tenants..." className="bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 text-sm outline-none focus:border-google-blue text-gray-900 w-64" />
             </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="text-xs uppercase bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Business Name</th>
                <th className="px-6 py-4 font-medium">Workspace Type</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'City Hospital', type: 'Medical', plan: 'Enterprise', status: 'Active' },
                { name: 'Skyline Realtors', type: 'Real Estate', plan: 'Pro', status: 'Active' },
                { name: 'Dr. Emily Chen', type: 'Medical', plan: 'Starter', status: 'Trial Ending' },
                { name: 'John Doe Consulting', type: 'Personal', plan: 'Starter', status: 'Inactive' },
              ].map((tenant, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{tenant.name}</td>
                  <td className="px-6 py-4">{tenant.type}</td>
                  <td className="px-6 py-4">{tenant.plan}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full",
                      tenant.status === 'Active' ? "bg-green-500/10 text-green-400" :
                      tenant.status === 'Trial Ending' ? "bg-yellow-500/10 text-yellow-400" :
                      "bg-slate-500/10 text-gray-500"
                    )}>
                      {tenant.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-500 hover:text-gray-900 transition-colors p-2 rounded-lg hover:bg-gray-50">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
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
