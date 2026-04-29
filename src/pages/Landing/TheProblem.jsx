import React from 'react';
import { AlertCircle, Target, Users2 } from 'lucide-react';

const TheProblem = () => {
  return (
    <section className="py-24 bg-gray-50 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-4">O Cenário Atual</h2>
          <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">O Silo que custa caro para as IES.</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all">
            <div className="h-16 w-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-500 group-hover:text-white transition-colors">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">57,2% de Evasão</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              O desengajamento prático é a principal causa da evasão no ensino superior. O aluno não vê conexão entre a teoria e o impacto real.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all">
            <div className="h-16 w-16 bg-amber-50 text-[#FFA900] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#FFA900] group-hover:text-white transition-colors">
              <Target className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">MEC & Extensão</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              A dificuldade de comprovar os 10% de carga horária da Curricularização da Extensão gera gargalos administrativos e riscos em auditorias.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 group hover:-translate-y-2 transition-all">
            <div className="h-16 w-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users2 className="h-8 w-8" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Silos de Conhecimento</h4>
            <p className="text-gray-500 font-medium leading-relaxed">
              Alunos de Direito, Saúde e Negócios têm problemas. Alunos de Tecnologia têm ferramentas. Eles apenas não possuem um canal de conexão.
            </p>
          </div>
        </div>

        <div className="mt-20 p-8 md:p-12 bg-gray-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-amber-400 font-black uppercase tracking-widest text-xs mb-4 italic">Insight da Pesquisa Astros:</p>
            <blockquote className="text-2xl md:text-3xl font-black italic leading-tight">
              "Mais de 80% dos alunos entrevistados desejam inovar, mas dão nota 5/5 para a dificuldade de encontrar parceiros de outros cursos."
            </blockquote>
          </div>
          <div className="h-24 w-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
            <span className="text-4xl">📊</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheProblem;
