import { motion } from 'framer-motion';
import { Brain, MessageSquare, CheckCircle2, UserCheck, ArrowRightLeft } from 'lucide-react';
import type { AIPerformance } from '../../types';
import { useCountUp } from '../../hooks/useCountUp';
import { cn } from '../../lib/utils';

interface AIPerformanceMatrixProps {
  data: AIPerformance;
}

interface PerformancePill {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  glowColor: string;
}

export function AIPerformanceMatrix({ data }: AIPerformanceMatrixProps) {
  const understanding = useCountUp({ end: data.understanding, decimals: 0, duration: 1500 });
  const resolution = useCountUp({ end: data.resolution, decimals: 0, duration: 1500 });
  const transfer = useCountUp({ end: data.transfer, decimals: 0, duration: 1500 });
  const satisfaction = useCountUp({ end: data.satisfaction, decimals: 0, duration: 1500 });

  const pills: PerformancePill[] = [
    {
      label: 'Understanding',
      value: understanding,
      icon: MessageSquare,
      color: 'text-accent-green',
      bgColor: 'bg-accent-green/10',
      glowColor: 'hover:shadow-accent-green/30',
    },
    {
      label: 'Resolution',
      value: resolution,
      icon: CheckCircle2,
      color: 'text-accent-blue',
      bgColor: 'bg-accent-blue/10',
      glowColor: 'hover:shadow-accent-blue/30',
    },
    {
      label: 'Transfer Rate',
      value: transfer,
      icon: ArrowRightLeft,
      color: 'text-accent-orange',
      bgColor: 'bg-accent-orange/10',
      glowColor: 'hover:shadow-accent-orange/30',
    },
    {
      label: 'Satisfaction',
      value: satisfaction,
      icon: UserCheck,
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/10',
      glowColor: 'hover:shadow-accent-purple/30',
    },
  ];

  const getPerformanceLevel = (value: number) => {
    if (value >= 90) return 'Excellent';
    if (value >= 75) return 'Good';
    if (value >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 90) return 'text-accent-green';
    if (value >= 75) return 'text-accent-blue';
    if (value >= 60) return 'text-accent-orange';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-gradient rounded-2xl p-6 hover-lift relative overflow-hidden group"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-accent-purple" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
              AI Insights
            </h3>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20">
          <span className="text-xs font-semibold text-accent-purple">GPT-4 Turbo</span>
        </div>
      </div>

      {/* Performance Pills */}
      <div className="grid grid-cols-2 gap-4 relative z-10">
        {pills.map((pill, index) => {
          const Icon = pill.icon;
          const performanceLevel = getPerformanceLevel(pill.value);
          const performanceColor = getPerformanceColor(pill.value);

          return (
            <motion.div
              key={pill.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.1 * index,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
              }}
              className={cn(
                'relative p-4 rounded-xl border border-white/5 transition-all duration-300 cursor-pointer',
                pill.bgColor,
                pill.glowColor,
                'hover:shadow-xl hover:border-white/10'
              )}
            >
              {/* Floating animation */}
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {/* Icon and Label */}
                <div className="flex items-center justify-between mb-3">
                  <Icon className={cn('w-5 h-5', pill.color)} />
                  <span className="text-xs text-text-secondary">{pill.label}</span>
                </div>

                {/* Value */}
                <div className="mb-2">
                  <div className={cn('text-3xl font-bold', pill.color)}>
                    {Math.round(pill.value)}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-bg-primary/50 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pill.value}%` }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 1, ease: 'easeOut' }}
                    className={cn(
                      'h-full rounded-full',
                      pill.value >= 90 && 'bg-accent-green',
                      pill.value >= 75 && pill.value < 90 && 'bg-accent-blue',
                      pill.value >= 60 && pill.value < 75 && 'bg-accent-orange',
                      pill.value < 60 && 'bg-red-500'
                    )}
                  />
                </div>

                {/* Performance Level */}
                <div className={cn('text-xs font-medium', performanceColor)}>
                  {performanceLevel}
                </div>
              </motion.div>

              {/* Glow effect on hover */}
              <div
                className={cn(
                  'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl',
                  pill.value >= 90 && 'bg-accent-green',
                  pill.value >= 75 && pill.value < 90 && 'bg-accent-blue',
                  pill.value >= 60 && pill.value < 75 && 'bg-accent-orange',
                  pill.value < 60 && 'bg-red-500'
                )}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 pt-4 border-t border-white/5 relative z-10"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Overall AI Performance</span>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-gradient">
              {Math.round((understanding + resolution + satisfaction - transfer) / 3)}%
            </div>
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Brain className="w-5 h-5 text-accent-purple" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
