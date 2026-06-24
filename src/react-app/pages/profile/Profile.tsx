import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Label } from '@/react-app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';

import { Badge } from '@/react-app/components/ui/badge';
import { Separator } from '@/react-app/components/ui/separator';
import { User, Mail, MapPin, Briefcase, Calendar, Link2, Image as ImageIcon, Edit3, Award, Users } from 'lucide-react';


const mockAlumniProfiles: Record<string, any> = {

  '1': {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    jobTitle: 'Senior Frontend Engineer',
    graduationYear: 2018,
    skills: ['React', 'TypeScript', 'Node.js', 'Leadership'],
    bio: 'Full-stack developer with 6+ years experience building scalable web applications. Passionate about mentoring and open source.'
  },
  '2': {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'New York, NY',
    company: 'FinanceHub',
    jobTitle: 'Product Manager',
    graduationYear: 2015,
    skills: ['Product Strategy', 'Analytics', 'Team Leadership'],
    bio: "Building fintech products that serve millions. Previously at Goldman Sachs. Always hiring!"
  }
};

export default function Profile() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [isOwnProfile] = useState(!id || id === user?.id);
  const [isEditing, setIsEditing] = useState(isOwnProfile);
const [profile, setProfile] = useState<any>({
    id: '',
    name: '',
    email: '',
    bio: '',
    location: '',
    company: '',
    jobTitle: '',
    graduationYear: undefined,
    skills: []
  });

  useEffect(() => {
    if (id && mockAlumniProfiles[id]) {
      setProfile(mockAlumniProfiles[id]);
    } else if (user) {
      setProfile({
        ...user,
        id: user.id,
        name: user.name,
        email: user.email,
        skills: user.profile?.skills || [],
        location: user.profile?.location || '',
        company: user.profile?.company || '',
        jobTitle: user.profile?.jobTitle || '',
        graduationYear: user.profile?.graduationYear,
        bio: user.profile?.bio || ''
      });
    }
  }, [id, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save
    console.log('Profile updated:', profile);
    setIsEditing(false);
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <CardContent className="py-16 text-center">
              <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Profile not found</h2>
              <p className="text-muted-foreground mb-6">This user profile doesn't exist.</p>
              <Button asChild>
                <Link to="/directory">Browse Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex w-32 h-32 bg-gradient-to-br from-primary to-primary/70 rounded-full p-1 mb-6">
            <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
              <User className="w-20 h-20 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">{profile.name || user?.name}</h1>
            <p className="text-2xl text-muted-foreground mb-1">{profile.jobTitle || 'No title set'} at {profile.company || 'No company'}</p>
          {profile.location && (
            <p className="flex items-center justify-center gap-2 text-lg text-muted-foreground mb-8">
              <MapPin className="w-5 h-5" />
              {profile.location}
            </p>
          )}
          {isOwnProfile && (
            <Button onClick={() => setIsEditing(!isEditing)} className="gap-2">
              {isEditing ? 'Cancel' : 'Edit Profile'}
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio || ''}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                        className="min-h-[120px]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location || ''}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gradYear">Graduation Year</Label>
                        <Select value={profile.graduationYear?.toString() || ''} onValueChange={(val) => setProfile((prev: any) => ({ ...prev, graduationYear: parseInt(val) || undefined }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 10}, (_, i) => 2024 - i).map(year => (
                              <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profile.company || ''}
                          onChange={(e) => setProfile({...profile, company: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={profile.jobTitle || ''}
                          onChange={(e) => setProfile({...profile, jobTitle: e.target.value})}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full">Save Changes</Button>
                  </form>
                ) : (
                  <>
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
                    {(profile.location || profile.graduationYear) && (
                      <div className="mt-6 space-y-2">
                        {profile.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                          </div>
                        )}
                        {profile.graduationYear && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            Class of {profile.graduationYear}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold">{profile.jobTitle} at {profile.company}</h4>
                      <p className="text-sm text-muted-foreground">Current role</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <span className="font-mono text-sm">{profile.email}</span>
                </div>
                {isOwnProfile && (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/messages">Send Message</Link>
                    </Button>
                    <Button variant="ghost" className="w-full">Connect</Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                      <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill: string, i: number) => (
                      <Badge key={i} variant="secondary">{skill}</Badge>
                    ))}
                  </div>

                </CardContent>
              </Card>
            )}

            {/* Connections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Connections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">247 connections</p>
                <Button variant="outline" className="w-full" size="sm">View all connections</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions for own profile */}
        {isOwnProfile && (
          <div className="mt-12 text-center">
            <Separator className="my-8" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="gap-2">
                <Link2 className="w-4 h-4" />
                Add Links
              </Button>
              <Button variant="outline" className="gap-2">
                <ImageIcon className="w-4 h-4" />
                Change Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

