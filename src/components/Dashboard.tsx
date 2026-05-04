import React, { useState, useMemo } from 'react';
import { 
  Trash2, 
  PlusCircle, 
  MessageCircle,
  Crown
} from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Service, Role } from '../types';
import { AddAppointmentModal } from './AddAppointmentModal';
import { cn } from '../lib/utils';
import { useBusinessLogic } from '../hooks/useBusinessLogic';

interface DashboardProps {
  appointments: Appointment[];
  onAdd: (app: Omit<Appointment, 'id'>) => void;
  onRemove: (id: string) => void;
  onUpdate: (app: Appointment) => void;
  services: Service[];
  role: Role;
}

export function Dashboard({ appointments, onAdd, onRemove, onUpdate, services, role }: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTodayModal, setShowTodayModal] = useState(false);
  const { stats, cashFlowData } = useBusinessLogic(appointments, services);
  const today = useMemo(() => new Date(), []);
  
  const todayAppointments = useMemo(() => appointments
    .filter(app => isSameDay(parseISO(app.date), today))
    .sort((a, b) => a.time.localeCompare(b.time)), [appointments, today]);

  const totalTodayRevenue = useMemo(() => todayAppointments.reduce((acc, app) => {
    const service = services.find(s => s.name === app.service);
    return acc + (service?.price || 0);
  }, 0), [todayAppointments, services]);

  const sendWhatsAppReminder = (app: Appointment) => {
    const text = `Oi ${app.clientName}! Confirmando seu horário de ${app.service} hoje às ${app.time}. Até breve!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const toggleStatus = (app: Appointment) => {
    const newStatus = app.status === 'completed' ? 'scheduled' : 'completed';
    onUpdate({ ...app, status: newStatus });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row h-full overflow-hidden bg-background"
    >
      <div className="flex-1 flex flex-col h-full border-r border-border-subtle overflow-hidden">
        <header className="h-24 border-b border-border-subtle flex items-center justify-between px-6 md:px-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10 gap-4">
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-serif text-neutral-900 tracking-tighter leading-none">
              Dauana
            </h2>
            <button 
              onClick={() => setShowTodayModal(true)}
              className="group flex items-center gap-2 mt-1"
            >
              <p className="text-[9px] md:text-[10px] text-muted uppercase tracking-[0.4em] font-bold group-hover:text-gold transition-colors">
                {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </p>
              <div className="px-1.5 py-0.5 bg-neutral-900 text-gold text-[8px] font-black rounded-full scale-90 group-hover:scale-100 transition-transform">
                {todayAppointments.length}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-10 h-10 md:w-auto md:px-6 md:h-11 bg-neutral-900 text-white rounded-2xl transition-all hover:bg-black flex items-center justify-center gap-2 shadow-xl active:scale-95 group"
                title="Novo Agendamento"
              >
                <PlusCircle className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Agendar</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar pb-32 overscroll-none">
          <div className="hidden md:grid md:grid-cols-4 gap-4 mb-8">
            <button 
              onClick={() => setShowTodayModal(true)}
              className="glass-card p-4 rounded-[28px] border border-neutral-100 shadow-sm relative overflow-hidden group text-left transition-all bg-white"
            >
              <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Agendas Hoje</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-2xl font-serif text-neutral-900 leading-none">{todayAppointments.length}</h3>
                <span className="text-[9px] font-bold text-neutral-400">CLIENTES</span>
              </div>
            </button>

            {role === 'admin' && (
              <div className="glass-card p-4 rounded-[28px] border border-neutral-100 shadow-sm relative overflow-hidden group bg-white">
                <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Faturamento Mês</p>
                <h3 className="text-2xl font-serif text-neutral-900 italic leading-none">R$ {stats.curMonthRevenue.toLocaleString('pt-BR')}</h3>
              </div>
            )}

            <div className="glass-card p-4 rounded-[28px] border border-neutral-100 shadow-sm relative overflow-hidden group bg-white">
              <p className="text-[8px] font-black text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Previsão Hoje</p>
              <h3 className="text-2xl font-serif text-gold leading-none">R$ {totalTodayRevenue.toLocaleString('pt-BR')}</h3>
            </div>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-serif text-neutral-900 italic">Próximas Horas</h3>
                <div className="h-[1px] w-8 bg-gold mt-1" />
              </div>
            </div>
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
                        <button
                          onClick={() => toggleStatus(app)}
                          className={cn(
                            "px-3 py-1.5 text-[8px] rounded-lg uppercase tracking-[0.2em] font-black transition-all shadow-sm active:scale-95 border",
                            app.status === 'completed' 
                              ? "bg-neutral-900 text-gold border-neutral-900" 
                              : "bg-white text-neutral-400 border-neutral-100 hover:border-gold/20"
                          )}
                        >
                          {app.status === 'completed' ? 'Concluído' : 'Confirmar'}
                        </button>
                        <button 
                          onClick={() => sendWhatsAppReminder(app)}
                          className="p-2 text-muted hover:text-green-500 bg-neutral-50 hover:bg-green-50 rounded-lg transition-all"
                          title="Lembrete WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Botão Agendar Grande para Mobile */}
          <div className="md:hidden fixed bottom-24 left-6 right-6 z-20">
            <button 
              onClick={() => setShowAddForm(true)}
              className="w-full bg-neutral-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all text-[11px] border border-gold/20"
            >
              <PlusCircle className="w-5 h-5 text-gold" />
              Agendar Novo Horário
            </button>
          </div>
        </div>
      </div>

      {showTodayModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowTodayModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="bg-white w-full max-w-lg rounded-[48px] p-8 md:p-10 relative z-20 shadow-2xl max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-8 sr-only">
               <h2 className="text-xl font-black italic tracking-tighter uppercase text-black">Agenda de Hoje</h2>
            </div>
            
            <div className="mb-8">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase text-black leading-none">Agenda Completa</h2>
              <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mt-2 opacity-40">
                {format(today, "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
              {todayAppointments.length === 0 ? (
                <p className="text-center py-10 text-muted font-bold uppercase text-[10px] tracking-widest opacity-40">Nenhum agendamento hoje</p>
              ) : (
                todayAppointments.map((app) => (
                  <div key={app.id} className="p-5 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-between group hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-black">{app.time}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center font-black text-[10px] text-muted">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-black text-black leading-tight">{app.clientName}</p>
                        <p className="text-[9px] font-black text-muted uppercase tracking-widest opacity-60">{app.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(app)}
                          className={cn(
                            "px-3 py-1.5 text-[8px] rounded-lg uppercase tracking-[0.2em] font-black transition-all shadow-sm active:scale-95 border",
                            app.status === 'completed' 
                              ? "bg-neutral-900 text-gold border-neutral-900" 
                              : "bg-white text-neutral-400 border-neutral-100 hover:border-gold/20"
                          )}
                        >
                          {app.status === 'completed' ? 'Concluído' : 'Confirmar'}
                        </button>
                        <button 
                          onClick={() => sendWhatsAppReminder(app)}
                          className="p-2 text-muted hover:text-green-500 bg-white rounded-lg transition-all"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              onClick={() => setShowTodayModal(false)}
              className="mt-8 w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
            >
              Fechar Visualização
            </button>
          </motion.div>
        </div>
      )}

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
