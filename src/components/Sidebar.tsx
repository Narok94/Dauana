import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  Clock,
  Menu
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-300 group relative",
        active 
          ? "bg-white/5 text-white border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]" 
          : "text-muted hover:text-white hover:bg-white/[0.02]"
      )}
    >
      <div className={cn(
        "flex-shrink-0 transition-transform duration-300", 
        active ? "text-white scale-110" : "group-hover:text-white group-hover:scale-110"
      )}>
        {icon}
      </div>
      {!collapsed && <span className="text-xs font-bold tracking-widest uppercase truncate">{label}</span>}
      {active && !collapsed && (
        <motion.div 
          layoutId="sidebar-active"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" 
        />
      )}
    </button>
  );
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="hidden md:flex border-r border-white/5 bg-black flex-col pt-10 relative transition-all duration-300 z-50 shrink-0"
      >
        <div className="px-10 mb-16">
          <h1 className="text-3xl font-black tracking-tighter italic text-gradient">DAUANA</h1>
          {isSidebarOpen && <p className="text-[9px] uppercase tracking-[0.4em] text-muted mt-2 font-black opacity-40">System 2026</p>}
        </div>

        <nav className="flex-1 px-5 space-y-2">
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

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-4 group cursor-pointer">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-110 transition-transform duration-300">
              DA
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white/90 truncate">Dauana A.</p>
                <p className="text-[9px] text-muted uppercase tracking-widest font-black truncate">Premium Account</p>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-20 bg-white text-black p-1.5 rounded-xl border border-black hover:scale-110 active:scale-95 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-[60]"
        >
          <Menu className="w-4 h-4" />
        </button>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/80 backdrop-blur-xl sticky top-0 z-[100] w-full">
        <h1 className="text-xl font-black italic text-gradient">DAUANA</h1>
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px]">
          DA
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-black/80 backdrop-blur-2xl border-t border-white/5 px-6 py-4 flex justify-between items-center safe-area-bottom">
        <MobileNavItem 
          icon={<CalendarIcon className="w-5 h-5" />} 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <MobileNavItem 
          icon={<Clock className="w-5 h-5" />} 
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
        />
        <MobileNavItem 
          icon={<Users className="w-5 h-5" />} 
          active={activeTab === 'clients'} 
          onClick={() => setActiveTab('clients')} 
        />
        <MobileNavItem 
          icon={<Settings className="w-5 h-5" />} 
          active={activeTab === 'services'} 
          onClick={() => setActiveTab('services')} 
        />
      </nav>
    </>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-3 rounded-2xl transition-all relative",
        active ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "text-muted"
      )}
    >
      {icon}
      {active && (
        <motion.div 
          layoutId="mobile-nav-active"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
        />
      )}
    </button>
  );
}
