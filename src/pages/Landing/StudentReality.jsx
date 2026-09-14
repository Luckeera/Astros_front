import React from 'react';
import { GraduationCap, MapPin } from 'lucide-react';

export default function StudentReality() {
  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1">
          <div className="inline-block px-4 py-2 bg-[#FFA900]/10 text-black font-black rounded-xl text-sm mb-6 border border-[#FFA900]/20">Validação Prática</div>
          <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">Alunos de humanas precisam de tecnologia. A tecnologia precisa de humanas.</h3>
          <p className="text-lg text-gray-600 font-medium mb-8 leading-relaxed">
            As respostas registram experiências e interesse em colaborações entre áreas. A Astros propõe aproximar estudantes com desafios e competências complementares, sem tratar essa relação como uma conclusão representativa de todos os cursos.
          </p>
          
          <div className="space-y-4">
            <div className="p-5 bg-[#FFA900]/5 rounded-2xl border border-[#FFA900]/20 relative hover:bg-[#FFA900]/10 transition-colors">
              <div className="absolute top-4 right-4 text-4xl text-[#FFA900]/30 font-serif">"</div>
              <p className="text-gray-800 font-bold italic relative z-10">Projeto voltado para a saúde; na equipe, faltavam alunos dos cursos de Saúde, Direito e ESG.</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 font-medium">
                <GraduationCap className="h-4 w-4 text-[#FFA900]" /> Respondente da área de Tecnologia
              </div>
            </div>
            <div className="p-5 bg-[#FFA900]/5 rounded-2xl border border-[#FFA900]/20 relative hover:bg-[#FFA900]/10 transition-colors">
              <div className="absolute top-4 right-4 text-4xl text-[#FFA900]/30 font-serif">"</div>
              <p className="text-gray-800 font-bold italic relative z-10">Colaboração entre nutrição e psicologia.</p>
              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 font-medium">
                <GraduationCap className="h-4 w-4 text-[#FFA900]" /> Respondente da área de Saúde
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full bg-[#FFA900]/5 p-8 rounded-[2rem] border border-[#FFA900]/20">
          <h4 className="text-xl font-black text-gray-900 mb-6">Algumas instituições representadas na amostra</h4>
          <div className="flex flex-wrap gap-3">
            {['UFPA', 'Unama', 'CESUPA', 'Unicesumar', 'Estácio', 'PUC-GO', 'Univali', 'Faculdade Cosmopolita'].map((uni) => (
              <span key={uni} className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 flex items-center gap-2 shadow-sm hover:border-[#FFA900] hover:text-black transition-colors cursor-default">
                <MapPin className="h-4 w-4 text-[#FFA900]" />
                {uni}
              </span>
            ))}
          </div>
          
          <h4 className="text-xl font-black text-gray-900 mt-10 mb-6">Áreas e cursos representados na amostra</h4>
          <div className="flex flex-wrap gap-3">
            {['Direito', 'Psicologia', 'ADS', 'Nutrição', 'Fisioterapia', 'Engenharia Elétrica', 'Medicina', 'Arquitetura e Urbanismo'].map((curso) => (
              <span key={curso} className="px-4 py-2.5 bg-[#FFA900] text-black rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black hover:text-white transition-colors cursor-default shadow-md shadow-[#FFA900]/20">
                <GraduationCap className="h-4 w-4" />
                {curso}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
