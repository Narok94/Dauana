import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';
import { cn } from '../lib/utils';

interface ServicesConfigViewProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

export function ServicesConfigView({ services, setServices }: ServicesConfigViewProps) {
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) return;
    
    if (editingId) {
      setServices(services.map(s => s.id === editingId ? {
        ...s,
        name: newService.name,
        price: Number(newService.price),
        duration: Number(newService.duration)
      } : s));
      setEditingId(null);
    } else {
      const service: Service = {
        id: Math.random().toString(36).substr(2, 9),
        name: newService.name,
        price: Number(newService.price),
        duration: Number(newService.duration)
      };
      setServices([...services, service]);
    }
    
    setNewService({ name: '', price: '', duration: '' });
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setNewService({
      name: service.name,
      price: service.price.toString(),
      duration: service.duration.toString()
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewService({ name: '', price: '', duration: '' });
  };

  const removeService = (id: string) => {
    if (editingId === id) cancelEdit();
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 max-w-4xl overflow-y-auto custom-scrollbar h-full pb-32 md:pb-10 bg-background"
    >
      <div className="mb-10 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-serif text-neutral-900">Catálogo de Serviços</h1>
        <p className="text-[9px] md:text-[10px] text-gold mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-60">Curadoria de Experiências Premium</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-6 glass-card p-6 md:p-8 rounded-[32px] lg:sticky lg:top-10 border border-neutral-100 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {editingId ? 'Editar Serviço' : 'Adicionar Novo'}
              </h2>
              {editingId && (
                <button 
                  type="button" 
                  onClick={cancelEdit}
                  className="p-1 hover:bg-neutral-100 rounded-md transition-colors text-muted hover:text-black"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted ml-1">Nome do Serviço</label>
              <input 
                className="w-full bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-sm focus:border-black/20 focus:bg-white outline-none transition-all placeholder:text-neutral-300"
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                placeholder="ex: Corte Moderno"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted ml-1">Preço (R$)</label>
                <input 
                  type="number"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-sm focus:border-black/20 focus:bg-white outline-none transition-all placeholder:text-neutral-300"
                  value={newService.price}
                  onChange={e => setNewService({ ...newService, price: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted ml-1">Duração (min)</label>
                <input 
                  type="number"
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-xl p-4 text-sm focus:border-black/20 focus:bg-white outline-none transition-all placeholder:text-neutral-300"
                  value={newService.duration}
                  onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 group">
              {editingId ? <Edit2 className="w-4 h-4 text-gold" /> : <Plus className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />}
              {editingId ? 'Atualizar Serviço' : 'Publicar Serviço'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Catálogo Atual</h2>
          {services.length === 0 ? (
            <div className="border border-dashed border-neutral-200 p-12 rounded-[32px] text-center text-muted text-sm italic opacity-50 bg-neutral-50">
              Nenhum serviço cadastrado ainda.
            </div>
          ) : (
            services.map(s => (
              <div key={s.id} className={cn(
                "glass-card p-5 md:p-6 rounded-2xl flex items-center justify-between group transition-all border shadow-sm",
                editingId === s.id ? "bg-neutral-50 border-black/10" : "hover:bg-white border-neutral-100"
              )}>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-neutral-900">{s.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest opacity-60">
                      {s.duration} min
                    </p>
                    <div className="w-1 h-1 rounded-full bg-gold/30" />
                    <p className="text-[10px] text-gold font-black uppercase tracking-widest">
                      R$ {s.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => startEdit(s)}
                    className="p-3 text-muted hover:text-black transition-colors md:opacity-0 md:group-hover:opacity-100 bg-neutral-50 md:bg-transparent rounded-xl"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeService(s.id)}
                    className="p-3 text-muted hover:text-red-500 transition-colors md:opacity-0 md:group-hover:opacity-100 bg-neutral-50 md:bg-transparent rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
