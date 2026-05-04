import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ArrowRight, Sparkles, Sun, Eye, Shapes } from 'lucide-react';
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
      const normalizedUsername = username.toLowerCase();
      if (normalizedUsername === 'dauana' && password === '12345') {
        onLogin({ id: '1', name: 'Dauana Admin', username: 'dauana', role: 'admin' });
      } else if (normalizedUsername === 'staff' && password === 'staff') {
        onLogin({ id: '2', name: 'Colaborador', username: 'staff', role: 'staff' });
      } else {
        setLoading(false);
        setError(true);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-6 overflow-hidden bg-neutral-900 font-sans">
      {/* Background with subtle Blur */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10 backdrop-blur-[3px]" />
        <div 
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=70&w=1280&auto=format&fit=crop')] bg-cover bg-center" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] z-20"
      >
        <div className="bg-white/95 backdrop-blur-md p-10 md:p-14 rounded-[48px] shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-white/40 relative group overflow-hidden">
          {/* Accent Border Line */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-bronze via-gold to-bronze opacity-80" />

          <div className="text-center mb-10">
            <h1 className="text-5xl md:text-6xl font-serif text-neutral-900 tracking-tighter mb-4">
              Dauana
            </h1>
            <div className="flex items-center justify-center gap-4">
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-500">Bronze</span>
              <div className="w-1 h-1 rounded-full bg-gold/50" />
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-500">Cílios</span>
              <div className="w-1 h-1 rounded-full bg-gold/50" />
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-500">Beleza</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group/input space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1 group-focus-within/input:text-gold transition-colors">Usuário</label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome de usuário"
                className="w-full border-b-2 border-neutral-100 py-3 text-sm focus:outline-none focus:border-gold transition-all bg-transparent placeholder:text-neutral-300 font-medium"
              />
            </div>

            <div className="group/input space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 ml-1 group-focus-within/input:text-gold transition-colors">Senha de Acesso</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-b-2 border-neutral-100 py-3 text-sm focus:outline-none focus:border-gold transition-all bg-transparent font-medium"
              />
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-2xl text-[9px] font-bold uppercase tracking-widest text-center border border-red-100"
              >
                Identidade não confirmada. Revise os dados.
              </motion.div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.4em] hover:bg-black transition-all mt-4 text-[10px] flex items-center justify-center gap-3 group relative overflow-hidden disabled:bg-neutral-400 shadow-xl"
            >
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
              ) : (
                <>
                  <span>ACESSAR SISTEMA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-gold" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[7px] text-neutral-300 font-black uppercase tracking-[0.4em]">
              Dauana Studio • Gestão de Elite © 2026
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
