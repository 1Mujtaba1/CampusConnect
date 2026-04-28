import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Mail, ShieldCheck, CalendarCheck, MessageSquare } from 'lucide-react';

function AdminDashboard() {
  const [view, setView] = useState('events'); // Toggle between events and messages
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = view === 'events' ? '/api/admin/events/pending' : '/api/admin/messages';
      const res = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { 'authorization': token }
      });
      setData(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2"><ShieldCheck className="text-blue-600"/> Admin Authority Panel</h1>
        
        {/* TAB SWITCHER */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setView('events')} 
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'events' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border'}`}
          >
            <CalendarCheck size={18} className="inline mr-2"/> Pending Events
          </button>
          <button 
            onClick={() => setView('messages')} 
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'messages' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-500 border'}`}
          >
            <MessageSquare size={18} className="inline mr-2"/> User Messages
          </button>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto mt-20 text-blue-600" /> : (
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            {view === 'events' ? (
              /* --- EVENTS TABLE --- */
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b text-slate-400 text-xs uppercase font-bold"><tr className="p-6"><th>Title</th><th>Actions</th></tr></thead>
                <tbody className="divide-y">
                  {data.map(e => (
                    <tr key={e._id} className="p-6">
                      <td className="p-6 font-bold">{e.title}</td>
                      <td className="p-6 flex gap-2">
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg">Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              /* --- MESSAGES VIEW --- */
              <div className="divide-y divide-slate-100">
                {data.length === 0 ? <p className="p-10 text-center text-slate-400">No messages yet.</p> : data.map(m => (
                  <div key={m._id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-slate-900">{m.subject}</h4>
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-black uppercase">New Message</span>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{m.message}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase">
                      <span className="flex items-center gap-1"><Mail size={14}/> {m.email}</span>
                      <span>By: {m.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;