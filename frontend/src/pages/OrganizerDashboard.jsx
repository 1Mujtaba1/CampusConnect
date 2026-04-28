import React, { useState, useEffect } from 'react';
import { Plus, Loader2, Trash2, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events');
        setEvents(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`, {
          headers: { 'authorization': token }
        });
        setEvents(events.filter(e => e._id !== id));
      } catch (err) { alert("Delete failed. Check permissions."); }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">Department Dashboard <span className="text-slate-400 font-normal">| {userName}</span></h1>
          <Link to="/create-event" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200"><Plus size={20} /> Create Event</Link>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b bg-slate-50 font-bold">Manage Active Events</div>
            <div className="divide-y">
              {events.map(event => (
                <div key={event._id} className="p-5 flex items-center justify-between hover:bg-slate-50/50">
                  <div className="flex items-center gap-4">
                    <img src={event.image} className="w-14 h-14 rounded-xl object-cover border" alt="" />
                    <h4 className="font-bold text-slate-800">{event.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link to={`/events/${event._id}`} className="p-2 text-blue-500 bg-blue-50 rounded-lg"><ExternalLink size={18}/></Link>
                    <button onClick={() => handleDelete(event._id)} className="p-2 text-red-500 bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;