import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { messageService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProjectChatSection = ({ project }) => {
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const data = await messageService.getProjectMessages(token, project.project_id, project.chat_id);
      setMessages(prev => {
        const newMsgs = data.messages || data || [];
        if (prev.length !== newMsgs.length) {
          setTimeout(scrollToBottom, 100);
          return newMsgs;
        }
        return prev;
      });
    } catch (err) {
      console.error('Erro ao carregar chat do projeto:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (project.chat_id) {
      loadMessages();
      // Optional polling or wait for websockets if needed
      const interval = setInterval(() => loadMessages(true), 10000); // refresh every 10s as a fallback
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [project.chat_id, token, project.project_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!msgInput.trim()) return;
    try {
      const newMessage = await messageService.sendProjectMessage(token, project.project_id, project.chat_id, msgInput);
      setMessages(prev => [...prev, newMessage]);
      setMsgInput('');
      scrollToBottom();
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  if (!project.chat_id) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center shadow-sm">
        <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-4" />
        <p className="text-sm font-bold text-gray-400">O chat deste projeto não está disponível.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col h-[500px] overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-black text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#FFA900]" /> Chat do Projeto
          </h3>
          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mt-1">Comunicação interna exclusiva da equipe</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
        {loading && messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
          </div>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <div key={msg.message_id} className={`flex flex-col ${msg.sender_id === currentUser?.user_id ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] px-5 py-3 text-sm font-bold ${
                msg.sender_id === currentUser?.user_id 
                  ? 'bg-[#FFA900] text-black rounded-2xl rounded-tr-none shadow-sm' 
                  : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm'
              }`}>
                {msg.sender_id !== currentUser?.user_id && (
                  <p className="text-[10px] font-black uppercase text-[#FFA900] mb-1">{msg.author_name || 'Participante'}</p>
                )}
                {msg.content}
              </div>
              <span className="text-[9px] text-gray-400 font-black uppercase mt-1.5 px-2 tracking-tighter">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="bg-gray-100 p-4 rounded-2xl mb-4 opacity-50"><MessageSquare className="h-8 w-8 text-gray-400" /></div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">Nenhuma mensagem ainda.</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input 
          type="text" 
          placeholder="Digite sua mensagem para a equipe..." 
          className="flex-1 text-sm bg-gray-50 px-5 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA900] transition-all font-bold placeholder:text-gray-300 shadow-inner" 
          value={msgInput}
          onChange={e => setMsgInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
        />
        <button 
          disabled={!msgInput.trim()}
          className="p-4 bg-gray-900 text-white rounded-xl hover:bg-[#FFA900] hover:text-black transition-all shadow-md disabled:opacity-50"
          onClick={handleSendMessage}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectChatSection;
