import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus, LogOut, Trash2, Power, Users } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal';
import ProjectChatSection from '../components/ProjectChatSection';
import ProjectInvites from '../components/ProjectInvites';

const ProjectDetailScreen = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ open: false, type: 'success', title: '', message: '' });
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjectDetails(token, projectId);
      setProject(data);
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, type: 'error', title: 'Erro', message: 'Falha ao carregar detalhes do projeto.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn, successMsg) => {
    try {
      await actionFn();
      setFeedback({ open: true, type: 'success', title: 'Sucesso', message: successMsg });
      if (successMsg.includes('excluído') || successMsg.includes('saiu')) {
        setTimeout(() => navigate('/projects'), 1500);
      } else {
        loadProject();
      }
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, type: 'error', title: 'Erro', message: 'Ação falhou.' });
    }
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const isLeader = project.creator_id === currentUser?.user_id;

  const allTeamMembers = [
    { user_id: project.creator_id, name: project.creator_name || 'Líder', role: 'Líder' },
    ...(project.participants_info || [])
      .filter(p => p.user_id !== project.creator_id)
      .map(p => ({ ...p, role: 'Membro' }))
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-40">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex-1 w-full min-w-0">
        <div className="flex justify-between items-start mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${project.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {project.is_active ? 'Projeto Ativo' : 'Projeto Inativo'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 break-words">{project.name}</h1>
            <p className="text-gray-600 font-medium leading-relaxed break-words">{project.description}</p>
          </div>

          {isLeader && (
            <div className="flex gap-2">
              <button 
                onClick={() => handleAction(() => projectService.toggleState(token, project.project_id), 'Estado alterado.')}
                className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
                title={project.is_active ? "Desativar Projeto" : "Ativar Projeto"}
              >
                <Power className="h-5 w-5" />
              </button>
              <button 
                onClick={() => handleAction(() => projectService.deleteProject(token, project.project_id), 'Projeto excluído.')}
                className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                title="Excluir Projeto"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          )}
          {!isLeader && (
            <button 
              onClick={() => handleAction(() => projectService.leaveProject(token, project.project_id, currentUser.user_id), 'Você saiu do projeto.')}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 font-bold text-xs uppercase rounded-xl hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sair do Projeto
            </button>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#FFA900]" /> Vagas e Participantes
          </h2>
          
          <div className="space-y-4">
            {project.roles && project.roles.length > 0 ? project.roles.map((role) => (
              <div key={role.id} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{role.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{role.explanation}</p>
                  <p className="text-[10px] font-bold mt-2 uppercase">
                    {role.is_filled ? (
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded">
                        Preenchida por {role.maker_user_name || "Usuário"}
                      </span>
                    ) : (
                      <span className="text-amber-500 bg-amber-50 px-2 py-1 rounded">
                        Vaga Aberta
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {!role.is_filled && (
                    <button 
                      onClick={() => handleAction(() => projectService.fillRole(token, project.project_id, role.id, currentUser.user_id), 'Você assumiu a vaga.')}
                      className="px-4 py-2 bg-[#FFA900] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-black transition-colors"
                    >
                      Assumir Vaga
                    </button>
                  )}
                  {role.is_filled && role.maker_user_id === currentUser?.user_id && (
                    <button 
                      onClick={() => handleAction(() => projectService.leaveRole(token, project.project_id, role.id, currentUser.user_id), 'Você deixou a vaga.')}
                      className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      Deixar Vaga
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <p className="text-sm font-bold text-gray-400 italic">Este projeto não possui vagas definidas.</p>
            )}
          </div>
        </div>
        </div>

        {allTeamMembers.length > 0 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 w-full lg:w-72 shrink-0 h-fit sticky top-24">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.1em] mb-6 flex items-center gap-2">
              <Users className="h-5 w-5 text-[#FFA900]" /> Equipe
            </h3>
            <div className="flex flex-col gap-4">
              {allTeamMembers.map(p => (
                <div key={p.user_id} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] shadow-sm hover:shadow-md">
                  <div className="h-10 w-10 bg-[#FFA900] text-white shadow-lg shadow-[#FFA900]/20 font-black text-lg flex items-center justify-center rounded-xl shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-black text-gray-900 block truncate">{p.name}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block truncate">{p.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {project.user_role && (
        <div className="mb-12">
          <ProjectInvites project={project} />
          <ProjectChatSection project={project} />
        </div>
      )}
      
      <FeedbackModal  
        isOpen={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={closeFeedback}
      />
    </div>
  );
};

export default ProjectDetailScreen;
