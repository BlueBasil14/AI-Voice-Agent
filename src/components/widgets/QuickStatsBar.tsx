import { motion } from 'framer-motion';
import { DollarSign, Users, PhoneCall, Clock } from 'lucide-react';
import { useCountUp } from '../../hooks/useCountUp';

interface QuickStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: React.ComponentType<any>;
  color: string;
  change: number;
}

export function QuickStatsBar() {
  const stats: QuickStat[] = [
    {
      label: 'Revenue (MTD)',
      value: 12450,
      prefix: '$',
      icon: DollarSign,
      color: 'text-accent-green',
      change: 12.5,
    },
    {
      label: 'Active Customers',
      value: 284,
      icon: Users,
      color: 'text-accent-blue',
      change: 8.2,
    },
    {
      label: 'Total Calls',
      value: 1247,
      icon: PhoneCall,
      color: 'text-accent-orange',
      change: 5.4,
    },
    {
      label: 'Avg Response Time',
      value: 45,
      suffix: 's',
      icon: Clock,
      color: 'text-accent-purple',
      change: -3.2,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const countValue = useCountUp({ end: stat.value, decimals: 0, duration: 1500 });

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            className="card-gradient rounded-xl p-4 hover-lift relative overflow-hidden group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change > 0
                  ? 'bg-accent-green/10 text-accent-green'
                  : 'bg-red-500/10 text-red-500'
              }`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </div>
            </div>

            <div className="text-2xl font-bold text-white mb-1">
              {stat.prefix}{countValue.toLocaleString()}{stat.suffix}
            </div>
            <div className="text-xs text-text-secondary">{stat.label}</div>

            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 ${stat.color.replace('text-', 'bg-')}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
          </motion.div>
        );
      })}
    </div>
  );
}
