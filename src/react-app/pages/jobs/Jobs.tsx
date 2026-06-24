import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';

import { Badge } from '@/react-app/components/ui/badge';
import { Briefcase, MapPin, DollarSign, Search, Filter, Clock } from 'lucide-react';

import { JobPosting } from '@/shared/types';

const mockJobs: JobPosting[] = [
  {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp',
    location: 'Bengaluru, India (Hybrid)',
    salary: '₹25,00,000 - ₹35,00,000',
    description: 'Build responsive web applications using React, TypeScript, and modern tooling. Join our innovative team shaping the future of edtech.',
    postedBy: 'John Smith',
    applyUrl: '#'
  },
  {
    id: '2',
    title: 'Product Manager - Growth',
    company: 'StartupX',
    location: 'Remote (India)',
    salary: '₹20,00,000 - ₹30,00,000',
    description: 'Drive user acquisition and retention strategies for our SaaS platform. Work cross-functionally with engineering and design.',
    postedBy: 'Sarah Lee',
    applyUrl: 'https://startupx.com/careers/pm-growth'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'FinanceHub',
    location: 'Hyderabad, India',
    salary: '₹30,00,000 - ₹40,00,000',
    description: "Leverage ML and analytics to optimize trading algorithms. Experience with Python, TensorFlow required.",
    postedBy: 'Mike Chen',
    applyUrl: '#'
  },
  {
    id: '4',
    title: 'UX/UI Designer',
    company: 'HealthTech',
    location: 'Pune, India (Remote OK)',
    salary: '₹15,00,000 - ₹25,00,000',
    description: 'Design intuitive interfaces for healthcare applications. Figma, user research experience a plus.',
    postedBy: 'Emily Davis',
    applyUrl: 'mailto:careers@healthtech.com'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Mumbai, India',
    salary: '₹30,00,000+',
    description: 'Scale our Kubernetes infrastructure. Terraform, AWS expertise required.',
    postedBy: 'Alex Kim',
    applyUrl: '#'
  }
];

export default function Jobs() {
  const [jobs, setJobs] = useState(mockJobs);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [salaryFilter, setSalaryFilter] = useState('all');

  useEffect(() => {
    let filtered = mockJobs;

    if (search) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job => job.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    if (typeFilter !== 'all') {
      // Mock type classification
      const types = {
        'engineering': ['Engineer', 'Developer', 'DevOps'],
        'product': ['Product', 'PM', 'Manager'],
        'design': ['Designer', 'UX', 'UI'],
        'data': ['Data', 'Scientist', 'ML']
      };
      const keywords = types[typeFilter as keyof typeof types];
      filtered = filtered.filter(job => keywords.some(kw => job.title.includes(kw)));
    }

    if (salaryFilter !== 'all') {
      filtered = filtered.filter(job => {
        if (salaryFilter === '15lpa+') return job.salary?.includes('15,00,000') || job.salary?.includes('20,00,000') || job.salary?.includes('25,00,000') || job.salary?.includes('30,00,000') || job.salary?.includes('35,00,000') || job.salary?.includes('40,00,000');
        if (salaryFilter === '25lpa+') return job.salary?.includes('25,00,000') || job.salary?.includes('30,00,000') || job.salary?.includes('35,00,000') || job.salary?.includes('40,00,000');
        if (salaryFilter === '35lpa+') return job.salary?.includes('35,00,000') || job.salary?.includes('40,00,000');
        return true;
      });
    }

    setJobs(filtered);
  }, [search, locationFilter, typeFilter, salaryFilter]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Job Opportunities</CardTitle>
                <p className="text-muted-foreground">Discover career opportunities posted by fellow alumni</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters ({jobs.length} jobs)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('');
              setLocationFilter('');
              setTypeFilter('all');
              setSalaryFilter('all');
            }}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search title, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
              </SelectContent>
            </Select>
            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Salary" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Salaries</SelectItem>
                <SelectItem value="15lpa+">₹15 LPA+</SelectItem>
                <SelectItem value="25lpa+">₹25 LPA+</SelectItem>
                <SelectItem value="35lpa+">₹35 LPA+</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Jobs Grid */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{job.company}</Badge>
                    {job.location.includes('Remote') ? (
                      <Badge variant="outline">Remote OK</Badge>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {job.location.split(',')[0]}
                      </div>
                    )}
                  </div>
                  {job.salary && (
                    <Badge className="text-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl">{job.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 line-clamp-3">{job.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Posted by {job.postedBy}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/jobs/${job.id}`}>View Details</Link>
                    </Button>
                    {job.applyUrl && (
                      <Button size="sm" asChild>
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply Now
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {jobs.length === 0 && (
          <Card className="mt-12 text-center py-16">
            <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline">Create Job Posting</Button>
          </Card>
        )}
      </div>
    </div>
  );
}

