import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Search, 
  Briefcase,
  Code2,
  Palette,
  Binary,
  TrendingUp,
  Target,
  Video,
  Cpu,
  HeartPulse,
  Scale,
  GraduationCap,
  Users,
  Sprout
} from 'lucide-react';
import OrbitIcon from '../icons/OrbitIcon';
import { useAuth } from '../context/AuthContext';
import { postService, projectService, macroAreaService } from '../services/api';
import { OFFICIAL_MACRO_AREAS } from '../services/macroAreasData';
import { useNavigate } from 'react-router-dom';

const ICON_MAP = {
  Code2,
  Palette,
  Binary,
  TrendingUp,
  Target,
  Video,
  Cpu,
  HeartPulse,
  Scale,
  GraduationCap,
  Users,
  Sprout,
  Sparkles
};

export default function CreatePostModal({
  isOpen,
  onClose,
  onPostCreated
}) {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [availableMacroAreas, setAvailableMacroAreas] = useState(OFFICIAL_MACRO_AREAS);
  const [selectedMacroAreaIds, setSelectedMacroAreaIds] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [macroSearch, setMacroSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Carrega macro áreas e projetos do usuário ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setMacroSearch('');

    const fetchMacroAreas = async () => {
      try {
        const data = await macroAreaService.getMacroAreas();
        if (Array.isArray(data) && data.length > 0) {
          setAvailableMacroAreas(data);
        } else {
          setAvailableMacroAreas(OFFICIAL_MACRO_AREAS);
        }
      } catch (err) {
        console.error('Erro ao carregar macro áreas:', err);
        setAvailableMacroAreas(OFFICIAL_MACRO_AREAS);
      }
    };

    const fetchProjects = async () => {
      if (!user || !token) return;
      try {
        const data = await projectService.getUserProjects(token, user.user_id);
        const list = Array.isArray(data) ? data : (data?.projects || []);
        setUserProjects(list);
      } catch (err) {
        console.error('Erro ao carregar projetos do usuário:', err);
      }
    };

    fetchMacroAreas();
    fetchProjects();
  }, [isOpen, token, user?.user_id]);

  // Fechar com a tecla ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const toggleMacroArea = (macroAreaId) => {
    setSelectedMacroAreaIds(prev =>
      prev.includes(macroAreaId)
        ? prev.filter(id => id !== macroAreaId)
        : [...prev, macroAreaId]
    );
  };

  // Filtragem de Macro Áreas por busca
  const filteredMacroAreas = useMemo(() => {
    if (!macroSearch.trim()) return availableMacroAreas;
    const term = macroSearch.toLowerCase().trim();
    return availableMacroAreas.filter(m =>
      m.name.toLowerCase().includes(term) ||
      (m.description && m.description.toLowerCase().includes(term))
    );
  }, [availableMacroAreas, macroSearch]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!user) {
      navigate('/login', { state: { message: 'Faça login para criar uma publicação!' } });
      return;
    }

    if (!title.trim() || title.length < 2) {
      setError('O título da publicação deve ter no mínimo 2 caracteres.');
      return;
    }
    if (title.length > 150) {
      setError('O título da publicação deve ter no máximo 150 caracteres.');
      return;
    }

    if (!content.trim() || content.length < 2) {
      setError('O conteúdo da publicação deve ter no mínimo 2 caracteres.');
      return;
    }
    if (content.length > 5000) {
      setError('O conteúdo da publicação deve ter no máximo 5000 caracteres.');
      return;
    }

    if (isCollaborative && !selectedProjectId) {
      setError('Para colaboração acadêmica, selecione um dos seus projetos para vincular.');
      return;
    }

    setIsSubmitting(true);
    try {
      let created;
      if (isCollaborative) {
        created = await postService.createCollabPost(token, selectedProjectId, {
          title: title.trim(),
          content: content.trim(),
          target_macro_areas: selectedMacroAreaIds
        });
      } else {
        created = await postService.createPost(token, {
          title: title.trim(),
          content: content.trim(),
          is_collaborative: false,
          project_id: selectedProjectId ? Number(selectedProjectId) : null,
          target_macro_areas: selectedMacroAreaIds
        });
      }

      // Notifica componentes ouvintes (ex: Feed) para recarregar posts
      window.dispatchEvent(new CustomEvent('post-created', { detail: created }));

      if (onPostCreated) {
        onPostCreated(created);
      }

      // Reseta e fecha modal
      setTitle('');
      setContent('');
      setIsCollaborative(false);
      setSelectedMacroAreaIds([]);
      setSelectedProjectId('');
      onClose();
    } catch (err) {
      console.error('Erro ao criar post:', err);
      setError(err.message || 'Falha ao criar o post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Clique no backdrop para fechar */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal responsivo com visual arrojado */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header do Modal */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFA900]/20 text-gray-900 border border-[#FFA900] rounded-lg text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" />
              Nova Publicação Acadêmica
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Publicar no Feed
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Compartilhe ideias, pesquisas ou pitches direcionados por competências práticas.
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Formulário / Corpo */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form id="create-post-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Título do Post */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Título da Publicação *
                </label>
                <span className={`text-[10px] font-bold ${title.length > 150 ? 'text-red-500' : 'text-gray-400'}`}>
                  {title.length}/150
                </span>
              </div>
              <input
                type="text"
                placeholder="Ex: Desenvolvendo sistema de visão computacional para drones..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={150}
                required
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl font-bold text-gray-900 text-sm focus:bg-white focus:border-[#FFA900] outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            {/* Conteúdo / Pitch */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Descrição detalhada *
                </label>
                <span className={`text-[10px] font-bold ${content.length > 5000 ? 'text-red-500' : 'text-gray-400'}`}>
                  {content.length}/5000
                </span>
              </div>
              <textarea
                placeholder="Descreva sua ideia, objetivo, o que já foi feito e o que você precisa..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                maxLength={5000}
                required
                className="w-full px-4 py-3 bg-gray-50/70 border border-gray-200 rounded-2xl font-medium text-gray-800 text-sm focus:bg-white focus:border-[#FFA900] outline-none transition-all placeholder:text-gray-400 resize-y"
              />
            </div>

            {/* Vínculo de Projeto */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/70 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#FFA900]" />
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Vincular a um Projeto (Opcional)
                </label>
              </div>

              {userProjects.length > 0 ? (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-900 text-xs outline-none focus:border-[#FFA900] transition-colors"
                >
                  <option value="">Nenhum projeto vinculado</option>
                  {userProjects.map(p => (
                    <option key={p.project_id} value={p.project_id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-gray-500 font-medium pt-1">
                  Você ainda não possui projetos para vincular.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/projects?create=true');
                    }}
                    className="font-black text-[#FFA900] hover:underline"
                  >
                    Criar um projeto
                  </button>
                </div>
              )}
            </div>

            {/* Toggle de Colaboração Acadêmica */}
            <div className="space-y-3 pt-1">
              <div
                onClick={() => setIsCollaborative(!isCollaborative)}
                className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                  isCollaborative
                    ? 'bg-[#FFA900]/10 border-[#FFA900] shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`p-3 rounded-xl transition-all ${
                    isCollaborative ? 'bg-[#FFA900] text-black shadow-md shadow-[#FFA900]/30' : 'bg-white text-gray-400 border border-gray-200'
                  }`}>
                    <OrbitIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="block text-sm font-black text-gray-900">Colaboração Acadêmica</span>
                    <span className="text-[11px] text-gray-500 font-medium">Pitch de projeto para busca ativa por colaboradores</span>
                  </div>
                </div>

                <div className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 ease-in-out flex items-center ${
                  isCollaborative ? 'bg-[#FFA900] justify-end' : 'bg-gray-300 justify-start'
                }`}>
                  <div className="h-5 w-5 rounded-full bg-white shadow-md transform transition-transform" />
                </div>
              </div>
            </div>

            {/* Macro Áreas Alvo com Seleção de Habilidades */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[#FFA900]" />
                    Macro Áreas de Habilidades Alvo
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Selecione quais competências práticas seu post busca (ou deixe livre para o campus inteiro).
                  </p>
                </div>
                {selectedMacroAreaIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedMacroAreaIds([])}
                    className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors self-start sm:self-auto"
                  >
                    Limpar Seleção ({selectedMacroAreaIds.length})
                  </button>
                )}
              </div>

              {/* Barra de Pesquisa de Macro Áreas */}
              <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrar por habilidade ou área prática (ex: Software, Design, Dados)..."
                  value={macroSearch}
                  onChange={(e) => setMacroSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#FFA900] outline-none transition-all"
                />
              </div>

              {/* Grid de Macro Áreas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {filteredMacroAreas.map((macro) => {
                  const isSelected = selectedMacroAreaIds.includes(macro.macro_area_id);
                  const IconComponent = ICON_MAP[macro.iconName || macro.icon] || Sparkles;

                  return (
                    <div
                      key={macro.macro_area_id}
                      onClick={() => toggleMacroArea(macro.macro_area_id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 select-none ${
                        isSelected
                          ? 'bg-[#FFA900]/15 border-[#FFA900] shadow-sm'
                          : 'bg-gray-50/80 border-gray-200 hover:border-gray-300 hover:bg-white'
                      }`}
                    >
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 transition-colors ${
                        isSelected ? 'bg-[#FFA900] text-black' : 'bg-white text-gray-400 border border-gray-100'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-black text-gray-900 leading-tight">
                            {macro.name}
                          </span>
                          {isSelected && (
                            <span className="h-4 w-4 rounded-full bg-[#FFA900] text-black flex items-center justify-center shrink-0">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium line-clamp-2 mt-1 leading-snug">
                          {macro.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Footer do Modal */}
        <div className="p-5 sm:p-6 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="create-post-form"
            disabled={isSubmitting}
            className="px-7 py-3 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-wider hover:bg-[#FFA900] hover:text-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <span>Publicar</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
