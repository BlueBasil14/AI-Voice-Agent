import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Phone,
  Calendar,
  Brain,
  Settings,
  CreditCard,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface NavItem {
  icon: React.ComponentType<any>;
  label: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: Phone, label: 'Calls', active: false },
  { icon: Calendar, label: 'Calendar', active: false },
  { icon: Brain, label: 'AI Insights', active: false },
  { icon: Settings, label: 'Settings', active: false },
  { icon: CreditCard, label: 'Billing', active: false },
];

export function SideNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed left-0 top-0 h-screen w-20 bg-bg-secondary border-r border-white/5 flex flex-col items-center py-8 z-50"
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mb-12 relative"
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue flex items-center justify-center font-display font-bold text-xl shadow-lg glow-green">
          VP
        </div>
      </motion.div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === activeIndex;
          const isHovered = index === hoveredIndex;

          return (
            <div key={item.label} className="relative group">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  'relative w-full h-14 rounded-xl flex items-center justify-center transition-all duration-300',
                  'hover:bg-white/5',
                  isActive && 'bg-white/10'
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-green rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon with rotation animation on hover */}
                <motion.div
                  animate={{
                    rotate: isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon
                    className={cn(
                      'w-6 h-6 transition-colors duration-300',
                      isActive
                        ? 'text-accent-green'
                        : 'text-text-secondary group-hover:text-text-primary'
                    )}
                  />
                </motion.div>
              </motion.button>

              {/* Tooltip */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -10,
                }}
                transition={{ duration: 0.2 }}
                className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-2 bg-bg-card border border-white/10 rounded-lg whitespace-nowrap pointer-events-none shadow-xl"
                style={{ display: isHovered ? 'block' : 'none' }}
              >
                <div className="text-sm font-medium text-text-primary">
                  {item.label}
                </div>
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-bg-card" />
              </motion.div>
            </div>
          );
        })}
      </nav>

      {/* Bottom indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="w-2 h-2 rounded-full bg-accent-green animate-pulse"
      />
    </motion.aside>
  );
}
