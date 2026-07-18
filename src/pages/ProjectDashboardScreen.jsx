import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Plus, ChevronRight, User } from 'lucide-react';

const ProjectDashboardScreen = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, [token, currentUser]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getUserProjects(token, currentUser.user_id);
      setProjects(data);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-40">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-4">Projetos</h1>
          <p className="text-gray-500 font-bold max-w-xl">Gerencie seus projetos acadêmicos e acompanhe suas colaborações.</p>
        </div>
        <button 
          onClick={() => navigate('/projects/create')}
          className="bg-gray-900 text-white font-black px-6 py-4 rounded-2xl shadow-xl shadow-gray-200 uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#FFA900] transition-colors"
        >
          <Plus className="h-5 w-5" />
          Novo Projeto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="w-10 h-10 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid gap-6">
          {projects.map((proj) => {
            const isLeader = proj.creator_id === currentUser.user_id;
            return (
              <div 
                key={proj.project_id} 
                onClick={() => navigate(`/projects/${proj.project_id}`)}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4 flex-1 overflow-hidden pr-4">
                    <div className="h-14 w-14 flex-shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center text-[#FFA900] group-hover:bg-[#FFA900] group-hover:text-white transition-colors">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-gray-900 truncate" title={proj.name}>{proj.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${proj.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {proj.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                          {isLeader ? 'Líder' : 'Participante'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-6 w-6 text-gray-300 group-hover:text-[#FFA900] transition-colors" />
                </div>
                <p className="text-gray-500 font-medium text-sm line-clamp-2">{proj.description}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center shadow-sm">
          <Briefcase className="h-16 w-16 text-gray-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-gray-900 mb-2">Nenhum projeto encontrado</h3>
          <p className="text-gray-500 font-medium">Você ainda não está participando de nenhum projeto.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectDashboardScreen;
