import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Type, AlignLeft, Image as ImageIcon, Send } from 'lucide-react';
import axios from 'axios';

function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Tech',
    date: '',
    time: '',
    venue: '',
    capacity: '',
    description: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const token = localStorage.getItem('token'); // Get the security token

    try {
      await axios.post('http://localhost:5000/api/events', formData, {
        headers: { 'authorization': token } // Send token to backend
      });
      
      alert("Success! Event submitted for admin approval.");
      setFormData({
        title: '', category: 'Tech', date: '', time: '', venue: '', capacity: '', description: '', image: ''
      });
    } catch (error) {
      console.error("Error creating event:", error);
      alert(error.response?.data?.message || "Failed to create event. Is your backend running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 pt-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className="bg-slate-900 p-8 text-white">
          <h1 className="text-3xl font-bold">Create Campus Event</h1>
          <p className="text-slate-400 mt-2">Fill in the details to propose a new event for your department.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Event Title</label>
            <div className="relative">
              <Type className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="text" name="title" required placeholder="e.g. Annual Techathon 2026" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.title} onChange={handleChange} />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="date" name="date" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.date} onChange={handleChange} />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Time</label>
            <div className="relative">
              <Clock className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="time" name="time" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.time} onChange={handleChange} />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Venue</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="text" name="venue" required placeholder="e.g. Seminar Hall A" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.venue} onChange={handleChange} />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Max Capacity</label>
            <div className="relative">
              <Users className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="number" name="capacity" required placeholder="e.g. 100" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.capacity} onChange={handleChange} />
            </div>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Event Poster URL</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-3 text-slate-400" size={18} />
              <input type="text" name="image" placeholder="https://images.unsplash.com/..." className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={formData.image} onChange={handleChange} />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea name="description" rows="4" required placeholder="Describe your event..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={formData.description} onChange={handleChange}></textarea>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="md:col-span-2 bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {isSubmitting ? 'Submitting...' : 'Propose Event'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// Simple internal loader component for the button
const Loader2 = ({ className }) => (
  <svg className={`animate-spin h-5 w-5 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default CreateEvent;