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
        <div className="flex items-center gap-3 sm:gap-4 cursor-pointer group" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="p-2 sm:p-2.5 bg-[#FFA900]/10 rounded-2xl border border-[#FFA900]/20 shadow-sm group-hover:bg-[#FFA900] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#FFA900]/40 overflow-hidden shrink-0">
            <OrbitIcon className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors animate-orbit" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-gray-900 group-hover:text-[#FFA900] transition-colors leading-none">
              astros.
            </span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-gray-400 group-hover:text-gray-700 transition-colors mt-0.5 sm:mt-1 leading-none">
              Colaboração Interdisciplinar
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/mural')}
            className="px-4 md:px-5 py-2.5 text-sm font-black text-gray-800 hover:text-[#FFA900] transition-colors rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <span>Mural de Projetos</span>
            <span className="h-2 w-2 rounded-full bg-[#FFA900] animate-pulse"></span>
          </button>
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
