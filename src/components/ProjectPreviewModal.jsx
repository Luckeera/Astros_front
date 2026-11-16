import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  BookOpen, 
  Star, 
  MessageSquarePlus,
  Clock,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectPreviewModal({ 
  project, 
  isOpen, 
  onClose,
  onToggleInterest,
  onStartProject,
  isInterested = false,
  isInterviewMode = false,
  isAdopted = false
}) {
  const auth = useAuth ? useAuth() : null;
  const user = auth?.user || null;
  const navigate = useNavigate();
  const [localInterested, setLocalInterested] = useState(isInterested);

  useEffect(() => {
    setLocalInterested(isInterested);
  }, [isInterested]);

  if (!isOpen || !project) return null;

  const isMock = Boolean(project.is_mock);
  const openRoles = project.roles?.filter(r => !r.is_filled) || [];
  const filledRoles = isMock ? [] : (project.roles?.filter(r => r.is_filled) || []);

  const handleInterestClick = () => {
    const nextState = !localInterested;
    setLocalInterested(nextState);
    if (onToggleInterest) {
      onToggleInterest(project.project_id, nextState);
    }
  };

  const handleGoToDetails = () => {
    onClose();
    navigate(`/projects/${project.project_id}`);
  };

  const handleCollaborate = () => {
    if (isInterviewMode) {
      handleInterestClick();
      return;
    }
    onClose();
    if (!user) {
      navigate('/login', { state: { message: 'Faça login para colaborar com este projeto!' } });
      return;
    }
    navigate(`/projects/${project.project_id}`);
  };

  const handleStartIdea = () => {
    onClose();
    if (!user && !isInterviewMode) {
      navigate('/login', { 
        state: { 
          message: 'Faça login para liderar e tirar esta ideia do papel!' 
        } 
      });
      return;
    }
    if (onStartProject) {
      onStartProject(project);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-2 border-gray-900 overflow-hidden my-8 z-10 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="relative p-6 sm:p-8 border-b-2 border-gray-100 bg-[#FAF9F6]">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-4 pr-12">
            {(project.areas || [project.area]).map((area, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-gray-900 text-white"
              >
                {area}
              </span>
            ))}

            {isMock ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-950 rounded-xl text-xs font-black border border-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" />
                Ideia Sugerida
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-black border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Projeto Ativo no Astros
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-3">
            {project.name}
          </h2>

          {isMock ? (
            <div className="flex items-center gap-3 text-sm text-gray-700 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200">
              <div className="h-9 w-9 rounded-xl bg-[#FFA900] text-black font-black flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="font-black text-gray-900">Proposta Aberta • Sem participantes ainda</p>
                <p className="text-xs text-gray-600 font-medium">Esta ideia é uma proposta livre aguardando liderança. Ao copiar e iniciar, você se torna o líder deste projeto no Mural e pode montar seu squad.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="h-9 w-9 rounded-xl bg-[#FFA900] text-black font-black flex items-center justify-center text-xs shadow-sm flex-shrink-0">
                {project.creator_name?.[0] || 'A'}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {project.creator_name}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {project.creator_course} {project.creator_college && `• ${project.creator_college}`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-700">
          
          {/* Mini Descrição / Slogan */}
          {project.summary && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border-l-4 border-[#FFA900] text-gray-800 font-semibold leading-relaxed">
              "{project.summary}"
            </div>
          )}

          {/* O Desafio e Proposta */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              {isMock ? 'Proposta de Desafio' : 'Visão Geral do Projeto'}
            </h4>
            <p className="text-gray-600 font-medium leading-relaxed text-sm sm:text-base">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Áreas & Competências</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <span 
                    key={idx}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Vagas em Aberto */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-[#FFA900]" />
                {isMock ? 'Competências & Vagas Sugeridas' : 'Composição do Time & Vagas'}
              </h4>
              <span className="text-xs font-bold text-gray-500">
                {isMock 
                  ? `${openRoles.length} vaga(s) sugerida(s)` 
                  : `${openRoles.length} aberta(s)${filledRoles.length > 0 ? ` • ${filledRoles.length} preenchida(s)` : ''}`}
              </span>
            </div>

            <div className="space-y-3">
              {openRoles.map((role) => (
                <div 
                  key={role.id || role.name}
                  className="p-4 rounded-2xl border-2 border-[#FFA900]/30 bg-amber-50/30 hover:bg-amber-50/60 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-[#FFA900]" />
                      <h5 className="font-black text-gray-900 text-sm">{role.name}</h5>
                    </div>
                    <span className="px-2.5 py-0.5 bg-[#FFA900] text-black font-black text-[10px] uppercase tracking-wider rounded-lg shadow-sm">
                      {isMock ? 'Vaga Sugerida' : 'Vaga Aberta'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium pl-4">
                    {role.explanation}
                  </p>
                </div>
              ))}

              {!isMock && filledRoles.map((role) => (
                <div 
                  key={role.id}
                  className="p-3.5 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-gray-800 text-xs">{role.name}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{role.maker_user_name || 'Integrante confirmado'}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Preenchido
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Última Atualização / Changelog preview */}
          {project.last_update && (
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Último avanço registrado</span>
                <p className="text-xs text-gray-700 font-medium mt-0.5">
                  "{project.last_update}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer com Ações Diferenciadas */}
        <div className="p-5 sm:p-6 bg-white border-t-2 border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Botão de Interesse (para ambos) */}
          <button
            onClick={handleInterestClick}
            className={`w-full sm:w-auto px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              localInterested 
                ? 'bg-amber-100 text-amber-900 border-2 border-amber-300 shadow-sm' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Star className={`h-4 w-4 ${localInterested ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
            {localInterested ? 'Interesse Registrado ⭐' : 'Achei Interessante'}
          </button>

          {isMock ? (
            /* Ação para Mocks de Ideias: Convidar o usuário a começar/liderar o projeto */
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleStartIdea}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isInterviewMode && isAdopted
                    ? 'bg-emerald-600 text-white hover:bg-red-600 shadow-lg shadow-emerald-600/20'
                    : 'text-black bg-[#FFA900] hover:bg-gray-900 hover:text-white shadow-lg shadow-[#FFA900]/30 hover:shadow-xl'
                }`}
              >
                {isInterviewMode ? (
                  isAdopted ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Ideia Adotada ✓ (Remover)
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Quero Adotar Esta Ideia 🚀
                    </>
                  )
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    {user ? 'Copiar & Iniciar Projeto 🚀' : 'Cadastre-se para Iniciar 🚀'}
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Ações para Projetos Reais do Banco de Dados */
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isInterviewMode && (
                <button
                  onClick={handleGoToDetails}
                  className="flex-1 sm:flex-none px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-[#FFA900]" />
                  Ver Detalhes
                </button>
              )}

              <button
                onClick={handleCollaborate}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isInterviewMode && localInterested
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                    : 'text-black bg-[#FFA900] hover:bg-gray-900 hover:text-white shadow-lg shadow-[#FFA900]/30 hover:shadow-xl'
                }`}
              >
                {isInterviewMode ? (
                  localInterested ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Interesse Selecionado!
                    </>
                  ) : (
                    <>
                      <Star className="h-4 w-4" />
                      Quero Colaborar ⭐
                    </>
                  )
                ) : (
                  <>
                    <MessageSquarePlus className="h-4 w-4" />
                    {user ? 'Quero Colaborar' : 'Entrar para Colaborar'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
