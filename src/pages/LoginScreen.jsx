import React, { useState } from 'react';
import { 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus, 
  LogIn,
  GraduationCap,
  Building2,
  Mail,
  Lock,
  User,
  Layers
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import OrbitIcon from '../icons/OrbitIcon';
import { UNIFIED_AREAS, MASTER_COURSES, detectAreaForCourse } from '../services/coursesData';

export default function LoginScreen() {
  const { login, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Modo: 'login' ou 'register'
  const [mode, setMode] = useState(location.state?.mode === 'register' ? 'register' : 'login');
  
  // Mensagem contextual de redirecionamento (ex: vindo do Mural para colaborar)
  const contextMessage = location.state?.message;

  // Estados de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Estados de Cadastro (com faculdade e curso em texto livre)
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerCollege, setRegisterCollege] = useState('');
  const [registerCourse, setRegisterCourse] = useState('');
  const [registerArea, setRegisterArea] = useState('Tecnologia');
  const [registerPeriod, setRegisterPeriod] = useState(1);
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // Estados de Carregamento e Erro
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(loginEmail.trim(), loginPassword);
      const destination = location.state?.from?.pathname || location.state?.from || '/feed';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.message || '';
      if (msg.includes('pesquisa do Astros') || msg.includes('Pesquisa do Astros')) {
        setRegisterEmail(loginEmail.trim());
        setMode('register');
        setError('Conta encontrada da pesquisa do Astros! Por favor, crie sua senha abaixo para ativar seu acesso.');
      } else {
        setError(msg || 'Email ou senha incorretos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validação estrutural simples de e-mail (com @ e .)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail.trim())) {
      setError('Por favor, informe um formato de e-mail válido (ex: seu.nome@gmail.com).');
      return;
    }

    if (registerName.trim().length < 2) {
      setError('Informe seu nome completo (mínimo 2 caracteres).');
      return;
    }

    if (registerPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        college_name: registerCollege.trim() || undefined,
        course_name: registerCourse.trim() || undefined,
        course_area: registerArea || undefined,
        period: Number(registerPeriod) || 1
      });

      setSuccessMsg('Conta criada com sucesso! Entrando...');
      setTimeout(() => {
        const destination = location.state?.from?.pathname || location.state?.from || '/mural';
        navigate(destination, { replace: true });
      }, 800);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Falha ao criar conta. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4 py-12 selection:bg-[#FFA900]/30">
      <style>{`
        @keyframes slowRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-orbit {
          animation: slowRotate 20s linear infinite;
        }
      `}</style>

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border-2 border-gray-900 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo e Cabeçalho */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-[#FFA900]/10 rounded-2xl border border-[#FFA900]/30 shadow-sm mb-3">
            <OrbitIcon className="h-10 w-10 text-[#FFA900] animate-orbit" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">astros.</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
            Rede de Colaboração Acadêmica & Projetos
          </p>
        </div>

        {/* Mensagem Contextual de Redirecionamento (se houver) */}
        {contextMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border-2 border-[#FFA900] flex items-start gap-3 text-left">
            <Sparkles className="h-5 w-5 text-[#FFA900] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-black text-gray-900">Ação solicitada:</p>
              <p className="text-xs text-gray-700 font-medium mt-0.5">{contextMessage}</p>
            </div>
          </div>
        )}

        {/* Abas Alternáveis: Entrar vs Criar Conta */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-2xl mb-8 border border-gray-200">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Entrar
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#FFA900] text-black shadow-sm border border-gray-900'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Criar Conta
          </button>
        </div>

        {/* Exibição de Erro */}
        {error && (
          <div className="mb-6 text-red-600 text-xs font-bold flex items-start gap-2 bg-red-50 p-4 rounded-xl border border-red-200 text-left">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Exibição de Sucesso */}
        {successMsg && (
          <div className="mb-6 text-emerald-700 text-xs font-bold flex items-center gap-2 bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-left">
            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* FORMULÁRIO 1: LOGIN                                       */}
        {/* ========================================================= */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                E-mail
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-gray-400" />
                <input 
                  type="email" 
                  required
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-sm text-gray-900"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1.5 ml-1">
                Senha
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-4 h-4 w-4 text-gray-400" />
                <input 
                  type={showLoginPassword ? 'text' : 'password'} 
                  required
                  placeholder="Sua senha secreta"
                  className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-sm text-gray-900"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-4 text-gray-400 hover:text-gray-700 p-1"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-xl hover:bg-[#FFA900] hover:text-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Acessando...
                </>
              ) : (
                <>
                  Acessar Plataforma
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                className="text-xs font-bold text-gray-500 hover:text-black hover:underline"
              >
                Ainda não tem conta? <span className="font-black text-[#FFA900]">Cadastre-se aqui</span>
              </button>
            </div>
          </form>
        ) : (
          /* ========================================================= */
          /* FORMULÁRIO 2: CADASTRO SEM BARREIRAS                      */
          /* ========================================================= */
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-left">
            {/* Nome Completo */}
            <div>
              <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                Nome Completo *
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-4 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  required
                  placeholder="Ex: Lucas Valente"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs sm:text-sm text-gray-900"
                  value={registerName}
                  onChange={e => setRegisterName(e.target.value)}
                />
              </div>
            </div>

            {/* E-mail (qualquer provedor) */}
            <div>
              <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                E-mail *
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-4 h-4 w-4 text-gray-400" />
                <input 
                  type="email" 
                  required
                  placeholder="seu.email@exemplo.com"
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs sm:text-sm text-gray-900"
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Faculdade e Curso (Campos de Texto Livres) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                  Faculdade / Instituição
                </label>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Ex: USP, UNIFESP, UNAMA..."
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs text-gray-900"
                    value={registerCollege}
                    onChange={e => setRegisterCollege(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                  Curso de Graduação
                </label>
                <div className="relative flex items-center">
                  <GraduationCap className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    list="courses-list"
                    placeholder="Selecione ou digite seu curso..."
                    className="w-full pl-10 pr-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs text-gray-900"
                    value={registerCourse}
                    onChange={e => {
                      const val = e.target.value;
                      setRegisterCourse(val);
                      const detected = detectAreaForCourse(val);
                      if (detected) setRegisterArea(detected);
                    }}
                  />
                  <datalist id="courses-list">
                    {MASTER_COURSES.map(c => (
                      <option key={c.name} value={c.name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Área de Atuação e Conhecimento */}
            <div>
              <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                Área do Conhecimento
              </label>
              <div className="relative flex items-center">
                <Layers className="absolute left-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={registerArea}
                  onChange={e => setRegisterArea(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs text-gray-900 appearance-none cursor-pointer"
                >
                  {UNIFIED_AREAS.map(area => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-1 ml-1">
                Usada para direcionar pitches de projetos e colaborações multidisciplinares no seu feed.
              </p>
            </div>

            {/* Período e Senha */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                  Semestre
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="12"
                  value={registerPeriod}
                  onChange={e => setRegisterPeriod(e.target.value)}
                  className="w-full px-3 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs text-gray-900 text-center"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-black text-gray-700 uppercase tracking-wider mb-1 ml-1">
                  Senha (mín. 6 dígitos) *
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 h-4 w-4 text-gray-400" />
                  <input 
                    type={showRegisterPassword ? 'text' : 'password'} 
                    required
                    minLength={6}
                    placeholder="Crie sua senha"
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-gray-900 focus:bg-white transition-all font-bold text-xs text-gray-900"
                    value={registerPassword}
                    onChange={e => setRegisterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-700 p-1"
                  >
                    {showRegisterPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#FFA900] text-black font-black rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-xl shadow-[#FFA900]/20 disabled:opacity-50 uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2 mt-6 cursor-pointer border-2 border-gray-900"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Criando sua conta...
                </>
              ) : (
                <>
                  Criar Conta e Entrar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); }}
                className="text-xs font-bold text-gray-500 hover:text-black hover:underline"
              >
                Já tem cadastro? <span className="font-black text-gray-900">Clique para entrar</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
