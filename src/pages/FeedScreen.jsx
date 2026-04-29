import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/api';
import PostCard from '../components/PostCard';
import FilterChips from '../components/ui/FilterChips';
import PostSkeleton from '../components/ui/PostSkeleton';

const FeedScreen = ({ onNavigateToDetail }) => {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('course');
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const data = await postService.getFeed(token, user.course_id, filter);
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) { 
        console.error('Fetch error:', err); 
        setPosts([]);
      } finally { 
        setLoading(false); 
      }
    };
    fetchPosts();
  }, [filter, user, token]);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-3">Feed Acadêmico</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">Explore projetos e conexões na sua área.</p>
      </header>
      
      <FilterChips activeFilter={filter} setActiveFilter={setFilter} />

      {loading ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div key={post.post_id} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${index * 50}ms` }}>
                <PostCard post={post} onNavigateToDetail={onNavigateToDetail} />
              </div>
            ))
          ) : (
            <div className="text-center py-40 bg-white rounded-3xl border border-gray-100 border-dashed shadow-sm">
              <div className="bg-gray-50 h-24 w-24 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner border border-gray-100">
                <Search className="h-12 w-12 text-gray-200" />
              </div>
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Nenhum post encontrado para este filtro.</p>
              <button onClick={() => setFilter('course')} className="mt-8 text-[#FFA900] text-xs font-black hover:underline uppercase tracking-widest border-2 border-orange-100 px-6 py-2.5 rounded-full hover:bg-orange-50 transition-colors">Recarregar Feed</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedScreen;
