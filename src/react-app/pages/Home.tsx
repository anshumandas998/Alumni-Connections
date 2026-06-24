import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Briefcase, MessageSquare, 
  Award, Image, ArrowRight, Star, TrendingUp
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import Navbar from '@/react-app/components/Navbar';
import Footer from '@/react-app/components/Footer';

const features = [
  {
    icon: Users,
    title: 'Alumni Directory',
    description: 'Find and connect with fellow graduates across industries and locations.',
    link: '/directory'
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Discover reunions, networking events, and professional workshops.',
    link: '/events'
  },
  {
    icon: Briefcase,
    title: 'Job Portal',
    description: 'Exclusive career opportunities shared by alumni-owned companies.',
    link: '/jobs'
  },
  {
    icon: MessageSquare,
    title: 'Messaging',
    description: 'Connect directly with alumni for mentorship and collaboration.',
    link: '/messages'
  },
  {
    icon: Award,
    title: 'Success Stories',
    description: 'Get inspired by the achievements of our distinguished alumni.',
    link: '/stories'
  },
  {
    icon: Image,
    title: 'Photo Gallery',
    description: 'Relive memories through photos from events and campus life.',
    link: '/gallery'
  }
];

const stats = [
  { value: '50K+', label: 'Alumni Members' },
  { value: '120+', label: 'Countries' },
  { value: '500+', label: 'Events/Year' },
  { value: '2K+', label: 'Jobs Posted' }
];

export default function Home() {
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1564769628038-5fd8f5d0b30e?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(222,47%,11%)]/95 via-[hsl(222,47%,11%)]/80 to-[hsl(222,47%,11%)]/60" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-8 border border-white/20">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-white/90 text-sm font-medium">Trusted by 50,000+ Alumni Worldwide</span>
            </div>
            
            <h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Where Alumni
              <span className="text-gold block">Connections</span>
              Come Alive
            </h1>
            
            <p className="text-xl text-white/80 mb-10 leading-relaxed max-w-2xl">
              Join the most vibrant alumni network. Build meaningful relationships, 
              discover career opportunities, and stay connected with your alma mater.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gold text-navy-dark hover:bg-gold/90 font-semibold px-8 py-6 text-lg group"
                >
                  Join the Network
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  Explore Directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-navy py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 text-gold mb-4">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Features</span>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold text-foreground mb-4"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Everything You Need to
              <span className="text-gold"> Stay Connected</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From networking to career growth, we provide all the tools for a thriving alumni community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-card rounded-2xl p-8 border border-border hover:border-gold/50 transition-all duration-300 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-gold transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-6 flex items-center text-gold font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 
              className="text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ready to Reconnect with Your
              <span className="text-gold"> Alumni Community?</span>
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Join thousands of alumni who are already networking, sharing opportunities, 
              and building lasting connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gold text-navy-dark hover:bg-gold/90 font-semibold px-10 py-6 text-lg"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/support">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-lg"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
