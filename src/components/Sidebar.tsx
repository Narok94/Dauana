import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  Clock,
  Menu,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed?: boolean;
}

function NavItem({ icon, label, active, onClick, collapsed }: NavItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-300 group",
          active 
            ? "bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]" 
            : "text-muted hover:text-black hover:bg-neutral-50"
        )}
      >
        <div className={cn(
          "flex-shrink-0 transition-transform duration-300", 
          active ? "text-white scale-110" : "group-hover:text-black group-hover:scale-110"
        )}>
          {icon}
        </div>
        {!collapsed && <span className="text-[10px] font-black tracking-widest uppercase truncate">{label}</span>}
        {active && !collapsed && (
          <motion.div 
            layoutId="sidebar-active"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#fff]" 
          />
        )}
      </button>

      {/* Tooltip for collapsed state */}
      <AnimatePresence>
        {collapsed && isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-lg whitespace-nowrap z-[100] shadow-xl pointer-events-none border border-white/10"
          >
            {label}
            <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45 border-l border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  onLogout: () => void;
}

export function Sidebar({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, onLogout }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="hidden md:flex border-r border-border-subtle bg-white flex-col pt-10 relative transition-all duration-300 z-50 shrink-0"
      >
        <div className="px-10 mb-16">
          <h1 className="text-3xl font-black tracking-tighter italic text-gradient">DAUANA</h1>
          {isSidebarOpen && <p className="text-[9px] uppercase tracking-[0.4em] text-muted mt-2 font-black opacity-30">Sistema 2026</p>}
        </div>

        <nav className="flex-1 px-5 space-y-2">
          <NavItem 
            icon={<CalendarIcon className="w-4 h-4" />} 
            label="Início" 
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

        <div className="p-8 border-t border-border-subtle">
          <div className="flex items-center gap-4 group cursor-pointer">
             <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-110 transition-transform duration-300 text-neutral-400">
              DA
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-black/90 truncate">Dauana A.</p>
                <p className="text-[9px] text-muted uppercase tracking-widest font-black truncate opacity-50">Conta Premium</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onLogout}
            className={cn(
              "flex items-center gap-3 w-full p-3.5 rounded-xl transition-all duration-300 group hover:bg-red-50 text-muted hover:text-red-500 mt-6",
              !isSidebarOpen && "justify-center"
            )}
            title="Sair do Sistema"
          >
            <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            {isSidebarOpen && <span className="text-[10px] font-black tracking-widest uppercase">Encerrar Sessão</span>}
          </button>
        </div>

        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-20 bg-black text-white p-1.5 rounded-xl border border-black hover:scale-110 active:scale-95 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-[60]"
        >
          <Menu className="w-4 h-4" />
        </button>
      </motion.aside>

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-white/80 backdrop-blur-xl sticky top-0 z-[100] w-full">
        <h1 className="text-xl font-black italic text-gradient">DAUANA</h1>
        <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center font-black text-[10px] text-neutral-400">
          DA
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-2xl border-t border-border-subtle px-6 py-4 flex justify-between items-center safe-area-bottom">
        <MobileNavItem 
          icon={<CalendarIcon className="w-5 h-5" />} 
          label="Início"
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
        />
        <MobileNavItem 
          icon={<Clock className="w-5 h-5" />} 
          label="Calendário"
          active={activeTab === 'calendar'} 
          onClick={() => setActiveTab('calendar')} 
        />
        <MobileNavItem 
          icon={<Users className="w-5 h-5" />} 
          label="Clientes"
          active={activeTab === 'clients'} 
          onClick={() => setActiveTab('clients')} 
        />
        <MobileNavItem 
          icon={<Settings className="w-5 h-5" />} 
          label="Serviços"
          active={activeTab === 'services'} 
          onClick={() => setActiveTab('services')} 
        />
        <MobileNavItem 
          icon={<LogOut className="w-5 h-5" />} 
          label="Sair"
          active={false} 
          onClick={onLogout} 
        />
      </nav>
    </>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "p-3 rounded-2xl transition-all relative",
          active ? "text-black bg-neutral-100 shadow-sm" : "text-muted"
        )}
      >
        {icon}
        {active && (
          <motion.div 
            layoutId="mobile-nav-active"
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-black"
          />
        )}
      </button>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -45 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black uppercase tracking-widest px-2 py-1.5 rounded-lg whitespace-nowrap z-[110] shadow-xl pointer-events-none border border-white/10"
          >
            {label}
            <div className="absolute bottom-[-3px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
