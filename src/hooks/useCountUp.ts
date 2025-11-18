import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  start?: number;
}

export function useCountUp({
  end,
  duration = 1000,
  decimals = 0,
  start = 0,
}: UseCountUpOptions): number {
  const [count, setCount] = useState(start);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeOut;

      setCount(parseFloat(current.toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    // Reset start time when end value changes
    startTimeRef.current = 0;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, decimals, start]);

  return count;
}
