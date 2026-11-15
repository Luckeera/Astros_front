import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Users, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Rocket, 
  ArrowRight,
  FolderGit2
} from 'lucide-react';
import { MURAL_AREAS } from '../services/muralData';
import { projectService } from '../services/api';
import ProjectPreviewModal from './ProjectPreviewModal';

export default function IntegratedMural() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);

  // Projetos 100% REAIS vindos do banco de dados (sem mocks)
  const [dbProjects, setDbProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getMuralProjects();
      setDbProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar projetos reais do banco de dados:', err);
      setDbProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();

    // Recarrega automaticamente quando um novo projeto for criado (ex: na entrevista)
    const handleProjectCreated = () => fetchProjects();
    window.addEventListener('project-created', handleProjectCreated);
    return () => window.removeEventListener('project-created', handleProjectCreated);
  }, []);

  // Lista normalizada dos projetos reais do banco de dados
  const allProjects = useMemo(() => {
    return dbProjects.map((p) => ({
      ...p,
      is_mock: false,
      summary: p.description && p.description.length > 140 
        ? p.description.slice(0, 140) + '...' 
        : p.description,
      areas: p.areas && p.areas.length > 0 
        ? p.areas 
        : (p.area ? [p.area] : ['Tecnologia'])
    }));
  }, [dbProjects]);

  // Filtra projetos por categoria selecionada e termo de busca
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchArea = selectedArea === 'all' || 
        (p.areas && p.areas.some(a => a.toLowerCase() === selectedArea.toLowerCase())) ||
        (p.area && p.area.toLowerCase() === selectedArea.toLowerCase());
      
      const matchSearch = !searchTerm.trim() || 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchArea && matchSearch;
    });
  }, [allProjects, selectedArea, searchTerm]);

  // Se compacto, exibe até 3 projetos; se expandido, exibe todos os filtrados
  const displayedProjects = isExpanded ? filteredProjects : filteredProjects.slice(0, 3);

  return (
    <section id="mural-integrado" className="py-20 px-6 max-w-6xl mx-auto border-t-2 border-gray-100">
      {/* Cabeçalho da Seção */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFA900]/15 text-gray-900 font-black text-xs uppercase tracking-wider mb-4 border border-[#FFA900]/30 shadow-sm">
          <Sparkles className="h-4 w-4 text-[#FFA900]" />
          Mural de Projetos Reais da Comunidade
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-4">
          Iniciativas ativas no banco de dados.
        </h2>
        <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed">
          Conheça os projetos reais cadastrados por estudantes na rede do Astros e veja vagas disponíveis para colaboração.
        </p>
      </div>

      {/* --- BARRA DE FILTROS POR CATEGORIA (Visível sempre, mesmo encolhida) --- */}
      <div className="mb-10 p-5 bg-gray-50/80 rounded-3xl border-2 border-gray-900 shadow-[4px_4px_0px_#000]">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Categorias / Áreas */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start">
            {MURAL_AREAS.map((area) => {
              const isSelected = selectedArea === area.id;
              return (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gray-900 text-white shadow-[2px_2px_0px_#FFA900]'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-900 hover:text-black'
                  }`}
                >
                  {area.label}
                </button>
              );
            })}
          </div>

          {/* Campo de Busca Rápida (ativo quando expandido ou sempre visível no desktop) */}
          {isExpanded && (
            <div className="relative w-full md:w-72 animate-in fade-in duration-200">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por nome ou tema..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-xs font-bold border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900]/40 transition-all placeholder:text-gray-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Estado de Carregamento */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="h-10 w-10 border-4 border-[#FFA900] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Consultando projetos reais no Supabase...
          </p>
        </div>
      ) : displayedProjects.length === 0 ? (
        /* Estado Vazio para a Categoria */
        <div className="bg-white rounded-3xl border-2 border-gray-900 p-12 text-center shadow-[4px_4px_0px_#000]">
          <div className="h-14 w-14 bg-amber-50 rounded-2xl mx-auto flex items-center justify-center text-[#FFA900] mb-4 border border-amber-200">
            <FolderGit2 className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">Nenhum projeto encontrado nesta categoria</h3>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
            Ainda não há projetos reais cadastrados sob esta área no banco de dados. Seja o primeiro a criar um na pesquisa abaixo!
          </p>
          <button
            onClick={() => setSelectedArea('all')}
            className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-black transition-colors"
          >
            Ver Todas as Categorias
          </button>
        </div>
      ) : (
        /* Grade de Cards do Banco de Dados */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProjects.map((project) => {
            const openRoles = project.roles?.filter((r) => !r.is_filled) || [];
            const primaryArea = project.areas?.[0] || project.area || 'Tecnologia';

            return (
              <div
                key={project.project_id || project.id || project.name}
                onClick={() => setActiveModalProject(project)}
                className="p-7 rounded-3xl border-2 border-gray-900 bg-white shadow-[5px_5px_0px_#000] hover:shadow-[7px_7px_0px_#FFA900] hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Header do Card: Tag da Área & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black bg-[#FFA900] px-3 py-1 rounded-lg">
                      {primaryArea}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {project.is_suggested ? 'Ideia Aberta' : 'Projeto Ativo'}
                    </span>
                  </div>

                  {/* Título do Projeto */}
                  <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight group-hover:text-[#FFA900] transition-colors line-clamp-2">
                    {project.name}
                  </h3>

                  {/* Criador / Faculdade */}
                  {project.creator_name && (
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                      Por {project.creator_name} • {project.creator_course || 'Graduação'}
                    </p>
                  )}

                  {/* Descrição Curta */}
                  <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Vagas / Habilidades Procuradas */}
                <div>
                  <div className="pt-4 border-t border-gray-100 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                      {openRoles.length > 0 ? 'Vagas Abertas:' : 'Equipe Formada'}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {openRoles.slice(0, 3).map((r, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md border border-gray-200"
                        >
                          {r.name || r.role_name}
                        </span>
                      ))}
                      {openRoles.length > 3 && (
                        <span className="text-[10px] font-bold bg-[#FFA900]/20 text-gray-900 px-2 py-1 rounded-md">
                          +{openRoles.length - 3}
                        </span>
                      )}
                      {openRoles.length === 0 && (
                        <span className="text-[10px] font-bold text-gray-400 italic">
                          Todas as vagas preenchidas
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Botão de Ação no Card */}
                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-gray-900 group-hover:text-[#FFA900] transition-colors pt-2">
                    <span>Ver Detalhes do Projeto</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botão Central de Expansão / Recolhimento (Aparece se houver mais de 3 projetos no filtro) */}
      {filteredProjects.length > 3 && (
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const nextState = !isExpanded;
              setIsExpanded(nextState);
              if (!nextState) {
                const el = document.getElementById('mural-integrado');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-white border-2 border-gray-900 rounded-2xl font-black text-sm uppercase tracking-wider shadow-[5px_5px_0px_#000] hover:bg-gray-50 hover:shadow-[7px_7px_0px_#FFA900] hover:scale-[1.01] active:scale-95 transition-all cursor-pointer group"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-5 w-5 text-gray-900 group-hover:-translate-y-1 transition-transform" />
                Recolher Mural de Ideias
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-[#FFA900] group-hover:rotate-12 transition-transform" />
                Ver Todos os Projetos da Categoria ({filteredProjects.length})
                <ChevronDown className="h-5 w-5 text-gray-900 group-hover:translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Modal de Detalhes do Projeto */}
      {activeModalProject && (
        <ProjectPreviewModal
          project={activeModalProject}
          isOpen={Boolean(activeModalProject)}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </section>
  );
}
