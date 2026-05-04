import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowRight } from 'lucide-react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        onLogin({ id: '1', name: 'Dauana Admin', username: 'admin', role: 'admin' });
      } else if (username === 'staff' && password === 'staff') {
        onLogin({ id: '2', name: 'Colaborador', username: 'staff', role: 'staff' });
      } else {
        setLoading(false);
        setError(true);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-black/[0.01] rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-black italic text-gradient tracking-tighter mb-4"
          >
            DAUANA
          </motion.h1>
          <p className="text-[10px] uppercase tracking-[0.6em] text-muted font-black opacity-40">
            Acesso Restrito · System 2026
          </p>
        </div>

        <motion.div 
          animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="glass-card p-10 md:p-12 rounded-[48px] border border-neutral-100 shadow-2xl bg-white/80 backdrop-blur-xl relative group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.01] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-black/[0.03] transition-all duration-700" />
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 ml-1">Usuário</label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white transition-all placeholder:text-neutral-300"
                placeholder="dauana.admin"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60">Senha</label>
                <button type="button" className="text-[8px] font-black uppercase tracking-widest text-muted hover:text-black transition-colors opacity-40 hover:opacity-100">
                  Esqueceu?
                </button>
              </div>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-[9px] text-red-500 font-bold uppercase tracking-widest text-center">
                Acesso negado. Verifique os dados.
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.25em] hover:bg-neutral-800 transition-all mt-4 text-[11px] shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 group/btn disabled:opacity-70 disabled:cursor-wait overflow-hidden relative"
            >
              {loading ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <LogIn className="w-4 h-4" />
                </motion.div>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-[9px] text-muted font-bold uppercase tracking-[0.2em] opacity-30">
            Powered by Antigravity Technology © 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
