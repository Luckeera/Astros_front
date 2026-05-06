import React from 'react';
import { Search, Briefcase, MessageCircle, CalendarDays, CheckCircle2 } from 'lucide-react';

export default function RequestedFeatures() {
  const features = [
    {
      title: "Busca de Habilidades",
      description: "Mapeamento específico de parceiros via filtros de hard e soft skills (Ex: Conhecimento Jurídico, Design UX).",
      icon: Search
    },
    {
      title: "Portfólio Colaborativo",
      description: "Uma vitrine para expor o andamento dos projetos interativos e o currículo/perfil de cada integrante.",
      icon: Briefcase
    },
    {
      title: "Chat Integrado",
      description: "Comunicação nativa e dedicada. Citada por quase todos como essencial para criar e debater demandas.",
      icon: MessageCircle
    },
    {
      title: "Mural de Eventos",
      description: "Centralize a dinâmica da Semana Ubíqua: cursos diversos postam temas e problemas reais, enquanto alunos de tecnologia filtram esses desafios para construir MVPs funcionais.",
      icon: CalendarDays
    }
  ];

  return (
    <div className="mt-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h3 className="text-3xl font-black text-gray-900 mb-4">O que os alunos pediram</h3>
        <p className="text-gray-600 font-medium">As 4 funcionalidades classificadas como indispensáveis na Pesquisa de Colaboração para viabilizar projetos reais.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {features.map((feat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border-2 border-gray-100 hover:border-[#FFA900] transition-all flex gap-6 items-start shadow-sm hover:shadow-xl hover:shadow-[#FFA900]/10 hover:-translate-y-1 group">
            <div className="bg-[#FFA900]/10 p-5 rounded-2xl group-hover:bg-[#FFA900] transition-colors">
              <feat.icon className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-2">
                {feat.title} <CheckCircle2 className="h-5 w-5 text-[#FFA900]" />
              </h4>
              <p className="text-gray-600 font-medium leading-relaxed">{feat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
