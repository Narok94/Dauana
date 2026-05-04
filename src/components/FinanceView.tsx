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
import { Expense } from '../types';
import { format, parseISO } from 'date-fns';
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
  expenses: Expense[];
  setExpenses: (exps: Expense[]) => void;
  appointments: any[];
  services: any[];
}

export function FinanceView({ expenses, setExpenses, appointments, services }: FinanceViewProps) {
  const { stats, cashFlowData } = useBusinessLogic(appointments, services, expenses);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Material', date: new Date().toISOString().split('T')[0] });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;
    
    const exp: Expense = {
      id: Math.random().toString(36).substr(2, 9),
      description: newExpense.description,
      amount: Number(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    };
    
    setExpenses([...expenses, exp]);
    setNewExpense({ description: '', amount: '', category: 'Material', date: new Date().toISOString().split('T')[0] });
    setShowAddExpense(false);
  };

  const exportToCSV = () => {
    const headers = ['Data', 'Descrição', 'Valor', 'Categoria'];
    const rows = expenses.map(e => [e.date, e.description, e.amount, e.category]);
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
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gradient">Fluxo de Caixa</h1>
          <p className="text-[9px] md:text-[10px] text-muted mt-1 md:mt-2 uppercase tracking-[0.3em] font-black opacity-40">Gestão de Lucratividade Efetiva</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            className="px-6 py-3 bg-neutral-100 text-black border border-neutral-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-200 transition-all"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button 
            onClick={() => setShowAddExpense(true)}
            className="px-6 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-neutral-800 transition-all shadow-xl active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nova Despesa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-8 rounded-[40px] border border-neutral-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.03] rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Receita Bruta</p>
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter text-black">R$ {stats.curMonthRevenue.toLocaleString('pt-BR')}</h3>
        </div>

        <div className="glass-card p-8 rounded-[40px] border border-neutral-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.03] rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] font-black text-muted uppercase tracking-[0.3em] opacity-60">Custo Total</p>
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          </div>
          <h3 className="text-3xl font-black italic tracking-tighter text-black">R$ {stats.curMonthExpenses.toLocaleString('pt-BR')}</h3>
        </div>

        <div className="glass-card p-8 rounded-[40px] border border-neutral-100 shadow-sm bg-neutral-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.05] rounded-full blur-3xl -mr-16 -mt-16" />
          <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Lucro Líquido</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black italic tracking-tighter">R$ {(stats.curMonthRevenue - stats.curMonthExpenses).toLocaleString('pt-BR')}</h3>
            <div className="px-3 py-1.5 bg-white/10 rounded-xl text-[10px] font-black italic group-hover:bg-white/20 transition-all">
              MARGEM {(stats.curMonthRevenue > 0 ? ((stats.curMonthRevenue - stats.curMonthExpenses) / stats.curMonthRevenue * 100).toFixed(0) : 0)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Log de Movimentações</h3>
            <Filter className="w-3.5 h-3.5 opacity-20" />
          </div>
          
          <div className="space-y-3">
            {expenses.length === 0 ? (
              <div className="p-10 border border-dashed border-neutral-200 rounded-[32px] text-center italic text-muted text-xs bg-neutral-50">
                Nenhuma despesa registrada.
              </div>
            ) : (
              expenses.sort((a, b) => b.date.localeCompare(a.date)).map(exp => (
                <div key={exp.id} className="p-5 glass-card rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 border border-red-100 group-hover:bg-red-100">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-tight">{exp.description}</p>
                      <p className="text-[9px] font-bold text-muted uppercase opacity-40">{format(parseISO(exp.date), 'dd MMMM', { locale: ptBR })} · {exp.category}</p>
                    </div>
                  </div>
                  <p className="font-mono font-bold text-red-500">- R$ {exp.amount.toLocaleString('pt-BR')}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
           <h3 className="text-[10px] font-black text-muted uppercase tracking-[0.4em] opacity-60">Impacto Diário (Receita vs Gasto)</h3>
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
                  <Bar dataKey="balance" radius={[6, 6, 0, 0]}>
                    {cashFlowData.map((entry, index) => (
                      <Cell key={index} fill={entry.balance >= 0 ? '#000' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddExpense && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddExpense(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-md rounded-[48px] p-10 md:p-12 relative shadow-2xl z-20"
            >
              <h2 className="text-2xl font-black italic tracking-tighter mb-8 text-black">Lançar Despesa</h2>
              <form onSubmit={handleAddExpense} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted ml-2">Descrição</label>
                  <input 
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:border-black/10 outline-none transition-all placeholder:text-neutral-300"
                    value={newExpense.description}
                    onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                    placeholder="Papel Higiênico, Luz, etc."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted ml-2">Valor (R$)</label>
                    <input 
                      type="number"
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:border-black/10 outline-none transition-all placeholder:text-neutral-300"
                      value={newExpense.amount}
                      onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted ml-2">Data</label>
                    <input 
                      type="date"
                      className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:border-black/10 outline-none transition-all"
                      value={newExpense.date}
                      onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-muted ml-2">Categoria</label>
                  <select 
                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs font-bold focus:bg-white focus:border-black/10 outline-none transition-all appearance-none"
                    value={newExpense.category}
                    onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    <option>Material</option>
                    <option>Operacional</option>
                    <option>Limpeza</option>
                    <option>Outros</option>
                  </select>
                </div>
                <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-neutral-800 transition-all shadow-xl active:scale-95">
                  Confirmar Lançamento
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
