import React from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Appointment, Service } from '../types';

interface ClientsViewProps {
  appointments: Appointment[];
  services: Service[];
}

export function ClientsView({ appointments, services }: ClientsViewProps) {
  const clients = Array.from(new Set(appointments.map(a => a.clientName))).map(name => {
    const apps = appointments.filter(a => a.clientName === name);
    return {
      name,
      totalVisits: apps.length,
      lastVisit: apps.sort((a, b) => b.date.localeCompare(a.date))[0].date,
      totalSpent: apps.reduce((acc, curr) => {
        const service = services.find(s => s.name === curr.service);
        return acc + (service?.price || 0);
      }, 0)
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 overflow-y-auto custom-scrollbar h-full pb-32 md:pb-10"
    >
      <div className="mb-10 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Portfólio de Clientes</h1>
        <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-50">Gestão de Relacionamento Premium</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-5xl">
        {clients.length === 0 ? (
          <div className="text-muted text-sm italic font-light opacity-50">Nenhum cliente cadastrado ainda.</div>
        ) : (
          clients.map(client => (
            <div key={client.name} className="glass-card rounded-[24px] md:rounded-3xl p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center hover:border-white/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.02] rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/[0.05] transition-all duration-700" />
              
              <div className="min-w-0 md:min-w-[260px] flex items-center gap-5 md:gap-6 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-900 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/5 font-black text-lg md:text-xl group-hover:scale-110 transition-transform duration-500 group-hover:border-white/40">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-white/90 group-hover:text-white transition-colors">{client.name}</h3>
                  <p className="text-[8px] md:text-[9px] text-muted uppercase tracking-[0.4em] mt-1 md:mt-2 font-black">Membro Elite</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 relative z-10 w-full">
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Visitas</p>
                  <p className="text-2xl md:text-3xl font-light text-gradient">{client.totalVisits}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Último Visto</p>
                  <p className="text-sm md:text-xl font-light text-white/80 group-hover:text-white transition-colors">
                    {format(parseISO(client.lastVisit), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Valor Vitalício</p>
                  <p className="text-2xl md:text-3xl font-light tracking-tighter">
                    R$ <span className="font-medium text-gradient">{client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
