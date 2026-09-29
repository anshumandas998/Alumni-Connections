import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await login(email, password);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  const demoLogin = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <main className="py-20 px-4 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-md w-full space-y-8 bg-card rounded-3xl p-10 shadow-2xl border">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              Sign In to AlumniConnect
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Welcome back! Please sign in to your account.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-12 pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gold text-navy-dark hover:bg-gold/90 py-3 rounded-2xl font-semibold text-lg h-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="space-y-3">
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <button onClick={() => demoLogin('admin@company.com', 'password123')} className="hover:text-gold transition-colors font-medium">
                Demo Admin Login
              </button>
              <span>•</span>
              <button onClick={() => demoLogin('superadmin@alumni.com', 'password123')} className="hover:text-gold transition-colors font-medium">
                Super Admin
              </button>
            </div>
            <div className="text-center">
              <Link to="/register" className="text-sm font-medium hover:text-gold transition-colors">
                Don't have an account? <span className="font-bold">Sign up</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

