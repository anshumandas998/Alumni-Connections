import { useAuth } from '@/react-app/contexts/AuthContext';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, Briefcase, MessageSquare, Bell, Award, Image,
  GraduationCap 
} from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/react-app/components/ui/card';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const quickActions = [
    { icon: Users, title: 'Directory', description: 'Connect with alumni', href: '/directory' },
    { icon: Calendar, title: 'Events', description: 'Upcoming events', href: '/events' },
    { icon: Briefcase, title: 'Jobs', description: 'Career opportunities', href: '/jobs' },
    { icon: MessageSquare, title: 'Messages', description: 'Your conversations', href: '/messages' },
    { icon: Bell, title: 'Notifications', description: 'Stay updated', href: '/notifications' },
    { icon: GraduationCap, title: 'Profile', description: 'Your profile', href: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Welcome back, {user.name}
              </h1>
              <p className="text-xl opacity-90">{user.profile?.location || 'Alumni Member'}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Link to="/profile">Edit Profile</Link>
              </Button>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                asChild
                variant="outline"
                className="h-auto p-8 text-left justify-start hover:bg-accent hover:text-foreground group"
              >
                <Link to={action.href} className="w-full">
                  <action.icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                    <p className="text-muted-foreground">{action.description}</p>
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Stats Cards - Mock */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connections</CardTitle>
              <Users className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Alerts</CardTitle>
              <Briefcase className="w-5 h-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
        </section>

        {/* Recent Activity - Mock */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">New connection request</p>
                    <p className="text-sm text-muted-foreground">Sarah Johnson • 2 hours ago</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 p-4 border rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Networking event tomorrow</p>
                    <p className="text-sm text-muted-foreground">Reminder • 1 day ago</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

