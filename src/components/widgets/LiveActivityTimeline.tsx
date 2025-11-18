import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Phone, Clock } from 'lucide-react';
import type { LiveCall } from '../../types';
import { getInitials, formatDuration } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface LiveActivityTimelineProps {
  calls: LiveCall[];
}

export function LiveActivityTimeline({ calls }: LiveActivityTimelineProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-accent-green';
      case 'scheduling':
        return 'bg-accent-blue';
      case 'hold':
        return 'bg-accent-orange';
      case 'transferred':
        return 'bg-accent-purple';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card-gradient rounded-2xl p-6 hover-lift relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent-blue" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              Live Activity
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-2 h-2 rounded-full bg-accent-blue"
          />
          <span className="text-xs text-text-secondary">{calls.length} active</span>
        </div>
      </div>

      {/* Live Calls */}
      <div className="space-y-4 relative z-10">
        <AnimatePresence mode="popLayout">
          {calls.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <Phone className="w-12 h-12 text-text-secondary/30 mx-auto mb-3" />
              <p className="text-sm text-text-secondary">No active calls</p>
            </motion.div>
          ) : (
            calls.map((call, index) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                  delay: index * 0.05,
                }}
                layout
                className="bg-bg-secondary/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center font-semibold text-white text-sm">
                    {getInitials(call.caller)}
                  </div>

                  {/* Caller Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{call.caller}</div>
                    {call.phone && (
                      <div className="text-xs text-text-secondary">{call.phone}</div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5',
                      call.status === 'active' && 'bg-accent-green/10 text-accent-green',
                      call.status === 'scheduling' && 'bg-accent-blue/10 text-accent-blue',
                      call.status === 'hold' && 'bg-accent-orange/10 text-accent-orange',
                      call.status === 'transferred' && 'bg-accent-purple/10 text-accent-purple'
                    )}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={cn('w-1.5 h-1.5 rounded-full', getStatusColor(call.status))}
                    />
                    {getStatusLabel(call.status)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(call.duration)}</span>
                    </div>
                    <span className="font-medium">
                      {Math.min(100, Math.round((call.duration / 300) * 100))}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-bg-primary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(100, (call.duration / 300) * 100)}%`,
                      }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={cn(
                        'h-full rounded-full',
                        call.status === 'active' && 'bg-gradient-to-r from-accent-green to-accent-blue',
                        call.status === 'scheduling' && 'bg-gradient-to-r from-accent-blue to-accent-purple',
                        call.status === 'hold' && 'bg-accent-orange',
                        call.status === 'transferred' && 'bg-accent-purple'
                      )}
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {calls.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-white/5 relative z-10"
        >
          <div className="text-xs text-text-secondary text-center">
            Real-time updates via WebSocket
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
