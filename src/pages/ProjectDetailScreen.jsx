import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, UserPlus, LogOut, Trash2, Power } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal';

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

  const isLeader = project.leader_id === currentUser?.user_id;

  return (
    <div className="max-w-4xl mx-auto px-6 pt-32 pb-40">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${project.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {project.is_active ? 'Projeto Ativo' : 'Projeto Inativo'}
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">{project.name}</h1>
            <p className="text-gray-600 font-medium leading-relaxed">{project.description}</p>
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
              <div key={role.role_id} className="p-6 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{role.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{role.description}</p>
                  <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">
                    {role.filled_quantity} / {role.quantity} preenchidas
                  </p>
                </div>
                
                <div className="flex gap-2">
                  {role.filled_quantity < role.quantity && (
                    <button 
                      onClick={() => handleAction(() => projectService.fillRole(token, project.project_id, role.role_id, currentUser.user_id), 'Você assumiu a vaga.')}
                      className="px-4 py-2 bg-[#FFA900] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-black transition-colors"
                    >
                      Assumir Vaga
                    </button>
                  )}
                  {/* Se o usuário atual está ocupando uma das vagas (precisaríamos saber os filled roles específicos por usuário para ser perfeito, mas vamos simplificar a UI) */}
                  <button 
                    onClick={() => handleAction(() => projectService.leaveRole(token, project.project_id, role.role_id, currentUser.user_id), 'Você deixou a vaga.')}
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Deixar Vaga
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-sm font-bold text-gray-400 italic">Este projeto não possui vagas definidas.</p>
            )}
          </div>
        </div>
      </div>
      
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
