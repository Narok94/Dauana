import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { Appointment, Service } from '../types';

interface AddAppointmentModalProps {
  onClose: () => void;
  onAdd: (app: Omit<Appointment, 'id'>) => void;
  services: Service[];
}

export function AddAppointmentModal({ onClose, onAdd, services }: AddAppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    service: services[0]?.name || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service) return;
    onAdd({ 
      ...formData, 
      status: 'scheduled' 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-white border border-neutral-100 w-full max-w-md rounded-[40px] p-10 md:p-12 relative overflow-hidden shadow-2xl group"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.01] rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-black/[0.03] transition-all duration-700" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <h2 className="text-2xl font-black tracking-tight text-gradient">Novo Agendamento</h2>
          <button onClick={onClose} className="p-2 text-muted hover:text-black hover:bg-neutral-50 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 ml-1">Nome do Cliente</label>
            <input 
              required
              className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white transition-all placeholder:text-neutral-300"
              placeholder="ex: João Silva"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 ml-1">Serviço</label>
            {services.length > 0 ? (
              <div className="relative group/select">
                <select 
                  className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white appearance-none cursor-pointer transition-all pr-12"
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                >
                  {services.map(s => (
                    <option key={s.id} value={s.name} className="bg-white text-black">
                      {s.name} — R$ {s.price.toLocaleString('pt-BR')}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted group-hover/select:text-black transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            ) : (
              <p className="text-xs text-red-500 font-medium">Cadastre serviços primeiro!</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 ml-1">Data</label>
              <input 
                type="date"
                required
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 ml-1">Horário</label>
              <input 
                type="time"
                required
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-5 text-sm text-black focus:outline-none focus:border-black/10 focus:bg-white transition-all"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={services.length === 0}
            className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-neutral-800 transition-all mt-6 text-[10px] shadow-lg active:scale-95 disabled:opacity-50"
          >
            Confirmar Agendamento
          </button>
        </form>
      </motion.div>
    </div>
  );
}
