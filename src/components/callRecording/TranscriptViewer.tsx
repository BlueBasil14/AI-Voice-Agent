import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, ThumbsUp, Meh, ThumbsDown, Copy, Check } from 'lucide-react';
import type { TranscriptSegment } from '../../types/callRecording';
import { cn, formatDuration } from '../../lib/utils';

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime?: number;
  onSegmentClick?: (timestamp: number) => void;
  searchQuery?: string;
}

export function TranscriptViewer({
  segments,
  currentTime = 0,
  onSegmentClick,
  searchQuery = '',
}: TranscriptViewerProps) {
  const [copied, setCopied] = useState(false);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current && currentTime > 0) {
      activeSegmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime]);

  const getSentimentIcon = (sentiment: TranscriptSegment['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="w-4 h-4 text-accent-green" />;
      case 'negative':
        return <ThumbsDown className="w-4 h-4 text-red-500" />;
      case 'neutral':
        return <Meh className="w-4 h-4 text-text-secondary" />;
    }
  };

  const getSpeakerInfo = (speaker: 'agent' | 'customer') => {
    if (speaker === 'agent') {
      return {
        name: 'AI Agent',
        icon: Bot,
        bgColor: 'bg-accent-blue/10',
        borderColor: 'border-accent-blue/20',
        textColor: 'text-accent-blue',
      };
    }
    return {
      name: 'Customer',
      icon: User,
      bgColor: 'bg-accent-purple/10',
      borderColor: 'border-accent-purple/20',
      textColor: 'text-accent-purple',
    };
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-accent-orange/30 text-white rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const copyTranscript = () => {
    const text = segments
      .map(seg => `[${formatDuration(seg.timestamp)}] ${seg.speaker === 'agent' ? 'Agent' : 'Customer'}: ${seg.text}`)
      .join('\n\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSegmentActive = (segment: TranscriptSegment) => {
    return currentTime >= segment.timestamp && currentTime < segment.timestamp + segment.duration;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Transcript</h3>
          <p className="text-xs text-text-secondary">
            {segments.length} segments • Click to jump to time
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyTranscript}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-secondary hover:bg-white/10 transition-colors ripple"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-accent-green" />
              <span className="text-sm text-accent-green">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">Copy</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Transcript */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        <AnimatePresence>
          {segments.map((segment, index) => {
            const speakerInfo = getSpeakerInfo(segment.speaker);
            const Icon = speakerInfo.icon;
            const isActive = isSegmentActive(segment);

            return (
              <motion.div
                key={segment.id}
                ref={isActive ? activeSegmentRef : null}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onSegmentClick?.(segment.timestamp)}
                className={cn(
                  'p-4 rounded-xl border transition-all duration-300 cursor-pointer',
                  isActive
                    ? 'bg-accent-green/10 border-accent-green/30 scale-[1.02]'
                    : `${speakerInfo.bgColor} ${speakerInfo.borderColor} hover:border-white/20`
                )}
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', speakerInfo.bgColor)}>
                    <Icon className={cn('w-4 h-4', speakerInfo.textColor)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn('text-sm font-semibold', speakerInfo.textColor)}>
                        {speakerInfo.name}
                      </span>
                      <span className="text-xs text-text-secondary font-mono">
                        {formatDuration(segment.timestamp)}
                      </span>
                      {getSentimentIcon(segment.sentiment)}
                      <span className="text-xs text-text-secondary">
                        {Math.round(segment.confidence * 100)}% confidence
                      </span>
                    </div>

                    {/* Text */}
                    <p className="text-sm text-white leading-relaxed">
                      {highlightText(segment.text, searchQuery)}
                    </p>

                    {/* Keywords */}
                    {segment.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {segment.keywords.map((keyword, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-secondary"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
