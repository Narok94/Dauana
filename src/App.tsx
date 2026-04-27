import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  Plus, 
  Clock,
  CheckCircle2,
  XCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Trash2,
  Edit2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, addDays, startOfToday, isSameDay, parseISO, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { cn } from './lib/utils';
import { Appointment, Service } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'clients' | 'services'>('dashboard');
  
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Corte Premium', duration: 45, price: 50 },
      { id: '2', name: 'Barba Tradicional', duration: 30, price: 30 },
      { id: '3', name: 'Styling Completo', duration: 60, price: 80 },
    ];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('appointments');
    return saved ? JSON.parse(saved) : [
      { id: '1', clientName: 'Ana Beatriz Silva', service: 'Corte + Hidratação', date: new Date().toISOString(), time: '09:00', status: 'scheduled' },
      { id: '2', clientName: 'Ricardo Costa', service: 'Barba e Bigode', date: new Date().toISOString(), time: '10:30', status: 'completed' },
      { id: '3', clientName: 'Mariana Lopes', service: 'Coloração Completa', date: addDays(new Date(), 1).toISOString(), time: '14:00', status: 'scheduled' },
    ];
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const app = { ...newApp, id: Math.random().toString(36).substr(2, 9) };
    setAppointments([...appointments, app]);
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 256 : 80 }}
        className="border-r border-border-subtle bg-black flex flex-col pt-8 relative transition-all duration-300 z-50 shrink-0"
      >
        <div className="px-8 mb-12">
          <h1 className="text-2xl font-bold tracking-tighter italic">DAUANA</h1>
          {isSidebarOpen && <p className="text-[10px] uppercase tracking-widest text-muted mt-1">Andrade System 2026</p>}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<CalendarIcon className="w-4 h-4" />} 
            label="Agenda" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Clock className="w-4 h-4" />} 
            label="Calendário" 
            active={activeTab === 'calendar'} 
            onClick={() => setActiveTab('calendar')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Users className="w-4 h-4" />} 
            label="Clientes" 
            active={activeTab === 'clients'} 
            onClick={() => setActiveTab('clients')}
            collapsed={!isSidebarOpen}
          />
          <NavItem 
            icon={<Settings className="w-4 h-4" />} 
            label="Serviços" 
            active={activeTab === 'services'} 
            onClick={() => setActiveTab('services')}
            collapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-6 border-t border-border-subtle">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-neutral-900 border border-border-subtle flex items-center justify-center font-bold text-sm shrink-0">
              AD
            </div>
            {isSidebarOpen && (
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-[10px] text-muted">Ajustes da Conta</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-20 bg-white text-black p-1 rounded-full border border-black hover:scale-110 transition-transform"
        >
          <Menu className="w-4 h-4" />
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <Dashboard 
              key="dashboard" 
              appointments={appointments} 
              onAdd={addAppointment} 
              services={services}
            />
          )}
          {activeTab === 'calendar' && (
            <CalendarView key="calendar" appointments={appointments} />
          )}
          {activeTab === 'clients' && (
            <ClientsView key="clients" appointments={appointments} services={services} />
          )}
          {activeTab === 'services' && (
            <ServicesConfigView 
              key="services" 
              services={services} 
              setServices={setServices} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, collapsed, highlight }: { 
  icon: React.ReactNode, 
  label: string, 
  active: boolean, 
  onClick: () => void,
  collapsed?: boolean,
  highlight?: boolean
}) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 group relative",
        active ? "bg-card text-white border border-border-subtle" : "text-muted hover:text-white hover:bg-neutral-900",
        highlight && !active && "border border-border-subtle text-white/90"
      )}
    >
      <div className={cn("flex-shrink-0", active ? "text-white" : "group-hover:text-white")}>
        {icon}
      </div>
      {!collapsed && <span className="text-sm font-medium tracking-tight whitespace-nowrap">{label}</span>}
      {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" />}
    </button>
  );
}

function Dashboard({ appointments, onAdd, services }: { 
  appointments: Appointment[], 
  onAdd: (app: Omit<Appointment, 'id'>) => void,
  services: Service[]
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const today = new Date();
  const todayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), today)).sort((a, b) => a.time.localeCompare(b.time));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full"
    >
      <div className="flex-1 flex flex-col h-full border-r border-border-subtle">
        <header className="h-20 border-b border-border-subtle flex items-center justify-between px-10 shrink-0">
          <div>
            <h2 className="text-xl font-semibold">{format(today, "EEEE, d 'de' MMMM", { locale: undefined })}</h2>
            <p className="text-xs text-muted">Você tem {todayAppointments.length} agendamentos para hoje</p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-6 py-2 bg-white text-black text-sm font-bold rounded-full hover:bg-neutral-200 transition-colors"
          >
            Novo Agendamento
          </button>
        </header>

        <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-6 max-w-3xl">
            {todayAppointments.length === 0 ? (
              <div className="text-muted text-sm italic">Nenhum agendamento para hoje.</div>
            ) : (
              todayAppointments.map((app) => (
                <div key={app.id} className="flex items-start space-x-6 pb-6 border-b border-border-subtle group">
                  <div className="w-20 text-right shrink-0">
                    <p className="text-lg font-bold">{app.time}</p>
                    <p className="text-[10px] text-muted uppercase tracking-widest">
                      {services.find(s => s.name === app.service)?.duration || 60} min
                    </p>
                  </div>
                  <div className="flex-1 bg-card border border-border-subtle p-5 rounded-xl flex justify-between items-center group-hover:border-white/30 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center border border-border-subtle font-bold text-xs uppercase">
                        {app.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{app.clientName}</h4>
                        <p className="text-xs text-muted">{app.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono mb-2">R$ {services.find(s => s.name === app.service)?.price || '0,00'}</p>
                      <span className={cn(
                        "px-2 py-1 text-[9px] rounded uppercase tracking-wider font-bold",
                        app.status === 'completed' ? "bg-white text-black" : "bg-neutral-900 text-muted border border-border-subtle"
                      )}>
                        {app.status === 'completed' ? 'Concluído' : 'Confirmado'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-80 p-8 bg-neutral-950 flex flex-col gap-10 shrink-0">
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-6">Visão da Semana</h3>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
              <div key={i} className="text-center group cursor-pointer">
                <p className="text-[9px] text-muted mb-2 font-bold group-hover:text-white transition-colors">{d}</p>
                <div className={cn(
                  "text-[10px] w-7 h-7 flex items-center justify-center mx-auto rounded-full transition-all",
                  i === 1 ? "bg-white text-black font-bold" : "text-muted hover:bg-neutral-900"
                )}>
                  {23 + i}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-6">Métricas Hoje</h3>
           <div className="space-y-4">
              <div className="p-5 bg-card border border-border-subtle rounded-xl">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Receita Prevista</p>
                <p className="text-2xl font-light">R$ {todayAppointments.reduce((acc, curr) => acc + (services.find(s => s.name === curr.service)?.price || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="p-5 bg-card border border-border-subtle rounded-xl">
                <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Ocupação</p>
                <p className="text-2xl font-light">78%</p>
                <div className="w-full bg-neutral-900 h-[2px] mt-3 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '78%' }}
                    className="bg-white h-full" 
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="mt-auto">
          <div className="p-6 border border-dashed border-border-subtle rounded-xl flex items-center gap-3 bg-neutral-900/20">
            <div className="flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mb-1">Sugestão de Gestão</p>
              <p className="text-[10px] text-muted leading-relaxed uppercase tracking-tighter font-medium">
                "Dica: Revise seus preços mensalmente para acompanhar o mercado."
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

// ... helper functions for AppointmentCard, AddAppointmentModal, CalendarView, ClientsView...


function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const isCompleted = appointment.status === 'completed';
  
  return (
    <motion.div 
      layout
      className={cn(
        "bg-card border border-border-subtle rounded-xl p-6 flex items-center justify-between group hover:border-white/20 transition-all",
        isCompleted && "opacity-40"
      )}
    >
      <div className="flex items-center gap-6">
        <div className="text-right min-w-[70px]">
          <p className="text-lg font-bold tracking-tight">{appointment.time}</p>
          <p className="text-[9px] text-muted uppercase font-bold tracking-widest">Horário</p>
        </div>
        <div className="h-8 w-[1px] bg-border-subtle" />
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center border border-border-subtle font-bold text-[10px]">
             {appointment.clientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-medium text-white">{appointment.clientName}</h3>
            <p className="text-xs text-muted">{appointment.service}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={cn(
          "px-2 py-0.5 text-[8px] rounded uppercase tracking-[0.2em] font-black",
          isCompleted ? "bg-white text-black" : "border border-border-subtle text-muted"
        )}>
          {isCompleted ? 'Concluído' : 'Ativo'}
        </span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-neutral-900 rounded-lg">
          <Settings className="w-3.5 h-3.5 text-muted" />
        </button>
      </div>
    </motion.div>
  );
}

function AddAppointmentModal({ onClose, onAdd, services }: { onClose: () => void, onAdd: (app: Omit<Appointment, 'id'>) => void, services: Service[] }) {
  const [formData, setFormData] = useState({
    clientName: '',
    service: services[0]?.name || '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '09:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service) return;
    onAdd({ ...formData, status: 'scheduled' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="bg-black border border-border-subtle w-full max-w-md rounded-2xl p-10 relative overflow-hidden ring-1 ring-white/5"
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-xl font-bold tracking-tight">Novo Agendamento</h2>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Nome do Cliente</label>
            <input 
              required
              className="w-full bg-neutral-900/50 border border-border-subtle rounded-lg p-4 text-sm text-white focus:outline-none focus:border-white/40 transition-all placeholder:text-neutral-700"
              placeholder="ex: João Silva"
              value={formData.clientName}
              onChange={e => setFormData({ ...formData, clientName: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Serviço</label>
            {services.length > 0 ? (
              <select 
                className="w-full bg-neutral-900/50 border border-border-subtle rounded-lg p-4 text-sm text-white focus:outline-none focus:border-white/40 appearance-none cursor-pointer"
                value={formData.service}
                onChange={e => setFormData({ ...formData, service: e.target.value })}
              >
                {services.map(s => <option key={s.id} value={s.name} className="bg-black">{s.name} — R${s.price}</option>)}
              </select>
            ) : (
              <p className="text-xs text-red-500">Cadastre serviços primeiro!</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Data</label>
              <input 
                type="date"
                required
                className="w-full bg-neutral-900/50 border border-border-subtle rounded-lg p-4 text-sm text-white focus:outline-none focus:border-white/40"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted">Horário</label>
              <input 
                type="time"
                required
                className="w-full bg-neutral-900/50 border border-border-subtle rounded-lg p-4 text-sm text-white focus:outline-none focus:border-white/40"
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={services.length === 0}
            className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-neutral-200 transition-all mt-4 text-sm disabled:opacity-50"
          >
            Confirmar Agendamento
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ServicesConfigView({ services, setServices }: { services: Service[], setServices: React.Dispatch<React.SetStateAction<Service[]>> }) {
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.name || !newService.price || !newService.duration) return;
    
    const service: Service = {
      id: Math.random().toString(36).substr(2, 9),
      name: newService.name,
      price: Number(newService.price),
      duration: Number(newService.duration)
    };
    
    setServices([...services, service]);
    setNewService({ name: '', price: '', duration: '' });
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 max-w-4xl"
    >
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Gestão de Serviços</h1>
        <p className="text-xs text-muted mt-1 uppercase tracking-widest">Configure seu catálogo e preços</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="space-y-6 bg-card border border-border-subtle p-8 rounded-2xl sticky top-10">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Adicionar Novo</h2>
            
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Nome</label>
              <input 
                className="w-full bg-neutral-900 border border-border-subtle rounded-lg p-3 text-sm focus:border-white/40 outline-none"
                value={newService.name}
                onChange={e => setNewService({ ...newService, name: e.target.value })}
                placeholder="ex: Corte Moderno"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Preço (R$)</label>
                <input 
                  type="number"
                  className="w-full bg-neutral-900 border border-border-subtle rounded-lg p-3 text-sm focus:border-white/40 outline-none"
                  value={newService.price}
                  onChange={e => setNewService({ ...newService, price: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-widest text-muted">Duração (min)</label>
                <input 
                  type="number"
                  className="w-full bg-neutral-900 border border-border-subtle rounded-lg p-3 text-sm focus:border-white/40 outline-none"
                  value={newService.duration}
                  onChange={e => setNewService({ ...newService, duration: e.target.value })}
                  placeholder="45"
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-white text-black py-3 rounded-full font-bold text-xs hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Salvar Serviço
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4">Catálogo Atual</h2>
          {services.length === 0 ? (
            <div className="border border-dashed border-border-subtle p-12 rounded-2xl text-center text-muted text-sm">
              Nenhum serviço cadastrado ainda.
            </div>
          ) : (
            services.map(s => (
              <div key={s.id} className="bg-card border border-border-subtle p-6 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all">
                <div>
                  <h3 className="font-bold text-white">{s.name}</h3>
                  <p className="text-xs text-muted mt-1">{s.duration} minutos — R$ {s.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <button 
                  onClick={() => removeService(s.id)}
                  className="p-2 text-muted hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

function CalendarView({ appointments }: { appointments: Appointment[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 h-full flex flex-col"
    >
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h1>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest">Visualização Mensal</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 border border-border-subtle rounded-full hover:bg-neutral-900 transition-all">
            <ChevronLeft className="w-5 h-5 text-muted hover:text-white" />
          </button>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 border border-border-subtle rounded-full hover:bg-neutral-900 transition-all">
            <ChevronRight className="w-5 h-5 text-muted hover:text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border-subtle border border-border-subtle rounded-2xl overflow-hidden flex-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map(day => (
          <div key={day} className="bg-black py-4 px-2 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-muted">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayAppointments = appointments.filter(app => isSameDay(parseISO(app.date), day));
          return (
            <div key={day.toString()} className="bg-black p-4 min-h-[140px] hover:bg-neutral-900/30 transition-all relative group">
              <span className={cn(
                "text-sm font-bold",
                isToday(day) && "bg-white text-black w-7 h-7 rounded-full flex items-center justify-center",
                !isToday(day) && format(day, 'MM') !== format(currentMonth, 'MM') && "opacity-20",
                !isToday(day) && format(day, 'MM') === format(currentMonth, 'MM') && "text-muted"
              )}>
                {format(day, 'd')}
              </span>
              <div className="mt-4 space-y-1.5">
                {dayAppointments.slice(0, 3).map(app => (
                  <div key={app.id} className="text-[8px] bg-neutral-900 border border-border-subtle text-white px-2 py-1 rounded truncate font-medium uppercase tracking-tighter hover:border-white/30 cursor-pointer">
                    {app.time} {app.clientName}
                  </div>
                ))}
                {dayAppointments.length > 3 && (
                  <div className="text-[8px] text-muted font-bold ml-1 uppercase tracking-widest">
                    + {dayAppointments.length - 3} mais
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

function ClientsView({ appointments, services }: { appointments: Appointment[], services: Service[] }) {
  const clients = Array.from(new Set(appointments.map(a => a.clientName))).map(name => {
    const apps = appointments.filter(a => a.clientName === name);
    return {
      name,
      totalVisits: apps.length,
      lastVisit: apps.sort((a, b) => b.date.localeCompare(a.date))[0].date,
      totalSpent: apps.reduce((acc, curr) => acc + (services.find(s => s.name === curr.service)?.price || 0), 0)
    };
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10"
    >
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Portfólio de Clientes</h1>
        <p className="text-xs text-muted mt-1 uppercase tracking-widest">Gestão de Relacionamento</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 max-w-5xl">
        {clients.map(client => (
          <div key={client.name} className="bg-card border border-border-subtle rounded-2xl p-8 flex flex-wrap gap-12 items-center hover:border-white/20 transition-all group">
            <div className="min-w-[240px] flex items-center gap-5">
              <div className="w-14 h-14 bg-neutral-900 rounded-full flex items-center justify-center border border-border-subtle font-bold text-lg group-hover:border-white/40">
                {client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-lg font-bold group-hover:text-white">{client.name}</h3>
                <p className="text-[10px] text-muted uppercase tracking-[0.2em] mt-1">Membro Elite</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-12">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Visitas</p>
                <p className="text-xl font-light">{client.totalVisits}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Último Visto</p>
                <p className="text-lg font-light">{format(parseISO(client.lastVisit), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-2">Valor Vitalício</p>
                <p className="text-xl font-light">R$ {client.totalSpent.toLocaleString('pt-BR')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Removed DauanaChat
