import React from 'react';
import { BookOpen, MapPin, Bell, AlertCircle, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrbitIcon from '../icons/OrbitIcon';

const ProfileScreen = () => {
  const { user } = useAuth();
  const notice = { text: "Atividade da Semana Ubíqua vence sexta às 23:59", label: "URGENTE" };
  const collabPosts = [
    { id: 1, title: "MVP de Software Mobile", subject: "Sistemas", desc: "Procuro Dev para integrar backend em projeto de extensão." },
    { id: 2, title: "Grupo de Estudos Avançados em IA", subject: "IA", desc: "Preparação para a Maratona de Programação." },
    { id: 3, title: "Protótipo UX de Saúde", subject: "Design", desc: "Voluntários para teste de usabilidade em app médico." },
  ];

  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-0">
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden mb-12 shadow-2xl shadow-gray-200/50 ring-1 ring-black/5">
        <div className="h-56 bg-gradient-to-br from-[#FFA900] to-[#FF8C00] relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="px-12 pb-14 relative">
          <div className="h-36 w-32 rounded-2xl border-[10px] border-white bg-gray-900 -mt-18 mb-10 shadow-2xl flex items-center justify-center text-white text-7xl font-black rotate-3 hover:rotate-0 transition-all duration-500 group cursor-help animate-in zoom-in-50">
            <span className="group-hover:scale-110 transition-transform">{user.name[0]}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tighter mb-3 leading-none">{user.name}</h1>
              <div className="flex items-center gap-4">
                <span className="px-5 py-2 bg-[#FFA900] text-black text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-orange-100">
                  {user.course?.area || 'Acadêmico'}
                </span>
                <span className="text-gray-400 font-black text-[11px] tracking-widest uppercase border-l border-gray-200 pl-4">MATRÍCULA #{user.user_id}</span>
              </div>
            </div>
            <button className="w-full sm:w-auto px-10 py-5 bg-gray-900 text-white border-2 border-gray-900 rounded-2xl text-[11px] font-black hover:bg-transparent hover:text-gray-900 transition-all shadow-xl uppercase tracking-[0.2em] active:scale-95">Editar Perfil</button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.3em]">Graduação</span>
              <div className="flex items-center gap-5 text-lg font-black text-gray-800">
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-50"><BookOpen className="h-6 w-6 text-[#FFA900]" /></div>
                {user.course?.name || "Bacharelado"}
              </div>
            </div>
            <div className="p-8 bg-gray-50/50 rounded-2xl border border-gray-100 group hover:border-[#FFA900]/40 transition-all hover:bg-white shadow-sm">
              <span className="block text-[10px] font-black text-gray-400 uppercase mb-4 tracking-[0.3em]">Jornada</span>
              <div className="flex items-center gap-5 text-lg font-black text-gray-800">
                <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-50"><MapPin className="h-6 w-6 text-[#FFA900]" /></div>
                {user.period}º Período
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-8 px-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-gray-900 rounded-xl text-white shadow-xl shadow-gray-200"><Bell className="h-5 w-5" /></div> Mural de Avisos
          </h3>
        </div>
        <div className="bg-white p-10 rounded-3xl border-l-[12px] border-[#FFA900] border-t border-r border-b border-gray-100 shadow-2xl shadow-gray-200/50 flex items-center justify-between group hover:scale-[1.03] transition-all cursor-pointer ring-1 ring-black/5">
          <div className="flex-1">
            <span className="text-[10px] font-black text-[#FFA900] uppercase tracking-[0.3em] mb-2 block font-sans">Alerta Prioritário</span>
            <p className="text-gray-800 font-black text-xl tracking-tight leading-snug max-w-sm">{notice.text}</p>
          </div>
          <div className="h-18 w-18 bg-orange-50 rounded-2xl flex items-center justify-center border-2 border-orange-100 shadow-inner group-hover:bg-[#FFA900] transition-colors">
            <AlertCircle className="h-8 w-8 text-[#FFA900] group-hover:text-white transition-colors" />
          </div>
        </div>
      </section>

      <section className="mb-16">
        <div className="flex justify-between items-center mb-8 px-6">
          <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-[#FFA900] rounded-xl text-white shadow-xl shadow-orange-100"><Sparkles className="h-5 w-5" /></div> Seus Projetos
          </h3>
        </div>
        <div className="flex gap-6 overflow-x-auto pt-8 pb-10 scrollbar-hide -mx-4 px-6 sm:mx-0 sm:px-0">
          {collabPosts.map(post => (
            <div key={post.id} className="min-w-[320px] bg-white p-10 rounded-3xl border border-gray-100 shadow-xl hover:shadow-3xl transition-all group hover:-translate-y-3 ring-1 ring-black/5">
              <span className="inline-block px-5 py-2 bg-gray-50 text-gray-400 text-[10px] font-black rounded-xl mb-8 group-hover:bg-gray-900 group-hover:text-white transition-all uppercase tracking-widest border border-gray-100">
                {post.subject}
              </span>
              <h4 className="text-2xl font-black text-gray-900 mb-4 tracking-tighter leading-tight group-hover:text-[#FFA900] transition-colors">{post.title}</h4>
              <p className="text-gray-400 text-sm font-medium leading-[1.6] mb-8 line-clamp-2">{post.desc}</p>
              <div className="flex items-center gap-3 text-[#FFA900] group-hover:translate-x-3 transition-transform">
                <div className="p-2 bg-orange-50 rounded-xl border border-orange-100 group-hover:bg-[#FFA900] group-hover:text-white transition-all duration-500 shadow-sm">
                  <OrbitIcon className="h-5 w-5 animate-[slowRotate_20s_linear_infinite]" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Ver Engajamento</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white rounded-3xl border border-gray-100 p-12 shadow-2xl shadow-gray-200/50 ring-1 ring-black/5">
        <div className="flex items-center justify-between mb-10">
           <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-gray-900 rounded-xl text-white shadow-xl shadow-gray-200"><Users className="h-5 w-5" /></div> Status Ativo
           </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {Array.from({ length: 98 }, (_, i) => {
            const level = Math.floor(Math.random() * 4); 
            const delay = i * 5;
            return (
              <div 
                key={i} 
                style={{ animationDelay: `${delay}ms` }}
                className={`w-5 h-5 rounded-lg transition-all duration-200 cursor-pointer shadow-sm animate-in fade-in zoom-in-50 duration-300 hover:z-20 hover:scale-[2.1] hover:rotate-[15deg] hover:shadow-2xl hover:ring-2 hover:ring-[#FFA900] ${
                  level === 0 ? 'bg-gray-100 hover:bg-gray-200' : 
                  level === 1 ? 'bg-orange-100 hover:bg-orange-200' : 
                  level === 2 ? 'bg-orange-300 hover:bg-orange-500' : 
                  'bg-[#FFA900] hover:bg-orange-600 hover:shadow-orange-200'
                }`} 
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
