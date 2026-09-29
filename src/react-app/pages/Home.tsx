import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, Briefcase, MessageSquare, 
  Award, Image, ArrowRight, Star, TrendingUp
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';

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
    title: 'Mentorship & Connections',
    description: 'Connect directly with distinguished alumni for career guidance and collaborative ventures.',
    link: '/directory'
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
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-[hsl(222,47%,11%)]"
          style={{
            backgroundImage: 'linear-gradient(135deg, hsl(222,47%,11%) 0%, hsl(45,93%,47%,0.1) 50%, hsl(222,47%,8%) 100%)',
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
      <section className="py-24 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-navy" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-bold uppercase tracking-widest mb-8 animate-pulse">
              Join the Network
            </div>
            <h2 
              className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1]"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Ready to Reconnect with Your
              <span className="text-gold block mt-2"> Alumni Community?</span>
            </h2>
            <p className="text-white/90 text-xl md:text-2xl mb-12 leading-relaxed font-medium">
              Join thousands of alumni who are already networking, sharing opportunities, 
              and building lasting connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gold text-navy hover:bg-white hover:text-navy font-black px-12 py-8 text-xl rounded-2xl shadow-[0_20px_50px_rgba(212,175,55,0.3)] hover:shadow-gold/40 transition-all duration-500 transform hover:-translate-y-1 active:scale-95"
                >
                  JOIN NOW
                </Button>
              </Link>
              <Link to="/directory">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/40 text-white hover:bg-white hover:text-navy px-12 py-8 text-xl rounded-2xl transition-all duration-500 backdrop-blur-sm"
                >
                  EXPLORE DIRECTORY
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges/Stats */}
            <div className="mt-16 pt-12 border-t border-white/10 flex flex-wrap justify-center gap-12 text-white/60">
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">5000+</p>
                <p className="text-xs uppercase tracking-widest font-bold">Active Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">200+</p>
                <p className="text-xs uppercase tracking-widest font-bold">Companies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white mb-1">150+</p>
                <p className="text-xs uppercase tracking-widest font-bold">Global Events</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
