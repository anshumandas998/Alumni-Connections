import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/react-app/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Badge } from '@/react-app/components/ui/badge';
import { Calendar, MapPin, Search, Filter } from 'lucide-react';

import { Event } from '@/shared/types';

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Networking Gala',
    description: 'Join fellow alumni for an evening of networking, dinner, and career discussions.',
    date: '2024-12-15T19:00:00',
    location: 'Grand Ballroom, City Center Hotel, San Francisco',
    organizer: 'Alumni Association',
    attendees: ['user1', 'user2', 'user3']
  },
  {
    id: '2',
    title: 'Tech Careers Panel Discussion',
    description: 'Hear from successful alumni leaders in tech about career paths and opportunities.',
    date: '2024-11-20T18:30:00',
    location: 'Virtual - Zoom',
    organizer: 'Tech Alumni Chapter',
    attendees: []
  },
  {
    id: '3',
    title: 'Sports Day & BBQ',
    description: 'Casual sports event followed by BBQ. Bring your family!',
    date: '2024-10-25T14:00:00',
    location: 'University Fields',
    organizer: 'Sports Committee',
    attendees: ['user4', 'user5']
  },
  {
    id: '4',
    title: 'Career Mentorship Workshop',
    description: '1:1 mentorship matching and skill-building sessions.',
    date: '2024-11-10T09:00:00',
    location: 'Career Center Room 101',
    organizer: 'Career Services',
    attendees: []
  },
  {
    id: '5',
    title: 'Holiday Fundraiser',
    description: 'Support student scholarships through our annual holiday event.',
    date: '2024-12-10T17:00:00',
    location: 'Online Auction Platform',
    organizer: 'Fundraising Committee',
    attendees: []
  }
];

export default function Events() {
  const [events, setEvents] = useState(mockEvents);
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    let filtered = mockEvents;

    // Search
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.description.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Location
    if (locationFilter) {
      filtered = filtered.filter(event => event.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }

    // Date filter
    const now = new Date();
    if (upcomingOnly) {
      filtered = filtered.filter(event => new Date(event.date) > now);
    }

    if (dateFilter === 'past') {
      filtered = filtered.filter(event => new Date(event.date) < now);
    }

    setEvents(filtered);
  }, [search, locationFilter, upcomingOnly, dateFilter]);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-3xl">Upcoming Events</CardTitle>
                <p className="text-muted-foreground">Join our community events and networking opportunities</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters ({events.length} events)
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => {
              setSearch('');
              setLocationFilter('');
              setUpcomingOnly(true);
              setDateFilter('all');
            }}>
              Clear All
            </Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Input
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="past">Past Events</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium">Upcoming Only</label>
              <input
                type="checkbox"
                checked={upcomingOnly}
                onChange={(e) => setUpcomingOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventDate = new Date(event.date);
            const isUpcoming = eventDate > new Date();
            
            return (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={isUpcoming ? "default" : "secondary"}>{isUpcoming ? "UPCOMING" : "PAST"}</Badge>
                      <Badge variant="outline">{event.attendees.length} attending</Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-tight">{event.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      by {event.organizer}
                    </div>
                    <Button asChild size="sm">
                      <Link to={`/events/${event.id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {events.length === 0 && (
          <Card className="mt-12 text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}

