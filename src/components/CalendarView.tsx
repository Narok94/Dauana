import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '../types';
import { cn } from '../lib/utils';

interface CalendarViewProps {
  appointments: Appointment[];
}

export function CalendarView({ appointments }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4 md:p-10 h-full flex flex-col overflow-hidden pb-24 md:pb-10 bg-background"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gradient capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h1>
          <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-40">Visualização de Elite</p>
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
            <div key={day.toString()} className="bg-white p-2 md:p-5 min-h-[80px] md:min-h-[160px] hover:bg-neutral-50/50 transition-all relative group border-border-subtle border-r border-b">
              <span className={cn(
                "text-[10px] md:text-sm font-black transition-all",
                isToday(day) && "bg-black text-white w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg md:scale-110",
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
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
