import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { MessageSquare, Plus } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import FeedScreen from './pages/FeedScreen';
import ProfileScreen from './pages/ProfileScreen';
import PostDetailScreen from './pages/PostDetailScreen';
import CreatePostScreen from './pages/CreatePostScreen';
import LoginScreen from './pages/LoginScreen';
import LandingPage from './pages/Landing/LandingPage';

// Componente para proteger rotas e aplicar o Layout do App
const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) return null; // O AuthProvider já trata o loading global
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#FFA900]/30 overflow-x-hidden">
      <Navbar />
      
      <main className="animate-in fade-in zoom-in-95 duration-1000 ease-out">
        {children}
      </main>
      
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <div className="fixed bottom-10 right-10 flex flex-col gap-6 z-[90]">
        {!isChatOpen && (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="h-20 w-20 bg-gray-900 text-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group hover:bg-[#FFA900] border-4 border-white"
          >
            <MessageSquare className="h-8 w-8 group-hover:rotate-12 transition-transform" />
          </button>
        )}
        <button 
          onClick={() => navigate('/create')}
          className="h-20 w-20 bg-[#FFA900] text-black rounded-3xl shadow-[0_20px_50px_rgba(255,169,0,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all group hover:bg-gray-900 hover:text-white border-4 border-white"
        >
          <Plus className="h-10 w-10 group-hover:rotate-90 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const navigateToDetail = (id) => { 
    navigate(`/post/${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Routes>
      {/* Rota Raiz: Landing Page B2B */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Rota de Login */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/feed" replace /> : <LoginScreen onLogin={login} />
        } 
      />

      {/* Rotas Protegidas do App */}
      <Route path="/feed" element={
        <AppLayout>
          <FeedScreen onNavigateToDetail={navigateToDetail} />
        </AppLayout>
      } />
      
      <Route path="/profile" element={
        <AppLayout>
          <ProfileScreen />
        </AppLayout>
      } />
      
      <Route path="/post/:postId" element={
        <AppLayout>
          <PostDetailScreen onBack={() => navigate('/feed')} />
        </AppLayout>
      } />
      
      <Route path="/create" element={
        <AppLayout>
          <CreatePostScreen onCancel={() => navigate('/feed')} />
        </AppLayout>
      } />

      {/* Redirecionamento de segurança */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
