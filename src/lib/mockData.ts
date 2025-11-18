import type { DashboardData, LiveCall, AppointmentDot, RecentActivity } from '../types';
import { getRandomInt, getRandomFloat } from './utils';

const CALLER_NAMES = [
  'John Doe', 'Sarah Miller', 'Mike Johnson', 'Emily Davis',
  'Robert Wilson', 'Lisa Anderson', 'David Brown', 'Jennifer Taylor',
  'Michael Clark', 'Amanda White', 'James Martinez', 'Jessica Lee'
];

const CALL_DESCRIPTIONS = [
  'Lawn mowing service inquiry',
  'Landscape design consultation',
  'Tree trimming request',
  'Spring cleanup booking',
  'Irrigation system repair',
  'Hedge trimming service',
  'Garden maintenance plan',
  'Mulch installation quote'
];

function generateTrendData(baseValue: number, points: number = 7): number[] {
  const trend: number[] = [];
  let current = baseValue;

  for (let i = 0; i < points; i++) {
    const change = getRandomFloat(-5, 5, 1);
    current = Math.max(60, Math.min(100, current + change));
    trend.push(parseFloat(current.toFixed(1)));
  }

  return trend;
}

function generateAppointmentDots(count: number = 50): AppointmentDot[] {
  const dots: AppointmentDot[] = [];
  const statuses: AppointmentDot['status'][] = ['completed', 'pending', 'cancelled'];

  for (let i = 0; i < count; i++) {
    dots.push({
      id: `dot-${i}`,
      status: statuses[getRandomInt(0, 2)],
      timestamp: Date.now() - getRandomInt(0, 86400000), // Last 24 hours
    });
  }

  return dots.sort((a, b) => a.timestamp - b.timestamp);
}

function generateLiveCalls(count: number = 2): LiveCall[] {
  const calls: LiveCall[] = [];
  const statuses: LiveCall['status'][] = ['active', 'scheduling', 'hold'];

  for (let i = 0; i < count; i++) {
    calls.push({
      id: `call-${Date.now()}-${i}`,
      caller: CALLER_NAMES[getRandomInt(0, CALLER_NAMES.length - 1)],
      status: statuses[getRandomInt(0, statuses.length - 1)],
      duration: getRandomInt(30, 300),
      phone: `(${getRandomInt(200, 999)}) ${getRandomInt(200, 999)}-${getRandomInt(1000, 9999)}`,
    });
  }

  return calls;
}

let dashboardData: DashboardData = {
  callMetrics: {
    answeredRate: 94.7,
    missedRecovery: 78.3,
    totalToday: 47,
    avgDuration: '3:24',
    trend: generateTrendData(94.7),
  },
  bookingMetrics: {
    scheduled: 12,
    confirmed: 8,
    pending: 3,
    cancelled: 1,
    conversionRate: 66.7,
    appointments: generateAppointmentDots(50),
  },
  liveActivity: generateLiveCalls(2),
  aiPerformance: {
    understanding: 96,
    resolution: 84,
    transfer: 12,
    satisfaction: 92,
  },
};

export function getDashboardData(): DashboardData {
  return { ...dashboardData };
}

export function updateDashboardData(): DashboardData {
  // Simulate real-time updates
  const shouldUpdateMetrics = Math.random() > 0.7;
  const shouldUpdateCalls = Math.random() > 0.6;
  const shouldUpdateBookings = Math.random() > 0.8;

  if (shouldUpdateMetrics) {
    dashboardData.callMetrics.answeredRate = getRandomFloat(90, 98, 1);
    dashboardData.callMetrics.missedRecovery = getRandomFloat(70, 85, 1);
    dashboardData.callMetrics.totalToday += getRandomInt(0, 2);

    // Update trend (shift left and add new value)
    dashboardData.callMetrics.trend.shift();
    dashboardData.callMetrics.trend.push(dashboardData.callMetrics.answeredRate);
  }

  if (shouldUpdateCalls) {
    // Update existing call durations
    dashboardData.liveActivity = dashboardData.liveActivity.map(call => ({
      ...call,
      duration: call.duration + getRandomInt(1, 5),
    }));

    // Sometimes add a new call
    if (Math.random() > 0.7 && dashboardData.liveActivity.length < 4) {
      dashboardData.liveActivity.push(generateLiveCalls(1)[0]);
    }

    // Sometimes remove a call
    if (Math.random() > 0.8 && dashboardData.liveActivity.length > 1) {
      dashboardData.liveActivity.shift();
    }
  }

  if (shouldUpdateBookings) {
    dashboardData.bookingMetrics.scheduled += getRandomInt(0, 1);
    dashboardData.bookingMetrics.confirmed += getRandomInt(0, 1);
    dashboardData.bookingMetrics.conversionRate =
      (dashboardData.bookingMetrics.confirmed / dashboardData.bookingMetrics.scheduled) * 100;

    // Add new appointment dot
    const statuses: AppointmentDot['status'][] = ['completed', 'pending', 'cancelled'];
    dashboardData.bookingMetrics.appointments.push({
      id: `dot-${Date.now()}`,
      status: statuses[getRandomInt(0, 2)],
      timestamp: Date.now(),
    });

    // Keep only last 50 appointments
    if (dashboardData.bookingMetrics.appointments.length > 50) {
      dashboardData.bookingMetrics.appointments.shift();
    }
  }

  // Slightly vary AI performance
  dashboardData.aiPerformance.understanding = Math.min(100, dashboardData.aiPerformance.understanding + getRandomFloat(-1, 1, 0));
  dashboardData.aiPerformance.resolution = Math.min(100, dashboardData.aiPerformance.resolution + getRandomFloat(-1, 1, 0));
  dashboardData.aiPerformance.satisfaction = Math.min(100, dashboardData.aiPerformance.satisfaction + getRandomFloat(-1, 1, 0));

  return { ...dashboardData };
}

export function generateRecentActivity(count: number = 10): RecentActivity[] {
  const activities: RecentActivity[] = [];
  const types: RecentActivity['type'][] = ['call', 'booking', 'message'];
  const statuses: RecentActivity['status'][] = ['success', 'pending', 'failed'];

  for (let i = 0; i < count; i++) {
    const type = types[getRandomInt(0, types.length - 1)];
    activities.push({
      id: `activity-${i}`,
      type,
      caller: CALLER_NAMES[getRandomInt(0, CALLER_NAMES.length - 1)],
      description: CALL_DESCRIPTIONS[getRandomInt(0, CALL_DESCRIPTIONS.length - 1)],
      timestamp: Date.now() - getRandomInt(0, 3600000), // Last hour
      status: statuses[getRandomInt(0, statuses.length - 1)],
    });
  }

  return activities.sort((a, b) => b.timestamp - a.timestamp);
}

// Simulate WebSocket-like updates
export function subscribeToUpdates(callback: (data: DashboardData) => void): () => void {
  const interval = setInterval(() => {
    const updatedData = updateDashboardData();
    callback(updatedData);
  }, 3000); // Update every 3 seconds

  return () => clearInterval(interval);
}
