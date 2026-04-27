import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { Appointment, Service } from '../types';
import { AddAppointmentModal } from './AddAppointmentModal';
import { cn } from '../lib/utils';

interface DashboardProps {
  appointments: Appointment[];
  onAdd: (app: Omit<Appointment, 'id'>) => void;
  services: Service[];
}

export function Dashboard({ appointments, onAdd, services }: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date();
  const todayAppointments = appointments
    .filter(app => isSameDay(parseISO(app.date), today))
    .sort((a, b) => a.time.localeCompare(b.time));

  const totalRevenue = todayAppointments.reduce((acc, curr) => {
    const service = services.find(s => s.name === curr.service);
    return acc + (service?.price || 0);
  }, 0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row h-full overflow-hidden"
    >
      <div className="flex-1 flex flex-col h-full border-r border-white/5 overflow-hidden">
        <header className="h-20 border-b border-border-subtle flex items-center justify-between px-6 md:px-10 shrink-0 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gradient">
              {format(today, "EEEE, d 'de' MMMM", { locale: undefined })}
            </h2>
            <p className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-medium mt-0.5">
              Você tem {todayAppointments.length} agendamentos para hoje
            </p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-white text-black text-[9px] md:text-xs font-black uppercase tracking-widest rounded-full hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">+ Novo</span>
          </button>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar pb-32 md:pb-10">
          <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-3xl">
            {todayAppointments.length === 0 ? (
              <div className="text-muted text-sm italic font-light opacity-50">Nenhum agendamento para hoje.</div>
            ) : (
              todayAppointments.map((app) => (
                <div key={app.id} className="flex items-start space-x-8 pb-8 border-b border-white/[0.03] group last:border-0">
                  <div className="w-20 text-right shrink-0 pt-1">
                    <p className="text-xl font-black text-white/90 group-hover:text-white transition-colors">{app.time}</p>
                    <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-bold mt-1">
                      {services.find(s => s.name === app.service)?.duration || 60} min
                    </p>
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-2xl flex justify-between items-center group-hover:border-white/20 transition-all duration-500">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-neutral-900 rounded-2xl flex items-center justify-center border border-white/5 font-bold text-sm uppercase group-hover:scale-110 transition-transform duration-500">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-white/90 text-lg group-hover:text-white transition-colors">{app.clientName}</h4>
                        <p className="text-xs text-muted uppercase tracking-widest font-medium">{app.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-bold mb-3">
                        R$ {services.find(s => s.name === app.service)?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                      <span className={cn(
                        "px-3 py-1.5 text-[8px] rounded-lg uppercase tracking-[0.2em] font-black transition-all",
                        app.status === 'completed' 
                          ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
                          : "bg-neutral-900 text-muted border border-white/5"
                      )}>
                        {app.status === 'completed' ? 'Concluído' : 'Confirmado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 p-6 md:p-8 border-l border-white/[0.03] bg-neutral-950/30 backdrop-blur-xl flex flex-col gap-10 md:gap-12 shrink-0 pb-32 lg:pb-8 overflow-y-auto lg:overflow-visible">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted mb-6 md:mb-8">Visão da Semana</h3>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <p className="text-[9px] md:text-[10px] text-muted mb-2 md:mb-3 font-black group-hover:text-white transition-colors">{d}</p>
                <div className={cn(
                  "text-[9px] md:text-[10px] w-7 h-7 md:w-8 md:h-8 flex items-center justify-center mx-auto rounded-xl transition-all duration-300 font-bold",
                  i === 1 
                    ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                    : "text-muted border border-transparent hover:border-white/20 hover:text-white"
                )}>
                  {23 + i}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
           <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted">Métricas Hoje</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <div className="glass-card p-5 md:p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-500" />
                <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black mb-2">Receita Prevista</p>
                <p className="text-2xl md:text-3xl font-light text-white tracking-tighter">
                  R$ <span className="font-medium text-gradient">{totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </p>
              </div>
              <div className="glass-card p-5 md:p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-500" />
                <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black mb-2">Ocupação</p>
                <p className="text-2xl md:text-3xl font-light text-white tracking-tighter text-gradient">78%</p>
                <div className="w-full bg-neutral-900 h-[3px] mt-4 md:mt-5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    className="bg-accent h-full shadow-[0_0_10px_#fff]" 
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="mt-8 lg:mt-auto">
          <div className="p-6 border border-dashed border-border-subtle rounded-xl flex items-center gap-3 bg-neutral-900/20">
            <div className="flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Sugestão de Gestão</p>
              <p className="text-[10px] text-muted leading-relaxed uppercase tracking-tighter font-medium">
                "Dica: Revise seus preços mensalmente para acompanhar o mercado."
              </p>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <AddAppointmentModal 
          onClose={() => setShowAddForm(false)} 
          onAdd={onAdd} 
          services={services}
        />
      )}
    </motion.div>
  );
}
