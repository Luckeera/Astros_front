import React from 'react';
import { Heart } from 'lucide-react';

const CommentItem = ({ comment, depth = 0, onReply, onToggleLike }) => (
  <div className={`mt-10 ${depth > 0 ? (depth > 1 ? 'ml-4' : 'ml-10') + ' border-l-2 border-[#FFA900]/20 pl-10' : ''}`}>
    <div className="flex items-center gap-4 mb-4">
      <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center text-[#FFA900] font-black text-xs border border-gray-100 shadow-sm">
        {comment.author?.name?.[0] || 'U'}
      </div>
      <div>
        <span className="text-xs font-black text-gray-900 uppercase tracking-tight block leading-tight">{comment.author?.name || 'Usuário'}</span>
        <span className="text-[9px] text-gray-400 font-black uppercase tracking-tighter mt-0.5 block">{new Date(comment.created_at).toLocaleDateString()}</span>
      </div>
    </div>
    <p className="text-sm text-gray-500 leading-relaxed font-medium bg-white p-4 rounded-xl border border-gray-200 shadow-sm">{comment.content}</p>
    <div className="flex items-center gap-6 mt-4 ml-2">
      <button 
        onClick={() => onToggleLike(comment.comment_id)}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors group"
      >
        <Heart className="h-4 w-4 group-active:scale-150 transition-transform" /> <span className="text-[10px] font-black">{comment.upvotes}</span>
      </button>
      <button 
        onClick={() => onReply(comment)}
        className="text-[10px] font-black text-gray-400 hover:text-[#FFA900] uppercase tracking-[0.2em] transition-colors"
      >
        Responder
      </button>
    </div>
    {comment.replies?.map(reply => (
      <CommentItem 
        key={reply.comment_id} 
        comment={reply} 
        depth={depth + 1} 
        onReply={onReply}
        onToggleLike={onToggleLike}
      />
    ))}
  </div>
);

export default CommentItem;
