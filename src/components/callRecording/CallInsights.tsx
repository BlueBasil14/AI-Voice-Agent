import { motion } from 'framer-motion';
import {
  Calendar,
  MessageSquare,
  AlertCircle,
  ThumbsUp,
  HelpCircle,
  XCircle,
} from 'lucide-react';
import type { CallInsight } from '../../types/callRecording';
import { formatDuration } from '../../lib/utils';
import { cn } from '../../lib/utils';

interface CallInsightsProps {
  insights: CallInsight[];
  onInsightClick?: (timestamp: number) => void;
}

export function CallInsights({ insights, onInsightClick }: CallInsightsProps) {
  const getInsightIcon = (type: CallInsight['type']) => {
    switch (type) {
      case 'booking':
        return Calendar;
      case 'question':
        return HelpCircle;
      case 'complaint':
        return AlertCircle;
      case 'praise':
        return ThumbsUp;
      case 'objection':
        return XCircle;
      default:
        return MessageSquare;
    }
  };

  const getInsightColor = (type: CallInsight['type']) => {
    switch (type) {
      case 'booking':
        return {
          bg: 'bg-accent-green/10',
          border: 'border-accent-green/20',
          text: 'text-accent-green',
          icon: 'text-accent-green',
        };
      case 'question':
        return {
          bg: 'bg-accent-blue/10',
          border: 'border-accent-blue/20',
          text: 'text-accent-blue',
          icon: 'text-accent-blue',
        };
      case 'complaint':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          text: 'text-red-500',
          icon: 'text-red-500',
        };
      case 'praise':
        return {
          bg: 'bg-accent-purple/10',
          border: 'border-accent-purple/20',
          text: 'text-accent-purple',
          icon: 'text-accent-purple',
        };
      case 'objection':
        return {
          bg: 'bg-accent-orange/10',
          border: 'border-accent-orange/20',
          text: 'text-accent-orange',
          icon: 'text-accent-orange',
        };
    }
  };

  const getSeverityBadge = (severity?: string) => {
    if (!severity) return null;

    const colors = {
      low: 'bg-accent-green/20 text-accent-green',
      medium: 'bg-accent-orange/20 text-accent-orange',
      high: 'bg-red-500/20 text-red-500',
    };

    return (
      <span className={cn('text-xs px-2 py-0.5 rounded-full', colors[severity as keyof typeof colors])}>
        {severity}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-white">Key Insights</h3>
        <p className="text-xs text-text-secondary">
          {insights.length} key moments detected by AI
        </p>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <div className="text-center py-8 text-text-secondary">
          <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No key insights detected</p>
        </div>
      ) : (
        <div className="space-y-2">
          {insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            const colors = getInsightColor(insight.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onInsightClick?.(insight.timestamp)}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all duration-300',
                  colors.bg,
                  colors.border,
                  'hover:border-white/20 hover:scale-[1.02]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', colors.bg)}>
                    <Icon className={cn('w-4 h-4', colors.icon)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-xs font-semibold uppercase', colors.text)}>
                        {insight.type}
                      </span>
                      <span className="text-xs text-text-secondary font-mono">
                        {formatDuration(insight.timestamp)}
                      </span>
                      {getSeverityBadge(insight.severity)}
                    </div>

                    <p className="text-sm text-white">{insight.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
