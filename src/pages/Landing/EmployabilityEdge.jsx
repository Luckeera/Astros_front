import React from 'react';
import { Lightbulb, Building2, Workflow, GraduationCap } from 'lucide-react';

export default function EmployabilityEdge() {
  return (
    <div className="pt-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-xl text-sm mb-6 border border-[#FFA900]/30">
          <Building2 className="h-4 w-4" /> Universidade Empreendedora
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 max-w-3xl mx-auto leading-tight">O Skill Gap e o Benchmarking de Ponta.</h3>
        <p className="text-lg text-gray-400 font-medium mb-16 max-w-4xl mx-auto leading-relaxed">
          As exigências do mercado mudaram drasticamente. Segundo o Fórum Econômico Mundial (WEF), profissionais analógicos estão obsoletos. O Astros transforma a instituição educacional baseada em "silos" em um verdadeiro Hub de Inovação Aberta, alinhado aos cases de sucesso mais rentáveis do ensino contemporâneo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <GraduationCap className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Benchmarking Global</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Mimetiza a Aprendizagem Baseada em Projetos (PBL) interprofissional de instituições como Insper, Minerva e CESAR School, sem a barreira do custo logístico físico absurdo.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <Workflow className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Hard & Soft Skills</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Forja as skills priorizadas pelo "Future of Jobs Report 2023": Alfabetização Tecnológica para as Ciências Humanas e "Escuta Ativa / Empatia" para a Engenharia.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <Lightbulb className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Vitrine Comercial</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Startups acadêmicas atuam como ferramenta agressiva de Marketing. Nutre o CRM da instituição com vitrines de inovação, reduzindo o Custo de Aquisição de Clientes (CAC).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
