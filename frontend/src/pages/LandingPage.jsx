import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, BarChart3, Globe, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="relative min-h-screen w-full bg-slate-50 overflow-x-hidden">
      
      {/* --- 1. GLOBAL BACKGROUND MESH (Fixed & Layered) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Top Right Glow */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/40 rounded-full blur-[120px] animate-pulse"></div>
        {/* Bottom Left Glow */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[120px]"></div>
        {/* Center Soft Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-white/60 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* --- 2. HERO SECTION --- */}
        <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <motion.span 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="inline-block px-4 py-1.5 mb-8 text-sm font-black tracking-widest text-blue-600 uppercase bg-blue-50/50 backdrop-blur-md border border-blue-100 rounded-full"
            >
              The Future of Campus Life
            </motion.span>
            
            <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-8 tracking-tighter">
              Manage Campus Events <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500">
                Without the Chaos.
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium">
              CEMS is the all-in-one platform for students, department heads, and organizers to create, discover, and join university events seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/events" className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-2xl">
                Explore Events <ArrowRight size={22} />
              </Link>
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-md text-slate-900 border border-slate-200 rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">
                Join as Organizer
              </Link>
            </div>
          </div>
        </section>

        {/* --- 3. STATS BAR (Glassmorphism) --- */}
        <section className="py-12 px-6">
          <div className="max-w-7xl mx-auto bg-white/40 backdrop-blur-xl border border-white/20 rounded-[3rem] p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 shadow-xl">
            {[
              { label: 'Active Events', val: '50+' },
              { label: 'Total Users', val: '1.5k' },
              { label: 'Departments', val: '12+' },
              { label: 'Success Rate', val: '100%' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-black text-slate-900 mb-1">{stat.val}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- 4. BENTO FEATURE GRID --- */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="md:col-span-4 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden group shadow-2xl">
                <ShieldCheck size={48} className="text-blue-400 mb-6" />
                <h3 className="text-4xl font-bold mb-4">Secure Admin Approval</h3>
                <p className="text-slate-400 text-lg">Every event goes through a rigorous vetting process by department heads, ensuring quality and relevance.</p>
              </div>

              <div className="md:col-span-2 bg-blue-600 rounded-[3rem] p-12 text-white shadow-2xl flex flex-col justify-between">
                <Zap size={40} />
                <h3 className="text-2xl font-bold">Instant Registration</h3>
              </div>

              <div className="md:col-span-3 bg-white/60 backdrop-blur-md border border-white rounded-[3rem] p-12 shadow-xl hover:bg-white transition-all">
                <BarChart3 size={40} className="text-indigo-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Detailed Analytics</h3>
                <p className="text-slate-500">Track registration trends and student engagement effortlessly.</p>
              </div>

              <div className="md:col-span-3 bg-white/60 backdrop-blur-md border border-white rounded-[3rem] p-12 shadow-xl hover:bg-white transition-all">
                <Globe size={40} className="text-green-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Role-Based Access</h3>
                <p className="text-slate-500">Dedicated panels for Students, Organizers, and Admins.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. HOW IT WORKS --- */}
        <section className="py-24 bg-slate-900/5 backdrop-blur-sm px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-16 text-slate-900">How it works?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: '01', title: 'Create', desc: 'Organizers submit event details and posters.' },
                { step: '02', title: 'Review', desc: 'Admins verify and approve the event details.' },
                { step: '03', title: 'Join', desc: 'Students discover and register in one click.' }
              ].map((item, i) => (
                <div key={i} className="relative p-8 bg-white/50 rounded-3xl border border-white">
                  <span className="text-6xl font-black text-blue-600/20 absolute top-4 right-8">{item.step}</span>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-12 text-center border-t border-slate-200/50">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
            © 2026 CampusConnect | CEMS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;