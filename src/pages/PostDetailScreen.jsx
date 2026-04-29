import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, X, Heart } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import OrbitIcon from '../icons/OrbitIcon';
import ContributionModal from '../components/ContributionModal';
import CommentItem from '../components/ui/CommentItem';

const PostDetailScreen = ({ onBack }) => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [showCollabModal, setShowCollabModal] = useState(false);
  
  const [isLiked, setIsLiked] = useState(false);
  const [upvotes, setUpvotes] = useState(0);

  const { token, user: currentUser } = useAuth();

  const fetchPost = async () => {
    try {
      const data = await postService.getPostById(token, postId);
      setPost(data);
      setIsLiked(data.is_liked || false);
      setUpvotes(data.upvotes || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, token]);

  const handleToggleLike = async () => {
    try {
      const data = await postService.toggleLike(token, postId);
      setUpvotes(data.current_upvotes); 
      setIsLiked(data.status === 'liked');
    } catch (err) { 
      console.error('Erro no Like:', err); 
    }
  };

  const handleSendComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await postService.addComment(token, postId, commentContent, replyingTo?.comment_id);
      setCommentContent('');
      setReplyingTo(null);
      fetchPost(); // Re-fetch to get nested structure correctly
    } catch (err) {
      console.error('Erro ao comentar:', err);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    try {
      await postService.toggleCommentLike(token, commentId);
      fetchPost();
    } catch (err) {
      console.error('Erro ao curtir comentário:', err);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    document.querySelector('textarea')?.focus();
  };

  if (loading) return <div className="py-20 text-center font-black text-gray-300 animate-pulse uppercase tracking-[0.3em] text-xs">Carregando Thread...</div>;
  if (!post) return <div className="py-20 text-center font-black text-red-400 uppercase tracking-widest text-xs">Post não encontrado no banco.</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <button onClick={onBack} className="mb-10 flex items-center gap-4 text-gray-400 hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-[0.3em] group">
        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 group-hover:border-[#FFA900] transition-colors"><ChevronLeft className="h-5 w-5" /></div> Voltar para o Feed
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/40 overflow-hidden ring-1 ring-black/5">
        <div className="p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-5">
              <div className="h-16 w-16 bg-[#FFA900] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#FFA900]/20">
                {post.author?.name?.[0] || 'A'}
              </div>
              <div>
                <h4 className="font-black text-xl text-gray-900 tracking-tighter leading-none mb-1.5">{post.author?.name}</h4>
                <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">{post.author?.course?.name} • {post.author?.period}º Período</p>
              </div>
            </div>
            
            {post.is_collaborative && post.author_id !== currentUser?.user_id && (
              <button 
                onClick={() => setShowCollabModal(true)}
                className="bg-[#FFA900] text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-[#FFA900]/40 transition-all flex items-center gap-5 border-2 border-transparent hover:border-black group"
              >
                Colaborar Agora
                <div className="bg-white/30 p-2 rounded-xl group-hover:bg-black group-hover:text-white transition-colors shadow-inner">
                  <OrbitIcon className="h-8 w-8 animate-[slowRotate_15s_linear_infinite]" />
                </div>
              </button>
            )}
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tighter mb-8 leading-[1.1]">{post.title}</h1>
          <div className="bg-gray-50/50 p-10 rounded-3xl border border-gray-100 mb-8 shadow-inner">
            <p className="text-gray-500 text-lg leading-[1.8] font-medium whitespace-pre-wrap">{post.content}</p>
          </div>

          <div className="flex items-center gap-4 mb-14">
            <button 
              onClick={handleToggleLike} 
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl transition-all border-2 ${isLiked ? 'bg-pink-50 border-pink-100 text-pink-600 font-bold shadow-lg shadow-pink-100' : 'bg-white border-gray-100 text-gray-400 hover:bg-gray-50 font-bold'}`}
            >
              <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-lg font-black">{upvotes}</span>
            </button>
            <div className="h-10 w-[1px] bg-gray-100 mx-2" />
            <div className="flex items-center gap-2 text-gray-300 font-black text-[10px] uppercase tracking-widest">
               Engajamento Acadêmico
            </div>
          </div>

          <div className="border-t border-gray-100 pt-14">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
                <div className="p-3 bg-gray-900 rounded-xl text-white shadow-lg shadow-gray-200"><MessageSquare className="h-5 w-5" /></div> Discussão Acadêmica
              </h3>
              <div className="bg-white px-6 py-2.5 rounded-full border border-gray-100 shadow-sm">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {(post.comments || []).length} Contribuições
                </span>
              </div>
            </div>
            
            <div className="mb-16 group">
              {replyingTo && (
                <div className="flex items-center justify-between bg-[#FFA900]/5 px-6 py-4 rounded-t-3xl border-t border-x border-gray-200 animate-slideDown">
                  <span className="text-[10px] font-black text-[#FFA900] uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#FFA900] rounded-full animate-pulse" />
                    Respondendo para <span className="text-gray-900">@{replyingTo.author?.name}</span>
                  </span>
                  <button 
                    onClick={() => setReplyingTo(null)} 
                    className="p-1 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="relative">
                <textarea 
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className={`w-full p-10 bg-gray-50 border border-gray-200 ${replyingTo ? 'rounded-b-3xl border-t-0' : 'rounded-3xl'} text-sm font-medium focus:ring-8 focus:ring-[#FFA900]/5 focus:bg-white focus:border-[#FFA900] transition-all duration-500 outline-none resize-none h-48 shadow-inner`} 
                  placeholder={replyingTo ? "Escreva sua resposta..." : `Comentar como ${currentUser?.name?.split(' ')[0] || 'Usuário'}...`} 
                />
                <div className="absolute bottom-6 right-8">
                  <button 
                    onClick={handleSendComment}
                    className="bg-gray-900 text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl hover:scale-105 active:scale-95"
                  >
                    {replyingTo ? "Responder" : "Publicar"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {(post.comments || []).length > 0 ? (
                post.comments.filter(c => !c.dad_comment_id).map(comment => (
                  <CommentItem 
                    key={comment.comment_id} 
                    comment={comment} 
                    onReply={handleReply}
                    onToggleLike={handleToggleCommentLike}
                  />
                ))
              ) : (
                <div className="text-center py-24 bg-gray-50/30 rounded-3xl border border-gray-100 border-dashed">
                   <p className="text-gray-400 font-black uppercase tracking-[0.25em] text-[10px]">O conhecimento cresce quando compartilhado. Inicie o debate.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showCollabModal && <ContributionModal post={post} onClose={() => setShowCollabModal(false)} />}
    </div>
  );
};

export default PostDetailScreen;
