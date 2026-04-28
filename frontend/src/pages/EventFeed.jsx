import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  Filter, 
  Loader2, 
  Tag, 
  Clock 
} from 'lucide-react';
import axios from 'axios';

const CATEGORIES = ['All Categories', 'Tech', 'Cultural', 'Workshop', 'Sports'];
const TIMEFRAMES = ['All Time', 'Upcoming', 'Past'];

function EventFeed() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [activeTimeframe, setActiveTimeframe] = useState('All Time');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events');
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All Categories' || event.category === activeCategory;
    
    let matchesTimeframe = true;
    if (activeTimeframe !== 'All Time') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      eventDate.setHours(0, 0, 0, 0);

      if (activeTimeframe === 'Upcoming') matchesTimeframe = eventDate >= today;
      else if (activeTimeframe === 'Past') matchesTimeframe = eventDate < today;
    }
    return matchesSearch && matchesCategory && matchesTimeframe;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER SECTION --- */}
        <div className="mb-12 flex flex-col xl:flex-row xl:items-end justify-between gap-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl font-black text-slate-900 tracking-tighter mb-4"
            >
              Campus <span className="text-blue-600">Events.</span>
            </motion.h1>
            <p className="text-slate-500 text-lg font-medium">Discover workshops, fests, and seminars across all departments.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-4 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search events..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Timeframe Filter */}
            <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              {TIMEFRAMES.map(time => (
                <button
                  key={time}
                  onClick={() => setActiveTimeframe(time)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTimeframe === time ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- CATEGORY TABS --- */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-now80 px-8 py-3 rounded-2xl font-bold text-sm transition-all border ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- EVENT GRID --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 size={48} className="animate-spin text-blue-600 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching campus pulse...</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200"
                >
                  <p className="text-xl font-bold text-slate-400">No events match your criteria.</p>
                  <button onClick={() => {setSearchQuery(''); setActiveCategory('All Categories');}} className="mt-4 text-blue-600 font-bold">Clear Filters</button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: EVENT CARD ---
function EventCard({ event }) {
  const isPast = new Date(event.date) < new Date().setHours(0,0,0,0);

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full ${isPast ? 'grayscale-[0.6] opacity-80' : ''}`}
    >
      {/* THE LINK WRAPPER THAT FIXES YOUR ISSUE */}
      <Link to={`/events/${event._id}`} className="flex flex-col h-full">
        
        {/* Image Container */}
        <div className="relative h-60 overflow-hidden bg-slate-200">
          <img 
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800'} 
            alt={event.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
            {event.category}
          </div>
          {isPast && (
            <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
              <span className="bg-white text-slate-900 px-6 py-2 rounded-full font-black text-xs uppercase tracking-tighter shadow-xl">Event Finished</span>
            </div>
          )}
        </div>
        
        {/* Content Container */}
        <div className="p-8 flex flex-col grow">
          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-3 mb-8">
            <div className="flex items-center text-slate-500 font-medium text-sm">
              <Calendar size={16} className="mr-3 text-blue-500" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center text-slate-500 font-medium text-sm">
              <MapPin size={16} className="mr-3 text-blue-500" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center text-slate-500 font-medium text-sm">
              <Clock size={16} className="mr-3 text-blue-500" />
              <span>{event.time || "TBA"}</span>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Availability</span>
              <span className={`text-sm font-black ${event.spotsLeft > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {event.spotsLeft > 0 ? `${event.spotsLeft} Spots Remaining` : 'Full House'}
              </span>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
              <ArrowRight size={20} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default EventFeed;