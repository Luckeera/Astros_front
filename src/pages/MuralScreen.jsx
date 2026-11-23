import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  Users, 
  Star, 
  Plus, 
  Layers,
  Rocket,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MURAL_AREAS, MURAL_PROJECTS } from '../services/muralData';
import { projectService } from '../services/api';
import ProjectPreviewModal from '../components/ProjectPreviewModal';
import CreateProjectModal from '../components/CreateProjectModal';

export default function MuralScreen() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedArea, setSelectedArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyOpenRoles, setOnlyOpenRoles] = useState(false);
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Estado para projetos reais vindos do banco de dados
  const [dbProjects, setDbProjects] = useState([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Estado para o Modal de Criação Direta
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialProjectData, setInitialProjectData] = useState(null);

  // Carrega projetos reais do banco de dados
  const fetchRealProjects = async () => {
    try {
      setLoadingDb(true);
      const data = await projectService.getMuralProjects(token);
      setDbProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Erro ao carregar projetos reais do banco:', err);
      setDbProjects([]);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    fetchRealProjects();
  }, [token]);

  // Lista normalizada de projetos reais (iniciativas ativas sob liderança de alunos)
  const realProjects = useMemo(() => {
    return dbProjects
      .filter((p) => !p.is_suggested)
      .map((p) => ({
        ...p,
        is_mock: false,
        summary: p.description && p.description.length > 130 
          ? p.description.slice(0, 130) + '...' 
          : p.description,
        areas: p.areas && p.areas.length > 0 
          ? p.areas 
          : (p.area ? [p.area] : ['Tecnologia'])
      }));
  }, [dbProjects]);

  // Lista de ideias sugeridas (tanto do banco quanto os templates de muralData.js)
  const mockProjects = useMemo(() => {
    const dbSuggested = dbProjects
      .filter((p) => p.is_suggested)
      .map((p) => ({
        ...p,
        is_mock: true,
        creator_name: null,
        creator_college: null,
        creator_course: null,
        summary: p.description && p.description.length > 130 
          ? p.description.slice(0, 130) + '...' 
          : p.description,
        areas: p.areas && p.areas.length > 0 
          ? p.areas 
          : (p.area ? [p.area] : ['Tecnologia'])
      }));

    const staticMocks = MURAL_PROJECTS.map((p) => ({
      ...p,
      is_mock: true,
      creator_name: null,
      creator_college: null,
      creator_course: null,
      areas: p.areas && p.areas.length > 0 ? p.areas : [p.area]
    }));

    return [...dbSuggested, ...staticMocks];
  }, [dbProjects]);

  // Todos os projetos combinados para deep linking e contagens
  const allProjects = useMemo(() => {
    return [...realProjects, ...mockProjects];
  }, [realProjects, mockProjects]);

  useEffect(() => {
    const projectIdParam = searchParams.get('project');
    if (projectIdParam) {
      const found = allProjects.find(p => String(p.project_id) === projectIdParam);
      if (found) {
        setActiveModalProject(found);
      }
    }
  }, [searchParams, allProjects]);
  
  // Lista de projetos com interesse registrado no localStorage
  const [interestedProjects, setInterestedProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('astros_mural_interests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleInterest = (projectId, isInterested) => {
    setInterestedProjects((prev) => {
      let next;
      if (isInterested) {
        next = prev.includes(projectId) ? prev : [...prev, projectId];
      } else {
        next = prev.filter(id => id !== projectId);
      }
      try {
        localStorage.setItem('astros_mural_interests', JSON.stringify(next));
      } catch (e) {
        console.error('Erro ao salvar interesse:', e);
      }
      return next;
    });
  };

  // Contagem por área considerando todos os projetos
  const areaCounts = useMemo(() => {
    const counts = { all: allProjects.length };
    MURAL_AREAS.forEach((ma) => {
      if (ma.id === 'all') return;
      const count = allProjects.filter((p) => {
        const areas = p.areas || [p.area];
        return areas.some((a) =>
          a === ma.id ||
          a?.toLowerCase() === ma.id?.toLowerCase() ||
          a?.toLowerCase().includes(ma.id?.toLowerCase()) ||
          ma.id?.toLowerCase().includes(a?.toLowerCase())
        );
      }).length;
      counts[ma.id] = count;
    });
    return counts;
  }, [allProjects]);

  // Função auxiliar de filtro
  const filterProject = (proj) => {
    if (selectedArea !== 'all') {
      const areas = proj.areas || [proj.area];
      const matchArea = areas.some((a) =>
        a === selectedArea ||
        a?.toLowerCase() === selectedArea?.toLowerCase() ||
        a?.toLowerCase().includes(selectedArea?.toLowerCase()) ||
        selectedArea?.toLowerCase().includes(a?.toLowerCase())
      );
      if (!matchArea) return false;
    }
    if (onlyOpenRoles) {
      const hasOpen = proj.roles?.some(r => !r.is_filled);
      if (!hasOpen) return false;
    }
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      const matchesName = proj.name?.toLowerCase().includes(query);
      const matchesSummary = proj.summary?.toLowerCase().includes(query);
      const matchesDesc = proj.description?.toLowerCase().includes(query);
      const matchesAuthor = proj.creator_name?.toLowerCase().includes(query);
      const matchesTags = proj.tags?.some(t => t.toLowerCase().includes(query));
      const matchesRoles = proj.roles?.some(r => r.name?.toLowerCase().includes(query));
      const matchesAreas = (proj.areas || [proj.area]).some(a => a?.toLowerCase().includes(query));
      return matchesName || matchesSummary || matchesDesc || matchesAuthor || matchesTags || matchesRoles || matchesAreas;
    }
    return true;
  };

  // Filtragem dos projetos reais (Seção 1)
  const filteredRealProjects = useMemo(() => {
    return realProjects.filter(filterProject);
  }, [realProjects, selectedArea, searchTerm, onlyOpenRoles]);

  // Filtragem das ideias sugeridas (Seção 2)
  const filteredMockProjects = useMemo(() => {
    return mockProjects.filter(filterProject);
  }, [mockProjects, selectedArea, searchTerm, onlyOpenRoles]);

  const totalFilteredCount = filteredRealProjects.length + filteredMockProjects.length;

  // Callback de criação de projeto com sucesso
  const handleProjectCreated = (newProject) => {
    setDbProjects(prev => [newProject, ...prev]);
    setActiveModalProject({
      ...newProject,
      is_mock: false,
      summary: newProject.description,
      areas: newProject.areas || [newProject.area || 'Tecnologia']
    });
  };

  // Abre a criação direta a partir de uma ideia sugerida (pré-preenchida)
  const handleStartIdea = (mockProject) => {
    setInitialProjectData(mockProject);
    setIsCreateModalOpen(true);
  };

  const handleOpenDirectCreate = () => {
    if (!user) {
      navigate('/login', { state: { message: 'Faça login para criar seu projeto no Mural!' } });
      return;
    }
    setInitialProjectData(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-900 pb-24">
      {/* Conteúdo Principal do Mural */}
      <section className="pt-8 sm:pt-12 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">
        
        {/* Título Principal */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-gray-900 mb-4 leading-tight">
            Mural de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA900] to-orange-500">Projetos & Ideias.</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 font-medium leading-relaxed">
            Descubra iniciativas reais de outros estudantes ou adote propostas interdisciplinares para formar sua equipe e liderar.
          </p>
        </div>

        {/* Banner de Convite para Pesquisa & Entrevista */}
        <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl border-2 border-gray-900 bg-amber-50 shadow-[4px_4px_0px_#000] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                Pesquisa Universitária Astros
              </p>
              <p className="text-xs text-gray-700 font-medium">
                Participe da entrevista guiada em 3 min e publique sua ideia ou intenção!
              </p>
            </div>
          </div>
          <Link
            to="/entrevista"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-wider hover:bg-black transition-colors whitespace-nowrap text-center"
          >
            Fazer Entrevista 🚀
          </Link>
        </div>

        {/* Barra de Pesquisa */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative flex items-center bg-white rounded-2xl border-2 border-gray-900 shadow-md p-2 focus-within:border-[#FFA900] transition-all">
            <Search className="h-5 w-5 text-gray-700 ml-4 flex-shrink-0" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por desafio, curso, competência ou nome..."
              className="w-full px-4 py-2.5 bg-transparent text-gray-900 placeholder-gray-400 font-bold text-sm sm:text-base outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="px-3 py-1 text-xs font-black text-gray-500 hover:text-black bg-gray-100 rounded-lg mr-2"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Filtros por Área Temática */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8 px-2">
          {MURAL_AREAS.map((area) => {
            const isSelected = selectedArea === area.id;
            const count = areaCounts[area.id] || 0;

            return (
              <button
                key={area.id}
                onClick={() => setSelectedArea(area.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-150 border-2 ${
                  isSelected
                    ? 'bg-[#FFA900] text-black border-gray-900 shadow-sm'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-gray-900'
                }`}
              >
                <span>{area.label}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                  isSelected ? 'bg-black text-[#FFA900]' : 'bg-gray-100 text-gray-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Barra de Status & Toggle de Vagas Abertas */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-b-2 border-gray-200 mb-10">
          <p className="text-sm font-black text-gray-900">
            {totalFilteredCount} iniciativa(s) encontrada(s)
            {selectedArea !== 'all' && ` em ${selectedArea}`}
          </p>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={onlyOpenRoles}
              onChange={(e) => setOnlyOpenRoles(e.target.checked)}
              className="h-4 w-4 rounded text-[#FFA900] focus:ring-[#FFA900] border-2 border-gray-900 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-bold text-gray-800">
              Apenas iniciativas com vagas abertas
            </span>
          </label>
        </div>

        {/* ========================================================= */}
        {/* SEÇÃO 1: PROJETOS REAIS EM ANDAMENTO                     */}
        {/* ========================================================= */}
        <div className="mb-16">
          <div className="mb-6 pb-3 border-b-2 border-gray-900">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse" />
              Projetos em Andamento
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Iniciativas reais criadas por estudantes com vagas abertas para colaboração imediata.
            </p>
          </div>

          {filteredRealProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRealProjects.map((project) => {
                const openRoles = project.roles?.filter(r => !r.is_filled) || [];
                const isFav = interestedProjects.includes(project.project_id);
                const projectAreas = project.areas || [project.area];

                return (
                  <div 
                    key={`real-${project.project_id}`}
                    onClick={() => setActiveModalProject(project)}
                    className="bg-white rounded-2xl border-2 border-gray-900 hover:border-[#FFA900] p-6 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[300px]"
                  >
                    <div>
                      {/* Topo do Card: Badge Projeto Ativo + Áreas + Vagas */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-black text-[10px] uppercase tracking-wider rounded-lg border border-emerald-300 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Projeto Ativo
                          </span>

                          {projectAreas.map((area, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-800 font-black text-[10px] uppercase tracking-wider rounded-md border border-gray-200"
                            >
                              {area}
                            </span>
                          ))}
                        </div>

                        {openRoles.length > 0 ? (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-950 border border-amber-300 rounded-lg text-[10px] font-black whitespace-nowrap">
                            ⚡ {openRoles.length} vaga(s)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold">
                            Completo
                          </span>
                        )}
                      </div>

                      {/* Título do Projeto */}
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-[#FFA900] transition-colors leading-snug mb-3">
                        {project.name}
                      </h3>

                      {/* Resumo */}
                      <p className="text-gray-600 font-medium text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                        {project.summary || project.description}
                      </p>

                      {/* Box de Vagas Procuradas */}
                      {openRoles.length > 0 && (
                        <div className="mb-5 p-3 rounded-xl bg-gray-50 border border-gray-200">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 block mb-1.5">
                            Vagas abertas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {openRoles.slice(0, 2).map((role, rIdx) => (
                              <span 
                                key={role.id || rIdx}
                                className="px-2 py-0.5 bg-white text-gray-900 font-bold rounded-md text-[11px] border border-gray-300 shadow-xs truncate max-w-[180px]"
                              >
                                • {role.name}
                              </span>
                            ))}
                            {openRoles.length > 2 && (
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-800 font-bold rounded-md text-[11px]">
                                +{openRoles.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rodapé do Card com Autor Real */}
                    <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-[#FFA900] text-black font-black flex items-center justify-center text-xs flex-shrink-0 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                          {project.creator_name?.[0] || 'A'}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-black text-gray-900 truncate">
                            {project.creator_name}
                          </p>
                          <p className="text-[10px] text-gray-500 font-bold truncate">
                            {project.creator_college || project.creator_course || 'Universitário'}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleInterest(project.project_id, !isFav);
                        }}
                        className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                          isFav 
                            ? 'bg-amber-100 text-amber-600 shadow-sm' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900'
                        }`}
                        title={isFav ? 'Remover interesse' : 'Marcar como interessante'}
                      >
                        <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-500 font-bold text-sm">
                Nenhum projeto em andamento encontrado nesta área.
              </p>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SEÇÃO 2: IDEIAS SUGERIDAS PARA TIRAR DO PAPEL             */}
        {/* ========================================================= */}
        <div className="mb-16">
          <div className="mb-6 pb-3 border-b-2 border-amber-300">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <Sparkles className="h-6 w-6 text-[#FFA900]" />
              Ideias Sugeridas para Tirar do Papel
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Desafios multidisciplinares aguardando líderes para formar equipes e iniciar o desenvolvimento.
            </p>
          </div>

          {filteredMockProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMockProjects.map((project) => {
                const openRoles = project.roles?.filter(r => !r.is_filled) || [];
                const isFav = interestedProjects.includes(project.project_id);
                const projectAreas = project.areas || [project.area];

                return (
                  <div 
                    key={`mock-${project.project_id}`}
                    onClick={() => setActiveModalProject(project)}
                    className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#FFA900] p-6 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group min-h-[300px]"
                  >
                    <div>
                      {/* Topo do Card: Badge Ideia Sugerida + Áreas */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-950 font-black text-[10px] uppercase tracking-wider rounded-lg border border-amber-300 flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-[#FFA900]" />
                            Ideia Sugerida
                          </span>

                          {projectAreas.map((area, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 bg-gray-100 text-gray-800 font-black text-[10px] uppercase tracking-wider rounded-md border border-gray-200"
                            >
                              {area}
                            </span>
                          ))}
                        </div>

                        {openRoles.length > 0 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[10px] font-black whitespace-nowrap">
                            {openRoles.length} vaga(s) sugerida(s)
                          </span>
                        )}
                      </div>

                      {/* Título da Ideia */}
                      <h3 className="text-xl font-black text-gray-900 group-hover:text-[#FFA900] transition-colors leading-snug mb-3">
                        {project.name}
                      </h3>

                      {/* Resumo da Ideia */}
                      <p className="text-gray-600 font-medium text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                        {project.summary || project.description}
                      </p>

                      {/* Box de Competências Sugeridas */}
                      {openRoles.length > 0 && (
                        <div className="mb-5 p-3 rounded-xl bg-amber-50/40 border border-amber-200">
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 block mb-1.5">
                            Competências sugeridas:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {openRoles.slice(0, 2).map((role, rIdx) => (
                              <span 
                                key={role.id || rIdx}
                                className="px-2 py-0.5 bg-white text-gray-900 font-bold rounded-md text-[11px] border border-amber-300 shadow-xs truncate max-w-[180px]"
                              >
                                • {role.name}
                              </span>
                            ))}
                            {openRoles.length > 2 && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded-md text-[11px]">
                                +{openRoles.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Rodapé do Card: SEM criador falso, com indicação 'Aguardando Líder' + Botão Copiar & Iniciar */}
                    <div className="pt-4 border-t-2 border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" />
                        <span className="text-[11px] font-black text-amber-950">Aguardando Líder</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartIdea(project);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#FFA900] hover:bg-gray-900 hover:text-white text-black font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                          title="Copiar ideia e iniciar como líder"
                        >
                          <Rocket className="h-3 w-3" />
                          <span>Copiar & Iniciar</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleInterest(project.project_id, !isFav);
                          }}
                          className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                            isFav 
                              ? 'bg-amber-100 text-amber-600 shadow-sm' 
                              : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-900'
                          }`}
                          title={isFav ? 'Remover interesse' : 'Marcar como interessante'}
                        >
                          <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center max-w-xl mx-auto">
              <p className="text-gray-500 font-bold text-sm">
                Nenhuma ideia sugerida encontrada com os filtros atuais.
              </p>
            </div>
          )}
        </div>

        {/* Estado vazio global caso nenhuma das duas seções tenha resultados */}
        {totalFilteredCount === 0 && (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center max-w-xl mx-auto shadow-sm my-8">
            <div className="h-16 w-16 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Nenhuma iniciativa encontrada</h3>
            <p className="text-gray-500 font-medium text-sm mb-6">
              Tente buscar por outros termos ou limpar os filtros por área temática.
            </p>
            <button
              onClick={() => {
                setSelectedArea('all');
                setSearchTerm('');
                setOnlyOpenRoles(false);
              }}
              className="px-6 py-2.5 bg-gray-900 text-white font-black rounded-xl text-xs uppercase tracking-wider hover:bg-[#FFA900] hover:text-black transition-colors"
            >
              Resetar Filtros
            </button>
          </div>
        )}

        {/* Botão de Propor Novo Projeto no Fim da Tela */}
        <div className="mt-16 text-center">
          <button
            onClick={handleOpenDirectCreate}
            className="px-8 py-4 bg-[#FFA900] text-black font-black rounded-2xl hover:bg-gray-900 hover:text-white transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 inline-flex items-center gap-3 text-sm uppercase tracking-wider border-2 border-gray-900 cursor-pointer"
          >
            <Plus className="h-5 w-5" />
            Propor Novo Projeto
          </button>
        </div>

      </section>

      {/* Modal de Preview do Projeto */}
      <ProjectPreviewModal 
        project={activeModalProject}
        isOpen={Boolean(activeModalProject)}
        onClose={() => {
          setActiveModalProject(null);
          if (searchParams.get('project')) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('project');
            setSearchParams(nextParams);
          }
        }}
        isInterested={activeModalProject ? interestedProjects.includes(activeModalProject.project_id) : false}
        onToggleInterest={handleToggleInterest}
        onStartProject={handleStartIdea}
      />

      {/* Modal de Criação Direta de Projeto */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setInitialProjectData(null);
        }}
        onProjectCreated={handleProjectCreated}
        initialData={initialProjectData}
      />

    </div>
  );
}
