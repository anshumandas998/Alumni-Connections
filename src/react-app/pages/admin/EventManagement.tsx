import { useState, useEffect } from 'react';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/react-app/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/react-app/components/ui/dialog';
import { Badge } from '@/react-app/components/ui/badge';
import { Calendar, Plus, Edit3, Trash2, Search } from 'lucide-react';
import api from '@/react-app/lib/api';
import type { Event } from '@/shared/types';

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/events');
      setEvents(data || []);
    } catch (error) {
      console.error('Failed to fetch events');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleSave = async () => {
    if (!editEvent) return;
    try {
      if (editEvent.id) {
        await api.put(`/events/${editEvent.id}`, editEvent);
      } else {
        await api.post('/events', editEvent);
      }
      setIsDialogOpen(false);
      setEditEvent(null);
      fetchEvents();
    } catch (error) {
      alert('Save failed');
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-8 h-8" />
            Event Management
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editEvent?.id ? 'Edit Event' : 'Add Event'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder="Title" value={editEvent?.title || ''} onChange={(e) => setEditEvent({...editEvent, title: e.target.value})} />
                <Input placeholder="Description" value={editEvent?.description || ''} onChange={(e) => setEditEvent({...editEvent, description: e.target.value})} />
                <Input type="datetime-local" placeholder="Date & Time" value={editEvent?.date ? new Date(editEvent.date).toISOString().slice(0,16) : ''} onChange={(e) => setEditEvent({...editEvent, date: new Date(e.target.value).toISOString()})} />
                <Input placeholder="Location" value={editEvent?.location || ''} onChange={(e) => setEditEvent({...editEvent, location: e.target.value})} />
              </div>
              <DialogFooter>
                <Button onClick={handleSave}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search events..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setEditEvent(event)}>
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
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

