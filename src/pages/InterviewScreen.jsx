import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OrbitIcon from '../icons/OrbitIcon';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Rocket, 
  Star, 
  Search, 
  Plus, 
  Trash2, 
  BookOpen, 
  HeartHandshake, 
  MessageSquare,
  Building,
  GraduationCap,
  Calendar,
  Layers,
  HelpCircle,
  Lock
} from 'lucide-react';
import { projectService, interviewService } from '../services/api';
import { MURAL_AREAS, MURAL_PROJECTS } from '../services/muralData';
import ProjectPreviewModal from '../components/ProjectPreviewModal';

const STEPS = [
  { id: 1, title: 'Perfil & Boas-Vindas', subtitle: 'Identificação básica' },
  { id: 2, title: 'Experiência & Ideia', subtitle: 'Histórico de projetos' },
  { id: 3, title: 'Vitrine Interativa', subtitle: 'Degustação do Mural' },
  { id: 4, title: 'Validação & Opinião', subtitle: 'Feedback da proposta' },
  { id: 5, title: 'Revisão & Ativação', subtitle: 'Criação automatizada' }
];

const PREDEFINED_BARRIERS = [
  'Falta de pessoas com habilidades complementares (dev, designer, negócios, saúde)',
  'Falta de tempo ou rotina de estudos pesada',
  'Não saber por onde começar ou estruturar o projeto',
  'Falta de mentoria ou apoio da faculdade',
  'Dificuldade em manter a equipe motivada'
];

const PREDEFINED_FEATURES = [
  'Mural visual de projetos categorizado por áreas do conhecimento',
  'Indicação explícita de vagas e papéis em aberto em cada projeto',
  'Documentação dinâmica e linha do tempo de evolução do projeto',
  'Chat direto e convites sem burocracia para quem tem competências complementares',
  'Banco de ideias sugeridas para quem quer começar do zero'
];

// Embaralha uma lista aleatoriamente (Fisher-Yates) mantendo a estabilidade após carregar
function shuffleList(list) {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function InterviewScreen({ embedded = false }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [completedData, setCompletedData] = useState(null);

  // --- Step 1: Perfil ---
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
    college_name: '',
    course_name: '',
    period: 1,
    age: ''
  });

  // --- Step 2: Experiência & Ideia ---
  const [experience, setExperience] = useState({
    had_past_demand: false,
    details_past_demand: '',
    past_barriers: [],
    how_would_act_on_incoming_interest: '',
    wants_to_create_project: false,
    wants_to_be_owner: true,
    project_name: '',
    project_description: '',
    project_area: 'Tecnologia',
    roles: [
      { role_name: 'UI/UX Designer', role_explanation: 'Design da interface e experiência do usuário.', role_quantity: 1 },
      { role_name: 'Desenvolvedor', role_explanation: 'Implementação de funcionalidades e protótipo.', role_quantity: 1 }
    ]
  });

  // --- Step 3: Degustação do Mural & Ideias Adotadas ---
  const [dbProjects, setDbProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedArea, setSelectedArea] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalProject, setActiveModalProject] = useState(null);
  const [interestedProjectIds, setInterestedProjectIds] = useState([]);
  const [adoptedProjects, setAdoptedProjects] = useState([]);
  const MAX_ADOPTED_PROJECTS = 2; // Proteção contra adoção massiva que polua o mural

  // --- Step 4: Validação & Opinião ---
  const [validation, setValidation] = useState({
    would_reach_out: '',
    interdisciplinary_opinion: '',
    valuable_features: [],
    feedback: ''
  });

  // Carrega projetos reais do banco de dados
  useEffect(() => {
    async function loadMural() {
      try {
        setLoadingProjects(true);
        const data = await projectService.getMuralProjects();
        setDbProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.warn('Erro ao carregar projetos do mural:', err);
      } finally {
        setLoadingProjects(false);
      }
    }
    loadMural();
  }, []);

  // Lista unificada de projetos (reais + ideias sugeridas)
  const allProjects = useMemo(() => {
    const realList = dbProjects
      .filter((p) => !p.is_suggested)
      .map((p) => ({
        ...p,
        is_mock: false,
        summary: p.description && p.description.length > 120 ? p.description.slice(0, 120) + '...' : p.description,
        areas: p.areas && p.areas.length > 0 ? p.areas : [p.area || 'Tecnologia']
      }));

    const dbSuggestedList = dbProjects
      .filter((p) => p.is_suggested)
      .map((p) => ({
        ...p,
        is_mock: true,
        creator_name: null,
        creator_college: null,
        creator_course: null,
        summary: p.description && p.description.length > 120 ? p.description.slice(0, 120) + '...' : p.description,
        areas: p.areas && p.areas.length > 0 ? p.areas : [p.area || 'Tecnologia']
      }));

    const mockList = MURAL_PROJECTS.map((p) => ({
      ...p,
      is_mock: true,
      creator_name: null,
      creator_college: null,
      creator_course: null,
      areas: p.areas && p.areas.length > 0 ? p.areas : [p.area]
    }));

    const combined = [...realList, ...dbSuggestedList, ...mockList];
    return shuffleList(combined);
  }, [dbProjects]);

  // Filtragem
  const filteredProjects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchArea = selectedArea === 'all' || (p.areas && p.areas.includes(selectedArea)) || p.area === selectedArea;
      const matchSearch =
        searchTerm.trim() === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchArea && matchSearch;
    });
  }, [allProjects, selectedArea, searchTerm]);

  // Toggle de interesse em um projeto
  const handleToggleInterest = (projectId, state) => {
    setInterestedProjectIds((prev) => {
      const exists = prev.includes(projectId);
      if (state && !exists) return [...prev, projectId];
      if (!state && exists) return prev.filter((id) => id !== projectId);
      return prev;
    });
  };

  // Se o usuário clicar em "Quero Adotar Esta Ideia" em um mock no modal:
  const handleAdoptIdea = (mockProj) => {
    const isAlreadyAdopted = adoptedProjects.some(
      (p) => p.project_id === mockProj.project_id || p.name.toLowerCase() === mockProj.name.toLowerCase()
    );

    if (isAlreadyAdopted) {
      // Desfaz a adoção caso já esteja na lista
      setAdoptedProjects((prev) =>
        prev.filter((p) => p.project_id !== mockProj.project_id && p.name.toLowerCase() !== mockProj.name.toLowerCase())
      );
      setActiveModalProject(null);
      return;
    }

    if (adoptedProjects.length >= MAX_ADOPTED_PROJECTS) {
      alert(`Por segurança e foco na equipe, você pode adotar no máximo ${MAX_ADOPTED_PROJECTS} ideias sugeridas por entrevista.`);
      return;
    }

    setAdoptedProjects((prev) => [
      ...prev,
      {
        project_id: mockProj.project_id,
        name: mockProj.name,
        description: mockProj.description,
        area: (mockProj.areas && mockProj.areas[0]) || mockProj.area || 'Tecnologia',
        roles: (mockProj.roles || []).map((r) => ({
          role_name: r.name,
          role_explanation: r.explanation || '',
          role_quantity: 1
        })),
        is_suggested: false // O usuário passa a liderar o projeto
      }
    ]);
    setActiveModalProject(null);
  };

  // Validação de etapas
  const canProceed = () => {
    if (currentStep === 1) {
      const validPassword = !profile.password || profile.password.length === 0 || profile.password.length >= 6;
      return (
        profile.name.trim().length >= 2 &&
        profile.email.includes('@') &&
        profile.college_name.trim().length >= 2 &&
        profile.course_name.trim().length >= 2 &&
        validPassword
      );
    }
    if (currentStep === 2) {
      if (experience.wants_to_create_project) {
        return experience.project_name.trim().length >= 2 && experience.project_description.trim().length >= 10;
      }
      return true;
    }
    if (currentStep === 4) {
      return Boolean(validation.would_reach_out && validation.interdisciplinary_opinion);
    }
    return true;
  };

  // Submissão da entrevista
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // 1. Projeto próprio criado na Etapa 2 (se preenchido e desejado)
      const projectsToCreate = [];
      if (experience.wants_to_create_project && experience.project_name.trim().length >= 2) {
        projectsToCreate.push({
          name: experience.project_name.trim(),
          description: experience.project_description.trim(),
          area: experience.project_area,
          roles: (experience.roles || [])
            .filter((r) => r.role_name && r.role_name.trim().length > 0)
            .map((r) => ({
              role_name: r.role_name.trim(),
              role_explanation: (r.role_explanation || '').trim(),
              role_quantity: 1
            })),
          is_suggested: !experience.wants_to_be_owner
        });
      }

      // 2. Ideias sugeridas adotadas na Etapa 3 (não sobrescrevem o projeto próprio)
      for (const ap of adoptedProjects) {
        projectsToCreate.push({
          name: ap.name.trim(),
          description: ap.description.trim(),
          area: ap.area,
          roles: (ap.roles || [])
            .filter((r) => r.role_name && r.role_name.trim().length > 0)
            .map((r) => ({
              role_name: r.role_name.trim(),
              role_explanation: (r.role_explanation || '').trim(),
              role_quantity: 1
            })),
          is_suggested: false
        });
      }

      const payload = {
        name: profile.name,
        email: profile.email,
        password: profile.password?.trim() || null,
        college_name: profile.college_name,
        course_name: profile.course_name,
        period: Number(profile.period) || 1,
        age: profile.age ? Number(profile.age) : null,

        had_past_demand: experience.had_past_demand,
        details_past_demand: experience.details_past_demand,
        past_barriers: experience.past_barriers,
        how_would_act_on_incoming_interest: experience.how_would_act_on_incoming_interest,

        wants_to_create_project: projectsToCreate.length > 0,
        proposed_project: projectsToCreate.length > 0 ? projectsToCreate[0] : null,
        proposed_projects: projectsToCreate,

        interested_project_ids: interestedProjectIds,

        would_reach_out: validation.would_reach_out,
        interdisciplinary_opinion: validation.interdisciplinary_opinion,
        valuable_features: validation.valuable_features,
        feedback: validation.feedback
      };

      const result = await interviewService.submitInterview(payload);
      setCompletedData(result);
      if (result.created_project_id || (result.created_project_ids && result.created_project_ids.length > 0)) {
        window.dispatchEvent(new CustomEvent('project-created', { detail: result }));
      }
    } catch (err) {
      alert('Erro ao enviar entrevista: ' + (err.message || 'Verifique sua conexão'));
    } finally {
      setSubmitting(false);
    }
  };

  // Reset para nova entrevista
  const handleResetForNext = () => {
    setProfile({
      name: '',
      email: '',
      password: '',
      college_name: '',
      course_name: '',
      period: 1,
      age: ''
    });
    setExperience({
      had_past_demand: false,
      details_past_demand: '',
      past_barriers: [],
      how_would_act_on_incoming_interest: '',
      wants_to_create_project: false,
      wants_to_be_owner: true,
      project_name: '',
      project_description: '',
      project_area: 'Tecnologia',
      roles: [
        { role_name: 'UI/UX Designer', role_explanation: 'Design da interface.', role_quantity: 1 },
        { role_name: 'Desenvolvedor', role_explanation: 'Implementação de funcionalidades.', role_quantity: 1 }
      ]
    });
    setInterestedProjectIds([]);
    setAdoptedProjects([]);
    setValidation({
      would_reach_out: '',
      interdisciplinary_opinion: '',
      valuable_features: [],
      feedback: ''
    });
    setCompletedData(null);
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="pesquisa" className={`${embedded ? 'bg-[#F5F5F7] border-t-4 border-gray-900 pt-6 pb-16' : 'min-h-screen bg-[#F5F5F7]'} text-gray-900 selection:bg-[#FFA900]/30 font-sans`}>
      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: slowRotate 20s linear infinite;
        }
      `}</style>
      {/* Top Header (apenas quando acessado como página independente) */}
      {!embedded && (
        <header className="border-b-2 border-gray-900 bg-white sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 cursor-pointer group">
              <div className="p-2 bg-[#FFA900]/10 rounded-2xl border border-[#FFA900]/20 shadow-sm group-hover:bg-[#FFA900] transition-all duration-300 overflow-hidden">
                <OrbitIcon className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors animate-orbit" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tighter group-hover:text-[#FFA900] transition-colors">
                    astros.
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-gray-900 text-white px-2 py-0.5 rounded-lg">
                    Pesquisa & Validação
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-bold hidden sm:block">
                  Demonstração interativa de funcionalidades & coleta de dados
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/mural')}
                className="px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Ir ao Mural
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Barra de Progresso Superior */}
      <div className={`bg-gray-50/95 border-t border-gray-200 ${embedded ? 'border-b border-gray-200 sticky top-20 z-30 shadow-sm' : ''}`}>
          {/* Versão Desktop (telas md em diante): Stepper completo com títulos */}
          <div className="hidden md:flex max-w-6xl mx-auto px-4 sm:px-6 py-3 items-center justify-between gap-2">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;
              return (
                <div 
                  key={s.id} 
                  className={`flex items-center gap-2.5 flex-1 transition-all ${
                    isActive ? 'opacity-100 font-black' : isPast ? 'opacity-70 font-bold' : 'opacity-40 font-semibold'
                  }`}
                >
                  <div 
                    className={`h-7 w-7 rounded-xl flex items-center justify-center text-xs border-2 transition-all ${
                      isActive 
                        ? 'bg-[#FFA900] border-gray-900 text-black shadow-[2px_2px_0px_#000]' 
                        : isPast 
                        ? 'bg-gray-900 border-gray-900 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPast ? '✓' : s.id}
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-gray-900 leading-tight">{s.title}</p>
                    <p className="text-[10px] text-gray-400 font-normal leading-tight">{s.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Versão Mobile (telas menores que md): Sutil, sem scroll horizontal, 100% responsiva */}
          <div className="md:hidden px-4 py-2.5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-black text-gray-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#FFA900] inline-block animate-pulse" />
                Etapa {currentStep} de 5 • {STEPS[currentStep - 1]?.title}
              </span>
              <span className="text-[10px] font-black text-gray-600 bg-gray-200/80 px-2 py-0.5 rounded-md">
                {Math.round((currentStep / 5) * 100)}%
              </span>
            </div>
            {/* 5 barras sutis */}
            <div className="grid grid-cols-5 gap-1.5">
              {STEPS.map((s) => {
                const isPast = currentStep > s.id;
                const isActive = currentStep === s.id;
                return (
                  <div
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-[#FFA900]'
                        : isPast
                        ? 'bg-gray-900'
                        : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {completedData ? (
          /* TELA DE SUCESSO / CELEBRAÇÃO */
          <div className="bg-white rounded-3xl border-2 sm:border-[3px] border-gray-900 p-8 sm:p-12 shadow-[6px_6px_0px_#000] sm:shadow-[10px_10px_0px_#000] ring-1 ring-black/5 text-center animate-in zoom-in-95 duration-300">
            <div className="h-20 w-20 rounded-3xl bg-[#FFA900] border-3 border-gray-900 flex items-center justify-center mx-auto mb-6 text-3xl shadow-[4px_4px_0px_#000]">
              🎉
            </div>

            <span className="px-3 py-1 bg-green-100 text-green-800 border border-green-300 rounded-xl text-xs font-black uppercase tracking-wider">
              Entrevista Concluída & Dados Integrados!
            </span>

            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
              Obrigado pela sua contribuição, {completedData.user_name}!
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base font-medium mb-8">
              {profile.password ? 'Sua conta com senha foi criada com sucesso e todas as ações solicitadas foram automatizadas na rede do Astros.' : 'Sua conta sem senha foi gerada com sucesso e todas as ações solicitadas foram automatizadas na rede do Astros.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 shadow-[3px_3px_0px_#000]">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  1. Perfil Ativo
                </span>
                <p className="text-sm font-bold text-gray-900">
                  Cadastrado via e-mail
                </p>
                <p className="text-xs text-gray-600 font-mono mt-0.5">{profile.email}</p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-gray-900 bg-[#FFA900]/10 border-[#FFA900] shadow-[3px_3px_0px_#000]">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                  2. {completedData.created_projects_count > 1 ? `${completedData.created_projects_count} Projetos Publicados` : 'Projeto Publicado'}
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {completedData.created_projects_count > 1
                    ? `${completedData.created_projects_count} Projetos Ao Vivo no Mural 🚀`
                    : completedData.created_project_id
                    ? 'Projeto Ao Vivo no Mural 🚀'
                    : 'Nenhum projeto criado'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {completedData.created_project_id || completedData.created_projects_count > 0
                    ? 'Já visível para outros alunos!'
                    : 'Poderá criar a qualquer momento.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 shadow-[3px_3px_0px_#000]">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 block mb-1">
                  3. Colaborações Enviadas
                </span>
                <p className="text-sm font-bold text-gray-900">
                  {completedData.invites_sent_count} Pedido(s) Automático(s)
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  DMs criadas com os autores dos projetos marcados.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/mural')}
                className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-black transition-all shadow-[4px_4px_0px_#FFA900]"
              >
                Ver Mural de Projetos 🖼️
              </button>
              <button
                onClick={handleResetForNext}
                className="w-full sm:w-auto px-8 py-4 bg-[#FFA900] text-black rounded-2xl font-black text-sm uppercase tracking-wider border-2 border-gray-900 hover:bg-[#ffb624] transition-all shadow-[4px_4px_0px_#000]"
              >
                Iniciar Próxima Entrevista 📋
              </button>
            </div>
          </div>
        ) : (
          /* CORPO DO FORMULÁRIO WIZARD */
          <div className="bg-white rounded-3xl border-2 sm:border-[3px] border-gray-900 p-6 sm:p-10 shadow-[6px_6px_0px_#000] sm:shadow-[10px_10px_0px_#000] ring-1 ring-black/5 relative">
            
            {/* ETAPA 1: PERFIL & BOAS-VINDAS */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b-2 border-gray-100 pb-5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-3">
                    Etapa 1 de 5 • Conhecendo Você
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Conectando talentos universitários de diferentes cursos
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    O <strong>Astros</strong> ajuda alunos a tirarem ideias do papel conectando quem tem habilidades complementares. 
                    Preencha os dados abaixo para iniciar sua experiência guiada:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Lucas Valente"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFA900] font-medium text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      E-mail Principal * <span className="text-gray-400 font-normal lowercase">(usado para ativar sua conta)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="seu.email@universidade.edu.br"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFA900] font-medium text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      Instituição / Faculdade *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: UFPE, UFRPE, Católica, etc."
                      value={profile.college_name}
                      onChange={(e) => setProfile({ ...profile, college_name: e.target.value })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFA900] font-medium text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      Curso de Graduação *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Ciência da Computação, Direito, Design..."
                      value={profile.course_name}
                      onChange={(e) => setProfile({ ...profile, course_name: e.target.value })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFA900] font-medium text-sm transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      Período / Semestre Atual *
                    </label>
                    <select
                      value={profile.period}
                      onChange={(e) => setProfile({ ...profile, period: Number(e.target.value) })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none font-bold text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <option key={num} value={num}>
                          {num}º Período
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                      Idade <span className="text-gray-400 font-normal lowercase">(opcional)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 22"
                      value={profile.age}
                      onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                      className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white focus:outline-none font-medium text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-gray-500" />
                        Definir Senha de Acesso <span className="text-gray-400 font-normal lowercase">(opcional - mín. 6 caracteres)</span>
                      </span>
                    </label>
                    <input
                      type="password"
                      placeholder="Crie uma senha agora para entrar direto no site depois (ou deixe em branco para definir mais tarde)"
                      value={profile.password}
                      onChange={(e) => setProfile({ ...profile, password: e.target.value })}
                      className={`w-full p-3.5 rounded-2xl border-2 ${profile.password && profile.password.length > 0 && profile.password.length < 6 ? 'border-red-500 bg-red-50/20' : 'border-gray-900 bg-gray-50'} focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FFA900] font-medium text-sm transition-all`}
                    />
                    {profile.password && profile.password.length > 0 && profile.password.length < 6 ? (
                      <p className="text-xs text-red-600 font-bold mt-1.5">
                        A senha precisa ter no mínimo 6 caracteres se você optar por defini-la agora.
                      </p>
                    ) : (
                      <p className="text-[11px] text-gray-500 mt-1 font-medium">
                        💡 Se definir uma senha agora, você já poderá fazer login normalmente com seu e-mail e essa senha. Se preferir não criar agora, poderá definir quando quiser no primeiro acesso.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ETAPA 2: EXPERIÊNCIA & IDEIA PRÓPRIA */}
            {currentStep === 2 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div className="border-b-2 border-gray-100 pb-5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-3">
                    Etapa 2 de 5 • Desejos & Barreiras
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Experiência Prática & Vontade de Criar
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Queremos entender o que te inspira e o que já te impediu de tirar ideias do papel.
                  </p>
                </div>

                {/* Pergunta 7: Já teve ideia? */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
                  <label className="block text-sm font-black text-gray-900 mb-3">
                    7. Você já teve vontade ou ideia de desenvolver algum projeto prático/produto fora da sala de aula?
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setExperience({ ...experience, had_past_demand: true })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                        experience.had_past_demand
                          ? 'bg-[#FFA900] text-black border-gray-900 shadow-[2px_2px_0px_#000]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      Sim, com certeza! 👍
                    </button>
                    <button
                      type="button"
                      onClick={() => setExperience({ ...experience, had_past_demand: false })}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                        !experience.had_past_demand
                          ? 'bg-gray-900 text-white border-gray-900 shadow-[2px_2px_0px_#000]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      Não / Ainda não
                    </button>
                  </div>

                  {experience.had_past_demand && (
                    <div className="mt-5 space-y-4 pt-4 border-t border-gray-200 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-1.5">
                          8. Qual era a ideia ou tema principal que você pensou?
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: Aplicativo de caronas para o campus, plataforma de estudos..."
                          value={experience.details_past_demand}
                          onChange={(e) => setExperience({ ...experience, details_past_demand: e.target.value })}
                          className="w-full p-3 rounded-xl border-2 border-gray-900 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA900]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                          9. O que mais dificultou ou te impediu de tirar essa ideia do papel?
                        </label>
                        <div className="space-y-2">
                          {PREDEFINED_BARRIERS.map((barrier, idx) => {
                            const isChecked = experience.past_barriers.includes(barrier);
                            return (
                              <label
                                key={idx}
                                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                  isChecked
                                    ? 'bg-amber-50 border-amber-400 font-bold text-gray-900'
                                    : 'bg-white border-gray-200 hover:border-gray-400 text-gray-700 font-medium'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    setExperience((prev) => ({
                                      ...prev,
                                      past_barriers: isChecked
                                        ? prev.past_barriers.filter((b) => b !== barrier)
                                        : [...prev.past_barriers, barrier]
                                    }));
                                  }}
                                  className="h-4 w-4 rounded accent-[#FFA900]"
                                />
                                <span className="text-xs sm:text-sm">{barrier}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pergunta 10: Como agiria caso pessoas se interessassem pela sua ideia? */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
                  <label className="block text-sm font-black text-gray-900 mb-3">
                    10. Caso você tenha (ou tivesse) uma ideia de projeto, como você agiria se pessoas de outros cursos se interessassem por ela e quisessem colaborar?
                  </label>
                  <div className="space-y-2.5">
                    {[
                      {
                        title: 'Ficaria muito empolgado e abriria o projeto para formar um time multidisciplinar e liderar',
                        desc: 'Quero ver a ideia nascer com o apoio de quem tem competências complementares.'
                      },
                      {
                        title: 'Gostaria de conversar primeiro para alinhar expectativas, ritmo e objetivos',
                        desc: 'Prefiro conhecer o comprometimento de cada um antes de formalizar.'
                      },
                      {
                        title: 'Aceitaria ajuda pontual em tarefas específicas, mas preferiria manter controle estrito',
                        desc: 'Gosto de centralizar as decisões principais do projeto.'
                      },
                      {
                        title: 'Ainda teria receio ou insegurança de liderar outras pessoas',
                        desc: 'Preferiria participar como colaborador em um projeto já liderado por outro aluno.'
                      }
                    ].map((opt, idx) => {
                      const isSelected = experience.how_would_act_on_incoming_interest === opt.title;
                      return (
                        <div
                          key={idx}
                          onClick={() => setExperience({ ...experience, how_would_act_on_incoming_interest: opt.title })}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#FFA900]/20 border-gray-900 font-bold shadow-[2px_2px_0px_#000]'
                              : 'bg-white border-gray-200 hover:border-gray-900 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full border-2 ${isSelected ? 'bg-black border-black' : 'border-gray-400'}`} />
                            <p className="text-xs sm:text-sm text-gray-900 font-bold">{opt.title}</p>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 pl-5">{opt.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pergunta 11: Cadastrar Projeto Agora */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-[#FFA900]/10 border-dashed">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-[#FFA900]" />
                        11. Você tem ou já teve alguma ideia de projeto que gostaria de tirar do papel / cadastrar?
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Ao cadastrar, você pode escolher se quer liderar o projeto ou deixá-lo como ideia sugerida para a comunidade!
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setExperience({ ...experience, wants_to_create_project: true })}
                      className={`flex-1 py-2.5 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                        experience.wants_to_create_project
                          ? 'bg-gray-900 text-white border-gray-900 shadow-[2px_2px_0px_#000]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      Sim, quero cadastrar 🚀
                    </button>
                    <button
                      type="button"
                      onClick={() => setExperience({ ...experience, wants_to_create_project: false })}
                      className={`flex-1 py-2.5 px-4 rounded-xl border-2 font-black text-xs uppercase tracking-wider transition-all ${
                        !experience.wants_to_create_project
                          ? 'bg-white text-gray-900 border-gray-900 font-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                      }`}
                    >
                      Não por enquanto
                    </button>
                  </div>

                  {experience.wants_to_create_project && (
                    <div className="space-y-4 pt-3 border-t border-amber-200 animate-in fade-in">
                      {/* Escolha: Dono/Líder vs Ideia Sugerida */}
                      <div className="p-4 rounded-2xl border-2 border-gray-900 bg-white">
                        <label className="block text-xs font-black uppercase tracking-wider text-gray-900 mb-2">
                          Deseja aparecer como o(a) dono(a)/líder desse projeto no Mural? *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setExperience({ ...experience, wants_to_be_owner: true })}
                            className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                              experience.wants_to_be_owner
                                ? 'bg-[#FFA900]/20 border-gray-900 shadow-[2px_2px_0px_#000]'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-900 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`h-3 w-3 rounded-full border-2 ${experience.wants_to_be_owner ? 'bg-black border-black' : 'border-gray-400'}`} />
                              <p className="text-xs font-black text-gray-900">👑 Sim, quero liderar</p>
                            </div>
                            <p className="text-[11px] text-gray-600 pl-5">
                              Seu perfil aparecerá como líder na seção <strong>Projetos em Andamento</strong>.
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setExperience({ ...experience, wants_to_be_owner: false })}
                            className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                              !experience.wants_to_be_owner
                                ? 'bg-amber-100/60 border-amber-600 shadow-[2px_2px_0px_#000]'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-900 text-gray-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`h-3 w-3 rounded-full border-2 ${!experience.wants_to_be_owner ? 'bg-black border-black' : 'border-gray-400'}`} />
                              <p className="text-xs font-black text-gray-900">💡 Ideia Sugerida Aberta</p>
                            </div>
                            <p className="text-[11px] text-gray-600 pl-5">
                              Entra como ideia sugerida (<strong>Aguardando Líder</strong>) para outros alunos adotarem.
                            </p>
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-black uppercase tracking-wider text-gray-700">
                            Nome do Projeto *
                          </label>
                          <span className="text-[11px] text-gray-400 font-medium">mín. 2 letras</span>
                        </div>
                        <input
                          type="text"
                          placeholder="Ex: EcoUbíqua, App de Saúde Mental Universitária..."
                          value={experience.project_name}
                          onChange={(e) => setExperience({ ...experience, project_name: e.target.value })}
                          className="w-full p-3 rounded-xl border-2 border-gray-900 bg-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#FFA900]"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-black uppercase tracking-wider text-gray-700">
                            Descrição do Desafio / Proposta *
                          </label>
                          <span className={`text-[11px] font-bold ${
                            experience.project_description.trim().length >= 10
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}>
                            {experience.project_description.trim().length}/10 mín. caracteres
                          </span>
                        </div>
                        <textarea
                          rows={3}
                          placeholder="Explique o problema que resolve e o que vocês pretendem construir (mínimo de 10 caracteres)..."
                          value={experience.project_description}
                          onChange={(e) => setExperience({ ...experience, project_description: e.target.value })}
                          className={`w-full p-3 rounded-xl border-2 bg-white font-medium text-sm focus:outline-none transition-colors ${
                            experience.project_description.trim().length > 0 && experience.project_description.trim().length < 10
                              ? 'border-amber-500 focus:ring-2 focus:ring-amber-400'
                              : 'border-gray-900 focus:ring-2 focus:ring-[#FFA900]'
                          }`}
                        />
                        {experience.project_description.trim().length > 0 && experience.project_description.trim().length < 10 && (
                          <p className="text-[11px] text-amber-600 font-bold mt-1">
                            Escreva pelo menos mais {10 - experience.project_description.trim().length} caractere(s) para poder avançar.
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                          <div>
                            <label className="text-xs font-black uppercase tracking-wider text-gray-700 block">
                              Vagas / Habilidades que você busca (opcional):
                            </label>
                            <span className="text-[11px] text-gray-500 font-medium">
                              Adicione competências que procura ou crie sem vagas para defini-las depois.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setExperience({
                                ...experience,
                                roles: [
                                  ...experience.roles,
                                  { role_name: '', role_explanation: '', role_quantity: 1 }
                                ]
                              })
                            }
                            className="text-xs font-black text-gray-900 flex items-center gap-1 hover:underline self-start sm:self-auto"
                          >
                            <Plus className="h-3 w-3" /> Adicionar Vaga
                          </button>
                        </div>

                        {experience.roles.length === 0 ? (
                          <div className="p-4 rounded-xl border-2 border-dashed border-gray-300 text-center bg-white/70">
                            <p className="text-xs font-bold text-gray-700">
                              Nenhuma vaga em aberto cadastrada no momento.
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              O projeto será criado sem vagas extras. Você poderá abrir vagas e buscar colaboradores a qualquer momento.
                            </p>
                            <button
                              type="button"
                              onClick={() =>
                                setExperience({
                                  ...experience,
                                  roles: [
                                    { role_name: '', role_explanation: '', role_quantity: 1 }
                                  ]
                                })
                              }
                              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-black hover:bg-black transition-colors"
                            >
                              <Plus className="h-3 w-3" /> Adicionar Primeira Vaga
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2.5">
                            {experience.roles.map((r, rIdx) => (
                              <div
                                key={rIdx}
                                className="flex flex-col sm:flex-row gap-2 sm:items-center p-2.5 sm:p-0 bg-white sm:bg-transparent rounded-xl sm:rounded-none border border-gray-200 sm:border-0"
                              >
                                <input
                                  type="text"
                                  placeholder="Nome da Vaga (ex: UI Designer)"
                                  value={r.role_name}
                                  onChange={(e) => {
                                    const updated = [...experience.roles];
                                    updated[rIdx].role_name = e.target.value;
                                    setExperience({ ...experience, roles: updated });
                                  }}
                                  className="w-full sm:w-1/3 min-w-0 p-2.5 rounded-xl border-2 border-gray-900 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FFA900]"
                                />
                                <input
                                  type="text"
                                  placeholder="Breve explicação da função"
                                  value={r.role_explanation}
                                  onChange={(e) => {
                                    const updated = [...experience.roles];
                                    updated[rIdx].role_explanation = e.target.value;
                                    setExperience({ ...experience, roles: updated });
                                  }}
                                  className="w-full sm:flex-1 min-w-0 p-2.5 rounded-xl border-2 border-gray-900 bg-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#FFA900]"
                                />
                                <div className="flex justify-end sm:block">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExperience({
                                        ...experience,
                                        roles: experience.roles.filter((_, i) => i !== rIdx)
                                      });
                                    }}
                                    className="h-9 w-9 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors flex-shrink-0"
                                    title="Remover esta vaga"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ETAPA 3: DEGUSTAÇÃO DO MURAL */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b-2 border-gray-100 pb-5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-3">
                    Etapa 3 de 5 • Vitrine Interativa
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    12. Degustação do Mural de Projetos
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Explore os projetos reais cadastrados e as ideias sugeridas. Clique para abrir detalhes e marque{' '}
                    <strong>⭐ "Quero Colaborar"</strong> naqueles que despertarem seu interesse!
                  </p>
                </div>

                {/* Filtros de Área & Busca */}
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar projetos por palavra-chave ou competência..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white text-sm font-medium focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => setSelectedArea('all')}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${
                        selectedArea === 'all'
                          ? 'bg-gray-900 text-white border-gray-900 shadow-[2px_2px_0px_#FFA900]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      Todas as Áreas
                    </button>
                    {MURAL_AREAS.filter((a) => a.id !== 'all').map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setSelectedArea(a.id)}
                        className={`px-3.5 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all ${
                          selectedArea === a.id
                            ? 'bg-[#FFA900] text-black border-gray-900 shadow-[2px_2px_0px_#000]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banner de Ideias Adotadas */}
                {adoptedProjects.length > 0 && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-[#FFA900] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-xl bg-[#FFA900] text-black font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        🚀
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-wider text-amber-900">
                          Ideias Adotadas para Liderar ({adoptedProjects.length}/{MAX_ADOPTED_PROJECTS}):
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          {adoptedProjects.map((ap, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-xs font-bold text-gray-900 shadow-sm"
                            >
                              <span>{ap.name}</span>
                              <button
                                type="button"
                                onClick={() => setAdoptedProjects((prev) => prev.filter((_, i) => i !== idx))}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                title="Remover ideia adotada"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-amber-800 font-semibold self-start sm:self-auto">
                      Serão criadas sob sua liderança ao concluir a pesquisa.
                    </span>
                  </div>
                )}

                {/* Grid de Projetos */}
                {loadingProjects ? (
                  <div className="p-12 text-center text-gray-400 font-bold">Carregando projetos do mural...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                    {filteredProjects.map((p) => {
                      const isInterested = interestedProjectIds.includes(p.project_id);
                      const isMock = Boolean(p.is_mock);
                      const isAdopted = adoptedProjects.some(
                        (ap) => ap.project_id === p.project_id || ap.name.toLowerCase() === p.name.toLowerCase()
                      );
                      return (
                        <div
                          key={p.project_id}
                          className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                            isAdopted
                              ? 'bg-emerald-50/70 border-emerald-600 shadow-[3px_3px_0px_#059669]'
                              : isInterested
                              ? 'bg-amber-50/80 border-[#FFA900] shadow-[3px_3px_0px_#FFA900]'
                              : 'bg-white border-gray-900 hover:shadow-[3px_3px_0px_#000]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg bg-gray-900 text-white">
                                {p.areas?.[0] || p.area}
                              </span>
                              {isMock ? (
                                isAdopted ? (
                                  <span className="text-[10px] font-black text-white bg-emerald-700 px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                                    <Rocket className="h-3 w-3" /> Adotada por Você
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                                    💡 Ideia Sugerida
                                  </span>
                                )
                              ) : (
                                <span className="text-[10px] font-black text-green-800 bg-green-100 px-2 py-0.5 rounded-lg">
                                  🟢 Projeto Ativo
                                </span>
                              )}
                            </div>

                            <h4 className="font-black text-base text-gray-900 leading-tight mb-1">
                              {p.name}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                              {p.summary || p.description}
                            </p>

                            {!isMock && p.creator_name && (
                              <p className="text-[11px] text-gray-500 font-medium mb-2">
                                Por: <strong className="text-gray-900">{p.creator_name}</strong> ({p.creator_course || 'Aluno'})
                              </p>
                            )}
                          </div>

                          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveModalProject(p)}
                              className="text-xs font-black text-gray-800 hover:underline flex items-center gap-1"
                            >
                              Ver Preview <ArrowRight className="h-3 w-3" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleInterest(p.project_id, !isInterested)}
                              className={`px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                                isInterested
                                  ? 'bg-[#FFA900] text-black border-2 border-gray-900 shadow-[2px_2px_0px_#000]'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              <Star className={`h-3.5 w-3.5 ${isInterested ? 'fill-black text-black' : 'text-gray-400'}`} />
                              {isInterested ? 'Selecionado ⭐' : 'Interesse'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Banner de Interesse Selecionado */}
                <div className="p-4 rounded-2xl bg-gray-900 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-[#FFA900] text-black flex items-center justify-center font-black">
                      ⭐
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider text-amber-400">
                        Projetos Selecionados para Colaboração:
                      </p>
                      <p className="text-sm font-bold">
                        {interestedProjectIds.length} projeto(s) marcado(s) com intenção de contato
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 hidden sm:block">
                    Avisos de colaboração serão enviados no final!
                  </span>
                </div>
              </div>
            )}

            {/* ETAPA 4: VALIDAÇÃO & OPINIÃO */}
            {currentStep === 4 && (
              <div className="space-y-7 animate-in fade-in duration-300">
                <div className="border-b-2 border-gray-100 pb-5">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-3">
                    Etapa 4 de 5 • Validação & Interdisciplinaridade
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Validação da Proposta de Valor
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Sua visão sincera é indispensável para direcionar o futuro do Astros.
                  </p>
                </div>

                {/* Pergunta 13: Entraria em contato com a pessoa? */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
                  <label className="block text-sm font-black text-gray-900 mb-3">
                    13. Se você encontrasse no Astros um projeto que realmente te interessasse, você entraria em contato com essa pessoa para produzirem juntos? *
                  </label>
                  <div className="space-y-2.5">
                    {[
                      'Com certeza! Mandaria mensagem imediatamente para combinar como ajudar',
                      'Provavelmente sim, desde que o projeto e o papel necessário fossem bem claros',
                      'Ficaria com um pouco de vergonha ou receio, mas provavelmente tentaria',
                      'Provavelmente não, prefiro que os outros tomem a iniciativa e venham falar comigo',
                      'Não entraria em contato'
                    ].map((opt, idx) => {
                      const isSelected = validation.would_reach_out === opt;
                      return (
                        <div
                          key={idx}
                          onClick={() => setValidation({ ...validation, would_reach_out: opt })}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-[#FFA900]/20 border-gray-900 font-bold shadow-[2px_2px_0px_#000]'
                              : 'bg-white border-gray-200 hover:border-gray-900 font-medium'
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 ${isSelected ? 'bg-black border-black' : 'border-gray-400'}`} />
                          <span className="text-xs sm:text-sm text-gray-900">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pergunta 14: Atividades interdisciplinares melhorariam aprendizado? */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
                  <label className="block text-sm font-black text-gray-900 mb-3">
                    14. Você acha que atividades e projetos interdisciplinares entre cursos diferentes seriam benéficos e melhorariam o seu aprendizado universitário? *
                  </label>
                  <div className="space-y-2.5">
                    {[
                      'Sim, com certeza! A faculdade ensina muita teoria isolada e o mercado exige visão prática multidisciplinar',
                      'Sim, seria uma excelente forma de aprender na prática e expandir networking',
                      'Depende muito da dedicação e comprometimento das pessoas envolvidas',
                      'Não acho que agregaria tanto à minha formação'
                    ].map((opt, idx) => {
                      const isSelected = validation.interdisciplinary_opinion === opt;
                      return (
                        <div
                          key={idx}
                          onClick={() => setValidation({ ...validation, interdisciplinary_opinion: opt })}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                            isSelected
                              ? 'bg-[#FFA900]/20 border-gray-900 font-bold shadow-[2px_2px_0px_#000]'
                              : 'bg-white border-gray-200 hover:border-gray-900 font-medium'
                          }`}
                        >
                          <span className={`h-3.5 w-3.5 rounded-full border-2 flex-shrink-0 ${isSelected ? 'bg-black border-black' : 'border-gray-400'}`} />
                          <span className="text-xs sm:text-sm text-gray-900">{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pergunta 15: Funcionalidades mais valiosas */}
                <div className="p-5 rounded-2xl border-2 border-gray-900 bg-gray-50">
                  <label className="block text-sm font-black text-gray-900 mb-3">
                    15. Quais funcionalidades apresentadas você achou mais valiosas para o seu dia a dia universitário?
                  </label>
                  <div className="space-y-2">
                    {PREDEFINED_FEATURES.map((feature, idx) => {
                      const isChecked = validation.valuable_features.includes(feature);
                      return (
                        <label
                          key={idx}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-amber-50 border-amber-400 font-bold text-gray-900'
                              : 'bg-white border-gray-200 hover:border-gray-400 text-gray-700 font-medium'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setValidation((prev) => ({
                                ...prev,
                                valuable_features: isChecked
                                  ? prev.valuable_features.filter((f) => f !== feature)
                                  : [...prev.valuable_features, feature]
                              }));
                            }}
                            className="h-4 w-4 rounded accent-[#FFA900]"
                          />
                          <span className="text-xs sm:text-sm">{feature}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Pergunta 16: Comentário livre */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
                    16. Alguma sugestão, crítica ou comentário livre sobre o Astros? <span className="text-gray-400 font-normal lowercase">(opcional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Deixe sua impressão, dúvida ou sugestão para a equipe..."
                    value={validation.feedback}
                    onChange={(e) => setValidation({ ...validation, feedback: e.target.value })}
                    className="w-full p-3.5 rounded-2xl border-2 border-gray-900 bg-gray-50 focus:bg-white text-sm font-medium focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* ETAPA 5: REVISÃO & ATIVAÇÃO */}
            {currentStep === 5 && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="border-b-2 border-gray-100 pb-5">
                  <span className="px-3 py-1 bg-green-100 text-green-900 border border-green-300 rounded-xl text-xs font-black uppercase tracking-wider inline-block mb-3">
                    Etapa 5 de 5 • Revisão Final
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    Pronto para finalizar e ativar sua participação!
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Confira as automações que o Astros executará imediatamente ao clicar no botão abaixo:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#FFA900] text-black font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      👤
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900">1. Cadastro Imediato sem Senha</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Sua conta de aluno será criada para <strong>{profile.name}</strong> ({profile.email}), vinculado a <strong>{profile.college_name}</strong> ({profile.course_name}, {profile.period}º período).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gray-900 text-white font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      🚀
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-sm text-gray-900">2. Publicação de Projeto(s) no Mural</h4>
                      {(() => {
                        const hasOwnProject = experience.wants_to_create_project && experience.project_name.trim().length >= 2;
                        const hasAdopted = adoptedProjects.length > 0;

                        if (!hasOwnProject && !hasAdopted) {
                          return (
                            <p className="text-xs text-gray-500 mt-0.5">
                              Nenhum projeto cadastrado nesta entrevista. Você poderá propor ou adotar ideias a qualquer momento após entrar.
                            </p>
                          );
                        }

                        return (
                          <div className="mt-2 space-y-2">
                            {hasOwnProject && (
                              <div className="p-3 rounded-xl bg-white border-2 border-gray-900 text-xs shadow-sm">
                                <span className="font-black text-gray-900 block text-xs">
                                  Projeto Próprio: "{experience.project_name}"
                                </span>
                                <span className="text-[11px] text-gray-600 block mt-0.5">
                                  {experience.wants_to_be_owner ? (
                                    <strong className="text-emerald-700">Projeto Ativo sob sua liderança</strong>
                                  ) : (
                                    <strong className="text-amber-700">Ideia Sugerida Aberta (Aguardando Líder)</strong>
                                  )}{' '}
                                  • {experience.roles.filter(r => r.role_name && r.role_name.trim()).length} vaga(s) em aberto
                                </span>
                              </div>
                            )}
                            {hasAdopted && (
                              adoptedProjects.map((ap, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-amber-50/90 border-2 border-[#FFA900] text-xs shadow-sm">
                                  <span className="font-black text-gray-900 block text-xs">
                                    Ideia Adotada do Mural: "{ap.name}"
                                  </span>
                                  <span className="text-[11px] text-emerald-700 font-bold block mt-0.5">
                                    Liderança do projeto assumida por você • {ap.roles.length} vaga(s) em aberto
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-gray-900 bg-gray-50 flex items-start gap-3">
                    <div className="h-8 w-8 rounded-xl bg-[#FFA900] text-black font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-gray-900">3. Conexões & Colaborações Automáticas</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {interestedProjectIds.length > 0 ? (
                          <>
                            Serão criadas <strong>{interestedProjectIds.length} conversa(s) direta(s) (DMs)</strong> com os autores dos projetos que você marcou com ⭐, enviando uma mensagem de apresentação automática e pedido de colaboração!
                          </>
                        ) : (
                          'Nenhum projeto específico marcado com interesse de colaboração.'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-medium">
                  💡 <strong>Impacto da Pesquisa:</strong> Todas as respostas serão consolidadas para validação acadêmica e comprovação de viabilidade da plataforma Astros.
                </div>
              </div>
            )}

            {/* BARRA DE NAVEGAÇÃO INFERIOR */}
            <div className="mt-8 pt-6 border-t-2 border-gray-100 flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  disabled={submitting}
                  className="px-5 py-3 rounded-2xl border-2 border-gray-900 text-gray-800 font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Voltar
                </button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!canProceed()}
                  className={`px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
                    canProceed()
                      ? 'bg-[#FFA900] text-black border-2 border-gray-900 shadow-[4px_4px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#000]'
                      : 'bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  Próxima Etapa <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-[4px_4px_0px_#FFA900] hover:bg-black transition-all hover:scale-[1.01]"
                >
                  {submitting ? (
                    'Processando Automações...'
                  ) : (
                    <>
                      <Rocket className="h-4 w-4 text-[#FFA900]" />
                      Finalizar Entrevista & Ativar Participação 🚀
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE PREVIEW DO PROJETO EM MODO ENTREVISTA */}
      {activeModalProject && (
        <ProjectPreviewModal
          project={activeModalProject}
          isOpen={Boolean(activeModalProject)}
          onClose={() => setActiveModalProject(null)}
          isInterviewMode={true}
          isInterested={interestedProjectIds.includes(activeModalProject.project_id)}
          isAdopted={adoptedProjects.some(
            (ap) => ap.project_id === activeModalProject.project_id || ap.name.toLowerCase() === activeModalProject.name.toLowerCase()
          )}
          onToggleInterest={(id, state) => handleToggleInterest(id, state)}
          onStartProject={(mockProj) => handleAdoptIdea(mockProj)}
        />
      )}
    </div>
  );
}
