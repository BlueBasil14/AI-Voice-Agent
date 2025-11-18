import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Phone, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

export type ToastType = 'success' | 'error' | 'info' | 'call' | 'booking';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'call':
        return <Phone className="w-5 h-5" />;
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-accent-green/10 border-accent-green/20 text-accent-green';
      case 'error':
        return 'bg-red-500/10 border-red-500/20 text-red-500';
      case 'info':
        return 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue';
      case 'call':
        return 'bg-accent-purple/10 border-accent-purple/20 text-accent-purple';
      case 'booking':
        return 'bg-accent-orange/10 border-accent-orange/20 text-accent-orange';
      default:
        return 'bg-accent-blue/10 border-accent-blue/20 text-accent-blue';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-24 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="pointer-events-auto"
            >
              <div
                className={cn(
                  'glass-effect rounded-xl p-4 pr-12 border shadow-2xl min-w-[320px] max-w-md relative',
                  getColors(toast.type)
                )}
              >
                {/* Close button */}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>

                <div className="flex items-start gap-3">
                  <div className={cn('flex-shrink-0', getColors(toast.type))}>
                    {getIcon(toast.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white mb-0.5">
                      {toast.title}
                    </h4>
                    {toast.message && (
                      <p className="text-xs text-text-secondary">
                        {toast.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
                  className={cn(
                    'absolute bottom-0 left-0 h-1 rounded-b-xl origin-left',
                    toast.type === 'success' && 'bg-accent-green',
                    toast.type === 'error' && 'bg-red-500',
                    toast.type === 'info' && 'bg-accent-blue',
                    toast.type === 'call' && 'bg-accent-purple',
                    toast.type === 'booking' && 'bg-accent-orange'
                  )}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
