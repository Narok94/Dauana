import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';

interface ServicesConfigViewProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

export function ServicesConfigView({ services, setServices }: ServicesConfigViewProps) {
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) return;
    
    const service: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration)
    };
    
    setServices([...services, service]);
    setNewService({ name: '', price: '', duration: '' });
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 max-w-4xl overflow-y-auto custom-scrollbar h-full pb-32 md:pb-10"
    >
      <div className="mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Gestão de Serviços</h1>
        <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-50">Configure seu catálogo e preços</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="space-y-6 glass-card p-6 md:p-8 rounded-[24px] md:rounded-2xl lg:sticky lg:top-10">
            <h2 className="text-[10px] font-black uppercase tracking-widest mb-4">Adicionar Novo</h2>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nome</label>
              <input 
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-sm focus:border-white/20 outline-none transition-all"
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                placeholder="ex: Corte Moderno"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Preço (R$)</label>
                <input 
                  type="number"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-sm focus:border-white/20 outline-none transition-all"
                  value={newService.price}
                  onChange={e => setNewService({ ...newService, price: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Duração (min)</label>
                <input 
                  type="number"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-3 text-sm focus:border-white/20 outline-none transition-all"
                  value={newService.duration}
                  onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,255,255,0.05)] active:scale-95">
              <Plus className="w-4 h-4" />
              Salvar Serviço
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest mb-4">Catálogo Atual</h2>
          {services.length === 0 ? (
            <div className="border border-dashed border-white/10 p-12 rounded-[24px] md:rounded-3xl text-center text-muted text-sm italic opacity-50">
              Nenhum serviço cadastrado ainda.
            </div>
          ) : (
            services.map(s => (
              <div key={s.id} className="glass-card p-5 md:p-6 rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
                <div>
                  <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">{s.name}</h3>
                  <p className="text-[10px] text-muted mt-1 uppercase tracking-widest font-medium">
                    {s.duration} min — R$ {s.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <button 
                  onClick={() => removeService(s.id)}
                  className="p-3 text-muted hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100 bg-white/5 md:bg-transparent rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
