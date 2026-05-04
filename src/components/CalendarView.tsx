import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '../types';
import { cn } from '../lib/utils';
import { AnimatePresence } from 'motion/react';
import { MessageCircle, X } from 'lucide-react';

interface CalendarViewProps {
  appointments: Appointment[];
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const selectedDayAppointments = selectedDay 
    ? appointments.filter(app => isSameDay(parseISO(app.date), selectedDay))
    : [];

  const sendWhatsAppReminder = (app: Appointment) => {
    const text = `Oi ${app.clientName}! Confirmando seu horário de ${app.service} dia ${format(parseISO(app.date), 'dd/MM')} às ${app.time}. Até breve!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-10 h-full flex flex-col overflow-hidden pb-24 md:pb-10 bg-background"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-serif text-neutral-900 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h1>
          <p className="text-[9px] md:text-[10px] text-gold mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-60">Visualização de Elite</p>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-2 md:p-3 border border-border-subtle bg-white rounded-xl md:rounded-2xl hover:bg-neutral-50 transition-all active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-muted hover:text-black" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-2 md:p-3 border border-border-subtle bg-white rounded-xl md:rounded-2xl hover:bg-neutral-50 transition-all active:scale-95"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted hover:text-black" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border-subtle border border-border-subtle rounded-2xl md:rounded-3xl overflow-hidden flex-1 shadow-sm overflow-y-auto custom-scrollbar bg-white">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
          <div key={i} className="bg-neutral-50/50 py-3 md:py-5 px-1 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted border-b border-border-subtle">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), day));
          const isDateInCurrentMonth = format(day, 'MM') === format(currentMonth, 'MM');

          return (
            <button 
              key={day.toString()} 
              onClick={() => setSelectedDay(day)}
              className="bg-white p-2 md:p-5 min-h-[80px] md:min-h-[160px] hover:bg-neutral-50 transition-all relative group border-border-subtle border-r border-b text-left w-full h-full"
            >
              <span className={cn(
                "text-[10px] md:text-sm font-black transition-all block mb-2",
                isToday(day) && "bg-neutral-900 text-gold w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center shadow-gold md:scale-110",
                !isToday(day) && !isDateInCurrentMonth && "opacity-10",
                !isToday(day) && isDateInCurrentMonth && "text-muted group-hover:text-black"
              )}>
                {format(day, 'd')}
              </span>
              <div className="mt-2 md:mt-5 space-y-1 md:space-y-2">
                {dayAppointments.slice(0, 2).map(app => (
                  <div key={app.id} className="text-[7px] md:text-[9px] bg-neutral-50 border border-neutral-100 text-neutral-600 px-1 md:px-3 py-0.5 md:py-1.5 rounded md:rounded-lg truncate font-bold uppercase tracking-tight hover:border-black/10 transition-all hidden sm:block">
                    {app.time} {app.clientName}
                  </div>
                ))}
                {/* Mobile indicators */}
                <div className="flex gap-0.5 sm:hidden justify-center mt-1">
                  {dayAppointments.map(app => (
                    <div key={app.id} className="w-1 h-1 rounded-full bg-neutral-300" />
                  ))}
                </div>
                {dayAppointments.length > 2 && (
                  <div className="text-[6px] md:text-[8px] text-muted font-bold ml-1 uppercase tracking-widest hidden sm:block">
                    + {dayAppointments.length - 2} mais
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedDay(null)} 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[48px] p-8 md:p-10 relative z-20 shadow-2xl max-h-[80vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase text-black leading-none">Clientes do Dia</h2>
                  <p className="text-[10px] font-black text-muted uppercase tracking-[0.4em] mt-2 opacity-40">
                    {format(selectedDay, "dd 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedDay(null)}
                  className="p-3 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-all"
                >
                  <X className="w-5 h-5 text-muted" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {selectedDayAppointments.length === 0 ? (
                  <p className="text-center py-10 text-neutral-400 font-bold uppercase text-[10px] tracking-widest opacity-40 italic">Nenhum agendamento para esta data</p>
                ) : (
                  selectedDayAppointments.map((app) => (
                    <div key={app.id} className="p-5 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-between group hover:border-gold/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="text-right shrink-0">
                          <p className="text-sm font-black text-neutral-900">{app.time}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center font-serif italic text-gold text-sm uppercase">
                          {app.clientName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 leading-tight">{app.clientName}</p>
                          <p className="text-[9px] font-black text-gold uppercase tracking-widest opacity-60">{app.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => sendWhatsAppReminder(app)}
                          className="p-2 text-neutral-400 hover:text-green-500 bg-white rounded-lg transition-all border border-neutral-100"
                          title="Enviar lembrete"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button 
                onClick={() => setSelectedDay(null)}
                className="mt-8 w-full bg-neutral-900 text-white py-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95"
              >
                Voltar ao Calendário
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
