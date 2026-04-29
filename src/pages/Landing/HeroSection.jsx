import React from 'react';
import { ShieldCheck, TrendingUp, Users } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFA900]/10 text-[#FFA900] font-bold text-sm mb-8 border border-[#FFA900]/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFA900] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFA900]"></span>
          </span>
          Apresentação Executiva Institucional
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-gray-900 mb-8">
          Transforme a Evasão Escolar em <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA900] to-orange-500">Engajamento Rentável.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 font-medium leading-relaxed mb-16">
          A plataforma Astros orquestra a colaboração interdisciplinar ativa, protegendo o LTV do seu aluno, automatizando a Curricularização da Extensão e posicionando sua IES como um polo de inovação.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-8 rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:border-[#FFA900]/30 hover:shadow-lg transition-all group">
            <TrendingUp className="h-10 w-10 text-[#FFA900] mb-6 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 mb-3">Retenção de LTV</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Combata os 57,2% de evasão nacional engajando alunos em projetos reais.</p>
          </div>
          <div className="p-8 rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:border-[#FFA900]/30 hover:shadow-lg transition-all group">
            <ShieldCheck className="h-10 w-10 text-[#FFA900] mb-6 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 mb-3">Compliance MEC</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Gere automaticamente evidências digitais para os 10% da Curricularização da Extensão.</p>
          </div>
          <div className="p-8 rounded-3xl border-2 border-gray-100 bg-white shadow-sm hover:border-[#FFA900]/30 hover:shadow-lg transition-all group">
            <Users className="h-10 w-10 text-[#FFA900] mb-6 group-hover:-translate-y-1 transition-transform" />
            <h3 className="font-bold text-lg text-gray-900 mb-3">Skill Gap WEF</h3>
            <p className="text-gray-600 font-medium leading-relaxed">Desenvolva habilidades vitais (soft e hard skills) exigidas pelo mercado de trabalho.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
