import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Users, Search, Filter, MapPin } from 'lucide-react';

import { AlumniProfile } from '@/shared/types';

const mockAlumni: AlumniProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'San Francisco, CA',
    company: 'TechCorp',
    jobTitle: 'Senior Developer',
    graduationYear: 2018,
    skills: ['React', 'Node.js', 'Leadership'],
    bio: 'Passionate full-stack developer with 5+ years experience.'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@example.com',
    location: 'New York, NY',
    company: 'FinanceHub',
    jobTitle: 'Product Manager',
    graduationYear: 2015,
    skills: ['Product', 'Strategy', 'Analytics'],
    bio: 'Building innovative fintech solutions.'
  },
  // Add more mock data...
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    location: 'Austin, TX',
    company: 'StartupX',
    jobTitle: 'Marketing Lead',
    graduationYear: 2020,
    skills: ['Marketing', 'Growth', 'SEO'],
    bio: 'Driving user growth for early-stage startups.'
  }
];

export default function Directory() {
  const [alumni, setAlumni] = useState(mockAlumni);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    let filtered = mockAlumni;

    if (search) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.jobTitle?.toLowerCase().includes(search.toLowerCase()) ||
        a.company?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter(a => a.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (industry) {
      filtered = filtered.filter(a => a.company || a.jobTitle?.toLowerCase().includes(industry.toLowerCase()));
    }

    if (year) {
      filtered = filtered.filter(a => a.graduationYear === parseInt(year));
    }

    setAlumni(filtered);
  }, [search, location, industry, year]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Alumni Directory</CardTitle>
                <p className="text-muted-foreground">Connect with {mockAlumni.length}+ fellow alumni</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
            <Button variant="outline" size="sm">
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, company, title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Input
              placeholder="Industry/Company"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Grad Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2015">2015</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Location</TableHead>
                  <TableHead className="hidden lg:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden lg:table-cell">Grad Year</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumni.map((alum) => (
                  <TableRow key={alum.id}>
                    <TableCell className="font-medium">{alum.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {alum.location}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{alum.company}</TableCell>
                    <TableCell className="hidden md:table-cell">{alum.jobTitle}</TableCell>
                    <TableCell className="hidden lg:table-cell">{alum.graduationYear}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {alum.skills.slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-muted text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                        {alum.skills.length > 3 && (
                          <span className="px-2 py-1 bg-muted text-xs rounded-full">+{alum.skills.length - 3}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/profile/${alum.id}`}>View Profile</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {alumni.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No alumni found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
                <Button variant="outline" onClick={() => { setSearch(''); setLocation(''); setIndustry(''); setYear(''); }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

