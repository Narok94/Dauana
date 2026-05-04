import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download, 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useBusinessLogic } from '../hooks/useBusinessLogic';
import { cn } from '../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FinanceViewProps {
  appointments: any[];
  services: any[];
}

export function FinanceView({ appointments, services }: FinanceViewProps) {
  const { stats, cashFlowData } = useBusinessLogic(appointments, services);
  const [filter, setFilter] = useState<'month' | 'forecast'>('month');
  
  const today = new Date();
  const todayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), today));

  const exportToCSV = () => {
    const headers = ['Data', 'Cliente', 'Serviço', 'Valor'];
    const rows = appointments
      .filter(app => app.status === 'completed')
      .map(a => [a.date, a.clientName, a.service, (services.find(s => s.name === a.service)?.price || 0)]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `financeiro-dauana-${format(new Date(), 'MM-yyyy')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 md:p-10 max-w-6xl mx-auto overflow-y-auto custom-scrollbar h-full pb-32 bg-background"
    >
      <div className="mb-10 md:mb-12 flex flex-col md:flex-row justify-between md:items-end gap-6 text-black">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif text-neutral-900">Gestão de Patrimônio</h1>
          <p className="text-[9px] md:text-[10px] text-gold mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-60">Controle de Entradas</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="px-6 py-3 bg-white text-neutral-900 border border-neutral-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-gold" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="glass-card p-8 rounded-[40px] border border-neutral-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.05] rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.3em]">Faturamento Efetivo</p>
            <ArrowUpRight className="w-4 h-4 text-gold" />
          </div>
          <h3 className="text-3xl font-serif text-neutral-900">R$ {stats.curMonthRevenue.toLocaleString('pt-BR')}</h3>
          <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Mês Atual</p>
        </div>

        <div className="glass-card p-8 rounded-[40px] border border-gold/10 shadow-xl bg-neutral-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gold/[0.08] rounded-full blur-3xl -mr-24 -mt-24" />
          <p className="text-[9px] font-black text-gold/60 uppercase tracking-[0.3em] mb-4">Previsão de Receita</p>
          <div className="flex items-end justify-between relative z-10">
            <h3 className="text-3xl font-serif text-gold italic">R$ {stats.forecastRevenue.toLocaleString('pt-BR')}</h3>
            <div className="px-3 py-1.5 bg-gold/10 rounded-xl text-[10px] font-black italic text-gold border border-gold/20">
              {todayAppointments.length} AGENDAMENTOS
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Entradas Recentes</h3>
            <Filter className="w-3.5 h-3.5 opacity-20" />
          </div>
          
          <div className="space-y-3">
            {appointments.filter(a => a.status === 'completed').length === 0 ? (
              <div className="p-10 border border-dashed border-neutral-200 rounded-[32px] text-center italic text-muted text-xs bg-neutral-50">
                Nenhuma entrada registrada.
              </div>
            ) : (
              appointments
                .filter(a => a.status === 'completed')
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10)
                .map(app => (
                  <div key={app.id} className="p-5 glass-card rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/5 group-hover:bg-gold/20">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-tight">{app.clientName}</p>
                        <p className="text-[9px] font-bold text-muted uppercase opacity-40">{format(parseISO(app.date), 'dd MMMM', { locale: ptBR })} · {app.service}</p>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-neutral-800">+ R$ {(services.find(s => s.name === app.service)?.price || 0).toLocaleString('pt-BR')}</p>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Fluxo de Entradas Diário</h3>
           <div className="glass-card p-6 md:p-8 rounded-[40px] border border-neutral-100 shadow-sm bg-white h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 700, fill: '#666' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: '#f8f8f8' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="revenue" radius={[6, 6, 0, 0]} fill="#D4AF37" />
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
