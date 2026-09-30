import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Menu, X, GraduationCap, LayoutDashboard, User as UserIcon, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Directory', href: '/directory' },
    { name: 'Events', href: '/events' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Stories', href: '/stories' },
    { name: 'Gallery', href: '/gallery' },
  ];

  const navbarBg = isHomePage 
    ? (isScrolled ? 'bg-navy shadow-2xl border-b border-white/10' : 'bg-transparent')
    : 'bg-navy shadow-2xl border-b border-white/10';

  const textColor = 'text-white';

  const linkColor = 'text-white/80 hover:text-gold';

  const logoColor = 'text-white';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 flex items-center ${navbarBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-gold to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-md shadow-gold/20">
              <GraduationCap className="w-6 h-6 text-navy-dark" />
            </div>
            <span className={`text-xl font-bold tracking-tight transition-colors ${logoColor}`}>
              Alumni<span className="text-gold">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-bold transition-colors uppercase tracking-wider ${linkColor}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Link to="/admin/dashboard">
                    <Button className="gap-2 font-bold bg-gold hover:bg-gold/90 text-navy shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                      Admin Portal
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2 font-bold text-white/80 hover:text-gold hover:bg-white/10">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2 font-bold text-white/80 hover:text-gold hover:bg-white/10">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout} 
                  className="border-white/20 text-white hover:bg-red-500 hover:text-white hover:border-red-500 font-bold gap-2 bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/admin/login">
                  <Button variant="ghost" className="text-white/60 hover:text-gold hover:bg-white/5 font-semibold text-xs gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin Portal
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="ghost" className="text-white/80 hover:text-gold hover:bg-white/10 font-bold">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gold hover:bg-gold/90 text-navy font-bold px-6 shadow-lg">
                    Join Network
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors ${textColor}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-navy-dark/95 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden animate-in slide-in-from-top duration-300">
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-lg font-bold text-white/90 hover:text-gold py-2.5 border-b border-white/5 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link to="/admin/dashboard" className="w-full">
                      <Button className="w-full justify-start gap-2 bg-gold text-navy font-bold hover:bg-gold/90">
                        <ShieldCheck className="w-5 h-5" />
                        Admin Portal
                      </Button>
                    </Link>
                  )}
                  <Link to="/dashboard" className="w-full">
                    <Button className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/20">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" className="w-full">
                    <Button className="w-full justify-start gap-2 bg-white/10 text-white hover:bg-white/20">
                      <UserIcon className="w-5 h-5" />
                      My Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="destructive" 
                    onClick={logout} 
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full font-bold border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/admin/login" className="w-full">
                    <Button variant="outline" className="w-full font-bold border-gold/40 text-gold hover:bg-gold/10 bg-transparent flex items-center justify-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold" />
                      Admin Login
                    </Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full bg-gold text-navy font-black shadow-lg hover:bg-gold/90">
                      JOIN NOW
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
