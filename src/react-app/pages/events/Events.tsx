import { useState, useEffect, useMemo } from 'react';
import { Calendar, MapPin, Users, Ticket, Search, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Event } from '@/shared/types';
import { Button } from '@/react-app/components/ui/button';

const fallbackEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Networking Gala',
    description: 'Join fellow alumni for an evening of networking, dinner, and career discussions. Keynote address by alumni tech founders.',
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
    description: 'A decade of milestones! Reconnect with your batchmates, reminisce old times, and celebrate our journeys together.',
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

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rsvpSuccessId, setRsvpSuccessId] = useState<string | null>(null);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('alumni_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEvents(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to load events', e);
    }
    setEvents(fallbackEvents);
  }, []);

  const handleRSVP = (event: Event) => {
    const attendeeId = user ? user.id : 'guest-' + Date.now();
    const alreadyAttending = (event.attendees || []).includes(attendeeId) || (user && (event.attendees || []).includes(user.email));

    let updatedAttendees: string[];
    if (alreadyAttending) {
      updatedAttendees = (event.attendees || []).filter(a => a !== attendeeId && a !== user?.email);
    } else {
      updatedAttendees = [...(event.attendees || []), user?.email || attendeeId];
    }

    const updatedEvents = events.map(e => e.id === event.id ? { ...e, attendees: updatedAttendees } : e);
    setEvents(updatedEvents);
    localStorage.setItem('alumni_events', JSON.stringify(updatedEvents));

    if (!alreadyAttending) {
      setRsvpSuccessId(event.id);
      setTimeout(() => setRsvpSuccessId(null), 4000);
    }
  };

  const categories = ['All', 'Networking', 'Workshops', 'Reunions', 'Conferences', 'Career'];

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) || 
                          e.location.toLowerCase().includes(search.toLowerCase()) ||
                          e.description.toLowerCase().includes(search.toLowerCase());
      const matchCategory = selectedCategory === 'All' || e.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [events, search, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Calendar className="w-4 h-4" />
              Community Gatherings & Webinars
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Alumni <span className="text-gold">Events</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed">
              Join reunions, masterclasses, and networking galas. Connect with fellow graduates across the world.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-24">
        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search events by title, venue, or keywords..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-gold/50 transition-all outline-none text-slate-800 text-sm font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-wider ${
                  selectedCategory === cat 
                    ? 'bg-navy text-gold shadow-lg shadow-navy/20' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Success Alert */}
        {rsvpSuccessId && (
          <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 animate-fadeIn">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold">RSVP Confirmed!</p>
              <p className="text-xs text-emerald-700">You're officially registered for this event. Check your dashboard for calendar reminders.</p>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No events found</h3>
              <p className="text-slate-400 mt-1">Try adjusting your search criteria or category filter.</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const eventDate = event.date ? new Date(event.date) : new Date();
              const monthName = eventDate.toLocaleDateString([], { month: 'short' }).toUpperCase();
              const dayNum = eventDate.getDate();
              const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const attendeeCount = (event.attendees || []).length;
              const isAttending = user && ((event.attendees || []).includes(user.id) || (event.attendees || []).includes(user.email));

              return (
                <div 
                  key={event.id} 
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col md:flex-row hover:-translate-y-1"
                >
                  <div className="md:w-48 bg-gradient-to-br from-navy via-slate-900 to-navy-dark flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden shrink-0">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <span className="text-gold font-black text-5xl mb-1 tracking-tighter drop-shadow-sm">{dayNum}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-white/90">{monthName}</span>
                    <span className="text-[11px] text-white/60 mt-1 font-medium">{timeStr}</span>
                    <div className="mt-4 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/20">
                      {event.category || 'Event'}
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h2 className="font-bold text-xl text-navy group-hover:text-gold transition-colors">
                          {event.title}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                        <span className="font-semibold text-slate-700">Hosted by {event.organizer}</span>
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-6 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span>{attendeeCount} / {event.capacity || 200} attending</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailEvent(event)}
                        className="text-xs font-bold text-navy hover:text-gold p-0 h-auto"
                      >
                        Event Details →
                      </Button>

                      <Button
                        onClick={() => handleRSVP(event)}
                        className={`rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                          isAttending
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-navy hover:bg-gold hover:text-navy text-white'
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        {isAttending ? 'Attending ✓' : 'RSVP Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Event Details Modal */}
      {detailEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-gold/10 text-gold text-xs font-bold rounded-full uppercase tracking-widest border border-gold/20">
                  {detailEvent.category || 'Event'}
                </span>
                <h3 className="text-2xl font-bold text-navy mt-3">{detailEvent.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Organized by {detailEvent.organizer}</p>
              </div>
              <button 
                onClick={() => setDetailEvent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-sm">
                <Calendar className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <div className="font-bold text-navy">
                    {detailEvent.date ? new Date(detailEvent.date).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBD'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {detailEvent.date ? new Date(detailEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-sm">
                <MapPin className="w-5 h-5 text-gold shrink-0" />
                <div>
                  <div className="font-bold text-navy">Location</div>
                  <div className="text-xs text-slate-500">{detailEvent.location}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-navy mb-2">About This Event</h4>
                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl">
                  {detailEvent.description}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDetailEvent(null)}
                className="flex-1 rounded-xl"
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleRSVP(detailEvent);
                  setDetailEvent(null);
                }}
                className="flex-1 bg-gold text-navy font-bold rounded-xl hover:bg-gold/90"
              >
                RSVP for Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
