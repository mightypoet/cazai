import { CheckSquare, Calendar, Mail, FileText, Zap, Bell, Plus, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function PersonalAssistantDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Today's Tasks" value="12" icon={CheckSquare} trend="4 Overdue" isPositive={false} />
        <StatCard title="Upcoming Meetings" value="3" icon={Calendar} trend="Next in 1h" isPositive={true} isNeutral={true} />
        <StatCard title="Emails Pending" value="28" icon={Mail} trend="-5" isPositive={true} />
        <StatCard title="Smart Notes" value="142" icon={FileText} trend="+2 Today" isPositive={true} />
        <StatCard title="Active Reminders" value="5" icon={Bell} trend="2 Urgent" isPositive={false} />
        <StatCard title="Productivity Score" value="84" icon={Zap} trend="+4%" isPositive={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kanban Board Preview */}
        <div className="lg:col-span-2 glass-card rounded-2xl border-gray-100 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display">Task Board (Priority View)</h2>
            <button className="bg-google-blue text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-google-blue/80 transition-colors flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
          <div className="flex-1 p-6 overflow-x-auto">
            <div className="flex gap-4 h-full min-w-[600px]">
              <TaskColumn title="To Do" tasks={[
                { title: 'Draft Quarterly Report', due: 'Today', priority: 'High' },
                { title: 'Review Marketing Copy', due: 'Tomorrow', priority: 'Medium' }
              ]} />
              <TaskColumn title="In Progress" tasks={[
                { title: 'Client Presentation Slides', due: 'Today', priority: 'High' }
              ]} />
              <TaskColumn title="Done" tasks={[
                { title: 'Email Follow-ups', due: 'Completed', priority: 'Low' },
                { title: 'Sync with Engineering', due: 'Completed', priority: 'Medium' }
              ]} />
            </div>
          </div>
        </div>

        {/* AI Notes Sidebar */}
        <div className="glass-card rounded-2xl border-gray-100 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold font-display">AI Summaries</h2>
            <button className="text-gray-500 hover:text-gray-900">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {[
              { title: 'Product Sync Meeting', time: '2 hours ago', snippet: 'Decided to push feature X to Q3. Need design assets by Friday.' },
              { title: 'Idea: Voice Agent V2', time: 'Yesterday', snippet: 'Implement sentiment analysis on the voice stream for better routing.' },
              { title: 'Client Call: Acme Corp', time: 'Yesterday', snippet: 'They are happy with the prototype. Need a pricing plan by next week.' },
            ].map((note, i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-google-blue transition-colors line-clamp-1">{note.title}</h4>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{note.time}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{note.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskColumn({ title, tasks }: any) {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{title} <span className="text-gray-400 ml-1">({tasks.length})</span></h3>
        <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal className="w-4 h-4" /></button>
      </div>
      <div className="flex-1 rounded-xl bg-gray-50 p-3 flex flex-col gap-3 border border-gray-100">
        {tasks.map((t: any, i: number) => (
          <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 cursor-grab active:cursor-grabbing shadow-sm flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-900 line-clamp-2">{t.title}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider",
                t.priority === 'High' ? "bg-red-500/10 text-red-400" :
                t.priority === 'Medium' ? "bg-yellow-500/10 text-yellow-500" :
                "bg-slate-500/10 text-gray-700"
              )}>{t.priority}</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                 <Calendar className="w-3 h-3" /> {t.due}
              </span>
            </div>
          </div>
        ))}
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
