import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Download,
  Tag,
  FileText,
  BarChart3,
  Clock,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import type { CallRecording } from '../../types/callRecording';
import { WaveformPlayer } from './WaveformPlayer';
import { TranscriptViewer } from './TranscriptViewer';
import { SentimentTimeline } from './SentimentTimeline';
import { CallInsights } from './CallInsights';
import { format } from 'date-fns';
import { cn, formatDuration } from '../../lib/utils';
import { useToast } from '../../contexts/ToastContext';

interface CallAnalyzerProps {
  call: CallRecording;
  onClose: () => void;
}

export function CallAnalyzer({ call, onClose }: CallAnalyzerProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'transcript' | 'insights' | 'sentiment'>('transcript');
  const { showToast } = useToast();

  const tabs = [
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'sentiment', label: 'Sentiment', icon: BarChart3 },
  ];

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'booked':
        return 'bg-accent-green/20 text-accent-green border-accent-green/30';
      case 'follow-up':
        return 'bg-accent-orange/20 text-accent-orange border-accent-orange/30';
      case 'not-interested':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      default:
        return 'bg-accent-blue/20 text-accent-blue border-accent-blue/30';
    }
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(call, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `call-${call.id}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Export Successful',
      message: 'Call data exported to JSON',
      duration: 3000,
    });
  };

  const exportToText = () => {
    const text = `Call Recording: ${call.caller}
Date: ${format(call.date, 'PPpp')}
Duration: ${formatDuration(call.duration)}
Outcome: ${call.outcome}
Sentiment Score: ${call.sentimentScore.toFixed(2)}

TRANSCRIPT:
${call.transcript
  .map(
    (seg) =>
      `[${formatDuration(seg.timestamp)}] ${seg.speaker === 'agent' ? 'Agent' : 'Customer'}: ${seg.text}`
  )
  .join('\n\n')}

INSIGHTS:
${call.insights
  .map(
    (insight) =>
      `[${formatDuration(insight.timestamp)}] ${insight.type.toUpperCase()}: ${insight.description}`
  )
  .join('\n')}
`;

    const dataBlob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `call-${call.id}-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    showToast({
      type: 'success',
      title: 'Export Successful',
      message: 'Transcript exported to text file',
      duration: 3000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-bg-secondary border border-white/10 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Call Analysis</h2>
              <p className="text-sm text-text-secondary">
                {format(call.date, 'PPpp')} • {call.phone}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg bg-bg-card hover:bg-white/10 flex items-center gap-2 transition-colors ripple">
                  <Download className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm text-text-secondary">Export</span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 bg-bg-card border border-white/10 rounded-lg shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={exportToJSON}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    Export as JSON
                  </button>
                  <button
                    onClick={exportToText}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors"
                  >
                    Export as Text
                  </button>
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

          {/* Call Info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-text-secondary" />
              <span className="text-lg font-semibold text-white">{call.caller}</span>
            </div>

            <div className={cn('px-3 py-1 rounded-full border text-sm font-medium', getOutcomeColor(call.outcome))}>
              {call.outcome === 'booked' && <CheckCircle2 className="w-4 h-4 inline mr-1" />}
              {call.outcome.replace('-', ' ').toUpperCase()}
            </div>

            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <Clock className="w-4 h-4" />
              {formatDuration(call.duration)}
            </div>

            {call.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-text-secondary flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Waveform Player */}
            <div className="bg-bg-card/30 rounded-xl p-4">
              <WaveformPlayer
                duration={call.duration}
                onTimeUpdate={setCurrentTime}
                currentTime={currentTime}
              />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium transition-colors',
                      activeTab === tab.id ? 'text-white' : 'text-text-secondary hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </div>

                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="grid grid-cols-1 gap-6">
              {activeTab === 'transcript' && (
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <TranscriptViewer
                      segments={call.transcript}
                      currentTime={currentTime}
                      onSegmentClick={setCurrentTime}
                      searchQuery=""
                    />
                  </div>
                  <div>
                    <CallInsights insights={call.insights} onInsightClick={setCurrentTime} />
                  </div>
                </div>
              )}

              {activeTab === 'insights' && (
                <CallInsights insights={call.insights} onInsightClick={setCurrentTime} />
              )}

              {activeTab === 'sentiment' && (
                <SentimentTimeline segments={call.transcript} />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
