import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Rocket, AlertCircle, CheckCircle2, Sparkles, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';

export default function CreateProjectModal({
  isOpen,
  onClose,
  onProjectCreated,
  initialData = null
}) {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSuccess(false);
      if (initialData) {
        setName(initialData.name || '');
        const desc = initialData.description || initialData.summary || '';
        setDescription(desc);

        if (initialData.roles && Array.isArray(initialData.roles)) {
          const prefilledRoles = initialData.roles
            .filter(r => !r.name.toLowerCase().includes('líder') && !r.name.toLowerCase().includes('lider'))
            .map(r => ({
              title: r.name.slice(0, 50),
              quantity: 1,
              description: (r.explanation && r.explanation.length >= 2)
                ? r.explanation
                : 'Colaboração no desenvolvimento e entregas técnicas da função.'
            }));
          setRoles(prefilledRoles);
        } else {
          setRoles([]);
        }
      } else {
        setName('');
        setDescription('');
        setRoles([]);
      }
    }
  }, [isOpen, initialData]);

  // Fechar com a tecla ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAddRole = () => {
    setRoles(prev => [...prev, { title: '', quantity: 1, description: '' }]);
  };

  const handleUpdateRole = (index, field, value) => {
    setRoles(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveRole = (index) => {
    setRoles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      navigate('/login', { state: { message: 'Faça login para criar seu projeto!' } });
      return;
    }

    if (!name.trim() || name.length < 2) {
      setError('O nome do projeto deve ter no mínimo 2 caracteres.');
      return;
    }
    if (name.length > 150) {
      setError('O nome do projeto deve ter no máximo 150 caracteres.');
      return;
    }

    if (!description.trim() || description.length < 2) {
      setError('A descrição do projeto deve ter no mínimo 2 caracteres.');
      return;
    }
    if (description.length > 5000) {
      setError('A descrição do projeto deve ter no máximo 5000 caracteres.');
      return;
    }

    for (let i = 0; i < roles.length; i++) {
      const r = roles[i];
      if (!r.title.trim() || r.title.length < 2) {
        setError(`Vaga #${i + 1}: o título deve ter no mínimo 2 caracteres.`);
        return;
      }
      if (r.title.length > 100) {
        setError(`Vaga #${i + 1}: o título deve ter no máximo 100 caracteres.`);
        return;
      }
      if (!r.description.trim() || r.description.length < 2) {
        setError(`Vaga #${i + 1} (${r.title}): a descrição da vaga deve ter no mínimo 2 caracteres.`);
        return;
      }
      if (r.description.length > 2000) {
        setError(`Vaga #${i + 1} (${r.title}): a descrição da vaga deve ter no máximo 2000 caracteres.`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        roles: roles.map(r => ({
          role_name: r.title.trim(),
          role_quantity: Number(r.quantity) || 1,
          role_explanation: r.description.trim()
        }))
      };

      const created = await projectService.createProject(token, payload);
      setSuccess(true);
      if (onProjectCreated) {
        onProjectCreated(created);
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Falha ao criar o projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isMuralIdea = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Backdrop click listener */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto z-10 animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFA900]/20 text-gray-900 border border-[#FFA900] rounded-lg text-xs font-black uppercase tracking-wider mb-2">
              {isMuralIdea ? <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" /> : <Briefcase className="h-3.5 w-3.5 text-[#FFA900]" />}
              {isMuralIdea ? 'Tirar Ideia do Papel' : 'Novo Projeto Acadêmico'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {isMuralIdea ? 'Lançar Projeto da Ideia' : 'Criar Novo Projeto'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              {isMuralIdea 
                ? 'Você será o líder deste projeto. Ajuste o título, a descrição e as vagas antes de publicar.' 
                : 'Defina os objetivos do seu projeto e monte sua equipe com alunos de diferentes cursos.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
            title="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-800">
          {!user && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-[#FFA900] flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#FFA900] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs sm:text-sm font-black text-gray-900">
                  Você precisa estar conectado para lançar o projeto.
                </p>
                <p className="text-xs text-gray-600 font-medium mt-0.5">
                  Faça login ou crie sua conta para cadastrar e liderar esta iniciativa.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/login', { state: { message: 'Faça login para criar seu projeto!' } })}
                  className="mt-3 px-4 py-2 bg-gray-900 text-white font-black text-xs uppercase tracking-wider rounded-xl hover:bg-[#FFA900] hover:text-black transition-colors"
                >
                  Entrar na Conta
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>Projeto criado com sucesso!</span>
            </div>
          )}

          <form id="create-project-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Nome do Projeto */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Nome do Projeto *
                </label>
                <span className="text-[11px] font-bold text-gray-400">
                  {name.length}/150
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: BioPrótese: Membros Mecânicos em 3D"
                maxLength={150}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:border-gray-900 outline-none transition-colors"
              />
            </div>

            {/* Descrição do Projeto */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-gray-900">
                  Descrição do Desafio & Objetivos *
                </label>
                <span className="text-[11px] font-bold text-gray-400">
                  {description.length}/5000
                </span>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o objetivo do projeto, o problema que pretende resolver e como a equipe atuará..."
                rows={4}
                maxLength={5000}
                required
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium text-sm text-gray-900 focus:border-gray-900 outline-none transition-colors resize-none"
              />
            </div>

            {/* Vagas / Papéis Procurados */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">
                    Vagas Procuradas
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Quais habilidades de outros cursos você busca para seu time?
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-[#FFA900] hover:text-black text-gray-800 rounded-xl text-xs font-black flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Adicionar Vaga
                </button>
              </div>

              {roles.length === 0 ? (
                <div className="p-5 rounded-2xl border-2 border-dashed border-gray-200 text-center bg-gray-50/50">
                  <p className="text-xs font-bold text-gray-500">
                    Nenhuma vaga específica adicionada no momento. Você poderá adicionar mais vagas depois na gestão do projeto.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="mt-2 text-xs font-black text-[#FFA900] hover:underline"
                  >
                    + Adicionar a primeira vaga
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.map((role, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 bg-gray-900 text-white rounded text-[10px] font-black uppercase">
                          Vaga #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(idx)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Remover vaga"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Função (ex: Designer UI, Dev Python, Jurídico)"
                            value={role.title}
                            maxLength={50}
                            onChange={(e) => handleUpdateRole(idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-gray-900"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Qtd"
                            value={role.quantity}
                            onChange={(e) => handleUpdateRole(idx, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-900 outline-none focus:border-gray-900"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <input
                          type="text"
                          placeholder="Descrição do que a pessoa irá fazer (mínimo 2 caracteres)..."
                          value={role.description}
                          maxLength={500}
                          onChange={(e) => handleUpdateRole(idx, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs font-medium text-gray-700 outline-none focus:border-gray-900"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-5 sm:p-6 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            form="create-project-form"
            disabled={loading || success || !user}
            className="px-7 py-3 bg-[#FFA900] text-black font-black text-xs uppercase tracking-wider rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Criando Projeto...
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                {isMuralIdea ? 'Lançar Este Projeto' : 'Criar Projeto'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
