import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronLeft, X, MessageSquare, Send, User, Check, X as XIcon, Search, Sparkles, Briefcase } from 'lucide-react';
import { messageService, projectService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import OrbitIcon from '../icons/OrbitIcon';

const ChatWindow = ({ isOpen, onClose }) => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [msgInput, setMsgInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, DM, PROJECT

  const { token, user: currentUser } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const loadChats = async (silent = false) => {
    if (!currentUser || !token) return;
    try {
      const data = await messageService.getChats(token, currentUser.user_id);
      setChats(data || []);
      return data || [];
    } catch (err) {
      if (!silent) console.error('Erro ao carregar conversas:', err);
      return [];
    }
  };

  const loadMessages = async (chat, silent = false) => {
    if (!chat || !token) return;
    if (!silent) setLoading(true);
    try {
      let data;
      if (chat.project_name || chat.type === 'PROJECT') {
        data = await messageService.getProjectMessages(token, chat.project_id, chat.chat_id);
      } else {
        data = await messageService.getDMMessages(token, chat.chat_id);
      }
      setMessages(data?.messages || data || []);
    } catch (err) {
      if (!silent) console.error('Erro ao carregar mensagens:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Carregar conversas quando abrir o modal
  useEffect(() => {
    if (isOpen && currentUser) {
      loadChats();
    }
  }, [isOpen, token, currentUser]);

  // Listener para eventos customizados de abertura direta (ex: do perfil ou convite)
  useEffect(() => {
    const handleDirectOpen = async (event) => {
      const detail = event?.detail;
      if (!detail) return;

      const loaded = await loadChats(true);
      const targetChatId = detail.chatId;
      const targetUserId = detail.userId;

      if (targetChatId) {
        const found = loaded.find(c => c.chat_id === targetChatId);
        if (found) {
          setActiveChat(found);
          loadMessages(found);
        } else {
          // Chat recém-criado pode ser montado provisoriamente
          const newChatObj = {
            chat_id: targetChatId,
            type: 'DM',
            other_participant: { user_id: targetUserId, name: detail.userName || 'Colega' }
          };
          setActiveChat(newChatObj);
          loadMessages(newChatObj);
        }
      } else if (targetUserId) {
        const found = loaded.find(c => c.other_participant?.user_id === targetUserId);
        if (found) {
          setActiveChat(found);
          loadMessages(found);
        }
      }
    };

    window.addEventListener('open-chat', handleDirectOpen);
    return () => window.removeEventListener('open-chat', handleDirectOpen);
  }, [currentUser, token]);

  // Carrega mensagens quando muda a conversa ativa
  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat);
    }
  }, [activeChat]);

  // Scroll automático para o final da conversa
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling para mensagens em tempo real quando o modal está aberto
  useEffect(() => {
    if (!isOpen || !activeChat) return;
    const interval = setInterval(() => {
      loadMessages(activeChat, true);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen, activeChat, token]);

  // Polling para lista de conversas
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      loadChats(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [isOpen, token, currentUser]);

  // Fechar com tecla ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSendMessage = async () => {
    if (!msgInput.trim() || !activeChat) return;
    const text = msgInput.trim();
    setMsgInput('');
    try {
      let newMessage;
      if (activeChat.project_name || activeChat.type === 'PROJECT') {
        newMessage = await messageService.sendProjectMessage(token, activeChat.project_id, activeChat.chat_id, text);
      } else {
        newMessage = await messageService.sendDMMessage(token, activeChat.chat_id, text);
      }
      setMessages(prev => [...prev, newMessage]);
      loadChats(true);
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

  const handleInviteAction = async (msg, action) => {
    try {
      if (action === 'accept') {
        await projectService.acceptInvite(token, msg.sender_id, msg.invite_id, msg.project_id);
      } else {
        await projectService.rejectInvite(token, msg.sender_id, msg.invite_id, msg.project_id);
      }
      loadMessages(activeChat);
    } catch (err) {
      console.error('Erro ao processar convite:', err);
    }
  };

  const getChatTitle = (chat) => {
    if (chat.project_name || chat.type === 'PROJECT') {
      return { name: chat.project_name || 'Projeto Sem Nome', subtitle: 'Projeto', isProject: true };
    }
    return { name: chat.other_participant?.name || 'Desconhecido', subtitle: 'DM Acadêmica', isProject: false };
  };

  // Filtragem de conversas por texto e tipo
  const filteredChats = useMemo(() => {
    return chats.filter(chat => {
      const info = getChatTitle(chat);
      const matchesSearch = info.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (filterType === 'DM') return !info.isProject;
      if (filterType === 'PROJECT') return info.isProject;
      return true;
    });
  }, [chats, searchQuery, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      {/* Clique fora para fechar */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl h-[90vh] max-h-[760px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row z-10 animate-in zoom-in-95 duration-200">
        
        {/* ================= COLUNA ESQUERDA: LISTA DE CONVERSAS ================= */}
        <div className={`w-full md:w-80 md:flex flex-col border-r border-gray-100 bg-[#FBFBFB] ${
          !activeChat ? 'flex flex-1' : 'hidden md:flex'
        }`}>
          {/* Topo da lista */}
          <div className="p-5 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FFA900]/15 rounded-xl text-[#FFA900]">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900 tracking-tight">Conversas</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {chats.length} {chats.length === 1 ? 'conversa ativa' : 'conversas ativas'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="md:hidden h-8 w-8 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition-colors"
                title="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Barra de Pesquisa */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-100/70 border border-gray-200/60 rounded-xl text-xs font-medium text-gray-800 placeholder:text-gray-400 focus:bg-white focus:border-[#FFA900] outline-none transition-all"
              />
            </div>

            {/* Abas de Filtro */}
            <div className="flex gap-1.5 mt-3">
              {[
                { id: 'ALL', label: 'Todas' },
                { id: 'DM', label: 'DMs' },
                { id: 'PROJECT', label: 'Projetos' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id)}
                  className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                    filterType === tab.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100/80 text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de itens */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {filteredChats.length > 0 ? (
              filteredChats.map(chat => {
                const title = getChatTitle(chat);
                const isSelected = activeChat?.chat_id === chat.chat_id;
                const hasUnread = (chat.unread_messages_count || 0) > 0;

                return (
                  <button
                    key={chat.chat_id}
                    onClick={() => setActiveChat(chat)}
                    className={`w-full p-3 rounded-2xl flex items-center gap-3.5 transition-all text-left ${
                      isSelected
                        ? 'bg-[#FFA900]/15 border-2 border-[#FFA900] shadow-sm'
                        : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#FFA900] text-black shadow-md shadow-[#FFA900]/30'
                        : title.isProject
                          ? 'bg-blue-50 text-blue-600 border border-blue-100'
                          : 'bg-gray-100 text-[#FFA900] border border-gray-100'
                    }`}>
                      {title.isProject ? <Briefcase className="h-5 w-5" /> : (title.name[0] || <User className="h-4 w-4" />)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-black text-gray-900 truncate">{title.name}</h4>
                        {hasUnread && (
                          <span className="px-1.5 py-0.5 bg-red-500 text-white rounded-full text-[9px] font-black">
                            {chat.unread_messages_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate flex items-center gap-1">
                        <span className={`inline-block h-1.5 w-1.5 rounded-full ${title.isProject ? 'bg-blue-500' : 'bg-[#FFA900]'}`} />
                        {title.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                  {searchQuery ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ativa'}
                </p>
                <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
                  {searchQuery ? 'Tente buscar por outro termo.' : 'Inicie DMs pelo perfil de colegas ou envie apresentações.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ================= COLUNA DIREITA: ÁREA DA CONVERSA ================= */}
        <div className={`flex-1 flex-col bg-white ${
          activeChat ? 'flex' : 'hidden md:flex'
        }`}>
          {activeChat ? (
            <>
              {/* Header da conversa ativa */}
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveChat(null)}
                    className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                    title="Voltar para a lista"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <div className="h-10 w-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                    {getChatTitle(activeChat).name[0] || 'U'}
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900 leading-tight">
                      {getChatTitle(activeChat).name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-[#FFA900]">
                        <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        {getChatTitle(activeChat).subtitle}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                  title="Fechar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Lista de mensagens */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-[#FBFBFB]">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-[#FFA900]/20 border-t-[#FFA900] rounded-full animate-spin" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map(msg => {
                    const isCurrentUser = msg.sender_id === currentUser?.user_id;

                    return (
                      <div
                        key={msg.message_id}
                        className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 text-sm font-medium transition-all ${
                            msg.is_invite
                              ? msg.status === 'accepted'
                                ? 'bg-green-50 text-green-900 rounded-2xl border border-green-200 shadow-sm'
                                : msg.status === 'rejected'
                                  ? 'bg-gray-100 text-gray-500 rounded-2xl border border-gray-200 shadow-sm'
                                  : 'bg-amber-50 text-amber-950 rounded-2xl border-2 border-[#FFA900] shadow-md'
                              : isCurrentUser
                                ? 'bg-gray-900 text-white rounded-2xl rounded-tr-sm shadow-sm'
                                : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm'
                          }`}
                        >
                          {msg.is_invite && (
                            <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-black/10">
                              <Sparkles className="h-3.5 w-3.5 text-[#FFA900]" />
                              <span className="text-[10px] font-black uppercase tracking-wider">
                                {msg.status === 'accepted' ? 'Convite Aceito' : msg.status === 'rejected' ? 'Convite Recusado' : 'Convite de Colaboração'}
                              </span>
                            </div>
                          )}

                          <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                          {msg.is_invite && msg.status === 'pending' && !isCurrentUser && (
                            <div className="flex gap-2 mt-3 pt-2 border-t border-black/5">
                              <button
                                onClick={() => handleInviteAction(msg, 'accept')}
                                className="flex-1 py-1.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" /> Aceitar
                              </button>
                              <button
                                onClick={() => handleInviteAction(msg, 'reject')}
                                className="flex-1 py-1.5 px-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              >
                                <XIcon className="w-3.5 h-3.5" /> Recusar
                              </button>
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] text-gray-400 font-bold uppercase mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
                    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-3">
                      <MessageSquare className="h-8 w-8 text-[#FFA900]" />
                    </div>
                    <p className="text-xs font-black uppercase tracking-wider text-gray-700">Inicie a conversa!</p>
                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                      Envie uma mensagem para alinhar ideias, tirar dúvidas ou combinar os próximos passos.
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input de envio */}
              <div className="p-3 sm:p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                  autoFocus
                  type="text"
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#FFA900] outline-none transition-all"
                  value={msgInput}
                  onChange={(e) => setMsgInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  disabled={!msgInput.trim()}
                  onClick={handleSendMessage}
                  title="Enviar mensagem"
                  className="h-11 w-11 bg-[#FFA900] text-black font-black rounded-2xl flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all shadow-md shadow-[#FFA900]/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            /* Estado quando nenhuma conversa está selecionada no Desktop */
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-white relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
                title="Fechar modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="p-5 bg-gradient-to-br from-[#FFA900]/20 to-[#FFA900]/5 rounded-3xl border border-[#FFA900]/20 mb-4 shadow-sm">
                <OrbitIcon className="h-12 w-12 text-[#FFA900]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">
                Suas Conversas & DMs
              </h3>
              <p className="text-xs text-gray-500 max-w-sm font-medium leading-relaxed">
                Selecione uma conversa ao lado para responder colegas de curso, acompanhar o chat dos seus projetos ou aceitar novos convites.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
