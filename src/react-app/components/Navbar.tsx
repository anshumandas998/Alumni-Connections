import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Directory', href: '/directory' },
    { name: 'Events', href: '/events' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Stories', href: '/stories' },
    { name: 'Gallery', href: '/gallery' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-navy' : 'text-white'}`}>
              AlumniConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-gold ${
                  isScrolled ? 'text-foreground/80' : 'text-white/90'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-gold ${isScrolled ? 'text-foreground/80' : 'text-white/90'}`}>
                  Dashboard
                </Link>
                <Link to="/profile" className={`text-sm font-medium transition-colors hover:text-gold ${isScrolled ? 'text-foreground/80' : 'text-white/90'}`}>
                  Profile
                </Link>
                <Button variant="ghost" onClick={logout} className={`${isScrolled ? 'text-foreground hover:text-gold' : 'text-white hover:text-gold hover:bg-white/10'}`}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className={`${isScrolled ? 'text-foreground hover:text-gold' : 'text-white hover:text-gold hover:bg-white/10'}`}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gold text-navy-dark hover:bg-gold/90 font-semibold">
                    Join Network
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className={`md:hidden p-2 ${isScrolled ? 'text-foreground' : 'text-white'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-xl">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-foreground/80 hover:text-gold font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-3">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" className="block">
                <Button className="w-full bg-gold text-navy-dark hover:bg-gold/90">Join Network</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
