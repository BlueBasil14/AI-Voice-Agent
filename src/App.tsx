import { useEffect, useState, useRef, createContext, useContext } from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { QuickStatsBar } from './components/widgets/QuickStatsBar';
import { CallMetricsCard } from './components/widgets/CallMetricsCard';
import { BookingMetricsCard } from './components/widgets/BookingMetricsCard';
import { LiveActivityTimeline } from './components/widgets/LiveActivityTimeline';
import { AIPerformanceMatrix } from './components/widgets/AIPerformanceMatrix';
import { RecentActivityFeed } from './components/widgets/RecentActivityFeed';
import { SettingsPanel } from './components/ui/SettingsPanel';
import { KeyboardShortcutsHelp } from './components/ui/KeyboardShortcutsHelp';
import { LoadingScreen } from './components/ui/Skeleton';
import { CallLibrary } from './components/callRecording/CallLibrary';
import { getDashboardData, subscribeToUpdates } from './lib/mockData';
import { celebrateBooking } from './lib/confetti';
import type { DashboardData } from './types';
import { motion } from 'framer-motion';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

type ViewType = 'dashboard' | 'recordings';

const ViewContext = createContext<{
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}>({
  currentView: 'dashboard',
  setCurrentView: () => {},
});

export const useView = () => useContext(ViewContext);

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(getDashboardData());
  const [isLoading, setIsLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { showToast } = useToast();
  const { settings } = useSettings();
  const prevDataRef = useRef<DashboardData | null>(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'k',
      ctrl: true,
      description: 'Open search',
      callback: () => {
        showToast({
          type: 'info',
          title: 'Search Coming Soon',
          message: 'Search functionality will be available in the next update',
        });
      },
    },
    {
      key: ',',
      ctrl: true,
      description: 'Open settings',
      callback: () => setSettingsOpen(true),
    },
    {
      key: 'r',
      ctrl: true,
      description: 'Refresh data',
      callback: () => {
        showToast({
          type: 'success',
          title: 'Data Refreshed',
          message: 'Dashboard data has been updated',
        });
      },
    },
    {
      key: '?',
      shift: true,
      description: 'Show keyboard shortcuts',
      callback: () => setHelpOpen(true),
    },
  ]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!settings.autoRefresh) return;

    const unsubscribe = subscribeToUpdates((data) => {
      const prevData = prevDataRef.current;

      // Check for new calls
      if (prevData && data.liveActivity.length > prevData.liveActivity.length) {
        if (settings.notificationsEnabled) {
          showToast({
            type: 'call',
            title: 'New Call Incoming',
            message: `${data.liveActivity[data.liveActivity.length - 1].caller} is calling`,
            duration: 4000,
          });
        }
      }

      // Check for new bookings
      if (prevData && data.bookingMetrics.confirmed > prevData.bookingMetrics.confirmed) {
        if (settings.notificationsEnabled) {
          showToast({
            type: 'booking',
            title: 'Appointment Confirmed!',
            message: 'A new appointment has been successfully booked',
            duration: 5000,
          });
        }
        if (settings.celebrationsEnabled) {
          celebrateBooking();
        }
      }

      prevDataRef.current = data;
      setDashboardData(data);
    });

    return () => {
      unsubscribe();
    };
  }, [settings, showToast]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ViewContext.Provider value={{ currentView, setCurrentView }}>
      <DashboardLayout>
        {currentView === 'dashboard' ? (
          <>
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
          </>
        ) : (
          <CallLibrary />
        )}
      </DashboardLayout>

      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {/* Keyboard Shortcuts Help */}
      <KeyboardShortcutsHelp isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      {/* Welcome Toast on First Load */}
      {!isLoading && (
        <div style={{ display: 'none' }}>
          {setTimeout(() => {
            showToast({
              type: 'success',
              title: 'Welcome to VoiceBot Pro',
              message: 'Press ⌘K for search, ⌘, for settings, or ? for keyboard shortcuts',
              duration: 6000,
            });
          }, 500)}
        </div>
      )}
    </ViewContext.Provider>
  );
}

function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;
