import React from 'react';
import { Scale, FileCheck2, Database } from 'lucide-react';

export default function RegulatoryCompliance() {
  return (
    <div className="bg-gray-900 rounded-[3rem] p-8 md:p-14 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#FFA900_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
      
      <div className="flex flex-col lg:flex-row-reverse gap-12 items-center relative z-10">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-xl text-sm mb-6 border border-[#FFA900]/30">
            <Scale className="h-4 w-4" /> Extensão sem planilha manual
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">Documentação automática das atividades de extensão.</h3>
          <p className="text-lg text-gray-400 font-medium mb-6 leading-relaxed">
            Registrar a participação dos alunos em atividades de extensão costuma significar planilha manual e relatório avulso. No Astros, cada projeto interdisciplinar já fica documentado automaticamente: quem participou, o que foi entregue e qual curso propôs o desafio.
          </p>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            Toda a conversa entre os cursos, as entregas e o histórico do projeto ficam registrados na própria plataforma, prontos para virar relatório sempre que a coordenação precisar.
          </p>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-1 gap-5">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-sm flex items-center gap-5 hover:border-[#FFA900]/50 transition-colors group">
            <div className="bg-[#FFA900] p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <FileCheck2 className="h-10 w-10 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Portfólio de Atividades</h4>
              <p className="text-gray-400 font-medium">Registro qualitativo da interação e evolução do estudante em projetos reais.</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-sm flex items-center gap-5 hover:border-[#FFA900]/50 transition-colors group">
            <div className="bg-[#FFA900] p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Database className="h-10 w-10 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Relatórios de Impacto</h4>
              <p className="text-gray-400 font-medium">Visão clara de quais cursos colaboraram, em quais projetos e com que resultado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
