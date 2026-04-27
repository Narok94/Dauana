import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
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
      className="p-4 md:p-10 h-full flex flex-col overflow-hidden pb-24 md:pb-10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 md:mb-12 gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-gradient">
            {format(currentMonth, 'MMMM yyyy')}
          </h1>
          <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-50">Visualização de Elite</p>
        </div>
        <div className="flex gap-2 md:gap-4">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-2 md:p-3 border border-white/5 bg-white/[0.02] rounded-xl md:rounded-2xl hover:bg-white/5 transition-all"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-muted hover:text-white" />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-2 md:p-3 border border-white/5 bg-white/[0.02] rounded-xl md:rounded-2xl hover:bg-white/5 transition-all"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted hover:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden flex-1 shadow-2xl overflow-y-auto custom-scrollbar">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
          <div key={day} className="bg-neutral-900/40 backdrop-blur-md py-3 md:py-5 px-1 text-center text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted border-b border-white/5">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), day));
          const isDateInCurrentMonth = format(day, 'MM') === format(currentMonth, 'MM');

          return (
            <div key={day.toString()} className="bg-black p-2 md:p-5 min-h-[80px] md:min-h-[160px] hover:bg-neutral-900/40 transition-all relative group border-white/[0.02] border-r border-b">
              <span className={cn(
                "text-[10px] md:text-sm font-black transition-all",
                isToday(day) && "bg-white text-black w-6 h-6 md:w-8 md:h-8 rounded-lg md:rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] md:scale-110",
                !isToday(day) && !isDateInCurrentMonth && "opacity-10",
                !isToday(day) && isDateInCurrentMonth && "text-muted group-hover:text-white"
              )}>
                {format(day, 'd')}
              </span>
              <div className="mt-2 md:mt-5 space-y-1 md:space-y-2">
                {dayAppointments.slice(0, 2).map(app => (
                  <div key={app.id} className="text-[7px] md:text-[9px] bg-white/[0.03] border border-white/5 text-white/80 px-1 md:px-3 py-0.5 md:py-1.5 rounded md:rounded-lg truncate font-bold uppercase tracking-tight hover:border-white/20 transition-all hidden sm:block">
                    {app.time} {app.clientName}
                  </div>
                ))}
                {/* Mobile indicators */}
                <div className="flex gap-0.5 sm:hidden justify-center mt-1">
                  {dayAppointments.map(app => (
                    <div key={app.id} className="w-1 h-1 rounded-full bg-white/40" />
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
