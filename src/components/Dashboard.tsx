import React, { useState } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Service } from '../types';
import { AddAppointmentModal } from './AddAppointmentModal';
import { cn } from '../lib/utils';

interface DashboardProps {
  appointments: Appointment[];
  onAdd: (app: Omit<Appointment, 'id'>) => void;
  onRemove: (id: string) => void;
  services: Service[];
}

export function Dashboard({ appointments, onAdd, onRemove, services }: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 0 });
  
  const todayAppointments = appointments
    .filter(app => isSameDay(parseISO(app.date), today))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row h-full overflow-hidden bg-background"
    >
      <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden">
        <header className="h-20 border-b border-border-subtle flex items-center justify-between px-6 md:px-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gradient capitalize">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </h2>
            <p className="text-[9px] md:text-[10px] text-muted uppercase tracking-widest font-bold mt-0.5 opacity-60">
              Você tem {todayAppointments.length} agendamentos para hoje
            </p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-4 md:px-6 py-2 md:py-2.5 bg-black text-white text-[9px] md:text-xs font-black uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          >
            <span className="hidden sm:inline">Novo Agendamento</span>
            <span className="sm:hidden">+ Novo</span>
          </button>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar pb-32 md:pb-10">
          <div className="grid grid-cols-1 gap-6 md:gap-8 max-w-3xl">
            {todayAppointments.length === 0 ? (
              <div className="text-muted text-sm italic font-light opacity-50 bg-neutral-50 p-10 rounded-3xl border border-dashed border-neutral-200 text-center">
                Descanse um pouco! Nenhum agendamento para hoje.
              </div>
            ) : (
              todayAppointments.map((app) => (
                <div key={app.id} className="flex items-start space-x-8 pb-8 border-b border-neutral-100 group last:border-0">
                  <div className="w-20 text-right shrink-0 pt-1">
                    <p className="text-xl font-black text-black/90 group-hover:text-black transition-colors">{app.time}</p>
                    <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-bold mt-1">
                      {services.find(s => s.name === app.service)?.duration || 60} min
                    </p>
                  </div>
                  <div className="flex-1 glass-card p-6 rounded-3xl flex justify-between items-center group-hover:border-neutral-300 transition-all duration-500 hover:bg-white shadow-sm border border-neutral-100">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200 font-bold text-sm uppercase group-hover:scale-110 transition-transform duration-500 text-neutral-600">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-black/90 text-lg group-hover:text-black transition-colors">{app.clientName}</h4>
                        <p className="text-[10px] text-muted uppercase tracking-widest font-black opacity-60">{app.service}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-sm font-mono font-bold text-neutral-800">
                        R$ {services.find(s => s.name === app.service)?.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onRemove(app.id)}
                          className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Excluir agendamento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <span className={cn(
                          "px-3 py-1.5 text-[8px] rounded-lg uppercase tracking-[0.2em] font-black transition-all",
                          app.status === 'completed' 
                            ? "bg-black text-white shadow-md" 
                            : "bg-neutral-100 text-muted border border-neutral-200"
                        )}>
                          {app.status === 'completed' ? 'Concluído' : 'Confirmado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-80 p-6 md:p-8 border-l border-border-subtle bg-neutral-50/50 backdrop-blur-xl flex flex-col gap-10 md:gap-12 shrink-0 pb-32 lg:pb-8 overflow-y-auto lg:overflow-visible">
        <div>
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted mb-6 md:mb-8 opacity-60">Visão da Semana</h3>
          <div className="grid grid-cols-7 gap-1 md:gap-2">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => {
              const dayDate = addDays(startOfCurrentWeek, i);
              const isSelected = isSameDay(dayDate, today);
              const hasAppointments = appointments.some(app => isSameDay(parseISO(app.date), dayDate));
              
              return (
                <div key={i} className="text-center group cursor-pointer">
                  <p className="text-[9px] md:text-[10px] text-muted mb-2 md:mb-3 font-black group-hover:text-black transition-colors">{d}</p>
                  <div className={cn(
                    "relative text-[9px] md:text-[10px] w-7 h-7 md:w-8 md:h-8 flex items-center justify-center mx-auto rounded-xl transition-all duration-300 font-bold",
                    isSelected 
                      ? "bg-black text-white shadow-lg scale-110" 
                      : "text-muted border border-neutral-100 hover:border-black/10 hover:text-black bg-white"
                  )}>
                    {format(dayDate, 'd')}
                    {hasAppointments && !isSelected && (
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-black rounded-full border-2 border-white" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-8 md:space-y-10">
           <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted opacity-60">Status de Hoje</h3>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
              <div className="glass-card p-5 md:p-6 rounded-3xl relative overflow-hidden group border border-neutral-100 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-black/[0.05] transition-all duration-500" />
                <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black mb-2">Compromissos</p>
                <p className="text-2xl md:text-3xl font-light text-black tracking-tighter">
                  {todayAppointments.length} <span className="font-medium text-gradient">Hoje</span>
                </p>
              </div>
              <div className="glass-card p-5 md:p-6 rounded-3xl relative overflow-hidden group border border-neutral-100 shadow-sm">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-black/[0.05] transition-all duration-500" />
                <p className="text-[9px] text-muted uppercase tracking-[0.2em] font-black mb-2">Ocupação</p>
                <p className="text-2xl md:text-3xl font-light text-black tracking-tighter text-gradient">78%</p>
                <div className="w-full bg-neutral-200 h-[3px] mt-4 md:mt-5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    className="bg-black h-full" 
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="mt-8 lg:mt-auto">
          <div className="p-6 border border-dashed border-neutral-200 rounded-3xl flex items-center gap-3 bg-white/50">
            <div className="flex-shrink-0">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div>
              <p className="text-[9px] text-black/40 uppercase font-black tracking-widest mb-1">Dica de Gestão</p>
              <p className="text-[10px] text-muted leading-relaxed uppercase tracking-tighter font-medium underline underline-offset-4 decoration-neutral-200">
                "Revise seu catálogo mensalmente para otimizar lucros."
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
