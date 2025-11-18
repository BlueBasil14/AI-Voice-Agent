import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';
import type { CallRecording } from '../../types/callRecording';
import { CallAnalyzer } from './CallAnalyzer';
import { searchCallRecordings, filterCallRecordings, mockCallRecordings } from '../../lib/callRecordingData';
import { format } from 'date-fns';
import { formatDuration } from '../../lib/utils';
import { cn } from '../../lib/utils';

export function CallLibrary() {
  const [recordings] = useState<CallRecording[]>(mockCallRecordings);
  const [filteredRecordings, setFilteredRecordings] = useState<CallRecording[]>(mockCallRecordings);
  const [selectedCall, setSelectedCall] = useState<CallRecording | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    outcome: CallRecording['outcome'][];
    sentiment: 'positive' | 'neutral' | 'negative' | null;
  }>({
    outcome: [],
    sentiment: null,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let results = searchCallRecordings(recordings, query);

    // Apply additional filters
    if (filters.outcome.length > 0 || filters.sentiment) {
      results = filterCallRecordings(results, {
        outcome: filters.outcome.length > 0 ? filters.outcome : undefined,
        sentiment: filters.sentiment || undefined,
      });
    }

    setFilteredRecordings(results);
  };

  const handleFilterChange = (key: 'outcome' | 'sentiment', value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    let results = searchCallRecordings(recordings, searchQuery);
    results = filterCallRecordings(results, {
      outcome: newFilters.outcome.length > 0 ? newFilters.outcome : undefined,
      sentiment: newFilters.sentiment || undefined,
    });

    setFilteredRecordings(results);
  };

  const toggleOutcomeFilter = (outcome: CallRecording['outcome']) => {
    const newOutcomes = filters.outcome.includes(outcome)
      ? filters.outcome.filter((o) => o !== outcome)
      : [...filters.outcome, outcome];

    handleFilterChange('outcome', newOutcomes);
  };

  const clearFilters = () => {
    setFilters({ outcome: [], sentiment: null });
    setFilteredRecordings(searchCallRecordings(recordings, searchQuery));
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="w-4 h-4 text-accent-green" />;
    if (score < -0.2) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-text-secondary" />;
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'booked':
        return 'bg-accent-green/20 text-accent-green';
      case 'follow-up':
        return 'bg-accent-orange/20 text-accent-orange';
      case 'not-interested':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-accent-blue/20 text-accent-blue';
    }
  };

  const activeFilterCount = filters.outcome.length + (filters.sentiment ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Call Recordings</h2>
          <p className="text-sm text-text-secondary">
            {filteredRecordings.length} of {recordings.length} calls
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-bg-secondary border border-white/10 rounded-lg text-white placeholder-text-secondary focus:outline-none focus:border-accent-green/50 transition-colors w-64"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ripple',
              showFilters || activeFilterCount > 0
                ? 'bg-accent-green/20 text-accent-green'
                : 'bg-bg-secondary hover:bg-white/10 text-text-secondary'
            )}
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="px-2 py-0.5 bg-accent-green text-white rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-bg-secondary rounded-xl p-4 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Filter Calls</h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-accent-green hover:text-accent-green/80 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Outcome Filter */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">Outcome</label>
                  <div className="flex flex-wrap gap-2">
                    {['booked', 'follow-up', 'not-interested', 'information'].map((outcome) => (
                      <button
                        key={outcome}
                        onClick={() => toggleOutcomeFilter(outcome as CallRecording['outcome'])}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs transition-colors',
                          filters.outcome.includes(outcome as CallRecording['outcome'])
                            ? getOutcomeColor(outcome) + ' border border-current'
                            : 'bg-white/5 text-text-secondary hover:bg-white/10'
                        )}
                      >
                        {outcome.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sentiment Filter */}
                <div>
                  <label className="text-xs text-text-secondary mb-2 block">Sentiment</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'positive', label: 'Positive', color: 'text-accent-green' },
                      { value: 'neutral', label: 'Neutral', color: 'text-text-secondary' },
                      { value: 'negative', label: 'Negative', color: 'text-red-500' },
                    ].map((sentiment) => (
                      <button
                        key={sentiment.value}
                        onClick={() =>
                          handleFilterChange(
                            'sentiment',
                            filters.sentiment === sentiment.value ? null : sentiment.value
                          )
                        }
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-xs transition-colors',
                          filters.sentiment === sentiment.value
                            ? `bg-${sentiment.color.split('-')[1]}/20 ${sentiment.color} border border-current`
                            : 'bg-white/5 text-text-secondary hover:bg-white/10'
                        )}
                      >
                        {sentiment.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredRecordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCall(recording)}
              className="card-gradient rounded-xl p-4 cursor-pointer hover-lift relative overflow-hidden group"
            >
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{recording.caller}</h4>
                      <p className="text-xs text-text-secondary">{recording.phone}</p>
                    </div>
                  </div>

                  {getSentimentIcon(recording.sentimentScore)}
                </div>

                {/* Date and Duration */}
                <div className="flex items-center gap-3 mb-3 text-xs text-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(recording.date, 'MMM d, h:mm a')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(recording.duration)}
                  </div>
                </div>

                {/* Outcome Badge */}
                <div className={cn('inline-block px-3 py-1 rounded-full text-xs font-medium', getOutcomeColor(recording.outcome))}>
                  {recording.outcome.replace('-', ' ').toUpperCase()}
                </div>

                {/* Tags */}
                {recording.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {recording.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-secondary">
                        {tag}
                      </span>
                    ))}
                    {recording.tags.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-text-secondary">
                        +{recording.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredRecordings.length === 0 && (
        <div className="text-center py-12">
          <Phone className="w-16 h-16 mx-auto mb-4 text-text-secondary opacity-30" />
          <h3 className="text-lg font-semibold text-white mb-2">No calls found</h3>
          <p className="text-sm text-text-secondary">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Call Analyzer Modal */}
      <AnimatePresence>
        {selectedCall && (
          <CallAnalyzer call={selectedCall} onClose={() => setSelectedCall(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
