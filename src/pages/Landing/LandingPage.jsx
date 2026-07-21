import React from 'react';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import StudentReality from './StudentReality';
import TheBarrier from './TheBarrier';
import RequestedFeatures from './RequestedFeatures';
import FinancialROI from './FinancialROI';
import RegulatoryCompliance from './RegulatoryCompliance';
import EmployabilityEdge from './EmployabilityEdge';
import CallToAction from './CallToAction';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#FFA900]/30 overflow-x-hidden">
      <LandingNavbar />
      <HeroSection />
      
      {/* Parte 1: A Realidade e a Dor do Aluno */}
      <section className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFA900]/10 text-black font-black rounded-full text-sm mb-6 border border-[#FFA900]/20">
              Parte 1
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">A Realidade do Aluno</h2>
            <p className="mt-4 text-xl text-gray-600 font-medium">Dados reais e necessidades validadas pela Pesquisa de Colaboração Interdisciplinar</p>
          </div>
          <div className="space-y-24">
            <StudentReality />
            <TheBarrier />
            <RequestedFeatures />
          </div>
        </div>
      </section>

      {/* Parte 2: O Valor Institucional e Estratégico */}
      <section className="bg-gray-900 py-32 border-t-8 border-[#FFA900] text-white">
         <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-full text-sm mb-6 border border-[#FFA900]/30">
              Parte 2
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Para Coordenadores e Instituições</h2>
            <p className="mt-4 text-xl text-gray-400 font-medium">Como o Astros apoia a extensão universitária, o acompanhamento pedagógico e a gestão de projetos interdisciplinares</p>
          </div>
          <div className="space-y-32">
            <FinancialROI />
            <RegulatoryCompliance />
            <EmployabilityEdge />
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
}
