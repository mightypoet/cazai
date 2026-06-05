import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Building2, User, ArrowRight, Check } from 'lucide-react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

export function Onboarding() {
  const [step, setStep] = useState<'auth' | 'workspace'>('auth');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { user, role, loading: globalLoading } = useAuth();

  useEffect(() => {
    if (!globalLoading && user) {
      if (role) {
        redirectBasedOnRole(role);
      } else {
        setStep('workspace');
      }
    }
  }, [user, role, globalLoading, navigate]);

  const redirectBasedOnRole = (userRole: string) => {
    if (userRole === 'medical') navigate('/dashboards/medical');
    else if (userRole === 'realestate') navigate('/dashboards/real-estate');
    else if (userRole === 'personal') navigate('/dashboards/personal');
    else if (userRole === 'superadmin') navigate('/dashboards/admin');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    let error;
    
    if (isLogin) {
      const res = await supabase.auth.signInWithPassword({ email, password });
      error = res.error;
    } else {
      const res = await supabase.auth.signUp({ email, password });
      error = res.error;
    }

    setAuthLoading(false);
    if (error) {
      alert(error.message);
    } else {
      if (!isLogin) {
         setStep('workspace');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        if (error.message.includes('Unsupported provider') || error.message.includes('provider is not enabled')) {
          alert("Google OAuth is not enabled in your Supabase project. Please enable it in the Supabase Dashboard under Authentication -> Providers.");
        } else {
          alert(error.message);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to sign in with Google');
    }
  };

  const handleContinue = async () => {
    if (!user) return;
    
    setAuthLoading(true);
    
    // Create user record in our generic users table
    const { error } = await supabase.from('users').upsert({
      id: user.id,
      email: user.email,
      role: selectedType === 'real-estate' ? 'realestate' : selectedType
    });
    
    setAuthLoading(false);
    
    if (error) {
      alert(error.message);
      return;
    }

    if (selectedType === 'medical') navigate('/dashboards/medical');
    else if (selectedType === 'real-estate') navigate('/dashboards/real-estate');
    else if (selectedType === 'personal') navigate('/dashboards/personal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-google-blue/10 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[50%] rounded-full bg-google-red/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl"
      >
        {step === 'auth' ? (
          <div className="max-w-md mx-auto glass-card p-8 rounded-2xl border-gray-200">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-google-blue via-google-yellow to-google-red flex items-center justify-center font-display font-bold text-xl mx-auto mb-4 shadow-lg shadow-google-blue/40">
                CZ
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to CAZAI</h2>
              <p className="text-gray-500">Sign in to your intelligent workspace</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-slate-500 focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-slate-500 focus:outline-none focus:border-google-blue focus:ring-1 focus:ring-google-blue transition-all"
                  required
                />
              </div>
              
              <button disabled={authLoading} type="submit" className="w-full mt-6 bg-gradient-to-r from-google-blue to-google-red text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
                {authLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-google-blue font-semibold ml-1 hover:underline">
                  {isLogin ? 'Sign up' : 'Log in'}
                </button>
              </p>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <button type="button" onClick={handleGoogleLogin} className="w-full bg-google-blue text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                  <svg className="w-5 h-5 bg-white rounded-full p-0.5 text-google-blue" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What type of business are you?</h2>
            <p className="text-gray-500 mb-12 text-center max-w-lg">
              Select your primary business type so we can customize your AI workspace and CRM pipeline.
            </p>

            <div className="grid md:grid-cols-3 gap-6 w-full mb-12">
              <WorkspaceCard 
                icon={<Stethoscope className="w-8 h-8" />}
                title="Medical / Clinic"
                description="Manage patients, appointments, doctors, and medical follow-ups."
                selected={selectedType === 'medical'}
                onClick={() => setSelectedType('medical')}
              />
              <WorkspaceCard 
                icon={<Building2 className="w-8 h-8" />}
                title="Real Estate"
                description="Manage listings, site visits, leads, and sales pipelines."
                selected={selectedType === 'real-estate'}
                onClick={() => setSelectedType('real-estate')}
              />
              <WorkspaceCard 
                icon={<User className="w-8 h-8" />}
                title="Personal Assistant"
                description="Manage tasks, meetings, calls, and smart notes seamlessly."
                selected={selectedType === 'personal'}
                onClick={() => setSelectedType('personal')}
              />
            </div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: selectedType ? 1 : 0 }}
              disabled={!selectedType}
              onClick={handleContinue}
              className="bg-google-blue text-white font-semibold px-8 py-4 rounded-full flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:pointer-events-none"
            >
              Enter Workspace
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function WorkspaceCard({ icon, title, description, selected, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "cursor-pointer p-6 rounded-2xl border transition-all relative overflow-hidden group",
        selected 
          ? "border-google-blue bg-google-blue/10 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
          : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"
      )}
    >
      {selected && (
        <div className="absolute top-4 right-4 text-google-blue">
          <Check className="w-6 h-6" />
        </div>
      )}
      <div className={cn(
        "mb-4 p-3 rounded-xl inline-block",
        selected ? "bg-google-blue text-white" : "bg-gray-100 text-gray-700 group-hover:text-gray-900"
      )}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

