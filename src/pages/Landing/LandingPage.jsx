import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import InterviewScreen from '../InterviewScreen';
import IntegratedMural from '../../components/IntegratedMural';
import { 
  Rocket, 
  Users, 
  Compass,
  Briefcase
} from 'lucide-react';

export default function LandingPage() {
  const scrollToPesquisa = () => {
    const el = document.getElementById('pesquisa');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (window.location.hash === '#pesquisa' || window.location.hash === '#entrevista') {
      setTimeout(() => {
        scrollToPesquisa();
      }, 150);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-[#FFA900]/30 overflow-x-hidden">
      {/* Navbar simplificada para a tela inicial (sem barra de busca e sem botão do mural) */}
      <Navbar showSearch={false} showMural={false} />

      {/* --- HERO: Apresentação da Ideia do Astros --- */}
      <section className="pt-12 md:pt-20 pb-16 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.15] text-gray-900 mb-6 max-w-5xl mx-auto">
          Tire seus projetos do papel com quem tem as{' '}
          <span className="relative inline-block px-3.5 py-1 bg-[#FFA900] text-gray-900 rounded-2xl shadow-sm -rotate-1 mx-1">
            habilidades certas.
          </span>
        </h1>

        <p className="text-lg sm:text-2xl text-gray-600 font-medium leading-relaxed max-w-3xl mx-auto mb-14">
          Você tem uma ideia incrível, mas precisa de desenvolvedores, designers, apoio jurídico ou de saúde? 
          O <strong>Astros</strong> conecta estudantes de diversas áreas para criar projetos práticos e acelerar portfólios reais.
        </p>

        {/* --- 3 PILARES DO PRODUTO (Condensados e Visuais) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-5xl mx-auto">
          {/* Pilar 1: Mural Aberto */}
          <div className="p-7 rounded-3xl border-2 border-gray-900 bg-white shadow-[5px_5px_0px_#000] hover:-translate-y-1 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#FFA900]/15 border-2 border-gray-900 flex items-center justify-center mb-5 group-hover:bg-[#FFA900] transition-colors">
              <Compass className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFA900] bg-gray-900 px-2.5 py-0.5 rounded-md inline-block mb-3">
              Mural Aberto
            </span>
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
              Vitrine de Ideias & Desafios
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Descubra projetos em andamento de várias faculdades ou publique seu pitch para atrair talentos com vagas abertas.
            </p>
          </div>

          {/* Pilar 2: Interdisciplinaridade */}
          <div className="p-7 rounded-3xl border-2 border-gray-900 bg-white shadow-[5px_5px_0px_#000] hover:-translate-y-1 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#FFA900]/15 border-2 border-gray-900 flex items-center justify-center mb-5 group-hover:bg-[#FFA900] transition-colors">
              <Users className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFA900] bg-gray-900 px-2.5 py-0.5 rounded-md inline-block mb-3">
              Interdisciplinaridade
            </span>
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
              Squads Multidisciplinares
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Junte quem desenvolve com quem desenha a interface, quem cuida da viabilidade jurídica, dos negócios ou da saúde.
            </p>
          </div>

          {/* Pilar 3: Construção de Portfólio (Alterado conforme solicitado) */}
          <div className="p-7 rounded-3xl border-2 border-gray-900 bg-white shadow-[5px_5px_0px_#000] hover:-translate-y-1 transition-all group">
            <div className="h-12 w-12 rounded-2xl bg-[#FFA900]/15 border-2 border-gray-900 flex items-center justify-center mb-5 group-hover:bg-[#FFA900] transition-colors">
              <Briefcase className="h-6 w-6 text-gray-900" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFA900] bg-gray-900 px-2.5 py-0.5 rounded-md inline-block mb-3">
              Portfólio Real
            </span>
            <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
              Construção de Portfólio Prático
            </h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Transforme o conhecimento de sala de aula em projetos concretos, comprove seu papel técnico em iniciativas reais e destaque-se para o mercado com entregas comprováveis.
            </p>
          </div>
        </div>
      </section>

      {/* --- MURAL DE IDEIAS INTEGRADO (Com div expansível) --- */}
      <IntegratedMural />

      {/* --- BANNER DE TRANSIÇÃO FLUIDA PARA A PESQUISA --- */}
      <section className="bg-gray-900 text-white py-12 px-6 border-t-2 border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-xl text-xs uppercase tracking-wider mb-4 border border-[#FFA900]/30">
            Pesquisa & Validação Prática
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">
            Ajude a co-criar o Astros e ative seu acesso
          </h2>
          <p className="text-gray-400 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Em menos de 3 minutos você experimenta os recursos da plataforma, escolhe áreas do seu interesse no Mural e já sai com seu perfil ativado.
          </p>
        </div>
      </section>

      {/* --- MÓDULO EMBUTIDO DA ENTREVISTA / PESQUISA --- */}
      <InterviewScreen embedded={true} />
    </div>
  );
}
