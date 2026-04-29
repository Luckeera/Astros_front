import React from 'react';
import { Share2, Zap, Layout } from 'lucide-react';

const AstrosSolution = () => {
  return (
    <section id="solucao" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 items-center">
          <div className="flex-1 relative order-2 md:order-1">
             <div className="absolute -inset-10 bg-[#FFA900]/5 rounded-full blur-[100px] -z-10"></div>
             <div className="space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-6 max-w-sm">
                  <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center text-[#FFA900]">
                    <Share2 className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Integração Multidisciplinar</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Via de mão dupla</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-6 max-w-sm ml-12 border-l-8 border-l-[#FFA900]">
                  <div className="h-14 w-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Curricularização Ativa</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Gestão de Extensão</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex items-center gap-6 max-w-sm">
                  <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Layout className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">Mural de Inovação</p>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Vitrine de Talentos</p>
                  </div>
                </div>
             </div>
          </div>

          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-4 text-center md:text-left">A Solução</h2>
            <h3 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-8">
              Conectando Problemas a Soluções.
            </h3>
            <p className="text-lg text-gray-500 font-medium leading-relaxed mb-8">
              O Astros rompe as paredes das salas de aula. Através de "Pitches de Ideias", alunos de áreas humanas trazem desafios reais, enquanto alunos de tecnologia encontram o contexto perfeito para aplicar suas habilidades.
            </p>
            <ul className="space-y-4">
              {['Match de Habilidades Inteligente', 'Portfólio de Projetos Integrados', 'Gestão de Horas de Extensão Automatizada'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-gray-700">
                  <div className="h-6 w-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrosSolution;
