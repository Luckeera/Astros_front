import React from 'react';
import { AlertOctagon } from 'lucide-react';

export default function TheBarrier() {
  return (
    <div className="relative mt-12">
      <div className="absolute inset-0 bg-[#FFA900] transform -skew-y-2 rounded-[3rem] -z-10 opacity-20"></div>
      <div className="bg-gray-900 rounded-[3rem] p-8 md:p-14 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <h3 className="text-3xl lg:text-4xl font-black mb-6 leading-tight">O Obstáculo: O isolamento departamental.</h3>
            <p className="text-lg text-gray-300 font-medium mb-8 leading-relaxed">
              Quando questionados sobre a dificuldade de encontrar parceiros de outros cursos para projetos, a esmagadora maioria dos estudantes da pesquisa atribuiu as notas máximas de dificuldade (4 e 5).
            </p>
            
            <div className="bg-white/10 p-8 rounded-3xl border border-[#FFA900]/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA900]/20 rounded-full blur-3xl"></div>
              <div className="flex items-start gap-5 relative z-10">
                <AlertOctagon className="h-12 w-12 text-[#FFA900] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-3 text-white">A Principal Barreira</h4>
                  <p className="text-gray-300 font-medium leading-relaxed">
                    A <strong className="text-[#FFA900]">"Falta de um canal ou plataforma de conexão"</strong> foi classificada como a dificuldade <strong>Número 1</strong> (A mais difícil de transpor), superando diferenças de horários ou linguagens técnicas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center py-10 md:py-0">
             <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[16px] border-[#FFA900] flex items-center justify-center flex-col shadow-[0_0_80px_rgba(255,169,0,0.3)] bg-gray-900 relative">
                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">Nº 1</span>
                <span className="text-sm md:text-base font-bold text-gray-400 mt-2 text-center px-8">Obstáculo apontado pelos universitários</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
