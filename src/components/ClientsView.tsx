import React from 'react';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Appointment, Service } from '../types';

import { ptBR } from 'date-fns/locale';

interface ClientsViewProps {
  appointments: Appointment[];
  services: Service[];
}

export function ClientsView({ appointments, services }: ClientsViewProps) {
  const [search, setSearch] = React.useState('');

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

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 overflow-y-auto custom-scrollbar h-full pb-32 md:pb-10 bg-background"
    >
      <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Portfólio de Clientes</h1>
          <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-40">Gestão de Relacionamento Premium</p>
        </div>

        <div className="relative w-full md:w-72">
          <input 
            type="text" 
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-neutral-100 rounded-2xl py-3 px-5 text-xs text-black focus:outline-none focus:border-black/10 transition-all shadow-sm placeholder:text-neutral-300 placeholder:font-bold placeholder:uppercase placeholder:tracking-widest"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 max-w-5xl">
        {filteredClients.length === 0 ? (
          <div className="text-muted text-sm italic font-light opacity-50 bg-neutral-50 p-10 rounded-3xl border border-dashed border-neutral-200 text-center">
            {search ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado ainda.'}
          </div>
        ) : (
          filteredClients.map(client => (
            <div key={client.name} className="glass-card rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center hover:bg-white transition-all duration-500 group relative overflow-hidden border border-neutral-100 shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/[0.01] rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-black/[0.03] transition-all duration-700" />
              
              <div className="min-w-0 md:min-w-[260px] flex items-center gap-5 md:gap-6 relative z-10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-neutral-50 rounded-2xl flex items-center justify-center border border-neutral-100 font-black text-lg md:text-xl group-hover:scale-110 transition-transform duration-500 group-hover:border-neutral-300 text-neutral-400">
                  {client.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-black text-black/90 group-hover:text-black transition-colors">{client.name}</h3>
                  <p className="text-[8px] md:text-[9px] text-muted uppercase tracking-[0.4em] mt-1 md:mt-2 font-black opacity-60">Membro Elite</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12 relative z-10 w-full">
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Visitas</p>
                  <p className="text-2xl md:text-3xl font-light text-gradient">{client.totalVisits}</p>
                </div>
                <div>
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Última Visita</p>
                  <p className="text-sm md:text-xl font-light text-black/80 group-hover:text-black transition-colors">
                    {format(parseISO(client.lastVisit), "d 'de' MMM, yyyy", { locale: ptBR })}
                  </p>
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted font-black mb-1 md:mb-3 opacity-40">Valor Total</p>
                  <p className="text-2xl md:text-3xl font-light tracking-tighter text-black">
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
