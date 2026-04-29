import React from 'react';
import { useNavigate } from 'react-router-dom';
import OrbitIcon from '../../icons/OrbitIcon';

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: slowRotate 20s linear infinite;
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="p-2.5 bg-[#FFA900]/10 rounded-2xl border border-[#FFA900]/20 shadow-sm group-hover:bg-[#FFA900] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#FFA900]/40 overflow-hidden">
            <OrbitIcon className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors animate-orbit" />
          </div>
          <span className="text-3xl font-black tracking-tighter text-gray-900 group-hover:text-[#FFA900] transition-colors">astros.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="px-6 md:px-8 py-3 bg-[#FFA900] text-black text-sm font-black rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-xl hover:shadow-[#FFA900]/40 hover:-translate-y-1"
          >
            Acessar o MVP
          </button>
        </div>
      </div>
    </nav>
  );
}
