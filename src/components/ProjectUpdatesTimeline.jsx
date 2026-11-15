import React from 'react';
import { 
  GitCommit, Flag, Users, Rocket, CheckCircle2, 
  Clock, ShieldAlert, Sparkles, Plus
} from 'lucide-react';

const formatUpdateDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

const getTagConfig = (tag, updateType) => {
  const normalizedTag = (tag || '').toLowerCase();

  if (normalizedTag.includes('marco')) {
    return {
      icon: Flag,
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
      dotBg: 'bg-[#FFA900] text-gray-950 ring-4 ring-amber-100',
      label: 'Marco'
    };
  }
  if (normalizedTag.includes('equipe')) {
    return {
      icon: Users,
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-200',
      dotBg: 'bg-blue-500 text-white ring-4 ring-blue-100',
      label: 'Equipe'
    };
  }
  if (normalizedTag.includes('entrega') || normalizedTag.includes('lança')) {
    return {
      icon: Rocket,
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-200',
      dotBg: 'bg-purple-500 text-white ring-4 ring-purple-100',
      label: 'Entrega'
    };
  }
  
  return {
    icon: updateType === 'system' ? CheckCircle2 : GitCommit,
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    dotBg: 'bg-emerald-500 text-white ring-4 ring-emerald-100',
    label: tag || 'Progresso'
  };
};

const ProjectUpdatesTimeline = ({ 
  updates = [], 
  isMember = false, 
  onOpenNewUpdateModal 
}) => {
  return (
    <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
      {/* Cabeçalho da Linha do Tempo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black text-white font-black text-[10px] uppercase tracking-wider">
              Escrita Incremental
            </span>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
              <GitCommit className="h-6 w-6 text-[#FFA900]" /> Histórico & Linha do Tempo
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Registro cronológico contínuo de marcos, entregas e alterações na equipe.
          </p>
        </div>

        {isMember && onOpenNewUpdateModal && (
          <button
            type="button"
            onClick={onOpenNewUpdateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-black hover:text-white transition-all self-start sm:self-auto hover:scale-[1.02] active:scale-95"
          >
            <Plus className="h-4 w-4" /> Novo Marco / Atualização
          </button>
        )}
      </div>

      {/* Lista / Timeline */}
      {updates.length === 0 ? (
        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-100">
            <Clock className="h-8 w-8" />
          </div>
          <p className="text-gray-500 font-bold text-sm">Nenhum evento registrado ainda.</p>
          <p className="text-xs text-gray-400 mt-1">
            As alterações da equipe e os marcos do projeto serão versionados aqui em tempo real.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#FFA900] before:via-gray-200 before:to-gray-100 space-y-8">
          {updates.map((item) => {
            const config = getTagConfig(item.tag, item.update_type);
            const IconComponent = config.icon;

            return (
              <div key={item.update_id} className="relative group">
                {/* Node da Timeline (Dot) */}
                <div className={`absolute -left-[1.85rem] sm:-left-[2.1rem] top-1.5 w-7 h-7 rounded-xl ${config.dotBg} flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                  <IconComponent className="h-3.5 w-3.5" />
                </div>

                {/* Conteúdo do Card de Atualização */}
                <div className="bg-gray-50/70 hover:bg-white border border-gray-100 hover:border-gray-200 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${config.badgeBg}`}>
                        {config.label}
                      </span>
                      {item.update_type === 'system' ? (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Log do Sistema
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-600">
                          por <strong className="text-gray-900">{item.author_name || 'Integrante'}</strong>
                        </span>
                      )}
                    </div>

                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {formatUpdateDate(item.created_at)}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-gray-900 tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectUpdatesTimeline;
