import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Package2, Mail, Lock } from 'lucide-react';
import { signInWithGoogle, loginWithEmail } from '../lib/firebase';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Login Error:", err);
      let message = 'Erro ao entrar com Google. Verifique sua conexão.';
      if (err.code === 'auth/operation-not-allowed') {
        message = 'O login com Google não está ativado no Console do Firebase.';
      } else if (err.code === 'auth/unauthorized-domain') {
        message = 'Este domínio não está autorizado no Console do Firebase.';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'O popup de login foi bloqueado pelo seu navegador.';
      }
      setError(message);
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error("Email Login Error:", err);
      let message = 'Erro ao entrar. Verifique suas credenciais.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        message = 'Email ou palavra-passe incorretos.';
      }
      setError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <Package2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">LogiStock</h1>
          <p className="text-slate-500 mt-2">Gestão Logística Inteligente</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            
            {!showEmailLogin ? (
              <div className="text-center space-y-4">
                <p className="text-slate-600 text-sm">
                  Acesse o sistema utilizando sua conta Google ou credenciais fornecidas.
                </p>
                
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 border border-slate-200 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  )}
                  <span className="text-sm">Entrar com Google</span>
                </button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-400">Ou use credenciais</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEmailLogin(true)}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-3 rounded-xl transition-all text-sm"
                >
                  Entrar com Nome e Senha
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email / Nome de Usuário</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="exemplo@logistock.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Palavra-passe</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <LogIn className="w-5 h-5" />}
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailLogin(false)}
                  className="w-full text-slate-500 text-sm font-medium hover:text-slate-700 transition-colors"
                >
                  Voltar para Login Google
                </button>
              </form>
            )}
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm mt-8">
          &copy; 2024 LogiStock. Acesso restrito.
        </p>
      </motion.div>
    </div>
  );
}
