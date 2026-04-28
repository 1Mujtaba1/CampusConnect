import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, MapPin, Ticket, User, Mail, Shield, Loader2 } from 'lucide-react';

function Profile() {
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const name = localStorage.getItem('userName');
  const email = localStorage.getItem('userEmail');
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/me/events', {
          headers: { 'authorization': token }
        });
        setMyEvents(res.data);
      } catch (err) {
        console.error("Error fetching user events", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMyEvents();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-lg shadow-blue-100">
            {name?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h1 className="text-4xl font-black text-slate-900">{name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-2 text-slate-500 font-medium bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">
                <Mail size={16} /> {email}
              </span>
              <span className="flex items-center gap-2 text-blue-600 font-black bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 uppercase text-xs tracking-widest">
                <Shield size={16} /> {role}
              </span>
            </div>
          </div>
        </div>

        {/* Registered Events Section */}
        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
          <Ticket className="text-blue-600" /> My Registered Events
        </h2>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
        ) : myEvents.length === 0 ? (
          <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-sm">No bookings found</p>
            <p className="text-slate-600 font-medium">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myEvents.map(event => (
              <div key={event._id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                <img src={event.image} className="w-20 h-20 rounded-2xl object-cover border" alt="" />
                <div className="flex flex-col justify-center">
                  <h4 className="font-bold text-slate-900 mb-1">{event.title}</h4>
                  <div className="space-y-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    <p className="flex items-center gap-2"><Calendar size={12} className="text-blue-500" /> {event.date}</p>
                    <p className="flex items-center gap-2"><MapPin size={12} className="text-blue-500" /> {event.venue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Profile;