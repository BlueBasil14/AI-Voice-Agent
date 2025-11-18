import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface WaveformPlayerProps {
  duration: number; // in seconds
  onTimeUpdate?: (time: number) => void;
  currentTime?: number;
}

export function WaveformPlayer({ duration, onTimeUpdate, currentTime: externalTime }: WaveformPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const waveformData = useRef<number[]>([]);

  // Generate waveform data
  useEffect(() => {
    const bars = 200;
    waveformData.current = Array.from({ length: bars }, () =>
      0.1 + Math.random() * 0.9
    );
  }, []);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / waveformData.current.length;
      const progress = currentTime / duration;

      ctx.clearRect(0, 0, width, height);

      waveformData.current.forEach((amplitude, i) => {
        const x = i * barWidth;
        const barHeight = amplitude * height * 0.8;
        const y = (height - barHeight) / 2;

        // Gradient based on progress
        const barProgress = i / waveformData.current.length;
        const isPassed = barProgress < progress;

        if (isPassed) {
          // Played portion - gradient green to blue
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, '#4ADE80');
          gradient.addColorStop(1, '#60A5FA');
          ctx.fillStyle = gradient;
        } else {
          // Unplayed portion - gray
          ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        }

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      // Draw progress line
      const progressX = progress * width;
      ctx.strokeStyle = '#4ADE80';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    };

    draw();
  }, [currentTime, duration]);

  // Animation loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = Date.now() - currentTime * 1000;

      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;

        if (elapsed >= duration) {
          setIsPlaying(false);
          setCurrentTime(duration);
          onTimeUpdate?.(duration);
          return;
        }

        setCurrentTime(elapsed);
        onTimeUpdate?.(elapsed);
        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, duration, onTimeUpdate]);

  // Sync with external time
  useEffect(() => {
    if (externalTime !== undefined && !isPlaying) {
      setCurrentTime(externalTime);
    }
  }, [externalTime, isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    const newTime = Math.max(0, currentTime - 10);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const handleSkipForward = () => {
    const newTime = Math.min(duration, currentTime + 10);
    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const handleWaveformClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * duration;

    setCurrentTime(newTime);
    onTimeUpdate?.(newTime);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4">
      {/* Waveform */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={100}
          onClick={handleWaveformClick}
          className="w-full h-24 cursor-pointer rounded-lg bg-bg-secondary/50"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause and Skip buttons */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipBack}
            className="w-10 h-10 rounded-lg bg-bg-secondary hover:bg-white/10 flex items-center justify-center transition-colors ripple"
          >
            <SkipBack className="w-5 h-5 text-text-secondary" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-lg bg-accent-green hover:bg-accent-green/80 flex items-center justify-center transition-colors ripple shadow-lg glow-green"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-0.5" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkipForward}
            className="w-10 h-10 rounded-lg bg-bg-secondary hover:bg-white/10 flex items-center justify-center transition-colors ripple"
          >
            <SkipForward className="w-5 h-5 text-text-secondary" />
          </motion.button>
        </div>

        {/* Time display */}
        <div className="flex items-center gap-2 text-sm text-text-secondary font-mono">
          <span className="text-white">{formatTime(currentTime)}</span>
          <span>/</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-text-secondary" />
            ) : (
              <Volume2 className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={(e) => {
              const newVolume = parseInt(e.target.value) / 100;
              setVolume(newVolume);
              if (newVolume > 0) setIsMuted(false);
            }}
            className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Playback speed (future feature) */}
        <div className="text-xs text-text-secondary px-2 py-1 rounded bg-white/5">
          1.0x
        </div>
      </div>
    </div>
  );
}
