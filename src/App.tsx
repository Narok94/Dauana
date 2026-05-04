import React, { useState, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Appointment, Service, User } from './types';

// Lazy loading views for better mobile performance
const Dashboard = lazy(() => import('./components/Dashboard').then(module => ({ default: module.Dashboard })));
const CalendarView = lazy(() => import('./components/CalendarView').then(module => ({ default: module.CalendarView })));
const ClientsView = lazy(() => import('./components/ClientsView').then(module => ({ default: module.ClientsView })));
const ServicesConfigView = lazy(() => import('./components/ServicesConfigView').then(module => ({ default: module.ServicesConfigView })));
const FinanceView = lazy(() => import('./components/FinanceView').then(module => ({ default: module.FinanceView })));

// Loading component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-background">
    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold/20 border-t-gold" />
  </div>
);

type Tab = 'dashboard' | 'calendar' | 'clients' | 'services' | 'finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const [services, setServices] = useLocalStorage<Service[]>('services', [
    { id: '1', name: 'Bronzeamento Natural', duration: 90, price: 120 },
    { id: '2', name: 'Extensão de Cílios', duration: 120, price: 150 },
    { id: '3', name: 'Design de Sobrancelhas', duration: 45, price: 60 },
  ]);

  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [
    { id: '1', clientName: 'Ana Beatriz Silva', service: 'Extensão de Cílios', date: new Date().toISOString().split('T')[0], time: '09:00', status: 'scheduled' },
    { id: '2', clientName: 'Gabriela Mendes', service: 'Bronzeamento Natural', date: new Date().toISOString().split('T')[0], time: '10:30', status: 'completed' },
  ]);

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const app = { ...newApp, id: Math.random().toString(36).substr(2, 9) } as Appointment;
    setAppointments([...appointments, app]);
  };

  const removeAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id));
  };

  const updateAppointment = (updatedApp: Appointment) => {
    setAppointments(appointments.map(app => app.id === updatedApp.id ? updatedApp : app));
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
          className="flex flex-col md:flex-row h-[100dvh] bg-background text-foreground font-sans overflow-hidden w-full relative"
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
            <Suspense fallback={<PageLoader />}>
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
                      onUpdate={updateAppointment}
                      services={services}
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
                      appointments={appointments}
                      services={services}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Suspense>
          </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
