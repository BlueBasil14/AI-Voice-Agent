import { motion } from 'framer-motion';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState, useEffect } from 'react';

const tabs = ['Dashboard', 'Calls', 'Appointments', 'Analytics', 'Settings'];

export function TopNav() {
  const [activeTab, setActiveTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [showNotificationDot, setShowNotificationDot] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-20 right-0 h-20 z-40 transition-all duration-300',
        scrolled
          ? 'glass-effect shadow-lg'
          : 'bg-transparent'
      )}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Left: Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <h1 className="text-2xl font-display font-bold text-gradient">
            VoiceBot Pro
          </h1>
          <div className="px-2 py-1 bg-accent-green/10 border border-accent-green/20 rounded-md">
            <span className="text-xs font-semibold text-accent-green">BETA</span>
          </div>
        </motion.div>

        {/* Center: Tabs */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-1 bg-bg-secondary/50 rounded-xl p-1 backdrop-blur-sm"
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(index)}
                className={cn(
                  'relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                  'hover:text-text-primary',
                  isActive
                    ? 'text-text-primary'
                    : 'text-text-secondary'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-bg-card rounded-lg shadow-lg"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </motion.nav>

        {/* Right: Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-4"
        >
          {/* Search */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center hover:bg-bg-card transition-colors duration-200 ripple"
          >
            <Search className="w-5 h-5 text-text-secondary" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotificationDot(false)}
            className="relative w-10 h-10 rounded-lg bg-bg-secondary border border-white/5 flex items-center justify-center hover:bg-bg-card transition-colors duration-200 ripple"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {showNotificationDot && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-2 h-2 bg-accent-orange rounded-full animate-pulse-glow"
              />
            )}
          </motion.button>

          {/* User Profile */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-xl bg-bg-secondary border border-white/5 hover:bg-bg-card transition-all duration-200 ripple"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-text-primary">Admin</div>
              <div className="text-xs text-text-secondary">Pro Plan</div>
            </div>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </motion.button>
        </motion.div>
      </div>
    </motion.header>
  );
}
