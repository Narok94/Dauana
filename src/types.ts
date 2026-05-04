export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  username: string;
  role: Role;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientId?: string;
  service: string;
  date: string; // ISO string
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  preferences?: string;
  lastVisit?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}
