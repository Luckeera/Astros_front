import React, { useState, useEffect } from 'react';
import { X, Pencil, Sparkles } from 'lucide-react';

const EditProjectInfoModal = ({
  isOpen,
  onClose,
  initialName = '',
  initialDescription = '',
  onSubmit,
  isSubmitting = false
}) => {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setError('');
    }
  }, [isOpen, initialName, initialDescription]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError('O nome do projeto deve ter pelo menos 2 caracteres.');
      return;
    }
    if (!description.trim() || description.trim().length < 2) {
      setError('A descrição do projeto deve ter pelo menos 2 caracteres.');
      return;
    }

    setError('');
    onSubmit({
      name: name.trim(),
      description: description.trim()
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
            Gestão do Líder
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <Pencil className="h-5 w-5 text-[#FFA900]" /> Editar Informações do Projeto
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Atualize o título e a descrição geral apresentada para os membros e no mural.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome do Projeto */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Nome do Projeto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Plataforma Solar Inteligente"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all"
            />
          </div>

          {/* Descrição do Projeto */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Descrição do Projeto
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Explique os objetivos, a motivação e os principais desafios da iniciativa..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-gray-500 font-black text-xs uppercase tracking-wider hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FFA900] text-gray-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-black hover:text-white transition-all disabled:opacity-50 border-2 border-gray-900"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectInfoModal;
