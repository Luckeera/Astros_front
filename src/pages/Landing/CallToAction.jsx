import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock } from 'lucide-react';

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-900 py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFA900_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
          Conecte seu projeto a quem pode fazer ele acontecer.
        </h2>
        <p className="text-xl text-gray-300 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
          Publique desafios reais, monte equipes com alunos de outros cursos e leve seus projetos do papel à prática — tudo dentro da plataforma Astros.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button 
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-[#FFA900] text-black text-xl font-black rounded-2xl hover:bg-white hover:text-black transition-all shadow-[0_0_40px_rgba(255,169,0,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 w-full sm:w-auto"
          >
            Acessar o Sistema Astros <ArrowRight className="h-6 w-6" />
          </button>
          
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-gray-400 bg-white/5 px-6 py-5 rounded-2xl border border-white/10 w-full sm:w-auto">
            <Lock className="h-5 w-5 text-[#FFA900]" /> Acesso restrito a usuários e gestão
          </div>
        </div>
      </div>
    </section>
  );
}
