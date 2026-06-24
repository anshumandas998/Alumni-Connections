import { useState } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Event } from '@/shared/types';
import { PlusCircle, Trash2 } from 'lucide-react';


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
];

export default function AdminEvents() {
  const [events, setEvents] = useState(mockEvents);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', description: '', date: '', location: '', organizer: '' });

  const createEvent = () => {
    setEvents([...events, { ...newEvent, id: String(events.length + 1), attendees: [] }]);
    setIsCreating(false);
    setNewEvent({ title: '', description: '', date: '', location: '', organizer: '' });
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Manage Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => setIsCreating(!isCreating)} className="mb-4">
          <PlusCircle className="w-4 h-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Event'}
        </Button>

        {isCreating && (
          <div className="space-y-4 mb-8 p-4 border rounded-lg">
            <Input placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
            <Textarea placeholder="Description" value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} />
            <Input type="datetime-local" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
            <Input placeholder="Location" value={newEvent.location} onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} />
            <Input placeholder="Organizer" value={newEvent.organizer} onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} />
            <Button onClick={createEvent}>Save Event</Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
