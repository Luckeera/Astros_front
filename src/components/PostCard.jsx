import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import ContributionModal from './ContributionModal';

const PostCard = ({ post, onNavigateToDetail }) => {
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [showCollabModal, setShowCollabModal] = useState(false);

  useEffect(() => {
    setIsLiked(post.is_liked || false);
    setUpvotes(post.upvotes || 0);
  }, [post.is_liked, post.upvotes]);
  
  const handleToggleLike = async (e) => {
    e.stopPropagation();
    try {
      const data = await postService.toggleLike(token, post.post_id);
      setUpvotes(data.current_upvotes); 
      setIsLiked(data.status === 'liked');
    } catch (err) { 
      console.error('Erro no Like:', err); 
    }
  };

  const handleCollab = (e) => {
    e.stopPropagation();
    setShowCollabModal(true);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    navigate(`/profile/${post.author_id}`);
  };

  const isAuthor = currentUser?.user_id === post.author_id;

  return (
    <>
    <div 
      onClick={() => onNavigateToDetail(post.post_id)}
      className={`bg-white rounded-3xl border ${post.is_collaborative ? 'border-[#FFA900] shadow-[#FFA900]/5 ring-1 ring-[#FFA900]/10' : 'border-gray-100'} shadow-sm mb-6 overflow-hidden transition-all hover:shadow-md cursor-pointer group`}
    >
      {post.is_collaborative && (
        <div className="bg-[#FFA900] px-6 py-2.5 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Colaboração Acadêmica
          </span>
          {!isAuthor && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
        </div>
      )}
      
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleProfileClick}>
            <div className="h-12 w-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#FFA900] font-black text-sm border border-gray-100 shadow-sm">
              {post.author?.name?.[0] || 'A'}
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 leading-none mb-1.5 hover:underline">
                {post.author?.name || `Usuário #${post.author_id}`}
              </h4>
              <p className="text-[11px] text-gray-400 font-black flex items-center gap-2 uppercase tracking-tight">
                <span className="text-[#FFA900]">{post.author?.period || '?'}º Período</span>
                <span className="h-1 w-1 bg-gray-200 rounded-full" />
                <span>{post.author?.course?.name || 'Curso não informado'}</span>
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg uppercase tracking-tighter shadow-inner">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <h3 className="font-black text-2xl mb-3 text-gray-900 tracking-tight leading-tight group-hover:text-[#FFA900] transition-colors">{post.title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-10 font-medium line-clamp-3">{post.content}</p>
        
        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleToggleLike} 
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl transition-all ${isLiked ? 'bg-pink-50 text-pink-600 font-bold shadow-sm' : 'text-gray-400 hover:bg-gray-50 font-bold'}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-black">{upvotes}</span>
            </button>
            <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-gray-400 hover:bg-gray-50 font-bold transition-all">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest text-[10px]">Discussão</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {post.is_collaborative && !isAuthor && (
              <button 
                onClick={handleCollab}
                className="flex items-center gap-2 bg-[#FFA900] text-black px-6 py-3 rounded-xl text-[10px] font-black hover:bg-black hover:text-white transition-all shadow-lg shadow-orange-100 uppercase tracking-widest"
              >
                Colaborar
                <Sparkles className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    {showCollabModal && <ContributionModal post={post} onClose={() => setShowCollabModal(false)} />}
    </>
  );
};

export default PostCard;
