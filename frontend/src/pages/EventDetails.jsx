import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle } from 'lucide-react';

function EventDetails() {
  const { id } = useParams(); // Gets ID from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(() => navigate('/events'));
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!token) {
      alert("Please login first!");
      return navigate('/login');
    }
    try {
      await axios.post(`http://localhost:5000/api/events/${id}/register`, {}, {
        headers: { 'authorization': token }
      });
      setIsRegistered(true);
      // Refresh event data to show updated seats
      const res = await axios.get(`http://localhost:5000/api/events/${id}`);
      setEvent(res.data);
    } catch (err) {
      alert("Registration failed. Event might be full.");
    }
  };

  if (!event) return <div className="text-center pt-40 font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-white py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold mb-8 hover:text-slate-900">
          <ArrowLeft size={20} /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <img src={event.image} className="w-full h-125 object-cover rounded-[3rem] shadow-2xl" alt="" />
          
          <div>
            <span className="bg-blue-50 text-blue-600 px-4 py-1 rounded-full text-sm font-black uppercase tracking-widest mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="text-5xl font-black text-slate-900 mb-6">{event.title}</h1>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-slate-100 p-3 rounded-2xl"><Calendar size={24} /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Date & Time</p><p className="font-bold">{event.date} at {event.time}</p></div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-slate-100 p-3 rounded-2xl"><MapPin size={24} /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Location</p><p className="font-bold">{event.venue}</p></div>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="bg-slate-100 p-3 rounded-2xl"><Users size={24} /></div>
                <div><p className="text-xs font-bold text-slate-400 uppercase">Availability</p><p className="font-bold">{event.spotsLeft} Seats Remaining</p></div>
              </div>
            </div>

            <p className="text-slate-500 leading-relaxed mb-10 text-lg">{event.description}</p>

            {isRegistered ? (
              <div className="bg-green-50 text-green-600 p-6 rounded-4xl flex items-center justify-center gap-3 font-bold border border-green-100">
                <CheckCircle /> You are registered for this event!
              </div>
            ) : (
              <button 
                onClick={handleRegister}
                disabled={event.spotsLeft <= 0}
                className="w-full bg-blue-600 text-white py-5 rounded-4xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:bg-slate-300"
              >
                {event.spotsLeft <= 0 ? 'Event Full' : 'Register Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;