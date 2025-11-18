import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';
import type { BookingMetrics } from '../../types';
import { useCountUp } from '../../hooks/useCountUp';
import { cn } from '../../lib/utils';

interface BookingMetricsCardProps {
  data: BookingMetrics;
}

export function BookingMetricsCard({ data }: BookingMetricsCardProps) {
  const conversionRate = useCountUp({ end: data.conversionRate, decimals: 1, duration: 1500 });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-accent-green';
      case 'pending':
        return 'bg-accent-orange';
      case 'cancelled':
        return 'bg-gray-600';
      default:
        return 'bg-gray-600';
    }
  };

  const statusCounts = {
    completed: data.appointments.filter((a) => a.status === 'completed').length,
    pending: data.appointments.filter((a) => a.status === 'pending').length,
    cancelled: data.appointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card-gradient rounded-2xl p-6 hover-lift relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-accent-orange" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              Booking Metrics
            </h3>
          </div>
        </div>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.5, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-accent-orange"
        />
      </div>

      {/* Main Conversion Rate */}
      <div className="mb-6 relative z-10">
        <div className="text-4xl font-bold text-white mb-1">
          {conversionRate.toFixed(1)}%
        </div>
        <div className="text-sm text-text-secondary">Conversion Rate</div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="w-3 h-3 text-accent-orange" />
          <span className="text-xs text-accent-orange">+3.2% vs last week</span>
        </div>
      </div>

      {/* Appointment Dots Grid */}
      <div className="relative z-10 mb-6">
        <div className="grid grid-cols-10 gap-2">
          {data.appointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.01,
                type: 'spring',
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{
                scale: 1.5,
                zIndex: 10,
              }}
              className={cn(
                'w-full aspect-square rounded-full transition-all duration-300',
                getStatusColor(appointment.status),
                appointment.status === 'completed' && 'shadow-lg shadow-accent-green/30',
                appointment.status === 'pending' && 'animate-pulse'
              )}
            />
          ))}
        </div>
      </div>

      {/* Legend and Stats */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-green" />
            <span className="text-sm text-text-secondary">Completed</span>
          </div>
          <span className="text-sm font-semibold text-white">{statusCounts.completed}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-orange animate-pulse" />
            <span className="text-sm text-text-secondary">Pending</span>
          </div>
          <span className="text-sm font-semibold text-white">{statusCounts.pending}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <span className="text-sm text-text-secondary">Cancelled</span>
          </div>
          <span className="text-sm font-semibold text-white">{statusCounts.cancelled}</span>
        </div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 relative z-10">
        <div>
          <div className="text-xl font-bold text-white">{data.scheduled}</div>
          <div className="text-xs text-text-secondary">Total Scheduled</div>
        </div>
        <div>
          <div className="text-xl font-bold text-accent-green">{data.confirmed}</div>
          <div className="text-xs text-text-secondary">Confirmed</div>
        </div>
      </div>
    </motion.div>
  );
}
