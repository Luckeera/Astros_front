import React from 'react';
import { ShieldCheck, BarChart3, Award } from 'lucide-react';

const InstitutionalROI = () => {
  return (
    <section id="roi" className="py-24 bg-gray-900 text-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-4">Impacto Institucional</h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Valor Acadêmico e Institucional.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-[#FFA900] text-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Extensão e Curricularização</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Registro sistemático de atividades de extensão, facilitando o acompanhamento pedagógico e a demonstração de impacto social e acadêmico.
            </p>
          </div>

          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-white text-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Permanência Estudantil</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Aumente o senso de pertencimento e aplicação prática. O aluno que constrói algo real fortalece seu vínculo com a instituição e com sua carreira.
            </p>
          </div>

          <div className="p-8 border border-white/10 rounded-3xl bg-white/5 hover:bg-white/10 transition-all group">
            <div className="h-14 w-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Award className="h-7 w-7" />
            </div>
            <h4 className="text-xl font-black mb-4">Prestígio e Inovação</h4>
            <p className="text-gray-400 font-medium leading-relaxed">
              Fortaleça a imagem da instituição como um centro de inovação e excelência, atraindo parcerias estratégicas e visibilidade acadêmica.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionalROI;
