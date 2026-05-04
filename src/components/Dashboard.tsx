import React, { useState } from 'react';
import { 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  Wallet, 
  MessageCircle,
  Crown,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { format, isSameDay, parseISO, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment, Service, Expense, Role } from '../types';
import { AddAppointmentModal } from './AddAppointmentModal';
import { cn } from '../lib/utils';
import { useBusinessLogic } from '../hooks/useBusinessLogic';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  appointments: Appointment[];
  onAdd: (app: Omit<Appointment, 'id'>) => void;
  onRemove: (id: string) => void;
  onAddExpense: (exp: Omit<Expense, 'id'>) => void;
  services: Service[];
  expenses: Expense[];
  role: Role;
}

export function Dashboard({ appointments, onAdd, onRemove, onAddExpense, services, expenses, role }: DashboardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Material' });
  const { stats, cashFlowData } = useBusinessLogic(appointments, services, expenses);
  const today = new Date();
  
  const todayAppointments = appointments
    .filter(app => isSameDay(parseISO(app.date), today))
    .sort((a, b) => a.time.localeCompare(b.time));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    onAddExpense({
      description: newExpense.description,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: new Date().toISOString().split('T')[0]
    });
    setNewExpense({ description: '', amount: '', category: 'Material' });
    setShowExpenseForm(false);
  };

  const sendWhatsAppReminder = (app: Appointment) => {
    const text = `Oi ${app.clientName}! Confirmando seu horário de ${app.service} hoje às ${app.time}. Até breve!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
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
            <h2 className="text-xl md:text-2xl font-black text-gradient uppercase italic tracking-tighter leading-none">
              DAUANA <span className="text-[10px] font-black tracking-widest text-muted italic ml-1 opacity-40">System</span>
            </h2>
            <p className="text-[9px] md:text-[10px] text-muted uppercase tracking-[0.4em] font-black mt-1 opacity-60">
              {format(today, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-neutral-50 rounded-2xl border border-neutral-100">
              <TrendingUp className="w-3.5 h-3.5 text-black" />
              <div className="text-left">
                <p className="text-[8px] font-black text-muted uppercase tracking-widest opacity-60">Saldo Previsto</p>
                <p className="text-[11px] font-bold text-black">R$ {stats.forecastBalance.toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowAddForm(true)}
                className="w-10 h-10 md:w-auto md:px-6 md:h-11 bg-black text-white rounded-2xl transition-all hover:bg-neutral-800 flex items-center justify-center gap-2 shadow-xl active:scale-95"
                title="Novo Agendamento"
              >
                <PlusCircle className="w-4 h-4" />
                <span className="hidden md:inline text-[9px] font-black uppercase tracking-widest">Agendar</span>
              </button>
              
              <button 
                onClick={() => setShowExpenseForm(true)}
                className="w-10 h-10 bg-white border border-neutral-100 text-black rounded-2xl transition-all hover:bg-neutral-50 flex items-center justify-center shadow-sm active:scale-95"
                title="Lançar Despesa"
              >
                <Wallet className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar pb-32">
          {role === 'admin' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="glass-card p-6 rounded-[32px] border border-neutral-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.01] rounded-full blur-3xl group-hover:bg-black/[0.03] transition-colors" />
                <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] mb-4 opacity-60">Faturamento Mês</p>
                <h3 className="text-3xl font-black italic tracking-tighter text-black">R$ {stats.curMonthRevenue.toLocaleString('pt-BR')}</h3>
                <div className="flex items-center gap-2 mt-4">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-bold uppercase",
                    stats.growth >= 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {stats.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stats.growth).toFixed(1)}%
                  </div>
                  <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-40">vs mês anterior</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-[32px] border border-neutral-100 shadow-sm col-span-1 md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Fluxo de Caixa 15 Dias</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-black" />
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Receita</span>
                    </div>
                  </div>
                </div>
                <div className="h-[120px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cashFlowData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" hide />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#000" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 max-w-4xl">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60 mb-2">Próximas Horas</h3>
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
        </div>
      </div>

      <div className="w-full lg:w-96 p-8 border-l border-border-subtle bg-white flex flex-col gap-10 shrink-0 pb-32 lg:pb-8 overflow-y-auto">
        {role === 'admin' && (
          <>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-6 opacity-60">Serviços Lucrativos</h3>
              <div className="space-y-4">
                {stats.serviceProfitability.map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-neutral-50 flex items-center justify-center text-[10px] font-black border border-neutral-100 group-hover:bg-black group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-tight">{item.name}</p>
                        <p className="text-[9px] text-muted font-bold uppercase opacity-60">{item.count} atendimentos</p>
                      </div>
                    </div>
                    <p className="text-xs font-black italic">R$ {item.revenue.toLocaleString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-6 opacity-60 flex items-center gap-2">
                <Crown className="w-3 h-3" />
                Clientes VIP
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {stats.vipClients.map((client, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                    <p className="text-[11px] font-black uppercase">{client.name}</p>
                    <div className="px-2 py-1 bg-black text-white text-[8px] font-black rounded-lg">
                      {client.count}X
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="mt-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted opacity-60 mb-4">Relatórios</h3>
           <button className="w-full flex items-center justify-between p-5 bg-neutral-50 rounded-[24px] border border-neutral-100 hover:bg-white hover:shadow-md transition-all group">
             <div className="flex items-center gap-3">
               <FileText className="w-4 h-4 text-muted group-hover:text-black" />
               <span className="text-[10px] font-black uppercase tracking-widest">Resumo Mensal PDF</span>
             </div>
             <TrendingUp className="w-3 h-3 opacity-20" />
           </button>
        </div>

        <div className="mt-auto">
          <div className="p-8 rounded-[40px] bg-neutral-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-all" />
            <Sparkles className="w-6 h-6 mb-4 opacity-50" />
            <h4 className="text-xl font-black italic tracking-tighter mb-2">IA Business <br/> Insights</h4>
            <p className="text-[10px] text-white/40 uppercase font-black leading-relaxed tracking-widest">
              "A cor de cabelo do mês é acobreado. Prepare seu estoque!"
            </p>
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

      {showExpenseForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowExpenseForm(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white w-full max-w-sm rounded-[40px] p-10 relative z-20 shadow-2xl">
            <h2 className="text-xl font-black italic tracking-tighter mb-8 uppercase text-black">Nova Despesa</h2>
            <form onSubmit={handleAddExpense} className="space-y-6">
              <input 
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white outline-none"
                placeholder="Descrição"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                required
              />
              <input 
                type="number"
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white outline-none"
                placeholder="Valor R$"
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                required
              />
              <select 
                className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white outline-none appearance-none"
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              >
                <option>Material</option>
                <option>Operacional</option>
                <option>Outros</option>
              </select>
              <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                Lançar Agora
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
