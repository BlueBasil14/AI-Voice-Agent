import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, Calendar, MessageSquare, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { RecentActivity } from '../../types';
import { cn } from '../../lib/utils';
import { useEffect, useState } from 'react';
import { generateRecentActivity } from '../../lib/mockData';

export function RecentActivityFeed() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);

  useEffect(() => {
    setActivities(generateRecentActivity(8));
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return PhoneCall;
      case 'booking':
        return Calendar;
      case 'message':
        return MessageSquare;
      default:
        return PhoneCall;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return CheckCircle2;
      case 'pending':
        return Clock;
      case 'failed':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-accent-green';
      case 'pending':
        return 'text-accent-orange';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-text-secondary';
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card-gradient rounded-2xl p-6 hover-lift relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <button className="text-sm text-accent-blue hover:text-accent-blue/80 transition-colors">
          View All
        </button>
      </div>

      {/* Activity List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        <AnimatePresence>
          {activities.map((activity, index) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);
            const statusColor = getStatusColor(activity.status);

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-bg-secondary/30 hover:bg-bg-secondary/50 transition-colors duration-200 border border-transparent hover:border-white/5"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-bg-card flex items-center justify-center flex-shrink-0 border border-white/5">
                  <ActivityIcon className="w-4 h-4 text-text-secondary" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-white text-sm truncate">
                      {activity.caller}
                    </p>
                    <span className="text-xs text-text-secondary whitespace-nowrap">
                      {getTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary truncate">
                    {activity.description}
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  <StatusIcon className={cn('w-4 h-4', statusColor)} />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
