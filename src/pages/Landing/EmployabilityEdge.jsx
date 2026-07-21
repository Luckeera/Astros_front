import React from 'react';
import { Lightbulb, Building2, Workflow, GraduationCap } from 'lucide-react';

export default function EmployabilityEdge() {
  return (
    <div className="pt-12">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFA900]/20 text-[#FFA900] font-black rounded-xl text-sm mb-6 border border-[#FFA900]/30">
          <Building2 className="h-4 w-4" /> O que você ganha no processo
        </div>
        <h3 className="text-3xl lg:text-4xl font-black text-white mb-6 max-w-3xl mx-auto leading-tight">Aprender fazendo, com gente de fora da sua bolha.</h3>
        <p className="text-lg text-gray-400 font-medium mb-16 max-w-4xl mx-auto leading-relaxed">
          Em vez de um hackathon isolado dentro da própria turma, você trabalha em um projeto real ao lado de alunos de outros cursos — cada um entrando com a parte que domina.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <GraduationCap className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Projeto com dono real</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              O desafio parte de um problema que outro curso está realmente enfrentando, não de um enunciado hipotético inventado em sala de aula.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <Workflow className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Contato com quem pensa diferente</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Tecnologia aprende a ouvir o problema antes de sair codando; os outros cursos ganham repertório técnico. As duas partes saem do projeto sabendo mais.
            </p>
          </div>
          
          <div className="bg-white p-10 rounded-[2rem] border-4 border-transparent text-left shadow-2xl shadow-black hover:border-[#FFA900] transition-all hover:-translate-y-2 group">
            <div className="bg-[#FFA900]/10 p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#FFA900] transition-colors">
              <Lightbulb className="h-8 w-8 text-[#FFA900] group-hover:text-black transition-colors" />
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-4">Portfólio de verdade</h4>
            <p className="text-gray-600 font-medium leading-relaxed">
              Ao final, você sai com um projeto real no portfólio — não um exercício de sala que fica esquecido depois da nota.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
