import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import OrbitIcon from '../icons/OrbitIcon';

const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState('lucas@exemplo.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <div className="p-5 rounded-2xl mb-4">
            <OrbitIcon className="h-10 w-10 text-[#FFA900]" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Astros</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Rede Social Acadêmica</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email acadêmico</label>
            <input 
              type="email" 
              required
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FFA900] focus:bg-white transition-all font-bold"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
            <input 
              type="password" 
              required
              className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#FFA900] focus:bg-white transition-all font-bold"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-xs font-bold flex items-center gap-2 bg-red-50 p-4 rounded-xl border border-red-100"><AlertCircle className="h-4 w-4" />{error}</div>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 bg-gray-900 text-white font-black rounded-xl hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 uppercase tracking-widest text-sm"
          >
            {loading ? 'Entrando...' : 'Acessar Plataforma'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
