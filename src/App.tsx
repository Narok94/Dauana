import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { addDays } from 'date-fns';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { ClientsView } from './components/ClientsView';
import { ServicesConfigView } from './components/ServicesConfigView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Appointment, Service } from './types';

type Tab = 'dashboard' | 'calendar' | 'clients' | 'services';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [services, setServices] = useLocalStorage<Service[]>('services', [
    { id: '1', name: 'Corte Premium', duration: 45, price: 50 },
    { id: '2', name: 'Barba Tradicional', duration: 30, price: 30 },
    { id: '3', name: 'Styling Completo', duration: 60, price: 80 },
  ]);

  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', [
    { id: '1', clientName: 'Ana Beatriz Silva', service: 'Corte + Hidratação', date: new Date().toISOString(), time: '09:00', status: 'scheduled' },
    { id: '2', clientName: 'Ricardo Costa', service: 'Barba e Bigode', date: new Date().toISOString(), time: '10:30', status: 'completed' },
    { id: '3', clientName: 'Mariana Lopes', service: 'Coloração Completa', date: addDays(new Date(), 1).toISOString(), time: '14:00', status: 'scheduled' },
  ]);

  const addAppointment = (newApp: Omit<Appointment, 'id'>) => {
    const app = { ...newApp, id: Math.random().toString(36).substr(2, 9) } as Appointment;
    setAppointments([...appointments, app]);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-black relative">
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
                services={services}
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
        </AnimatePresence>
      </main>
    </div>
  );
}
