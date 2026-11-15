import React, { useState, useEffect, useMemo } from 'react';
import { X, Sparkles, Check, AlertCircle, Rocket, Layers, Search, FileText, Briefcase } from 'lucide-react';
import OrbitIcon from '../icons/OrbitIcon';
import { useAuth } from '../context/AuthContext';
import { postService, courseService, projectService } from '../services/api';
import { MASTER_COURSES } from '../services/coursesData';
import { useNavigate } from 'react-router-dom';

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
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);
  const [userProjects, setUserProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Carrega cursos e projetos do usuário ao abrir o modal
  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setCourseSearch('');

    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses(token);
        if (Array.isArray(data) && data.length > 0) {
          setAvailableCourses(data);
        } else {
          // Fallback robusto para o catálogo mestre nacional de 165 cursos
          setAvailableCourses(MASTER_COURSES.map((c, i) => ({ course_id: i + 1, ...c })));
        }
      } catch (err) {
        console.error('Erro ao carregar cursos:', err);
        setAvailableCourses(MASTER_COURSES.map((c, i) => ({ course_id: i + 1, ...c })));
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

    fetchCourses();
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

  const toggleCourse = (courseId) => {
    setSelectedCourseIds(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const toggleArea = (areaName, areaCourses) => {
    const areaCourseIds = areaCourses.map(c => c.course_id);
    const allSelected = areaCourseIds.every(id => selectedCourseIds.includes(id));

    if (allSelected) {
      setSelectedCourseIds(prev => prev.filter(id => !areaCourseIds.includes(id)));
    } else {
      setSelectedCourseIds(prev => [...new Set([...prev, ...areaCourseIds])]);
    }
  };

  // Filtragem e agrupamento de cursos por área
  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return availableCourses;
    const term = courseSearch.toLowerCase().trim();
    return availableCourses.filter(c =>
      c.name.toLowerCase().includes(term) ||
      (c.area && c.area.toLowerCase().includes(term))
    );
  }, [availableCourses, courseSearch]);

  const coursesByArea = useMemo(() => {
    return filteredCourses.reduce((acc, course) => {
      const area = course.area || 'Outros';
      if (!acc[area]) acc[area] = [];
      acc[area].push(course);
      return acc;
    }, {});
  }, [filteredCourses]);

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
          target_courses: selectedCourseIds
        });
      } else {
        created = await postService.createPost(token, {
          title: title.trim(),
          content: content.trim(),
          is_collaborative: false,
          project_id: selectedProjectId ? Number(selectedProjectId) : null,
          target_courses: selectedCourseIds
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
      setSelectedCourseIds([]);
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

      {/* Modal mais largo (max-w-4xl) com visual reformulado */}
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
              Compartilhe pesquisas, ideias ou vincule seus projetos para direcionar aos cursos de interesse.
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
                <span className="text-[11px] font-bold text-gray-400">
                  {title.length}/150
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="O que o mundo acadêmico deve saber hoje?"
                maxLength={150}
                required
                className="w-full px-4 py-3.5 bg-gray-50/70 border-2 border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white focus:border-[#FFA900] outline-none transition-all"
              />
            </div>

            {/* Conteúdo do Post */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Corpo do Artigo / Projeto *
                </label>
                <span className="text-[11px] font-bold text-gray-400">
                  {content.length}/5000
                </span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Articule suas ideias, hipóteses ou necessidades de colaboração..."
                rows={5}
                maxLength={5000}
                required
                className="w-full px-4 py-3.5 bg-gray-50/70 border-2 border-gray-200 rounded-xl font-medium text-sm text-gray-800 focus:bg-white focus:border-[#FFA900] outline-none transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Seção de Vínculo de Projeto (Disponível para qualquer post) */}
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#FFA900]/20 rounded-lg text-black">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <label className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                      Vincular a um Projeto (Opcional)
                    </label>
                    <p className="text-[11px] text-gray-500 font-medium">
                      O post exibirá um atalho direto para a tela de documentação do seu projeto.
                    </p>
                  </div>
                </div>

                {selectedProjectId && (
                  <button
                    type="button"
                    onClick={() => setSelectedProjectId('')}
                    className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                  >
                    Desvincular
                  </button>
                )}
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

            {/* Cursos Alvo com Busca Rápida e Catálogo Completo */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Cursos Alvo (Onde seu post aparecerá)
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Se nenhum curso for selecionado, seu post ficará visível para todos os cursos do campus.
                  </p>
                </div>
                {selectedCourseIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedCourseIds([])}
                    className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors self-start sm:self-auto"
                  >
                    Limpar Seleção ({selectedCourseIds.length})
                  </button>
                )}
              </div>

              {/* Barra de Pesquisa de Cursos */}
              <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pesquisar curso ou área..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#FFA900] outline-none transition-all"
                />
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {Object.keys(coursesByArea).length > 0 ? (
                  Object.entries(coursesByArea).map(([area, courses]) => {
                    const areaCourseIds = courses.map(c => c.course_id);
                    const isAreaSelected = areaCourseIds.every(id => selectedCourseIds.includes(id));

                    return (
                      <div key={area} className="bg-gray-50/70 p-3.5 rounded-2xl border border-gray-200/70">
                        <button
                          type="button"
                          onClick={() => toggleArea(area, courses)}
                          className={`text-[10px] font-black uppercase tracking-wider mb-2.5 flex items-center gap-1.5 transition-colors ${
                            isAreaSelected ? 'text-[#FFA900]' : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          <Layers className="h-3 w-3" />
                          Área: {area} {isAreaSelected ? '(Toda selecionada)' : '(Selecionar tudo)'}
                        </button>

                        <div className="flex flex-wrap gap-1.5">
                          {courses.map(course => {
                            const isSelected = selectedCourseIds.includes(course.course_id);
                            return (
                              <button
                                key={course.course_id}
                                type="button"
                                onClick={() => toggleCourse(course.course_id)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 border-2 ${
                                  isSelected
                                    ? 'bg-[#FFA900]/15 border-[#FFA900] text-gray-900 shadow-sm'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 text-[#FFA900]" />}
                                {course.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-gray-400 text-xs font-bold">
                    Nenhum curso encontrado para "{courseSearch}".
                  </div>
                )}
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
            disabled={isSubmitting || !user}
            className="px-7 py-3 bg-[#FFA900] text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Publicando...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Publicar Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
