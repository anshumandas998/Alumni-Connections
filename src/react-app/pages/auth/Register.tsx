import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Mail, User, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    const success = await register(formData.email, formData.password, formData.name);
    setIsLoading(false);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <main className="py-20 px-4 flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="max-w-md w-full space-y-8 bg-card rounded-3xl p-10 shadow-2xl border">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
              Join AlumniConnect
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Create your free account and reconnect with your network.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>
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
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="you@example.com"
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
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 py-3 border border-border rounded-2xl bg-background focus:ring-gold focus:border-gold transition-all"
                  placeholder="Confirm your password"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gold text-navy-dark hover:bg-gold/90 py-3 rounded-2xl font-semibold text-lg h-auto"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="text-center">
            <Link to="/login" className="text-sm font-medium hover:text-gold transition-colors">
              Already have an account? <span className="font-bold">Sign in</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

