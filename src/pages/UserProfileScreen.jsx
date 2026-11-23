import React, { useState, useEffect } from 'react';
import { BookOpen, MapPin, Sparkles, Building2, FolderGit2, ArrowRight, MessageSquare, Target } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, projectService, messageService } from '../services/api';
import OrbitIcon from '../icons/OrbitIcon';

const UserProfileScreen = () => {
  const { userId } = useParams();
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile(token, userId);
        setProfileUser(data);
      } catch (err) {
        console.error("Erro ao buscar perfil do usuário", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const data = await projectService.getUserProjects(token, userId);
        setProjects(data || []);
      } catch (err) {
        console.error("Erro ao buscar projetos do usuário", err);
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    if (userId) {
      fetchProfile();
      fetchProjects();
    }
  }, [userId, token]);

  const handleSendDM = async () => {
    try {
      if (!profileUser || profileUser.user_id === currentUser?.user_id) return;
      const res = await messageService.createDM(token, currentUser.user_id, profileUser.user_id);
      window.dispatchEvent(new CustomEvent('open-chat', {
        detail: {
          chatId: res.chat_id,
          userId: profileUser.user_id,
          userName: profileUser.name
        }
      }));
    } catch (err) {
      console.error("Erro ao iniciar DM", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center mt-20 font-black text-gray-500 uppercase tracking-widest text-sm">
        Usuário não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-0">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-12 shadow-2xl shadow-gray-200/50 ring-1 ring-black/5">
        <div className="h-56 bg-gradient-to-br from-[#FFA900] to-[#FF8C00] relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="px-6 sm:px-12 pb-14 relative">
          <div className="h-36 w-32 rounded-2xl border-[10px] border-white bg-gray-900 -mt-18 mb-10 shadow-2xl flex items-center justify-center text-white text-7xl font-black rotate-3 hover:rotate-0 transition-all duration-500 group cursor-help animate-in zoom-in-50">
            <span className="group-hover:scale-110 transition-transform">{profileUser.name?.[0] || '?'}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3 leading-none">{profileUser.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-5 py-2 bg-[#FFA900] text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-orange-100">
                  {profileUser.course?.area || 'Acadêmico'}
                </span>
                {(profileUser.macro_areas?.length > 0
                  ? profileUser.macro_areas
                  : [profileUser.macro_area, profileUser.secondary_macro_area].filter(Boolean)
                ).map((m, idx) => (
                  <span key={m.macro_area_id || idx} className="px-4 py-2 bg-gray-900 text-[#FFA900] text-[10px] font-black rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <Target className="h-3.5 w-3.5 text-[#FFA900]" />
                    {m.name}
                  </span>
                ))}
                <span className="text-gray-400 font-black text-[11px] tracking-widest uppercase border-l border-gray-200 pl-4">MATRÍCULA #{profileUser.user_id}</span>
              </div>
            </div>
            
            {profileUser.user_id !== currentUser?.user_id && (
              <button 
                onClick={handleSendDM}
                className="w-full sm:w-auto px-8 py-5 bg-gray-900 text-white border-2 border-gray-900 rounded-2xl text-[11px] font-black hover:bg-[#FFA900] hover:text-black hover:border-[#FFA900] transition-all shadow-xl uppercase tracking-[0.2em] active:scale-95 flex items-center gap-3 justify-center"
              >
                <MessageSquare className="h-5 w-5" /> Iniciar Conversa
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-5 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm flex flex-col justify-between min-w-0">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest truncate">Habilidade Prática</span>
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-50 shrink-0 text-[#FFA900]">
                  <Target className="h-5 w-5" />
                </div>
                <span 
                  className="text-sm sm:text-base font-black text-gray-800 leading-snug break-words min-w-0 flex-1"
                  title={(profileUser.macro_areas?.length > 0 ? profileUser.macro_areas : [profileUser.macro_area, profileUser.secondary_macro_area].filter(Boolean)).map(m => m.name).join(' • ') || "Não informada"}
                >
                  {(profileUser.macro_areas?.length > 0 ? profileUser.macro_areas : [profileUser.macro_area, profileUser.secondary_macro_area].filter(Boolean)).map(m => m.name).join(' • ') || "Não informada"}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm flex flex-col justify-between min-w-0">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest truncate">Graduação</span>
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-50 shrink-0 text-[#FFA900]">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span 
                  className="text-sm sm:text-base font-black text-gray-800 leading-snug break-words min-w-0 flex-1"
                  title={profileUser.course?.name || "Não informado"}
                >
                  {profileUser.course?.name || "Não informado"}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm flex flex-col justify-between min-w-0">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest truncate">Instituição</span>
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-50 shrink-0 text-[#FFA900]">
                  <Building2 className="h-5 w-5" />
                </div>
                <span 
                  className="text-sm sm:text-base font-black text-gray-800 leading-snug break-words min-w-0 flex-1"
                  title={profileUser.college?.name || "Não informada"}
                >
                  {profileUser.college?.name || "Não informada"}
                </span>
              </div>
            </div>

            <div className="p-5 sm:p-6 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm flex flex-col justify-between min-w-0">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest truncate">Jornada</span>
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className="p-3 bg-white rounded-xl shadow-md border border-gray-50 shrink-0 text-[#FFA900]">
                  <MapPin className="h-5 w-5" />
                </div>
                <span 
                  className="text-sm sm:text-base font-black text-gray-800 leading-snug break-words min-w-0 flex-1"
                  title={`${profileUser.period}º Período`}
                >
                  {profileUser.period}º Período
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8 px-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-[#FFA900] rounded-xl text-white shadow-xl shadow-orange-100">
              <Sparkles className="h-5 w-5" />
            </div> 
            Projetos Recentes ({projects.length})
          </h3>
        </div>

        {loadingProjects ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-lg">
            <div className="w-8 h-8 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Carregando projetos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xl shadow-gray-200/40 ring-1 ring-black/5">
            <div className="h-16 w-16 bg-amber-50 rounded-2xl mx-auto flex items-center justify-center text-[#FFA900] mb-4 border border-amber-100">
              <FolderGit2 className="h-8 w-8" />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">Nenhum projeto encontrado</h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Este estudante ainda não possui projetos ativos ou finalizados vinculados ao seu perfil.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pt-4 pb-8 scrollbar-hide -mx-4 px-6 sm:mx-0 sm:px-0">
            {projects.map(project => (
              <div 
                key={project.project_id}
                onClick={() => navigate(`/projects/${project.project_id}`)}
                className="min-w-[320px] max-w-[360px] bg-white p-8 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all group hover:-translate-y-2 ring-1 ring-black/5 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`inline-block px-4 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-widest border ${
                      project.user_role === 'Lider' 
                        ? 'bg-[#FFA900]/10 text-amber-700 border-[#FFA900]/30' 
                        : 'bg-gray-50 text-gray-500 border-gray-100'
                    }`}>
                      {project.user_role === 'Lider' ? 'Líder' : 'Participante'}
                    </span>
                    <span 
                      className={`h-2.5 w-2.5 rounded-full ${project.is_active ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-gray-300'}`} 
                      title={project.is_active ? 'Projeto Ativo' : 'Projeto Inativo'} 
                    />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-3 tracking-tighter leading-tight group-hover:text-[#FFA900] transition-colors line-clamp-2">
                    {project.name}
                  </h4>
                  <p className="text-gray-400 text-sm font-medium leading-[1.6] mb-6 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[#FFA900] group-hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-2">
                    <OrbitIcon className="h-4 w-4 animate-[slowRotate_20s_linear_infinite]" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ver Projeto</span>
                  </div>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfileScreen;
