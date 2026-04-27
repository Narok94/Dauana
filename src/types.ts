export interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string; // ISO string
  time: string;
  status: 'scheduled' | 'cancelled' | 'completed';
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}
