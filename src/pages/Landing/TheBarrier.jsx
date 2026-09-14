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
              Metade dos respondentes válidos (17/34) atribuiu notas 4 ou 5 à dificuldade de encontrar parceiros de outros cursos; a média foi 3,50/5.
            </p>
            
            <div className="bg-white/10 p-8 rounded-3xl border border-[#FFA900]/30 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA900]/20 rounded-full blur-3xl"></div>
              <div className="flex items-start gap-5 relative z-10">
                <AlertOctagon className="h-12 w-12 text-[#FFA900] flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-xl mb-3 text-white">As barreiras mais relevantes</h4>
                  <p className="text-gray-300 font-medium leading-relaxed">
                    A maior barreira é conciliar horários: <strong className="text-[#FFA900]">90% (27/30)</strong> colocaram disponibilidade entre as duas dificuldades mais importantes. Canal de conexão e clareza de papéis também aparecem no top 2 de <strong className="text-[#FFA900]">63% das respostas</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full flex justify-center py-10 md:py-0">
             <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[16px] border-[#FFA900] flex items-center justify-center flex-col shadow-[0_0_80px_rgba(255,169,0,0.3)] bg-gray-900 relative">
                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter">90%</span>
                <span className="text-sm md:text-base font-bold text-gray-400 mt-2 text-center px-8">colocaram disponibilidade no top 2 (27/30)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
