import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Hash } from 'lucide-react';

const AddProjectRoleModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [roleName, setRoleName] = useState('');
  const [roleQuantity, setRoleQuantity] = useState(1);
  const [roleExplanation, setRoleExplanation] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roleName.trim() || roleName.trim().length < 2) {
      setError('Por favor, informe um título ou nome válido para a vaga.');
      return;
    }
    const qty = parseInt(roleQuantity, 10);
    if (isNaN(qty) || qty < 1) {
      setError('A quantidade de vagas deve ser de pelo menos 1.');
      return;
    }
    if (!roleExplanation.trim() || roleExplanation.trim().length < 2) {
      setError('Por favor, descreva as responsabilidades e requisitos para a vaga.');
      return;
    }

    setError('');
    onSubmit({
      role_name: roleName.trim(),
      role_quantity: qty,
      role_explanation: roleExplanation.trim()
    });
  };

  const handleClose = () => {
    setRoleName('');
    setRoleQuantity(1);
    setRoleExplanation('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] max-w-xl w-full p-8 md:p-10 shadow-2xl border border-gray-100 flex flex-col relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="px-2.5 py-0.5 rounded-full bg-[#FFA900] text-black font-black text-[10px] uppercase tracking-wider">
            Nova Vaga
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#FFA900]" /> Adicionar Vaga ao Projeto
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Abra oportunidades na equipe para atrair novos membros e colaboradores.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome da Função */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              Nome da Função / Papel
            </label>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Ex: Desenvolvedor Front-end, Designer UI/UX, Pesquisador..."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all"
            />
          </div>

          {/* Quantidade de Vagas */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2 flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-[#FFA900]" /> Quantidade de Pessoas Necessárias
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={roleQuantity}
              onChange={(e) => setRoleQuantity(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all"
            />
            <span className="text-[10px] text-gray-400 font-medium mt-1 block">
              Se for maior que 1, múltiplas vagas com esse título serão abertas na equipe.
            </span>
          </div>

          {/* Explicação da Função */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-700 mb-2">
              O que a função envolve
            </label>
            <textarea
              value={roleExplanation}
              onChange={(e) => setRoleExplanation(e.target.value)}
              rows={4}
              placeholder="Descreva as responsabilidades, ferramentas ou habilidades esperadas para esta vaga..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FFA900] focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
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
                  Abrindo Vaga...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Abrir Vaga
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectRoleModal;
