export interface CallMetrics {
  answeredRate: number;
  missedRecovery: number;
  totalToday: number;
  avgDuration: string;
  trend: number[];
}

export interface BookingMetrics {
  scheduled: number;
  confirmed: number;
  pending: number;
  cancelled: number;
  conversionRate: number;
  appointments: AppointmentDot[];
}

export interface AppointmentDot {
  id: string;
  status: 'completed' | 'pending' | 'cancelled';
  timestamp: number;
}

export interface LiveCall {
  id: string;
  caller: string;
  status: 'active' | 'scheduling' | 'hold' | 'transferred';
  duration: number;
  phone?: string;
}

export interface AIPerformance {
  understanding: number;
  resolution: number;
  transfer: number;
  satisfaction: number;
}

export interface DashboardData {
  callMetrics: CallMetrics;
  bookingMetrics: BookingMetrics;
  liveActivity: LiveCall[];
  aiPerformance: AIPerformance;
}

export interface RecentActivity {
  id: string;
  type: 'call' | 'booking' | 'message';
  caller: string;
  description: string;
  timestamp: number;
  status: 'success' | 'pending' | 'failed';
}

export type CallStatus = 'active' | 'scheduling' | 'hold' | 'transferred';
export type AppointmentStatus = 'completed' | 'pending' | 'cancelled';
