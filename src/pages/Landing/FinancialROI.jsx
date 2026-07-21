import React from 'react';
import { Users, XCircle, CheckCircle2 } from 'lucide-react';

export default function FinancialROI() {
  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-[#FFA900]/10 border-2 border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/10 text-black font-black rounded-xl text-sm mb-6 border border-[#FFA900]/20">
          <Users className="h-4 w-4 text-[#FFA900]" /> Da Semana Ubíqua ao Astros
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">Como a Semana Ubíqua virou o ponto de partida do Astros.</h3>
        <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed">
          Na Semana Ubíqua — a semana de projetos práticos da faculdade — as turmas de tecnologia recebem um tema definido pelos professores e correm contra o tempo em formato de hackathon. O problema: o tema nem sempre reflete a necessidade real de outro curso, e quem entende a parte teórica do problema não participa da construção da solução.
        </p>
        <p className="text-lg text-gray-600 font-medium leading-relaxed">
          O Astros propõe outro formato: os temas deixam de ser escolhidos pelos professores e passam a ser desafios reais, publicados por alunos de outros cursos. Direito, Saúde ou Negócios trazem o problema que estão vivendo, e a turma de tecnologia constrói a solução em conjunto com eles — parte técnica e parte teórica no mesmo projeto, do início ao fim.
        </p>
      </div>

      <div className="flex-1 w-full">
        <div className="bg-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-8 -bottom-8 text-white/5">
            <Users className="h-64 w-64 text-white/5" />
          </div>
          <h4 className="text-xl font-bold mb-8 text-gray-300 relative z-10 border-b border-white/10 pb-4">Semana Ubíqua: antes e depois</h4>
          <div className="space-y-8 relative z-10">
            <div className="flex gap-4 items-start">
              <XCircle className="h-8 w-8 text-red-500 shrink-0" />
              <div>
                <div className="font-bold text-white mb-1">Hoje</div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">Tema definido pelo professor. A turma de tecnologia resolve sozinha, sem o curso dono do problema na mesa.</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle2 className="h-8 w-8 text-green-400 shrink-0" />
              <div>
                <div className="font-bold text-white mb-1">Com o Astros</div>
                <div className="text-sm text-gray-400 font-medium leading-relaxed">O tema nasce como um desafio real, publicado por alunos de outro curso. A solução é construída em conjunto, do início ao fim.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
