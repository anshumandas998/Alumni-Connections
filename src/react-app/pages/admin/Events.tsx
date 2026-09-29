import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Button } from '@/react-app/components/ui/button';
import { Input } from '@/react-app/components/ui/input';
import { Textarea } from '@/react-app/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/react-app/components/ui/table';
import { Event } from '@/shared/types';
import { PlusCircle, Trash2, Edit2, Search, Calendar, Users, X } from 'lucide-react';

const defaultEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Networking Gala',
    description: 'Join fellow alumni for an evening of networking, dinner, and career discussions.',
    date: '2026-12-15T19:00',
    location: 'Grand Ballroom, City Center Hotel, San Francisco',
    organizer: 'Alumni Association',
    category: 'Networking',
    capacity: 500,
    attendees: ['user1', 'user2', 'user3']
  },
  {
    id: '2',
    title: 'Tech Careers Panel & Innovation Summit',
    description: 'Hear from successful alumni leaders in AI, Cloud, and Fintech about future career paths and direct opportunities.',
    date: '2026-11-20T18:30',
    location: 'Innovation Hub, Virtual & Campus',
    organizer: 'TechCorp',
    category: 'Workshops',
    capacity: 1000,
    attendees: ['user1']
  },
  {
    id: '3',
    title: 'Class of 2016 - 10 Year Reunion',
    description: 'A decade of milestones! Reconnect with your batchmates, reminisce old times, and celebrate our journeys.',
    date: '2026-10-25T18:00',
    location: 'University Club Lounge & Courtyard',
    organizer: 'Alumni Association',
    category: 'Reunions',
    capacity: 250,
    attendees: []
  },
  {
    id: '4',
    title: 'Startup Pitch & Angel Mentorship Forum',
    description: 'Pitch your venture to alumni angel investors and startup mentors who have raised over $50M.',
    date: '2026-11-05T14:00',
    location: 'Auditorium Hall C & Zoom',
    organizer: 'StartupX',
    category: 'Conferences',
    capacity: 300,
    attendees: []
  }
];

export default function AdminEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>(() => {
    try {
      const saved = localStorage.getItem('alumni_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load events from storage', e);
    }
    return defaultEvents;
  });

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialNewEvent = useMemo(() => ({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'Networking' as NonNullable<Event['category']>,
    organizer: user?.role === 'admin' ? (user.adminCompany || '') : 'Alumni Association',
    capacity: 150
  }), [user]);

  const [newEvent, setNewEvent] = useState(initialNewEvent);

  useEffect(() => {
    localStorage.setItem('alumni_events', JSON.stringify(events));
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!user) return [];
    let list = user.role === 'super_admin' 
      ? events 
      : events.filter(e => e.organizer === user.adminCompany);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(e => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'All') {
      list = list.filter(e => e.category === categoryFilter);
    }

    return list;
  }, [events, user, search, categoryFilter]);

  const saveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;

    if (editingId) {
      setEvents(events.map(ev => ev.id === editingId ? {
        ...ev,
        ...newEvent,
        id: editingId,
        attendees: ev.attendees || []
      } : ev));
      setEditingId(null);
    } else {
      const created: Event = {
        ...newEvent,
        id: `ev-${Date.now()}`,
        attendees: []
      };
      setEvents([created, ...events]);
    }

    setIsCreating(false);
    setNewEvent(initialNewEvent);
  };

  const startEdit = (ev: Event) => {
    setEditingId(ev.id);
    setNewEvent({
      title: ev.title,
      description: ev.description,
      date: ev.date,
      location: ev.location,
      category: ev.category || 'Networking',
      organizer: ev.organizer,
      capacity: ev.capacity || 100
    });
    setIsCreating(true);
  };

  const deleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter(e => e.id !== id));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-navy p-8 rounded-3xl relative overflow-hidden mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-4">
            <Calendar className="w-4 h-4" />
            Event Management
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Events {user.role === 'admin' ? `for ${user.adminCompany}` : '(All Organizers)'}
              </h1>
              <p className="text-white/60 mt-2">Create and manage upcoming alumni reunions, galas, and workshops.</p>
            </div>
            <Button 
              onClick={() => {
                setEditingId(null);
                setNewEvent(initialNewEvent);
                setIsCreating(!isCreating);
              }}
              className="bg-gold hover:bg-gold/90 text-navy font-bold px-8 py-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
            >
              {isCreating ? <X className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
              {isCreating ? 'Cancel' : 'Create New Event'}
            </Button>
          </div>
        </div>
      </div>

      {isCreating && (
        <form onSubmit={saveEvent} className="bg-white rounded-3xl p-8 shadow-xl border border-navy/10 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-navy flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              {editingId ? 'Edit Event Details' : 'Create New Event'}
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Title *</label>
              <Input 
                required 
                placeholder="e.g. Annual Alumni Gala 2026" 
                value={newEvent.title} 
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                className="w-full h-11 px-4 border border-input rounded-xl bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Networking">Networking</option>
                <option value="Workshops">Workshops</option>
                <option value="Reunions">Reunions</option>
                <option value="Conferences">Conferences</option>
                <option value="Career">Career</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Date & Time *</label>
              <Input 
                type="datetime-local" 
                required
                value={newEvent.date} 
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Location / Venue *</label>
              <Input 
                required 
                placeholder="e.g. Grand Ballroom, San Francisco or Virtual Zoom" 
                value={newEvent.location} 
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Organizer</label>
              <Input 
                placeholder="Organizer Company or Chapter" 
                value={newEvent.organizer} 
                disabled={user.role === 'admin'}
                onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} 
                className="rounded-xl py-3"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Capacity</label>
              <Input 
                type="number"
                min="1"
                placeholder="e.g. 200" 
                value={newEvent.capacity} 
                onChange={(e) => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) || 50 })} 
                className="rounded-xl py-3"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Event Description</label>
            <Textarea 
              rows={3}
              placeholder="Provide a comprehensive summary of what attendees can expect, key speakers, dress code, etc." 
              value={newEvent.description} 
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} 
              className="rounded-xl"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreating(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" className="bg-navy hover:bg-navy/90 text-white font-bold px-8 rounded-xl">
              {editingId ? 'Save Changes' : 'Publish Event'}
            </Button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search events by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-gold/50 outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 rounded-xl text-sm font-bold text-navy outline-none border-none"
          >
            <option value="All">All Categories</option>
            <option value="Networking">Networking</option>
            <option value="Workshops">Workshops</option>
            <option value="Reunions">Reunions</option>
            <option value="Conferences">Conferences</option>
            <option value="Career">Career</option>
          </select>
          <div className="text-xs font-bold text-slate-400 whitespace-nowrap">
            {filteredEvents.length} events
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-navy/10">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Title & Description</TableHead>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Date & Time</TableHead>
              <TableHead className="font-bold">Location</TableHead>
              <TableHead className="font-bold">Organizer</TableHead>
              <TableHead className="font-bold">RSVPs</TableHead>
              <TableHead className="font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-400">
                  No events found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredEvents.map((event) => (
                <TableRow key={event.id} className="hover:bg-slate-50 transition-colors">
                  <TableCell>
                    <div className="font-bold text-navy">{event.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-1 max-w-xs">{event.description}</div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider">
                      {event.category || 'General'}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium text-sm whitespace-nowrap">
                    {event.date ? new Date(event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'TBD'}
                  </TableCell>
                  <TableCell className="text-slate-600 text-sm">{event.location}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full uppercase tracking-wider border border-gold/20">
                      {event.organizer}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-gold" />
                      <span>{(event.attendees || []).length} / {event.capacity || 100}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => startEdit(event)} 
                        className="text-slate-600 hover:text-navy hover:bg-slate-100 rounded-xl"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteEvent(event.id)} 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
