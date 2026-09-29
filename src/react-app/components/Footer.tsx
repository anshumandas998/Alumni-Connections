import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-navy" />
              </div>
              <span className="text-xl font-bold tracking-tight">AlumniConnect</span>
            </Link>
            <p className="text-white/60 leading-relaxed">
              Empowering our alumni network through meaningful connections, career growth, and lifelong community engagement.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gold hover:text-navy rounded-full flex items-center justify-center transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gold hover:text-navy rounded-full flex items-center justify-center transition-all duration-300">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gold hover:text-navy rounded-full flex items-center justify-center transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gold hover:text-navy rounded-full flex items-center justify-center transition-all duration-300">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/directory" className="text-white/60 hover:text-white transition-colors">Alumni Directory</Link></li>
              <li><Link to="/events" className="text-white/60 hover:text-white transition-colors">Upcoming Events</Link></li>
              <li><Link to="/jobs" className="text-white/60 hover:text-white transition-colors">Career Portal</Link></li>
              <li><Link to="/stories" className="text-white/60 hover:text-white transition-colors">Success Stories</Link></li>
              <li><Link to="/gallery" className="text-white/60 hover:text-white transition-colors">Photo Gallery</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-white/60 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-white/60 hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/privacy" className="text-white/60 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-white/60 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-white/60 hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 text-gold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-1" />
                <span>123 University Ave,<br />Campus City, ST 12345</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Phone className="w-5 h-5 text-gold shrink-0" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex items-center gap-3 text-white/60">
                <Mail className="w-5 h-5 text-gold shrink-0" />
                <span>alumni@university.edu</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 text-center text-white/40 text-sm font-medium">
          <p>© {new Date().getFullYear()} AlumniConnect. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
