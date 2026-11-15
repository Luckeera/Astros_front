/**
 * Catálogo Unificado de Áreas do Conhecimento e Cursos de Graduação
 * Utilizado para validação, autocompletar e consistência entre Frontend e Backend.
 */

export const UNIFIED_AREAS = [
  'Tecnologia',
  'Engenharia',
  'Saúde',
  'Direito',
  'Negócios',
  'Design',
  'Comunicação',
  'Humanidades & Educação',
  'Ciências Agrárias & Ambientais',
];

export const MASTER_COURSES = [
  // --- TECNOLOGIA ---
  { name: 'Análise e Desenvolvimento de Sistemas', area: 'Tecnologia' },
  { name: 'Ciência da Computação', area: 'Tecnologia' },
  { name: 'Engenharia de Software', area: 'Tecnologia' },
  { name: 'Sistemas de Informação', area: 'Tecnologia' },
  { name: 'Redes de Computadores', area: 'Tecnologia' },
  { name: 'Segurança da Informação', area: 'Tecnologia' },
  { name: 'Ciência de Dados', area: 'Tecnologia' },
  { name: 'Inteligência Artificial', area: 'Tecnologia' },
  { name: 'Jogos Digitais', area: 'Tecnologia' },
  { name: 'Banco de Dados', area: 'Tecnologia' },
  { name: 'Gestão da Tecnologia da Informação', area: 'Tecnologia' },
  { name: 'Matemática', area: 'Tecnologia' },
  { name: 'Matemática Computacional', area: 'Tecnologia' },
  { name: 'Estatística', area: 'Tecnologia' },
  { name: 'Física', area: 'Tecnologia' },
  { name: 'Química', area: 'Tecnologia' },
  { name: 'Bioinformática', area: 'Tecnologia' },

  // --- ENGENHARIA ---
  { name: 'Engenharia Civil', area: 'Engenharia' },
  { name: 'Engenharia Mecânica', area: 'Engenharia' },
  { name: 'Engenharia Elétrica', area: 'Engenharia' },
  { name: 'Engenharia de Produção', area: 'Engenharia' },
  { name: 'Engenharia Eletrônica', area: 'Engenharia' },
  { name: 'Engenharia Mecatrônica', area: 'Engenharia' },
  { name: 'Engenharia Química', area: 'Engenharia' },
  { name: 'Engenharia de Computação', area: 'Engenharia' },
  { name: 'Engenharia Ambiental e Sanitária', area: 'Engenharia' },
  { name: 'Engenharia Biomédica', area: 'Engenharia' },
  { name: 'Engenharia Aeroespacial', area: 'Engenharia' },
  { name: 'Engenharia Automotiva', area: 'Engenharia' },
  { name: 'Engenharia de Materiais', area: 'Engenharia' },
  { name: 'Engenharia de Minas', area: 'Engenharia' },
  { name: 'Engenharia de Petróleo', area: 'Engenharia' },
  { name: 'Engenharia de Telecomunicações', area: 'Engenharia' },
  { name: 'Engenharia Naval', area: 'Engenharia' },
  { name: 'Engenharia de Controle e Automação', area: 'Engenharia' },

  // --- SAÚDE ---
  { name: 'Medicina', area: 'Saúde' },
  { name: 'Enfermagem', area: 'Saúde' },
  { name: 'Odontologia', area: 'Saúde' },
  { name: 'Fisioterapia', area: 'Saúde' },
  { name: 'Farmácia', area: 'Saúde' },
  { name: 'Nutrição', area: 'Saúde' },
  { name: 'Psicologia', area: 'Saúde' },
  { name: 'Biomedicina', area: 'Saúde' },
  { name: 'Fonoaudiologia', area: 'Saúde' },
  { name: 'Terapia Ocupacional', area: 'Saúde' },
  { name: 'Medicina Veterinária', area: 'Saúde' },
  { name: 'Ciências Biológicas (Biologia)', area: 'Saúde' },
  { name: 'Educação Física', area: 'Saúde' },
  { name: 'Radiologia', area: 'Saúde' },
  { name: 'Saúde Coletiva', area: 'Saúde' },
  { name: 'Estética e Cosmética', area: 'Saúde' },
  { name: 'Gestão Hospitalar', area: 'Saúde' },

  // --- DIREITO ---
  { name: 'Direito', area: 'Direito' },
  { name: 'Relações Internacionais', area: 'Direito' },
  { name: 'Segurança Pública', area: 'Direito' },
  { name: 'Criminologia', area: 'Direito' },

  // --- NEGÓCIOS ---
  { name: 'Administração', area: 'Negócios' },
  { name: 'Ciências Contábeis', area: 'Negócios' },
  { name: 'Ciências Econômicas (Economia)', area: 'Negócios' },
  { name: 'Marketing', area: 'Negócios' },
  { name: 'Gestão Financeira', area: 'Negócios' },
  { name: 'Recursos Humanos', area: 'Negócios' },
  { name: 'Comércio Exterior', area: 'Negócios' },
  { name: 'Logística', area: 'Negócios' },
  { name: 'Gestão Comercial', area: 'Negócios' },
  { name: 'Gestão Pública', area: 'Negócios' },
  { name: 'Processos Gerenciais', area: 'Negócios' },
  { name: 'Empreendedorismo', area: 'Negócios' },
  { name: 'Hotelaria e Turismo', area: 'Negócios' },

  // --- DESIGN ---
  { name: 'Design Gráfico', area: 'Design' },
  { name: 'Design de Produto', area: 'Design' },
  { name: 'Design Visual', area: 'Design' },
  { name: 'Design de Interiores', area: 'Design' },
  { name: 'Design de Moda', area: 'Design' },
  { name: 'Arquitetura e Urbanismo', area: 'Design' },
  { name: 'Animação e Modelagem 3D', area: 'Design' },
  { name: 'Web Design e UX/UI', area: 'Design' },

  // --- COMUNICAÇÃO ---
  { name: 'Publicidade e Propaganda', area: 'Comunicação' },
  { name: 'Jornalismo', area: 'Comunicação' },
  { name: 'Relações Públicas', area: 'Comunicação' },
  { name: 'Cinema e Audiovisual', area: 'Comunicação' },
  { name: 'Produção Multimídia', area: 'Comunicação' },
  { name: 'Fotografia', area: 'Comunicação' },
  { name: 'Comunicação Social', area: 'Comunicação' },

  // --- HUMANIDADES & EDUCAÇÃO ---
  { name: 'Pedagogia', area: 'Humanidades & Educação' },
  { name: 'Filosofia', area: 'Humanidades & Educação' },
  { name: 'História', area: 'Humanidades & Educação' },
  { name: 'Geografia', area: 'Humanidades & Educação' },
  { name: 'Letras (Português / Literaturas)', area: 'Humanidades & Educação' },
  { name: 'Letras (Inglês / Espanhol / Tradução)', area: 'Humanidades & Educação' },
  { name: 'Ciências Sociais', area: 'Humanidades & Educação' },
  { name: 'Sociologia', area: 'Humanidades & Educação' },
  { name: 'Serviço Social', area: 'Humanidades & Educação' },
  { name: 'Teologia', area: 'Humanidades & Educação' },
  { name: 'Artes Visuais', area: 'Humanidades & Educação' },
  { name: 'Artes Cênicas (Teatro)', area: 'Humanidades & Educação' },
  { name: 'Música', area: 'Humanidades & Educação' },

  // --- CIÊNCIAS AGRÁRIAS & AMBIENTAIS ---
  { name: 'Agronomia', area: 'Ciências Agrárias & Ambientais' },
  { name: 'Zootecnia', area: 'Ciências Agrárias & Ambientais' },
  { name: 'Engenharia Florestal', area: 'Ciências Agrárias & Ambientais' },
  { name: 'Gestão Ambiental', area: 'Ciências Agrárias & Ambientais' },
  { name: 'Oceanografia', area: 'Ciências Agrárias & Ambientais' },
  { name: 'Geologia', area: 'Ciências Agrárias & Ambientais' },
];

export function detectAreaForCourse(courseName) {
  if (!courseName) return 'Tecnologia';
  const clean = courseName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const match = MASTER_COURSES.find(c => 
    c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === clean
  );
  if (match) return match.area;

  if (clean.includes('comput') || clean.includes('software') || clean.includes('sistema') || clean.includes('dados') || clean.includes('ti') || clean.includes('ads')) return 'Tecnologia';
  if (clean.includes('medic') || clean.includes('enferm') || clean.includes('odont') || clean.includes('fisiot') || clean.includes('farm') || clean.includes('psico') || clean.includes('saude')) return 'Saúde';
  if (clean.includes('direito') || clean.includes('jurid') || clean.includes('penal') || clean.includes('relacoes inter')) return 'Direito';
  if (clean.includes('engenhar') || clean.includes('mec') || clean.includes('elet')) return 'Engenharia';
  if (clean.includes('design') || clean.includes('arquitet') || clean.includes('visual') || clean.includes('moda')) return 'Design';
  if (clean.includes('admin') || clean.includes('contab') || clean.includes('econ') || clean.includes('mark') || clean.includes('financ') || clean.includes('gestao') || clean.includes('negoc')) return 'Negócios';
  if (clean.includes('jornal') || clean.includes('publicid') || clean.includes('cinema') || clean.includes('comunic')) return 'Comunicação';
  if (clean.includes('pedagog') || clean.includes('letras') || clean.includes('histori') || clean.includes('filosof') || clean.includes('artes')) return 'Humanidades & Educação';
  if (clean.includes('agro') || clean.includes('florest') || clean.includes('ambient') || clean.includes('geolog')) return 'Ciências Agrárias & Ambientais';

  return 'Tecnologia';
}
