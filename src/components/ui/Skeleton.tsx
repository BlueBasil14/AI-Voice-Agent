import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('skeleton rounded-lg', className)} />
  );
}

export function CardSkeleton() {
  return (
    <div className="card-gradient rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-32 h-4" />
        </div>
        <Skeleton className="w-2 h-2 rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="w-24 h-10" />
        <Skeleton className="w-full h-24" />
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-12" />
          <Skeleton className="flex-1 h-12" />
        </div>
      </div>
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="card-gradient rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <Skeleton className="w-12 h-6 rounded-full" />
      </div>
      <Skeleton className="w-20 h-8 mb-1" />
      <Skeleton className="w-full h-3" />
    </div>
  );
}

export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-bg-primary flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center font-display font-bold text-2xl"
        >
          VP
        </motion.div>
        <motion.h2
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl font-semibold text-white mb-2"
        >
          Loading Dashboard...
        </motion.h2>
        <p className="text-sm text-text-secondary">Preparing your data</p>
      </div>
    </motion.div>
  );
}
