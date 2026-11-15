import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, UserPlus, LogOut, Trash2, Power, Users, 
  FileText, Settings, Edit3, Plus, Sparkles, Pencil 
} from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal';
import ProjectChatSection from '../components/ProjectChatSection';
import ProjectInvites from '../components/ProjectInvites';
import MarkdownViewer from '../components/MarkdownViewer';
import DocumentationEditor from '../components/DocumentationEditor';
import CreateProjectUpdateModal from '../components/CreateProjectUpdateModal';
import EditProjectInfoModal from '../components/EditProjectInfoModal';
import AddProjectRoleModal from '../components/AddProjectRoleModal';
import ProjectUpdatesTimeline from '../components/ProjectUpdatesTimeline';

const ProjectDetailScreen = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('panel'); // 'panel' ou 'docs'
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [isNewUpdateModalOpen, setIsNewUpdateModalOpen] = useState(false);
  const [isEditInfoModalOpen, setIsEditInfoModalOpen] = useState(false);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [isSavingDoc, setIsSavingDoc] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, type: 'success', title: '', message: '' });
  
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('tab') === 'docs') {
      setActiveTab('docs');
    }
  }, [searchParams]);

  useEffect(() => {
    loadProject();
    loadUpdates();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjectDetails(token, projectId);
      setProject(data);
      // Se tiver ?tab=docs na URL ou não for integrante, abre direto na documentação
      if (searchParams.get('tab') === 'docs' || !data.user_role) {
        setActiveTab('docs');
      }
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, type: 'error', title: 'Erro', message: 'Falha ao carregar detalhes do projeto.' });
    } finally {
      setLoading(false);
    }
  };

  const loadUpdates = async () => {
    try {
      const data = await projectService.getProjectUpdates(projectId);
      setUpdates(data);
    } catch (err) {
      console.error('Falha ao carregar atualizações:', err);
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
        loadUpdates();
      }
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, type: 'error', title: 'Erro', message: 'Ação falhou.' });
    }
  };

  // Salvar Escrita Absoluta (Documentação)
  const handleSaveDocumentation = async (newDocumentation) => {
    try {
      setIsSavingDoc(true);
      await projectService.updateDocumentation(token, projectId, newDocumentation);
      setProject(prev => ({ ...prev, documentation: newDocumentation }));
      setIsEditingDocs(false);
      setFeedback({ 
        open: true, 
        type: 'success', 
        title: 'Documentação Salva', 
        message: 'A documentação oficial do projeto foi atualizada com sucesso!' 
      });
    } catch (err) {
      console.error(err);
      setFeedback({ 
        open: true, 
        type: 'error', 
        title: 'Erro ao Salvar', 
        message: 'Não foi possível salvar a documentação. Tente novamente.' 
      });
    } finally {
      setIsSavingDoc(false);
    }
  };

  // Registrar Escrita Incremental (Novo Marco/Update)
  const handleCreateUpdate = async (updateData) => {
    try {
      setIsSubmittingUpdate(true);
      await projectService.addProjectUpdate(token, projectId, updateData);
      setIsNewUpdateModalOpen(false);
      await loadUpdates();
      setFeedback({ 
        open: true, 
        type: 'success', 
        title: 'Marco Registrado', 
        message: 'A atualização do projeto foi registrada com sucesso!' 
      });
    } catch (err) {
      console.error(err);
      setFeedback({ 
        open: true, 
        type: 'error', 
        title: 'Erro ao Registrar', 
        message: 'Não foi possível registrar o marco. Tente novamente.' 
      });
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  // Atualizar Nome e Descrição do Projeto (Líder)
  const handleUpdateProjectInfo = async (info) => {
    try {
      setIsSubmittingInfo(true);
      const updated = await projectService.updateProjectInfo(token, projectId, info);
      setProject(prev => ({
        ...prev,
        name: updated.name,
        description: updated.description
      }));
      setIsEditInfoModalOpen(false);
      setFeedback({
        open: true,
        type: 'success',
        title: 'Informações Atualizadas',
        message: 'O nome e a descrição do projeto foram alterados com sucesso!'
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao Atualizar',
        message: 'Não foi possível salvar as alterações do projeto. Tente novamente.'
      });
    } finally {
      setIsSubmittingInfo(false);
    }
  };

  // Adicionar Nova Vaga (Líder)
  const handleAddProjectRole = async (roleData) => {
    try {
      setIsSubmittingRole(true);
      await projectService.addProjectRole(token, projectId, roleData);
      setIsAddRoleModalOpen(false);
      await loadProject();
      await loadUpdates();
      setFeedback({
        open: true,
        type: 'success',
        title: 'Vaga Adicionada',
        message: 'A nova vaga foi aberta na equipe com sucesso!'
      });
    } catch (err) {
      console.error(err);
      setFeedback({
        open: true,
        type: 'error',
        title: 'Erro ao Adicionar Vaga',
        message: 'Não foi possível adicionar a vaga. Tente novamente.'
      });
    } finally {
      setIsSubmittingRole(false);
    }
  };

  // Remover Vaga Aberta (Líder)
  const handleDeleteRole = (roleId, roleName) => {
    handleAction(
      () => projectService.deleteProjectRole(token, projectId, roleId),
      `Vaga '${roleName}' removida com sucesso.`
    );
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
        <div className="w-10 h-10 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const isLeader = project.creator_id === currentUser?.user_id;
  const isMember = Boolean(project.user_role);

  const allTeamMembers = [
    { user_id: project.creator_id, name: project.creator_name || 'Líder', role: 'Líder' },
    ...(project.participants_info || [])
      .filter(p => p.user_id !== project.creator_id)
      .map(p => ({ ...p, role: 'Membro' }))
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-32 pb-40 animate-in fade-in duration-300">
      {/* Barra de Navegação Superior e Ações Globais */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold transition-colors group self-start"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Voltar
        </button>

        {/* Botão de Novo Marco disponível em ambas as telas para integrantes */}
        {isMember && (
          <button
            type="button"
            onClick={() => setIsNewUpdateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-black hover:text-white transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-95 border-2 border-gray-900"
          >
            <Plus className="h-4 w-4" /> Novo Marco / Atualização
          </button>
        )}
      </div>

      {/* Alternador de Abas Centralizado (Painel Interno vs. Documentação) */}
      {isMember && (
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-md">
            <button
              onClick={() => setActiveTab('panel')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === 'panel'
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Settings className="h-4 w-4" /> Painel da Equipe
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                activeTab === 'docs'
                  ? 'bg-[#FFA900] text-gray-950 shadow-md'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-4 w-4" /> Documentação Oficial
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          ABA 1: PAINEL INTERNO DA EQUIPE (Estilização Original Restaurada)
         ======================================================== */}
      {activeTab === 'panel' && isMember && (
        <div className="animate-in fade-in duration-200">
          <div className="flex flex-col lg:flex-row gap-6 mb-8 items-start">
            {/* Card Principal da Esquerda */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 flex-1 w-full min-w-0">
              <div className="flex justify-between items-start mb-8 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${
                      project.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {project.is_active ? 'Projeto Ativo' : 'Projeto Inativo'}
                    </span>
                    {project.area && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                        {project.area}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter break-words">{project.name}</h1>
                    {isLeader && (
                      <button 
                        type="button"
                        onClick={() => setIsEditInfoModalOpen(true)}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
                        title="Editar nome e descrição do projeto"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed break-words">{project.description}</p>
                </div>

                {isLeader && (
                  <div className="flex gap-2 shrink-0">
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
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 font-bold text-xs uppercase rounded-xl hover:bg-red-100 transition-colors shrink-0"
                  >
                    <LogOut className="h-4 w-4" /> Sair do Projeto
                  </button>
                )}
              </div>

              {/* Seção Vagas e Participantes */}
              <div className="mt-12">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-[#FFA900]" /> Vagas e Participantes
                  </h2>
                  {isLeader && (
                    <button
                      type="button"
                      onClick={() => setIsAddRoleModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:bg-black hover:text-white transition-all border-2 border-gray-900 hover:scale-[1.02] active:scale-95"
                    >
                      <Plus className="h-4 w-4" /> Nova Vaga
                    </button>
                  )}
                </div>
                
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
                      
                      <div className="flex items-center gap-2">
                        {!role.is_filled && (
                          <button 
                            onClick={() => handleAction(() => projectService.fillRole(token, project.project_id, role.id, currentUser?.user_id), 'Você assumiu a vaga.')}
                            className="px-4 py-2 bg-[#FFA900] text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md hover:bg-black transition-colors"
                          >
                            Assumir Vaga
                          </button>
                        )}
                        {role.is_filled && role.maker_user_id === currentUser?.user_id && (
                          <button 
                            onClick={() => handleAction(() => projectService.leaveRole(token, project.project_id, role.id, currentUser?.user_id), 'Você deixou a vaga.')}
                            className="px-4 py-2 bg-white border border-gray-200 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            Deixar Vaga
                          </button>
                        )}
                        {isLeader && !role.is_filled && role.name.toLowerCase() !== 'lider' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRole(role.id, role.name)}
                            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100"
                            title={`Remover vaga '${role.name}'`}
                          >
                            <Trash2 className="h-4 w-4" />
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

            {/* Card Lateral da Direita (Equipe) */}
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
          
          {/* Seções de Convites e Chat Interno */}
          {project.user_role && (
            <div className="mb-12 space-y-8">
              <ProjectInvites project={project} />
              <ProjectChatSection project={project} />
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          ABA 2: DOCUMENTAÇÃO OFICIAL (Somente Escrita Absoluta) & LINHA DO TEMPO (Opção C)
         ======================================================== */}
      {activeTab === 'docs' && (
        <div className="animate-in fade-in duration-200 space-y-8">
          {isEditingDocs ? (
            <DocumentationEditor
              initialValue={project.documentation || project.description}
              onSave={handleSaveDocumentation}
              onCancel={() => setIsEditingDocs(false)}
              isSaving={isSavingDoc}
            />
          ) : (
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFA900] text-black font-black text-[10px] uppercase tracking-wider">
                      Escrita Absoluta
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      • {project.name}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <FileText className="h-6 w-6 text-[#FFA900]" /> Documentação Oficial do Projeto
                  </h2>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    Visão geral, objetivos, arquitetura técnica e materiais de divulgação consolidados da iniciativa.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-auto">
                  {isMember && (
                    <button
                      type="button"
                      onClick={() => setIsEditingDocs(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-[#FFA900] hover:text-black transition-all hover:scale-[1.02] active:scale-95 border-2 border-gray-900 group"
                      title="Entrar no Modo Edição da Documentação"
                    >
                      <Pencil className="h-4 w-4 text-[#FFA900] group-hover:text-black transition-colors" /> Modo Edição
                    </button>
                  )}
                </div>
              </div>

              {/* Corpo Exclusivo da Escrita Absoluta Renderizado em Markdown Rico */}
              <div className="bg-gray-50/50 p-6 md:p-10 rounded-2xl border border-gray-100">
                <MarkdownViewer content={project.documentation || project.description} />
              </div>
            </div>
          )}

          {/* Histórico e Linha do Tempo de Marcos (Opção C) */}
          <ProjectUpdatesTimeline
            updates={updates}
            isMember={isMember}
            onOpenNewUpdateModal={() => setIsNewUpdateModalOpen(true)}
          />
        </div>
      )}

      {/* Modal de Escrita Incremental (Novo Marco / Atualização) */}
      <CreateProjectUpdateModal
        isOpen={isNewUpdateModalOpen}
        onClose={() => setIsNewUpdateModalOpen(false)}
        onSubmit={handleCreateUpdate}
        isSubmitting={isSubmittingUpdate}
      />

      {/* Modal de Edição de Informações do Projeto */}
      <EditProjectInfoModal
        isOpen={isEditInfoModalOpen}
        onClose={() => setIsEditInfoModalOpen(false)}
        initialName={project.name}
        initialDescription={project.description}
        onSubmit={handleUpdateProjectInfo}
        isSubmitting={isSubmittingInfo}
      />

      {/* Modal de Abertura de Vaga */}
      <AddProjectRoleModal
        isOpen={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        onSubmit={handleAddProjectRole}
        isSubmitting={isSubmittingRole}
      />

      {/* Modal de Feedback */}
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
