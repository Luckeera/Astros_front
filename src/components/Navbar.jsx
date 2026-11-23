import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, LogOut, Briefcase, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrbitIcon from '../icons/OrbitIcon';

const Navbar = ({ showMural = true }) => {
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
          to={user ? "/feed" : "/"} 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer group"
        >
          <div className="p-2 sm:p-2.5 bg-[#FFA900]/10 rounded-2xl border border-[#FFA900]/20 shadow-sm group-hover:bg-[#FFA900] transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#FFA900]/40 overflow-hidden shrink-0">
            <OrbitIcon className="h-8 w-8 sm:h-10 sm:w-10 text-[#FFA900] group-hover:text-black transition-colors animate-orbit" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tighter group-hover:text-[#FFA900] transition-colors leading-none">
              astros.
            </span>
            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-wider text-gray-400 group-hover:text-gray-700 transition-colors mt-0.5 sm:mt-1 leading-none">
              Colaboração Interdisciplinar
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 relative" ref={menuRef}>
          {showMural && (
            <Link
              to="/mural"
              className="px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-gray-700 hover:text-black hover:bg-gray-100 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="h-4 w-4 text-[#FFA900]" />
              <span className="hidden sm:inline">Mural</span>
            </Link>
          )}
          {user ? (
            <>
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
                    onClick={() => { navigate('/mural'); setIsMenuOpen(false); }}
                    className="w-full px-5 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-4 transition-colors"
                  >
                    <div className="p-2 bg-amber-50 rounded-lg text-[#FFA900]"><Sparkles className="h-4 w-4" /></div> Mural de Projetos
                  </button>
                  <button 
                    onClick={() => { navigate('/projects'); setIsMenuOpen(false); }}
                    className="w-full px-5 py-3 text-left text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-4 transition-colors"
                  >
                    <div className="p-2 bg-[#FFA900]/10 rounded-lg text-[#FFA900]"><Briefcase className="h-4 w-4" /></div> Meus Projetos
                  </button>
                  <div className="h-px bg-gray-100 my-2 mx-4" />
                  <button 
                    onClick={() => { 
                      logout(); 
                      setIsMenuOpen(false); 
                      navigate('/');
                    }}
                    className="w-full px-5 py-3 text-left text-sm font-bold text-red-500 hover:bg-red-50 flex items-center gap-4 transition-colors"
                  >
                    <div className="p-2 bg-red-50 rounded-lg text-red-500"><LogOut className="h-4 w-4" /></div> Sair da conta
                  </button>
                </div>
              )}
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-gray-900 text-white hover:bg-[#FFA900] hover:text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              Entrar / Cadastrar
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;