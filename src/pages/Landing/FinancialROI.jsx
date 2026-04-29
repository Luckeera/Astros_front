import React from 'react';
import { CircleDollarSign, ArrowUpRight, TrendingDown } from 'lucide-react';

export default function FinancialROI() {
  return (
    <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-[#FFA900]/10 border-2 border-gray-100 flex flex-col lg:flex-row gap-12 items-center">
      <div className="flex-1">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/10 text-black font-black rounded-xl text-sm mb-6 border border-[#FFA900]/20">
          <CircleDollarSign className="h-4 w-4 text-[#FFA900]" /> Retenção e LTV
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">A hemorragia financeira da evasão.</h3>
        <p className="text-lg text-gray-600 font-medium mb-6 leading-relaxed">
          Dados do Mapa do Ensino Superior e do Inep atestam que a taxa de evasão global atinge impressionantes <strong className="text-gray-900 bg-[#FFA900]/20 px-1 rounded">57,2%</strong> (chegando a <strong className="text-gray-900 bg-[#FFA900]/20 px-1 rounded">61% na rede privada</strong>). A perda de um aluno representa a destruição direta do <em>Lifetime Value (LTV)</em> e das mensalidades recorrentes.
        </p>
        <p className="text-lg text-gray-600 font-medium leading-relaxed">
          O Astros estanca essa evasão fornecendo afiliação social. Transforma impulsos efêmeros — como uma "Semana Ubíqua" — em projetos persistentes de longo prazo. Metodologias baseadas em projetos práticos blindam o aluno contra a desmotivação e o abandono de curso.
        </p>
      </div>
      
      <div className="flex-1 w-full">
        <div className="bg-gray-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-8 -bottom-8 text-white/5">
            <CircleDollarSign className="h-64 w-64 text-white/5" />
          </div>
          <h4 className="text-xl font-bold mb-8 text-gray-300 relative z-10 border-b border-white/10 pb-4">Indicadores Analisados</h4>
          <div className="space-y-8 relative z-10">
            <div>
               <div className="flex items-end gap-3">
                 <div className="text-5xl font-black text-red-500 flex items-center"><TrendingDown className="h-10 w-10 mr-2" /> 61%</div>
               </div>
               <div className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wider">Evasão na Rede Privada (Inep/Semesp)</div>
            </div>
            <div>
               <div className="flex items-end gap-3">
                 <div className="text-5xl font-black text-white flex items-center"><ArrowUpRight className="h-10 w-10 mr-2 text-green-400" /> Engajamento</div>
               </div>
               <div className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-wider">Comunidade Prática Reduz Intenção de Abandono</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
