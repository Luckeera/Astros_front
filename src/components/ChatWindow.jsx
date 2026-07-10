import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, X, MessageSquare, Send, User, Check, X as XIcon } from 'lucide-react';
import { messageService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatWindow = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && currentUser) {
      loadChats();
    }
  }, [isOpen, token, currentUser]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      const data = await messageService.getChats(token, currentUser.user_id);
      setChats(data);
    } catch (err) {
      console.error('Erro ao carregar conversas:', err);
    }
  };

  const loadMessages = async (chat) => {
    setLoading(true);
    try {
      let data;
      if (chat.project_name) {
        data = await messageService.getProjectMessages(token, chat.project_id, chat.chat_id);
      } else {
        data = await messageService.getDMMessages(token, chat.chat_id);
      }
      setMessages(data.messages || data || []);
    } catch (err) {
      console.error('Erro ao carregar mensagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!msgInput.trim() || !activeChat) return;
    try {
      let newMessage;
      if (activeChat.project_name) {
        newMessage = await messageService.sendProjectMessage(token, activeChat.project_id, activeChat.chat_id, msgInput);
      } else {
        newMessage = await messageService.sendDMMessage(token, activeChat.chat_id, msgInput);
      }
      setMessages(prev => [...prev, newMessage]);
      setMsgInput('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const handleInviteAction = async (msg, action) => {
    // action can be 'accept' or 'reject'
    try {
      if (action === 'accept') {
        await projectService.acceptInvite(token, msg.sender_id, msg.invite_id, msg.project_id);
      } else {
        await projectService.rejectInvite(token, msg.sender_id, msg.invite_id, msg.project_id);
      }
      loadMessages(activeChat); // Reload to update status
    } catch (err) {
      console.error('Erro ao processar convite:', err);
    }
  };

  if (!isOpen) return null;

  const getChatTitle = (chat) => {
    if (chat.project_name) {
      return { name: chat.project_name, subtitle: 'Projeto' };
    }
    return { name: chat.other_participant?.name || 'Desconhecido', subtitle: 'DM' };
  };

  return (
    <div className="fixed bottom-24 right-8 w-[22rem] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col z-[150] animate-in slide-in-from-bottom-6 duration-300 overflow-hidden ring-1 ring-black/5">
      <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
        <div className="flex items-center gap-3">
          {activeChat ? (
            <>
              <button onClick={() => setActiveChat(null)} className="p-1 hover:bg-white/10 rounded-lg"><ChevronLeft className="h-5 w-5" /></button>
              <div>
                <span className="text-xs font-black uppercase tracking-widest block leading-tight truncate max-w-[120px]">
                  {getChatTitle(activeChat).name}
                </span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                  {getChatTitle(activeChat).subtitle}
                </span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#FFA900] rounded-full animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Conversas</span>
            </div>
          )}
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
      </div>
      
      <div className="h-[26rem] flex flex-col bg-gray-50/30">
        {!activeChat ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chats.length > 0 ? (
              chats.map(chat => {
                const title = getChatTitle(chat);
                return (
                  <button 
                    key={chat.chat_id}
                    onClick={() => setActiveChat(chat)}
                    className="w-full p-4 bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 group shadow-sm"
                  >
                    <div className="h-10 w-10 bg-gray-100 rounded-xl flex items-center justify-center text-[#FFA900] font-black group-hover:bg-[#FFA900] group-hover:text-white transition-colors border border-gray-50">
                      {title.name[0] || <User className="h-4 w-4" />}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <h4 className="text-xs font-black text-gray-900 uppercase tracking-tight truncate">{title.name}</h4>
                      <p className="text-[9px] text-[#FFA900] font-bold uppercase tracking-tighter truncate">{title.subtitle}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-6 opacity-40">
                <MessageSquare className="h-10 w-10 text-gray-300 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">Nenhuma conversa ativa ainda.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-6 h-6 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
                </div>
              ) : messages.length > 0 ? (
                messages.map(msg => (
                  <div key={msg.message_id} className={`flex flex-col ${msg.sender_id === currentUser?.user_id ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] px-5 py-3 text-xs font-bold ${
                      msg.is_invite 
                        ? 'bg-amber-100 text-amber-900 rounded-2xl border-2 border-amber-300 shadow-sm'
                        : msg.sender_id === currentUser?.user_id 
                          ? 'bg-gray-900 text-white rounded-2xl rounded-tr-none shadow-sm' 
                          : 'bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm'
                    }`}>
                      {msg.is_invite && <p className="text-[10px] font-black uppercase mb-1">💌 Convite de Projeto</p>}
                      {msg.content}
                      {msg.is_invite && msg.sender_id !== currentUser?.user_id && (
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => handleInviteAction(msg, 'accept')} className="bg-green-500 text-white p-1.5 rounded-lg flex-1 flex justify-center hover:bg-green-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleInviteAction(msg, 'reject')} className="bg-red-500 text-white p-1.5 rounded-lg flex-1 flex justify-center hover:bg-red-600"><XIcon className="w-4 h-4" /></button>
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 font-black uppercase mt-1.5 px-2 tracking-tighter">
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <div className="bg-gray-100 p-4 rounded-2xl mb-4 opacity-50"><MessageSquare className="h-8 w-8 text-gray-400" /></div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">Inicie a conversa!</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
              <input 
                autoFocus
                type="text" 
                placeholder="Diga algo..." 
                className="flex-1 text-xs bg-gray-50 px-5 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA900] transition-all font-bold placeholder:text-gray-300 shadow-inner" 
                value={msgInput}
                onChange={e => setMsgInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                disabled={!msgInput.trim()}
                className="p-3.5 bg-[#FFA900] text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-md shadow-[#FFA900]/20 disabled:opacity-50"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
