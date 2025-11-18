import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { PhoneIncoming, TrendingUp } from 'lucide-react';
import type { CallMetrics } from '../../types';
import { useCountUp } from '../../hooks/useCountUp';

interface CallMetricsCardProps {
  data: CallMetrics;
}

export function CallMetricsCard({ data }: CallMetricsCardProps) {
  const answeredRate = useCountUp({ end: data.answeredRate, decimals: 1, duration: 1500 });
  const missedRecovery = useCountUp({ end: data.missedRecovery, decimals: 1, duration: 1500 });

  const chartData = data.trend.map((value, index) => ({
    name: `Day ${index + 1}`,
    value,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-gradient rounded-2xl p-6 hover-lift relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-green/10 flex items-center justify-center">
            <PhoneIncoming className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              Call Metrics
            </h3>
          </div>
        </div>
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-2 h-2 rounded-full bg-accent-green"
        />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-6 mb-6 relative z-10">
        <div>
          <div className="text-4xl font-bold text-gradient mb-1">
            {answeredRate.toFixed(1)}%
          </div>
          <div className="text-sm text-text-secondary">Answered Rate</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-accent-green" />
            <span className="text-xs text-accent-green">+2.3% vs last week</span>
          </div>
        </div>

        <div>
          <div className="text-4xl font-bold text-white mb-1">
            {missedRecovery.toFixed(1)}%
          </div>
          <div className="text-sm text-text-secondary">Missed Recovery</div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3 text-accent-blue" />
            <span className="text-xs text-accent-blue">+1.8% vs last week</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative z-10 -mx-2">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
          className="h-24"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#4ADE80" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#A3A3A3', fontSize: '12px' }}
                itemStyle={{ color: '#4ADE80', fontSize: '14px', fontWeight: 'bold' }}
                cursor={{ stroke: '#4ADE80', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={2}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#4ADE80',
                  stroke: '#0A0A0A',
                  strokeWidth: 2,
                  className: 'glow-green',
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5 relative z-10">
        <div>
          <div className="text-xl font-bold text-white">{data.totalToday}</div>
          <div className="text-xs text-text-secondary">Calls Today</div>
        </div>
        <div>
          <div className="text-xl font-bold text-white">{data.avgDuration}</div>
          <div className="text-xs text-text-secondary">Avg Duration</div>
        </div>
      </div>
    </motion.div>
  );
}
