import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Mail, Lock, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Use demo: admin@company.com or superadmin@alumni.com');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-dark to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl animate-fadeIn">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gold/30">
            <Shield className="w-10 h-10 text-gold" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-white/60">Secure Access Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                placeholder="admin@company.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-gold to-orange-500 hover:from-gold/90 text-navy-dark font-bold py-4 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all h-auto"
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-white/40 text-xs text-center mb-4 uppercase tracking-widest font-semibold">Demo Accounts</p>
          <div className="grid grid-cols-1 gap-3">
            <button 
              onClick={() => { setEmail('superadmin@alumni.com'); setPassword('password123'); }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors border border-white/5 group"
            >
              <p className="text-gold text-[10px] font-bold uppercase tracking-tighter mb-1">Super Admin</p>
              <p className="text-white/80 text-xs font-mono group-hover:text-white">superadmin@alumni.com</p>
            </button>
            <button 
              onClick={() => { setEmail('admin@company.com'); setPassword('password123'); }}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-left transition-colors border border-white/5 group"
            >
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-tighter mb-1">Company Admin</p>
              <p className="text-white/80 text-xs font-mono group-hover:text-white">admin@company.com</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

