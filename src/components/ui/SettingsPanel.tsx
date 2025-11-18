import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings as SettingsIcon, Bell, Volume2, Sparkles, RefreshCw } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { cn } from '../../lib/utils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useSettings();

  const toggleSettings = [
    {
      id: 'notificationsEnabled',
      label: 'Notifications',
      description: 'Show toast notifications for new events',
      icon: Bell,
      value: settings.notificationsEnabled,
    },
    {
      id: 'soundEnabled',
      label: 'Sound Effects',
      description: 'Play sounds for notifications',
      icon: Volume2,
      value: settings.soundEnabled,
    },
    {
      id: 'celebrationsEnabled',
      label: 'Celebrations',
      description: 'Show confetti for successful bookings',
      icon: Sparkles,
      value: settings.celebrationsEnabled,
    },
    {
      id: 'autoRefresh',
      label: 'Auto Refresh',
      description: 'Automatically update dashboard data',
      icon: RefreshCw,
      value: settings.autoRefresh,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-bg-secondary border-l border-white/10 z-[101] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-bg-secondary/95 backdrop-blur-md border-b border-white/10 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center">
                    <SettingsIcon className="w-5 h-5 text-accent-purple" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Settings</h2>
                    <p className="text-xs text-text-secondary">Customize your dashboard</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors ripple"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* General Settings */}
              <div>
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                  General
                </h3>
                <div className="space-y-4">
                  {toggleSettings.map((setting, index) => {
                    const Icon = setting.icon;
                    return (
                      <motion.div
                        key={setting.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="card-gradient rounded-xl p-4 hover-lift"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-accent-blue" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-white mb-1">
                                {setting.label}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {setting.description}
                              </div>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            onClick={() =>
                              updateSettings({ [setting.id]: !setting.value })
                            }
                            className={cn(
                              'relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0',
                              setting.value ? 'bg-accent-green' : 'bg-white/10'
                            )}
                          >
                            <motion.div
                              initial={false}
                              animate={{
                                x: setting.value ? 24 : 2,
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                            />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Refresh Interval */}
              {settings.autoRefresh && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide mb-4">
                    Refresh Interval
                  </h3>
                  <div className="card-gradient rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-white">Update every</span>
                      <span className="text-lg font-bold text-accent-green">
                        {settings.refreshInterval}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={settings.refreshInterval}
                      onChange={(e) =>
                        updateSettings({ refreshInterval: parseInt(e.target.value) })
                      }
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-text-secondary mt-2">
                      <span>1s</span>
                      <span>10s</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reset Button */}
              <button
                onClick={() => {
                  resetSettings();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-medium hover:bg-red-500/20 transition-colors ripple"
              >
                Reset to Defaults
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
