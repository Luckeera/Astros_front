import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, LogOut, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrbitIcon from '../icons/OrbitIcon';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: slowRotate 20s linear infinite;
        }
      `}</style>
      <div className="max-w-5xl mx-auto px-4 flex justify-between h-24 items-center">
        <Link 
          to="/" 
          className="flex items-center gap-4 cursor-pointer group"
        >
          <div className="p-2.5 bg-orange-50/50 rounded-2xl border border-orange-100 shadow-sm group-hover:bg-[#FFA900] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-orange-200/50 overflow-hidden">
            <OrbitIcon className="h-10 w-10 text-[#FFA900] group-hover:text-white transition-colors animate-orbit" />
          </div>
          <span className="text-4xl font-black text-gray-900 tracking-tighter group-hover:text-[#FFA900] transition-colors">astros</span>
        </Link>

        <div className="hidden md:flex flex-1 justify-center px-10">
          <div className="w-full max-w-sm relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Pesquisar projetos ou mentes..." 
              className="w-full pl-12 pr-6 py-3 bg-gray-100/50 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#FFA900]/20 transition-all outline-none border border-transparent focus:border-[#FFA900] font-medium" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all bg-white shadow-sm"
          >
            <div className="h-9 w-9 rounded-lg bg-[#FFA900] flex items-center justify-center text-white font-black shadow-md shadow-[#FFA900]/20">
              {user?.name?.[0] || 'U'}
            </div>
            <span className="text-sm font-bold text-gray-800 hidden sm:block">{user?.name?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-14 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden">
              <button 
                onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                className="w-full px-5 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-4 transition-colors"
              >
                <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><User className="h-4 w-4" /></div> Meu Perfil
              </button>
              <button 
                onClick={() => { navigate('/projects'); setIsMenuOpen(false); }}
                className="w-full px-5 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-4 transition-colors"
              >
                <div className="p-2 bg-[#FFA900]/10 rounded-lg text-[#FFA900]"><Briefcase className="h-4 w-4" /></div> Meus Projetos
              </button>
              <div className="h-px bg-gray-100 my-2 mx-4" />
              <button 
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="w-full px-5 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-4 transition-colors"
              >
                <div className="p-2 bg-red-50 rounded-lg text-red-500"><LogOut className="h-4 w-4" /></div> Sair da conta
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
