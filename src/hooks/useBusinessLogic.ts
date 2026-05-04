import { useMemo } from 'react';
import { Appointment, Service, Expense, Client } from '../types';
import { 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  parseISO, 
  subMonths, 
  format,
  isAfter,
  startOfDay
} from 'date-fns';

export function useBusinessLogic(
  appointments: Appointment[], 
  services: Service[], 
  expenses: Expense[]
) {
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonthInterval = { start: startOfMonth(now), end: endOfMonth(now) };
    const prevMonthInterval = { 
      start: startOfMonth(subMonths(now, 1)), 
      end: endOfMonth(subMonths(now, 1)) 
    };

    const getRevenue = (interval: { start: Date, end: Date }) => {
      return appointments
        .filter(app => {
          const appDate = parseISO(app.date);
          return app.status === 'completed' && isWithinInterval(appDate, interval);
        })
        .reduce((acc, app) => {
          const service = services.find(s => s.name === app.service);
          return acc + (service?.price || 0);
        }, 0);
    };

    const curMonthRevenue = Number(getRevenue(currentMonthInterval));
    const prevMonthRevenue = Number(getRevenue(prevMonthInterval));

    // Forecasting revenue (including scheduled)
    const forecastRevenue = appointments
      .filter(app => {
        const appDate = parseISO(app.date);
        return (app.status === 'scheduled' || app.status === 'completed') && 
               isWithinInterval(appDate, currentMonthInterval);
      })
      .reduce((acc, app) => {
        const service = services.find(s => s.name === app.service);
        return acc + (service?.price || 0);
      }, 0);

    const curMonthExpenses = expenses
      .filter(exp => isWithinInterval(parseISO(exp.date), currentMonthInterval))
      .reduce((acc, exp) => acc + exp.amount, 0);

    // Most profitable services
    const serviceProfitability = services.map(service => {
      const count = appointments.filter(a => a.service === service.name && a.status === 'completed').length;
      return {
        name: service.name,
        revenue: count * service.price,
        count
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // VIP Clients
    const clientStats = appointments.reduce((acc, app) => {
      if (app.status === 'completed') {
        acc[app.clientName] = (acc[app.clientName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const vipClients = Object.entries(clientStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      curMonthRevenue,
      prevMonthRevenue,
      forecastRevenue,
      forecastBalance: forecastRevenue - curMonthExpenses,
      curMonthExpenses,
      serviceProfitability,
      vipClients,
      growth: prevMonthRevenue > 0 ? ((curMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100 : 0
    };
  }, [appointments, services, expenses]);

  const cashFlowData = useMemo(() => {
    const days = 30;
    const data = [];
    const today = startOfDay(new Date());

    for (let i = -15; i <= 15; i++) {
        const date = addDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        const dayRevenue = appointments
            .filter(a => a.date === dateStr && (a.status === 'completed' || a.status === 'scheduled'))
            .reduce((acc, a) => acc + (services.find(s => s.name === a.service)?.price || 0), 0);
            
        const dayExpense = expenses
            .filter(e => e.date === dateStr)
            .reduce((acc, e) => acc + e.amount, 0);

        data.push({
            date: format(date, 'dd/MM'),
            revenue: dayRevenue,
            expense: dayExpense,
            balance: dayRevenue - dayExpense
        });
    }
    return data;
  }, [appointments, services, expenses]);

  return { stats, cashFlowData };
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
