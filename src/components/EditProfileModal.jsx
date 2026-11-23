import React, { useState, useEffect } from 'react';
import { X, Target, User, Calendar, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService, macroAreaService } from '../services/api';
import { OFFICIAL_MACRO_AREAS } from '../services/macroAreasData';

export default function EditProfileModal({ isOpen, onClose, onProfileUpdated }) {
  const { user, token, updateUser } = useAuth();

  const [name, setName] = useState('');
  const [period, setPeriod] = useState(1);
  const [macroAreaId, setMacroAreaId] = useState('');
  const [secondaryMacroAreaId, setSecondaryMacroAreaId] = useState('');
  const [macroAreas, setMacroAreas] = useState(OFFICIAL_MACRO_AREAS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setPeriod(user.period || 1);
      setMacroAreaId(user.macro_area_id || (user.macro_area?.macro_area_id) || '');
      setSecondaryMacroAreaId(user.secondary_macro_area_id || (user.secondary_macro_area?.macro_area_id) || '');
      setError(null);

      macroAreaService.getMacroAreas()
        .then(data => {
          if (Array.isArray(data) && data.length > 0) setMacroAreas(data);
        })
        .catch(() => setMacroAreas(OFFICIAL_MACRO_AREAS));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || name.trim().length < 2) {
      setError('O nome deve conter pelo menos 2 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: name.trim(),
        period: Number(period) || 1,
        macro_area_id: macroAreaId ? Number(macroAreaId) : null,
        secondary_macro_area_id: secondaryMacroAreaId ? Number(secondaryMacroAreaId) : null
      };

      const updatedUser = await userService.updateProfile(token, user.user_id, payload);
      
      if (updateUser) {
        updateUser(updatedUser);
      }
      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      onClose();
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      setError(err.message || 'Falha ao atualizar perfil. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden my-auto z-10 animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-[#FAF9F6] flex items-center justify-between">
          <div>
            <span className="px-3 py-1 bg-[#FFA900]/20 text-gray-900 border border-[#FFA900] rounded-lg text-[10px] font-black uppercase tracking-wider inline-block mb-1">
              Configurações do Aluno
            </span>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Editar Perfil</h3>
          </div>
          <button
            onClick={onClose}
            className="h-9 w-9 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Nome */}
          <div>
            <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
              Nome de Exibição *
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#FFA900] focus:bg-white transition-all font-bold text-xs text-gray-900"
              />
            </div>
          </div>

          {/* Semestre / Período */}
          <div>
            <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1">
              Semestre Atual *
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 h-4 w-4 text-gray-400" />
              <select
                value={period}
                onChange={e => setPeriod(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#FFA900] focus:bg-white transition-all font-bold text-xs text-gray-900 appearance-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>{n}º Semestre / Período</option>
                ))}
              </select>
            </div>
          </div>

          {/* Macro Área Principal */}
          <div>
            <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-[#FFA900]" />
              1ª Habilidade Prática Principal (Macro Área)
            </label>
            <div className="relative flex items-center">
              <select
                value={macroAreaId}
                onChange={e => setMacroAreaId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#FFA900] focus:bg-white transition-all font-bold text-xs text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Selecione sua 1ª habilidade...</option>
                {macroAreas.map(m => (
                  <option key={m.macro_area_id} value={m.macro_area_id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
            </div>
          </div>

          {/* 2ª Macro Área Opcional */}
          <div>
            <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5 text-gray-400" />
              2ª Habilidade Complementar <span className="text-gray-400 font-normal lowercase">(opcional - máx. 2)</span>
            </label>
            <div className="relative flex items-center">
              <select
                value={secondaryMacroAreaId}
                onChange={e => setSecondaryMacroAreaId(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-[#FFA900] focus:bg-white transition-all font-bold text-xs text-gray-900 appearance-none cursor-pointer"
              >
                <option value="">Nenhuma (Apenas 1 habilidade)</option>
                {macroAreas.filter(m => m.macro_area_id !== Number(macroAreaId)).map(m => (
                  <option key={m.macro_area_id} value={m.macro_area_id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
            </div>
            <p className="text-[10px] text-gray-400 font-medium mt-1">
              Você pode ter até 2 macro áreas práticas no seu perfil acadêmico.
            </p>
          </div>

          {/* Botões */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gray-900 text-white font-black text-xs uppercase tracking-wider hover:bg-[#FFA900] hover:text-black transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
