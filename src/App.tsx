import { useEffect, useState } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { QuickStatsBar } from './components/widgets/QuickStatsBar';
import { CallMetricsCard } from './components/widgets/CallMetricsCard';
import { BookingMetricsCard } from './components/widgets/BookingMetricsCard';
import { LiveActivityTimeline } from './components/widgets/LiveActivityTimeline';
import { AIPerformanceMatrix } from './components/widgets/AIPerformanceMatrix';
import { RecentActivityFeed } from './components/widgets/RecentActivityFeed';
import { getDashboardData, subscribeToUpdates } from './lib/mockData';
import type { DashboardData } from './types';
import { motion } from 'framer-motion';

function App() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(getDashboardData());

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToUpdates((data) => {
      setDashboardData(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <DashboardLayout>
      {/* Quick Stats Bar */}
      <QuickStatsBar />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {/* Call Metrics */}
        <motion.div className="animate-stagger-1">
          <CallMetricsCard data={dashboardData.callMetrics} />
        </motion.div>

        {/* Booking Metrics */}
        <motion.div className="animate-stagger-2">
          <BookingMetricsCard data={dashboardData.bookingMetrics} />
        </motion.div>

        {/* Live Activity */}
        <motion.div className="animate-stagger-3">
          <LiveActivityTimeline calls={dashboardData.liveActivity} />
        </motion.div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Performance */}
        <motion.div className="animate-stagger-4">
          <AIPerformanceMatrix data={dashboardData.aiPerformance} />
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentActivityFeed />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

export default App;
