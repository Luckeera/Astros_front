import React from 'react';
import { Smartphone, MessageCircle, FileBadge, Calendar } from 'lucide-react';

const StudentFeatures = () => {
  const features = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Pitches de Ideias",
      desc: "Um mural dinâmico onde alunos postam demandas e desafios reais de suas áreas."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Chat & Colaboração",
      desc: "Ambiente seguro para formação de times e alinhamento de entregas acadêmicas."
    },
    {
      icon: <FileBadge className="h-6 w-6" />,
      title: "Portfólio de Inovação",
      desc: "Geração automática de badges e certificados para o currículo dos alunos."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Hub de Eventos",
      desc: "Perenize o impacto de hackathons e semanas acadêmicas o ano inteiro."
    }
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-4 text-center md:text-left">Experiência do Ecossistema</h2>
            <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">O que move os Astros.</h3>
          </div>
          <button className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#FFA900] transition-colors border-b-2 border-transparent hover:border-[#FFA900] pb-2">
            Ver todas as funcionalidades
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-2xl hover:border-white transition-all">
              <div className="h-12 w-12 bg-white text-gray-900 rounded-2xl flex items-center justify-center shadow-lg mb-6 text-[#FFA900]">
                {f.icon}
              </div>
              <h4 className="text-lg font-black text-gray-900 mb-3">{f.title}</h4>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudentFeatures;
