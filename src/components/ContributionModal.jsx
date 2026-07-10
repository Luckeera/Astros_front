import React, { useState } from 'react';
import { X } from 'lucide-react';
import OrbitIcon from '../icons/OrbitIcon';
import { messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './ui/FeedbackModal';

const ContributionModal = ({ post, onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ open: false, type: 'success', title: '', message: '' });
  const { token, user: currentUser } = useAuth();

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    try {
      const chatData = await messageService.createDM(token, currentUser.user_id, post.author.user_id);
      await messageService.sendPresentation(token, chatData.chat_id, message, post.author.user_id, post.project_id);
      
      setFeedback({
        open: true,
        type: 'success',
        title: 'Vôo Autorizado!',
        message: 'Sua proposta foi enviada. O autor poderá iniciar uma conversa com você em breve.'
      });
      setMessage('');
    } catch (err) {
      console.error(err);
      let errorTitle = 'Pouso Forçado';
      let errorMsg = 'Não conseguimos enviar sua proposta agora.';
      
      if (err.message && err.message.includes('403')) {
        errorTitle = 'Acesso Negado';
        errorMsg = 'Você não pode colaborar no seu próprio projeto ou seu curso não é o alvo desta vez.';
      }

      setFeedback({
        open: true,
        type: 'error',
        title: errorTitle,
        message: errorMsg
      });
    } finally {
      setSending(false);
    }
  };

  const closeWithSuccess = () => {
    setFeedback({ ...feedback, open: false });
    if (feedback.type === 'success') {
      onClose();
      // Dispara o evento para abrir o chat automaticamente, educando o usuário
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-chat'));
      }, 300); // Pequeno atraso para a animação do modal fechar
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">Colaborar com Projeto</h3>
              <p className="text-[10px] font-black text-[#FFA900] uppercase tracking-widest mt-1">Ref: {post.title}</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200 shadow-sm">
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-8">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Sua Apresentação Acadêmica</label>
            <textarea 
              autoFocus
              className="w-full h-48 p-6 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#FFA900]/10 focus:border-[#FFA900] focus:bg-white transition-all outline-none resize-none leading-relaxed shadow-inner" 
              placeholder="Olá! Sou de [Seu Curso] e me interessei no seu projeto. Minhas habilidades em..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button 
                onClick={onClose}
                className="flex-1 py-4 text-gray-500 font-black text-xs uppercase tracking-widest hover:text-gray-900 transition-colors"
              >
                Cancelar
              </button>
              <button 
                disabled={!message.trim() || sending}
                onClick={handleSend}
                className="flex-[2] py-5 bg-gray-900 text-white font-black rounded-2xl hover:bg-black disabled:opacity-50 transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-xs flex items-center justify-center gap-4 group"
              >
                {sending ? 'Enviando Proposta...' : 'Enviar Solicitação'}
                <div className="bg-white/10 p-2 rounded-xl group-hover:bg-[#FFA900] transition-colors">
                  <OrbitIcon className="h-7 w-7 animate-[slowRotate_10s_linear_infinite]" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <FeedbackModal 
        isOpen={feedback.open}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onClose={closeWithSuccess}
      />
    </>
  );
};

export default ContributionModal;
