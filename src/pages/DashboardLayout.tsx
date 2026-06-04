import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Stethoscope, Building2, User, LayoutDashboard, Calendar, Users, 
  Phone, Headset, BarChart3, Settings, ClipboardList, Home, 
  MapPin, Route, CheckSquare, FileText, Mail, FileCheck2, PieChart
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

const MEDICAL_LINKS = [
  { path: '/dashboards/medical', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboards/medical#patients', icon: Users, label: 'Patients' },
  { path: '/dashboards/medical#doctors', icon: Stethoscope, label: 'Doctors' },
  { path: '/dashboards/medical#appointments', icon: ClipboardList, label: 'Appointments' },
  { path: '/dashboards/medical#calendar', icon: Calendar, label: 'Calendar' },
  { path: '/dashboards/medical#voice', icon: Phone, label: 'Voice Calls' },
  { path: '/dashboards/medical#support', icon: Headset, label: 'Support Tickets' },
  { path: '/dashboards/medical#analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/dashboards/medical#settings', icon: Settings, label: 'Settings' },
];

const REAL_ESTATE_LINKS = [
  { path: '/dashboards/real-estate', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboards/real-estate#leads', icon: Users, label: 'Leads' },
  { path: '/dashboards/real-estate#properties', icon: Home, label: 'Properties' },
  { path: '/dashboards/real-estate#site-visits', icon: MapPin, label: 'Site Visits' },
  { path: '/dashboards/real-estate#voice', icon: Phone, label: 'Voice Calls' },
  { path: '/dashboards/real-estate#follow-ups', icon: Route, label: 'Follow Ups' },
  { path: '/dashboards/real-estate#pipeline', icon: BarChart3, label: 'Sales Pipeline' },
  { path: '/dashboards/real-estate#analytics', icon: PieChart, label: 'Analytics' },
  { path: '/dashboards/real-estate#settings', icon: Settings, label: 'Settings' },
];

const PA_LINKS = [
  { path: '/dashboards/personal', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboards/personal#tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/dashboards/personal#calendar', icon: Calendar, label: 'Calendar' },
  { path: '/dashboards/personal#meetings', icon: Users, label: 'Meetings' },
  { path: '/dashboards/personal#notes', icon: FileText, label: 'Notes' },
  { path: '/dashboards/personal#contacts', icon: User, label: 'Contacts' },
  { path: '/dashboards/personal#emails', icon: Mail, label: 'Emails' },
  { path: '/dashboards/personal#voice', icon: Phone, label: 'Voice Assistant' },
  { path: '/dashboards/personal#settings', icon: Settings, label: 'Settings' },
];

export function DashboardLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  let links = MEDICAL_LINKS;
  let title = 'Medical CRM';
  if (location.pathname.includes('real-estate')) {
    links = REAL_ESTATE_LINKS;
    title = 'Real Estate CRM';
  } else if (location.pathname.includes('personal')) {
    links = PA_LINKS;
    title = 'PA Workspace';
  } else if (location.pathname.includes('admin')) {
    links = [{ path: '/dashboards/admin', icon: LayoutDashboard, label: 'Admin Dashboard' }];
    title = 'Super Admin';
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-gray-900 selection:bg-google-blue selection:text-gray-900 relative">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-google-blue/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-google-red/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 z-10 relative",
        collapsed ? "w-[80px]" : "w-[280px]"
      )}>
        <div className="p-4 flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-google-blue via-google-yellow to-google-red flex items-center justify-center font-display font-bold text-sm shadow-lg shadow-google-blue/40">
              CZ
            </div>
            {!collapsed && <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">CAZAI</span>}
          </div>
          
          {!collapsed && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Workspace</p>
              <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm">
                <div className="w-2 h-2 rounded-full bg-google-blue"></div>
                <span className="truncate">{title}</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar">
          {!collapsed && <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2 mt-4">Menu</p>}
          {links.map((link) => (
            <Link 
              key={link.label}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                (location.pathname + location.hash === link.path) || (location.pathname === link.path && !location.hash)
                  ? "bg-google-blue/10 text-gray-900 border border-google-blue/20" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <link.icon className={cn("w-5 h-5 flex-shrink-0", collapsed ? "mx-auto" : "")} />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-100 flex flex-col gap-2">
           <button 
             onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = '/';
             }}
             className="w-full flex items-center justify-center gap-2 text-google-red hover:text-white hover:bg-google-red text-sm p-2 rounded-lg transition-colors"
           >
              {collapsed ? "X" : "Logout"}
           </button>
           <button 
             onClick={() => setCollapsed(!collapsed)}
             className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 text-sm p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
           >
              {collapsed ? "»" : "« Collapse"}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full relative z-10 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-google-blue/10 via-transparent to-transparent">
        <header className="h-14 border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 shrink-0">
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-display font-semibold text-gray-900">Overview</h1>
           </div>
           <div className="flex items-center gap-4">
              <button className="relative w-10 h-10 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                 <div className="absolute top-2 right-2 w-2 h-2 bg-google-green rounded-full"></div>
                 <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border border-gray-200 overflow-hidden shadow-inner flex items-center justify-center text-sm font-bold text-white">
                 JS
              </div>
           </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
