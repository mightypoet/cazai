import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Bot, Calendar, Users, CheckCircle, ArrowRight, Play, TrendingUp, Phone, CalendarCheck } from 'lucide-react';
import React from 'react';
import { cn } from '../lib/utils';

export function Landing() {
  return (
    <div className="relative min-h-screen text-gray-900 overflow-hidden pb-32">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-google-blue/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] rounded-full bg-google-red/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[40%] rounded-full bg-google-green/10 blur-[120px]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Nav */}
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-google-blue via-google-yellow to-google-red flex items-center justify-center font-display font-bold text-sm shadow-lg shadow-google-blue/40">
              CZ
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">CAZAI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/onboarding" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Login</Link>
            <Link to="/onboarding" className="text-sm bg-google-blue hover:bg-google-blue/80 text-white px-5 py-2.5 rounded-full transition-all font-semibold shadow-lg shadow-google-blue/20 border border-google-blue/30">
              Start Free Trial
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="mt-24 mb-32 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel border-gray-300 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-google-green animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">CAZAI 2.0 is Live</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-6 max-w-4xl"
          >
            Your AI Business <br />
            <span className="text-gradient">Operating System</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mb-10"
          >
            Manage appointments, leads, tasks, support and sales from one intelligent platform powered by autonomous AI.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <Link to="/onboarding" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-google-blue to-google-red text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(14,165,233,0.4)] transition-all flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 rounded-full glass-panel hover:bg-gray-100 text-white font-semibold text-lg transition-all flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating Dashboard Preview */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 1, delay: 0.2 }}
           className="relative mx-auto max-w-5xl rounded-2xl glass-card overflow-hidden border-gray-300 p-2 shadow-[0_0_50px_rgba(14,165,233,0.15)]"
        >
           <div className="absolute top-0 left-10 w-3/4 h-1/2 bg-gradient-to-br from-google-blue/40 to-google-red/10 blur-[100px] z-0 pointer-events-none"></div>
           <div className="relative z-10 bg-white rounded-xl overflow-hidden border border-gray-100 flex aspect-[16/9] md:aspect-[16/10]">
              {/* Fake Sidebar */}
              <div className="w-16 md:w-48 border-r border-gray-100 bg-white/80 p-4 hidden sm:flex flex-col gap-4">
                 <div className="h-4 w-24 bg-gray-100 rounded mb-4 hidden md:block"></div>
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded bg-gray-100 flex-shrink-0"></div>
                       <div className="h-3 w-full bg-gray-50 rounded hidden md:block"></div>
                    </div>
                 ))}
              </div>
              {/* Fake Main Content */}
              <div className="flex-1 p-6 flex flex-col gap-6">
                 <div className="flex justify-between items-center">
                    <div className="h-6 w-48 bg-gray-100 rounded"></div>
                    <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                       <div key={i} className="h-24 rounded-lg bg-gray-50 border border-gray-100 p-4 flex flex-col justify-between">
                          <div className="h-3 w-16 bg-gray-100 rounded"></div>
                          <div className="h-6 w-24 bg-gray-200 rounded"></div>
                       </div>
                    ))}
                 </div>
                 <div className="flex-1 rounded-lg border border-gray-100 overflow-hidden flex">
                    <div className="flex-1 p-4 flex flex-col gap-4">
                       <div className="h-4 w-32 bg-gray-100 rounded"></div>
                       {[...Array(5)].map((_, i) => (
                         <div key={i} className="h-10 w-full rounded bg-gray-50"></div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="mt-40 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Bot className="w-8 h-8 text-google-green" />}
            title="AI Voice Agent"
            description="24/7 autonomous call handling, lead qualification, and customer support with natural voice."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-google-red" />}
            title="Smart CRM"
            description="Intelligent lead tracking, deal pipelines, and automated follow-ups tailored to your business."
          />
          <FeatureCard 
            icon={<CheckCircle className="w-8 h-8 text-google-blue" />}
            title="Task Management"
            description="Assign tasks, set deadlines, and track projects with built-in team collaboration tools."
          />
        </div>

      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 rounded-2xl flex flex-col items-start"
    >
      <div className="p-3 rounded-lg bg-gray-50 mb-6 shadow-inner border border-gray-200">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{description}</p>
    </motion.div>
  );
}

