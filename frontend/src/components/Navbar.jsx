import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white shadow-sm py-4'
    } border-b border-slate-100 px-6`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* BRAND SECTION - LOGO REMOVED */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-slate-900">
            Campus<span className="text-blue-600">Connect</span>
          </span>
        </Link>

        {/* NAVIGATION LINKS */}
        <div className="hidden md:flex items-center gap-8 font-bold text-slate-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link to="/events" className="hover:text-blue-600 transition-colors">Events</Link>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
          
          {(role === 'organizer' || role === 'admin') && (
            <Link to="/dashboard" className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <LayoutDashboard size={18} /> Dept Dashboard
            </Link>
          )}

          {role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-colors">
              <ShieldCheck size={18} /> Admin Panel
            </Link>
          )}
        </div>

        {/* USER AUTH SECTION */}
        <div className="flex items-center gap-4">
          {!role ? (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-slate-600 font-bold hover:bg-slate-50 px-4 py-2 rounded-xl transition-all">
                Login
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Profile Link */}
              <Link to="/profile" className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 hover:bg-white hover:shadow-sm border border-slate-200 rounded-full transition-all">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-black shadow-inner uppercase">
                  {userName?.charAt(0)}
                </div>
                <span className="hidden sm:block text-xs font-black text-slate-800">{userName}</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={22} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;