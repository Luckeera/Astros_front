import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Plus, X } from 'lucide-react';
import FeedbackModal from '../components/ui/FeedbackModal';

const ProjectCreationScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [roles, setRoles] = useState([]);
  const [feedback, setFeedback] = useState({ open: false, type: 'success', title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  const addRole = () => {
    setRoles([...roles, { title: '', description: '', quantity: 1 }]);
  };

  const updateRole = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index][field] = value;
    setRoles(newRoles);
  };

  const removeRole = (index) => {
    const newRoles = roles.filter((_, i) => i !== index);
    setRoles(newRoles);
  };

  const handleCreate = async () => {
    if (!name.trim() || !description.trim()) {
      setFeedback({ open: true, type: 'error', title: 'Campos Vazios', message: 'Preencha o nome e descrição do projeto.' });
      return;
    }

    if (roles.length > 0) {
      const invalidRole = roles.find(r => r.title.length < 2 || r.description.length < 10);
      if (invalidRole) {
        setFeedback({ open: true, type: 'error', title: 'Validação de Vagas', message: 'Cada vaga deve ter um título com no mínimo 2 caracteres e uma descrição com no mínimo 10 caracteres.' });
        return;
      }
    }

    setSubmitting(true);
    try {
      const projData = {
        name,
        description,
        ...(roles.length > 0 && {
          roles: roles.map(r => ({
            role_name: r.title,
            role_quantity: r.quantity,
            role_explanation: r.description
          }))
        })
      };
      const res = await projectService.createProject(token, projData);
      setFeedback({ open: true, type: 'success', title: 'Projeto Criado!', message: 'O projeto foi criado com sucesso.' });
    } catch (err) {
      console.error(err);
      setFeedback({ open: true, type: 'error', title: 'Erro', message: 'Não foi possível criar o projeto.' });
    } finally {
      setSubmitting(false);
    }
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
    if (feedback.type === 'success') {
      navigate('/projects');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 pt-32 pb-40">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors">
        <ArrowLeft className="h-5 w-5" /> Voltar
      </button>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-8">Novo Projeto</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Nome do Projeto</label>
            <input 
              type="text" 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-[#FFA900]/10 focus:border-[#FFA900] focus:bg-white transition-all outline-none"
              placeholder="Ex: App de Gestão de Tempo"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Descrição</label>
            <textarea 
              className="w-full h-32 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-[#FFA900]/10 focus:border-[#FFA900] focus:bg-white transition-all outline-none resize-none"
              placeholder="Descreva o objetivo do projeto..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vagas / Funções (Opcional)</label>
              <button onClick={addRole} className="text-xs font-black text-[#FFA900] uppercase tracking-widest flex items-center gap-1 hover:text-gray-900 transition-colors">
                <Plus className="h-4 w-4" /> Adicionar Vaga
              </button>
            </div>

            <div className="space-y-4">
              {roles.map((role, idx) => (
                <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                  <button onClick={() => removeRole(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <input 
                        type="text" 
                        placeholder="Título da vaga (ex: Backend)" 
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#FFA900]/50 outline-none"
                        value={role.title}
                        onChange={(e) => updateRole(idx, 'title', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-1">
                      <input 
                        type="number" 
                        min="1"
                        placeholder="Qtd" 
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#FFA900]/50 outline-none"
                        value={role.quantity}
                        onChange={(e) => updateRole(idx, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <input 
                        type="text" 
                        placeholder="Descrição curta (ex: Node.js e SQL)" 
                        className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#FFA900]/50 outline-none"
                        value={role.description}
                        onChange={(e) => updateRole(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {roles.length === 0 && (
                <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-2xl text-gray-400 text-xs font-bold">
                  Nenhuma vaga adicionada ainda.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-end">
          <button 
            disabled={submitting}
            onClick={handleCreate}
            className="bg-gray-900 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-gray-200 uppercase tracking-widest text-xs hover:bg-[#FFA900] disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Criando...' : 'Criar Projeto'}
          </button>
        </div>
      </div>
      
      <FeedbackModal 
        isOpen={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={closeFeedback}
      />
    </div>
  );
};

export default ProjectCreationScreen;
