import React from 'react';
import { Scale, FileCheck2, Database } from 'lucide-react';

export default function RegulatoryCompliance() {
  return (
    <div className="bg-gray-900 rounded-[3rem] p-8 md:p-14 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#FFA900_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
      
      <div className="flex flex-col lg:flex-row-reverse gap-12 items-center relative z-10">
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-xl text-sm mb-6 border border-[#FFA900]/30">
            <Scale className="h-4 w-4" /> Adequação Regulatória
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight">Automatização dos 10% da Curricularização da Extensão.</h3>
          <p className="text-lg text-gray-400 font-medium mb-6 leading-relaxed">
            A Resolução CNE/CES nº 7/2018 exige que toda IES dedique 10% da carga horária para extensão universitária. Mapear e documentar essa obrigatoriedade para milhares de alunos em dezenas de cursos é um pesadelo logístico.
          </p>
          <p className="text-lg text-gray-400 font-medium leading-relaxed">
            A Plataforma Astros funciona como a infraestrutura de controle oficial: centraliza a interação dialógica interdisciplinar e gera relatórios precisos. Elimina planilhas analógicas, garantindo evidências rastreáveis essenciais para avaliadores do MEC (Conceito 5 no Inep).
          </p>
        </div>
        
        <div className="flex-1 w-full grid grid-cols-1 gap-5">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-sm flex items-center gap-5 hover:border-[#FFA900]/50 transition-colors group">
            <div className="bg-[#FFA900] p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <FileCheck2 className="h-10 w-10 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Evidências Rastreáveis</h4>
              <p className="text-gray-400 font-medium">Automatização do registro de horas e interação do estudante em banco de dados.</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-sm flex items-center gap-5 hover:border-[#FFA900]/50 transition-colors group">
            <div className="bg-[#FFA900] p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <Database className="h-10 w-10 text-black" />
            </div>
            <div>
              <h4 className="font-bold text-xl text-white mb-1">Painéis para o Inep</h4>
              <p className="text-gray-400 font-medium">Relatórios práticos mostrando interdisciplinaridade real para comissões de auditoria.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
