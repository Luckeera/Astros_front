import React, { useState } from 'react';
import { X, Flag, Rocket, CheckCircle2, GitCommit, Sparkles } from 'lucide-react';

const TAG_OPTIONS = [
  { value: 'Marco', label: 'Marco Importante', icon: Flag, color: 'text-amber-500' },
  { value: 'Progresso', label: 'Progresso / Etapa', icon: GitCommit, color: 'text-emerald-500' },
  { value: 'Entrega', label: 'Entrega de Atividade', icon: CheckCircle2, color: 'text-blue-500' },
  { value: 'Lançamento', label: 'Lançamento / Versão', icon: Rocket, color: 'text-purple-500' },
];

const CreateProjectUpdateModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Marco');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor, informe o título da atualização.');
      return;
    }
    if (!content.trim()) {
      setError('Por favor, descreva o que foi concluído ou atingido nesta etapa.');
      return;
    }

    setError('');
    onSubmit({
      title: title.trim(),
      tag,
      content: content.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 md:p-10 shadow-2xl border border-gray-100 flex flex-col relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFA900] text-black font-black text-[10px] uppercase tracking-wider">
            Escrita Incremental
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">
            Registrar Nova Etapa / Marco
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Documente avanços e novidades na linha do tempo pública do projeto.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Categoria / Tag */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Tipo de Atualização
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TAG_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = tag === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTag(opt.value)}
                    className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                      isSelected
                        ? 'border-[#FFA900] bg-amber-50/60 text-gray-900 shadow-sm'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${opt.color}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Título do Marco */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Título da Etapa / Marco
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Entrega do Protótipo Alfa, Lançamento do MVP..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all"
            />
          </div>

          {/* Conteúdo Detalhado */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Descrição do que foi atingido
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              placeholder="Explique os desafios superados, o que foi entregue e os próximos passos..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-xs hover:bg-gray-100 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-black hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar Marco 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectUpdateModal;
