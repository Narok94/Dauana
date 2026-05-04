import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { addDays } from 'date-fns';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ClientsView } from './components/ClientsView';
import { ServicesConfigView } from './components/ServicesConfigView';
import { FinanceView } from './components/FinanceView';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Appointment, Service, Expense, User } from './types';

type Tab = 'dashboard' | 'calendar' | 'clients' | 'services' | 'finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [services, setServices] = useLocalStorage<Service[]>('services', [
    { id: '1', name: 'Corte Premium', duration: 45, price: 50 },
    { id: '2', name: 'Barba Tradicional', duration: 30, price: 30 },
    { id: '3', name: 'Styling Completo', duration: 60, price: 80 },
  ]);

  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [
    { id: '1', clientName: 'Ana Beatriz Silva', service: 'Corte Premium', date: new Date().toISOString().split('T')[0], time: '09:00', status: 'scheduled' },
    { id: '2', clientName: 'Ricardo Costa', service: 'Barba Tradicional', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'completed' },
  ]);

  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', [
    { id: '1', description: 'Aluguel', amount: 1500, date: new Date().toISOString().split('T')[0], category: 'Operacional' },
    { id: '2', description: 'Produtos', amount: 350, date: new Date().toISOString().split('T')[0], category: 'Insumos' },
  ]);

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const app = { ...newApp, id: Math.random().toString(36).substr(2, 9) } as Appointment;
    setAppointments([...appointments, app]);
  };

  const addExpense = (newExp: Omit<Expense, 'id'>) => {
    const exp = { ...newExp, id: Math.random().toString(36).substr(2, 9) } as Expense;
    setExpenses([...expenses, exp]);
  };

  const removeAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full"
        >
          <Login onLogin={(u) => setUser(u)} />
        </motion.div>
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row h-screen bg-background text-foreground font-sans overflow-hidden w-full"
        >
          <Sidebar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
            onLogout={() => setUser(null)}
            role={user.role}
          />

          <main className="flex-1 flex flex-col overflow-hidden relative">
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div 
                  key="dashboard"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 h-full overflow-hidden"
                >
                  <Dashboard 
                    appointments={appointments} 
                    onAdd={addAppointment} 
                    onRemove={removeAppointment}
                    onAddExpense={addExpense}
                    services={services}
                    expenses={expenses}
                    role={user.role}
                  />
                </motion.div>
              )}
              {activeTab === 'calendar' && (
                <motion.div 
                  key="calendar"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 h-full overflow-hidden"
                >
                  <CalendarView appointments={appointments} />
                </motion.div>
              )}
              {activeTab === 'clients' && (
                <motion.div 
                  key="clients"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 h-full overflow-hidden"
                >
                  <ClientsView appointments={appointments} services={services} />
                </motion.div>
              )}
              {activeTab === 'services' && (
                <motion.div 
                  key="services"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 h-full overflow-hidden"
                >
                  <ServicesConfigView 
                    services={services} 
                    setServices={setServices} 
                  />
                </motion.div>
              )}
              {activeTab === 'finance' && (
                <motion.div 
                  key="finance"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="flex-1 h-full overflow-hidden"
                >
                  <FinanceView 
                    expenses={expenses} 
                    setExpenses={setExpenses}
                    appointments={appointments}
                    services={services}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
