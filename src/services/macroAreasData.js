/**
 * Catálogo Oficial de Macro Áreas de Habilidades Práticas do Astros
 * Cobertura 100% MECE (sem brechas) para todos os cursos e talentos acadêmicos.
 */
export const OFFICIAL_MACRO_AREAS = [
  {
    macro_area_id: 1,
    name: "Desenvolvimento de Software & TI",
    description: "Frontend, Backend, Mobile, Fullstack, DevOps, Cloud, Cibersegurança e Banco de Dados",
    iconName: "Code2",
    color: "#3B82F6", // Blue
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    macro_area_id: 2,
    name: "Design, UI/UX & Criatividade Visual",
    description: "Prototipação Figma, UI Design, UX Research, Design System, 3D, Motion, Arquitetura e Produto",
    iconName: "Palette",
    color: "#EC4899", // Pink
    badgeBg: "bg-pink-50 text-pink-700 border-pink-200"
  },
  {
    macro_area_id: 3,
    name: "Dados, Inteligência Artificial & Analytics",
    description: "Data Science, Machine Learning, Deep Learning, Engenharia de Dados, BI, SQL e NLP/LLMs",
    iconName: "Binary",
    color: "#8B5CF6", // Purple
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200"
  },
  {
    macro_area_id: 4,
    name: "Negócios, Gestão & Estratégia",
    description: "Modelagem (Canvas), Gestão Ágil de Projetos, Finanças, Valuation, Controladoria e RH",
    iconName: "TrendingUp",
    color: "#F59E0B", // Amber
    badgeBg: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    macro_area_id: 5,
    name: "Marketing, Growth & Vendas",
    description: "Growth Hacking, Tráfego Pago, SEO, Vendas B2B/B2C, Funis de Conversão, CRM e Pricing",
    iconName: "Target",
    color: "#EF4444", // Red
    badgeBg: "bg-red-50 text-red-700 border-red-200"
  },
  {
    macro_area_id: 6,
    name: "Comunicação, Mídias & Audiovisual",
    description: "Copywriting, Roteiro, Produção e Edição de Vídeo, Podcast, Mídias Sociais e Jornalismo",
    iconName: "Video",
    color: "#06B6D4", // Cyan
    badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200"
  },
  {
    macro_area_id: 7,
    name: "Engenharia, Hardware & Automação",
    description: "Robótica, Sistemas Embarcados (Arduino/IoT), Mecatrônica, Prototipagem Física (3D) e Estruturas",
    iconName: "Cpu",
    color: "#6366F1", // Indigo
    badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200"
  },
  {
    macro_area_id: 8,
    name: "Saúde, Biológicas & Bem-Estar",
    description: "Protocolos biomédicos, atendimento em saúde, avaliação física/nutricional, psicologia e análises",
    iconName: "HeartPulse",
    color: "#10B981", // Emerald
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    macro_area_id: 9,
    name: "Direito, Regulação & Políticas Públicas",
    description: "Direito Digital & LGPD, Propriedade Intelectual, Contratos/Vesting, Compliance e Relações Internacionais",
    iconName: "Scale",
    color: "#64748B", // Slate
    badgeBg: "bg-slate-50 text-slate-700 border-slate-200"
  },
  {
    macro_area_id: 10,
    name: "Educação, Treinamento & EdTech",
    description: "Design Instrucional, Gamificação, Metodologias Ativas de Ensino, Material Didático e T&D Corporativo",
    iconName: "GraduationCap",
    color: "#14B8A6", // Teal
    badgeBg: "bg-teal-50 text-teal-700 border-teal-200"
  },
  {
    macro_area_id: 11,
    name: "Humanidades, Ciências Sociais & Cultura",
    description: "Pesquisa Social, Diversidade & Inclusão (DEI), Responsabilidade Social, Produção Cultural e Artes",
    iconName: "Users",
    color: "#F97316", // Orange
    badgeBg: "bg-orange-50 text-orange-700 border-orange-200"
  },
  {
    macro_area_id: 12,
    name: "Meio Ambiente, Agro & Sustentabilidade (ESG)",
    description: "Práticas ESG, Gestão de Resíduos, Créditos de Carbono, Energias Renováveis e Agroecologia",
    iconName: "Sprout",
    color: "#84CC16", // Lime
    badgeBg: "bg-lime-50 text-lime-700 border-lime-200"
  },
  {
    macro_area_id: 13,
    name: "Multidisciplinar / Outras Habilidades",
    description: "Perfis generalistas, gestão de inovação aberta, articulação interdisciplinar e papéis híbridos",
    iconName: "Sparkles",
    color: "#FFA900", // Astros Amber
    badgeBg: "bg-[#FFA900]/10 text-amber-800 border-[#FFA900]/30"
  }
];

export function getMacroAreaById(id) {
  if (!id) return null;
  return OFFICIAL_MACRO_AREAS.find(a => a.macro_area_id === Number(id)) || null;
}
