import React from 'react';
import { ShieldCheck, BarChart3, Award } from 'lucide-react';

const InstitutionalROI = () => {
  return (
    <section id="roi" className="py-24 bg-gray-900 text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-4">ROI Institucional</h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Valor Estratégico para a sua IES.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-[#FFA900] text-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Conformidade Inep/MEC</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Automação completa da coleta de evidências para a Curricularização da Extensão. Painéis prontos para visitas de comissão do MEC.
            </p>
          </div>

          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-white text-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Combate à Evasão</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Aumente o senso de pertencimento e aplicação prática. O aluno que constrói algo real tem 40% menos chance de abandonar o curso.
            </p>
          </div>

          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Marca Empregadora</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Posicione sua IES como uma Universidade Empreendedora e Inovadora, atraindo parcerias com o ecossistema e empresas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalROI;
