// Dados mockados de alta fidelidade para o Mural do Astros (Ideias Sugeridas)
// Ideias sugeridas são propostas abertas de desafios multidisciplinares aguardando alunos
// para liderar e montar suas equipes. Não possuem participantes nem criadores fictícios.
// NOTA ARQUITETURAL: A dinâmica de criação/utilização dessas ideias sugeridas será reformulada
// em breve (detalhes em arq_md/mural_projetos_sugeridos.md). Evite acoplar regras aqui.

export const MURAL_AREAS = [
  { id: 'all', label: 'Todas as Áreas' },
  { id: 'Tecnologia', label: 'Tecnologia' },
  { id: 'Engenharia', label: 'Engenharia' },
  { id: 'Saúde', label: 'Saúde' },
  { id: 'Direito', label: 'Direito' },
  { id: 'Negócios', label: 'Negócios' },
  { id: 'Design', label: 'Design' },
  { id: 'Comunicação', label: 'Comunicação' },
  { id: 'Humanidades & Educação', label: 'Humanas' },
  { id: 'Ciências Agrárias & Ambientais', label: 'Agrárias & Ambientais' },
];

export const MURAL_PROJECTS = [
  // TECNOLOGIA + SAÚDE
  {
    project_id: 101,
    name: 'CampusVoice: Acessibilidade com IA',
    areas: ['Tecnologia', 'Saúde'],
    summary: 'Transcrição em tempo real de aulas e navegação acessível no campus para universitários com deficiência visual e auditiva.',
    description: 'O CampusVoice nasceu para combater as barreiras diárias de acessibilidade enfrentadas no ensino superior. Desenvolvemos microfones direcionais conectados a IA de fala-para-texto com vocabulário técnico acadêmico.',
    tags: ['IA', 'Acessibilidade', 'Inclusão', 'Mobile'],
    created_at: '2026-10-18T10:30:00Z',
    is_active: true,
    roles: [
      { id: 1, name: 'Engenharia de Software / IA', explanation: 'Coordenação técnica e integração com APIs de fala e transcrição.', is_filled: false },
      { id: 2, name: 'Fonoaudiologia / Linguística', explanation: 'Avaliação de inteligibilidade fonética e validação de termos técnicos.', is_filled: false },
      { id: 3, name: 'Design A11y (Acessibilidade)', explanation: 'Telas com diretrizes WCAG 2.2 e alto contraste para baixa visão.', is_filled: false }
    ]
  },

  // TECNOLOGIA + ENGENHARIA
  {
    project_id: 102,
    name: 'OpenLab: Gêmeos Digitais para Laboratórios',
    areas: ['Tecnologia', 'Engenharia'],
    summary: 'Simulação WebGL de bancadas de eletrônica e química para faculdades sem infraestrutura física avançada.',
    description: 'Permitir que alunos realizem práticas laboratoriais avançadas no próprio navegador antes das aulas presenciais, reduzindo risco de acidentes e quebra de componentes caros.',
    tags: ['WebGL', 'Simulação', 'Educação', 'Computação Gráfica'],
    created_at: '2026-10-19T14:00:00Z',
    is_active: true,
    roles: [
      { id: 4, name: 'Engenharia de Simulação 3D', explanation: 'Modelagem dos circuitos e física dos fluidos no canvas.', is_filled: false },
      { id: 5, name: 'Química / Farmácia', explanation: 'Revisão dos reagentes e cinética das reações químicas simuladas.', is_filled: false },
      { id: 6, name: 'Pedagogia / Design Instrucional', explanation: 'Estruturação dos roteiros de aula e tutoriais práticos.', is_filled: false }
    ]
  },

  // SAÚDE + TECNOLOGIA
  {
    project_id: 103,
    name: 'GlicoTrack: Gestão Pediátrica de Diabetes',
    areas: ['Saúde', 'Tecnologia'],
    summary: 'App gamificado e mascote virtual para crianças com diabetes tipo 1 monitorarem glicemia com menor estresse.',
    description: 'Acompanhamento interativo e leve da rotina glicêmica, transformando medições e contagem de carboidratos em conquistas lúdicas compartilhadas com pais e pediatras.',
    tags: ['Saúde Digital', 'Gamificação', 'Pediatria', 'Nutrição'],
    created_at: '2026-10-22T14:15:00Z',
    is_active: true,
    roles: [
      { id: 7, name: 'Pesquisa Clínica / Nutrição', explanation: 'Protocolos de segurança clínica e validação com famílias.', is_filled: false },
      { id: 8, name: 'Desenvolvedor Full Stack', explanation: 'Construção da API e sincronização do painel médico.', is_filled: false },
      { id: 9, name: 'Ilustrador 2D / Mascotes', explanation: 'Criação das reações e trajes da mascote interativa.', is_filled: false }
    ]
  },

  // SAÚDE + TECNOLOGIA
  {
    project_id: 104,
    name: 'NeuroSync: Monitor de Burnout Acadêmico',
    areas: ['Saúde', 'Tecnologia'],
    summary: 'Wearable e algoritmo preditivo para detecção precoce de fadiga cognitiva extrema em universitários.',
    description: 'Análise de variabilidade da frequência cardíaca (HRV) combinada com diário emocional para identificar picos de estresse crônico antes da semana de provas.',
    tags: ['Neurociência', 'Wearables', 'Psicologia', 'Data Science'],
    created_at: '2026-10-23T11:00:00Z',
    is_active: true,
    roles: [
      { id: 10, name: 'Pesquisa em Psicometria', explanation: 'Desenvolvimento das escalas e testes clínicos de estresse.', is_filled: false },
      { id: 11, name: 'Cientista de Dados (Python)', explanation: 'Modelagem de séries temporais de sinais fisiológicos.', is_filled: false },
      { id: 12, name: 'Engenharia Biomédica', explanation: 'Calibração dos sensores de fotopletismografia (PPG).', is_filled: false }
    ]
  },

  // DIREITO + TECNOLOGIA
  {
    project_id: 105,
    name: 'JurisClaro: Contratos Acessíveis para PMEs',
    areas: ['Direito', 'Tecnologia'],
    summary: 'Auditoria de cláusulas de risco e tradução de jargões jurídicos para microempreendedores periféricos.',
    description: 'O JurisClaro traduz o juridiquês em linguagem clara, aponta riscos contratuais frequentes e sugere alternativas equilibradas para quem não pode pagar bancas de advocacia.',
    tags: ['LegalTech', 'Impacto Social', 'IA', 'Empreendedorismo'],
    created_at: '2026-10-25T09:00:00Z',
    is_active: true,
    roles: [
      { id: 13, name: 'Consultoria Jurídica / Contratos', explanation: 'Classificação de cláusulas e base normativa de defesa do PME.', is_filled: false },
      { id: 14, name: 'Engenharia de NLP (Texto)', explanation: 'Construção do extrator de cláusulas abusivas com processamento de linguagem natural.', is_filled: false },
      { id: 15, name: 'Design de UX / Visual Law', explanation: 'Visual Law e diagnósticos intuitivos em forma de semáforo.', is_filled: false }
    ]
  },

  // DIREITO + TECNOLOGIA
  {
    project_id: 106,
    name: 'DefensoriaTech: Triagem de Ações Coletivas',
    areas: ['Direito', 'Tecnologia'],
    summary: 'Canal comunitário para mapear queixas habitacionais e gerar dossiês para a Defensoria Pública.',
    description: 'Plataforma para associações de bairro registrarem violações ao direito à moradia, saneamento e transporte, agrupando evidências de forma estruturada para ações civis públicas.',
    tags: ['Direitos Humanos', 'Habitação', 'Mobilização', 'Open Data'],
    created_at: '2026-10-26T15:30:00Z',
    is_active: true,
    roles: [
      { id: 16, name: 'Articulação Jurídica / Processual', explanation: 'Triagem processual e interlocução estruturada com defensores.', is_filled: false },
      { id: 17, name: 'Desenvolvedor Web', explanation: 'Formulários offline-first e upload seguro de fotos e documentos.', is_filled: false },
      { id: 18, name: 'Serviço Social / Pesquisa de Campo', explanation: 'Metodologia de escuta comunitária nas periferias.', is_filled: false }
    ]
  },

  // NEGÓCIOS + ENGENHARIA
  {
    project_id: 107,
    name: 'CicloVerde: Logística Reversa Universitária',
    areas: ['Negócios', 'Engenharia'],
    summary: 'Marketplace de componentes reaproveitáveis e urnas de descarte de hardware eletrônico no campus.',
    description: 'Campi descartam quilos de placas, telas e fontes todo semestre. O CicloVerde cria uma ponte circular para teste, catálogo e doação de peças funcionais para laboratórios e alunos.',
    tags: ['Economia Circular', 'Sustentabilidade', 'ESG', 'Hardware'],
    created_at: '2026-10-30T16:20:00Z',
    is_active: true,
    roles: [
      { id: 19, name: 'Estratégia de Negócios & ESG', explanation: 'Parcerias com a prefeitura do campus e cooperativas de reciclagem.', is_filled: false },
      { id: 20, name: 'Engenharia de Hardware', explanation: 'Triagem técnica das peças e bancada de teste rápido de componentes.', is_filled: false },
      { id: 21, name: 'Comunicação & Campanhas', explanation: 'Engajamento com centros acadêmicos e atléticas universitárias.', is_filled: false }
    ]
  },

  // NEGÓCIOS + DESIGN
  {
    project_id: 108,
    name: 'UniMatch: Estágios em Desafios Reais',
    areas: ['Negócios', 'Design'],
    summary: 'Plataforma para conectar ONGs e pequenas empresas a squads multidisciplinares de estudantes.',
    description: 'Em vez de vagas burocráticas, empresas publicam desafios práticos de 6 semanas onde equipes com alunos de marketing, código e gestão entregam soluções conjuntas.',
    tags: ['EdTech', 'Recrutamento', 'Squads', 'Empregabilidade'],
    created_at: '2026-10-31T08:45:00Z',
    is_active: true,
    roles: [
      { id: 22, name: 'Estratégia & Captação', explanation: 'Captação de empresas parceiras e definição de métricas de impacto.', is_filled: false },
      { id: 23, name: 'Desenvolvedor Full Stack', explanation: 'Algoritmo de matchmaking de habilidades complementares.', is_filled: false },
      { id: 24, name: 'Design de Produto', explanation: 'Fluxos de onboarding e painel de acompanhamento dos squads.', is_filled: false }
    ]
  },

  // DESIGN + TECNOLOGIA
  {
    project_id: 109,
    name: 'Arandu: Narrativas Indígenas em AR',
    areas: ['Design', 'Tecnologia'],
    summary: 'Livro didático com animações 3D e relatos orais em línguas originárias para escolas de ensino fundamental.',
    description: 'Em cocriação com lideranças e professores indígenas, o livro físico ganha vida pelo celular com ilustrações animadas e narrações tradicionais bilíngues.',
    tags: ['Cultura', 'Realidade Aumentada', 'Design Editorial', 'WebXR'],
    created_at: '2026-11-01T11:45:00Z',
    is_active: true,
    roles: [
      { id: 25, name: 'Direção de Arte & Ilustração', explanation: 'Concepção visual das pranchas e diagramação editorial.', is_filled: false },
      { id: 26, name: 'Desenvolvedor Unity / WebXR', explanation: 'Programação dos gatilhos de AR no navegador sem app pesado.', is_filled: false },
      { id: 27, name: 'Antropologia / Educação', explanation: 'Curadoria pedagógica e alinhamento à Lei 11.645/08.', is_filled: false }
    ]
  },

  // DESIGN + SAÚDE
  {
    project_id: 110,
    name: 'TypoLab: Tipografia Inclusiva para Dislexia',
    areas: ['Design', 'Saúde'],
    summary: 'Família tipográfica variável calibrada para legibilidade em apostilas e plataformas de ensino superior.',
    description: 'Desenvolvimento e testes de fontes digitais com compensação de peso inferior e distinção geométrica entre glifos frequentemente espelhados por estudantes disléxicos.',
    tags: ['Design Tipográfico', 'Acessibilidade', 'Educação', 'Neurologia'],
    created_at: '2026-11-02T13:10:00Z',
    is_active: true,
    roles: [
      { id: 28, name: 'Type Design / Tipografia', explanation: 'Desenho vetorial dos glifos e calibração de eixos variáveis.', is_filled: false },
      { id: 29, name: 'Pesquisa em Neurociência Cognitiva', explanation: 'Ensaios de rastreamento ocular (Eye-tracking) e velocidade de leitura.', is_filled: false },
      { id: 30, name: 'Engenharia Frontend', explanation: 'Módulos CSS e plugins para navegadores para aplicação das fontes.', is_filled: false }
    ]
  },

  // ENGENHARIA + SAÚDE
  {
    project_id: 111,
    name: 'SolarDrop: Dessalinizador Solar Passivo',
    areas: ['Engenharia', 'Saúde'],
    summary: 'Equipamento modular de purificação solar de água salobra de baixo custo para comunidades do semiárido.',
    description: 'Sistema térmico solar que purifica até 10 litros de água por dia sem eletricidade, usando peças rotomoldadas e plástico reciclável com fácil manutenção local.',
    tags: ['Saneamento', 'Energia Solar', 'Mecânica', 'Impacto Social'],
    created_at: '2026-11-03T18:00:00Z',
    is_active: true,
    roles: [
      { id: 31, name: 'Engenharia Mecânica & Térmica', explanation: 'Dimensionamento das superfícies e simulações térmicas CFD.', is_filled: false },
      { id: 32, name: 'Química / Engenharia Ambiental', explanation: 'Testes de salinidade e potabilidade microbiológica da água tratada.', is_filled: false },
      { id: 33, name: 'Design Industrial', explanation: 'Projeto ergonômico de rotomoldagem para montagem e manutenção simples.', is_filled: false }
    ]
  },

  // ENGENHARIA + SAÚDE
  {
    project_id: 112,
    name: 'BioPrótese: Membros Mecânicos em 3D',
    areas: ['Engenharia', 'Saúde'],
    summary: 'Próteses mioelétricas de membros superiores com sensores mioelétricos e custo 85% inferior ao mercado.',
    description: 'Fabricação distribuída de próteses de mão e antebraço acionadas por sinais musculares superficiais, com arquivos abertos e customização conforme a anatomia do usuário.',
    tags: ['Biomecânica', 'Impressão 3D', 'Robótica', 'Saúde'],
    created_at: '2026-11-04T10:00:00Z',
    is_active: true,
    roles: [
      { id: 34, name: 'Engenharia Mecatrônica & Robótica', explanation: 'Desenvolvimento dos servomotores e circuitos de filtragem EMG.', is_filled: false },
      { id: 35, name: 'Fisioterapia / Reabilitação', explanation: 'Protocolos de adaptação motora e exercícios de reabilitação.', is_filled: false },
      { id: 36, name: 'Design de Produto & Bioengenharia', explanation: 'Encaixe anatômico e textura confortável impressa em TPU.', is_filled: false }
    ]
  }
];