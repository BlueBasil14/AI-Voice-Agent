import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { TranscriptSegment } from '../../types/callRecording';
import { formatDuration } from '../../lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentTimelineProps {
  segments: TranscriptSegment[];
}

export function SentimentTimeline({ segments }: SentimentTimelineProps) {
  // Convert segments to sentiment data points
  const sentimentData = segments.map(segment => {
    const score =
      segment.sentiment === 'positive' ? 1 : segment.sentiment === 'negative' ? -1 : 0;

    return {
      time: segment.timestamp,
      score,
      label: segment.sentiment,
      speaker: segment.speaker,
      text: segment.text.substring(0, 50) + '...',
    };
  });

  // Calculate overall sentiment
  const avgSentiment =
    sentimentData.reduce((sum, d) => sum + d.score, 0) / sentimentData.length;

  const getSentimentLabel = (score: number) => {
    if (score > 0.2) return 'Positive';
    if (score < -0.2) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.2) return 'text-accent-green';
    if (score < -0.2) return 'text-red-500';
    return 'text-text-secondary';
  };

  const getSentimentIcon = (score: number) => {
    if (score > 0.2) return <TrendingUp className="w-5 h-5" />;
    if (score < -0.2) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Sentiment Analysis</h3>
          <p className="text-xs text-text-secondary">Emotional tone throughout the call</p>
        </div>

        <div className={`flex items-center gap-2 ${getSentimentColor(avgSentiment)}`}>
          {getSentimentIcon(avgSentiment)}
          <div className="text-right">
            <div className="text-2xl font-bold">
              {avgSentiment > 0 ? '+' : ''}
              {avgSentiment.toFixed(2)}
            </div>
            <div className="text-xs">{getSentimentLabel(avgSentiment)}</div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-bg-secondary/50 rounded-xl p-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={sentimentData}>
            <defs>
              <linearGradient id="sentimentPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sentimentNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />

            <XAxis
              dataKey="time"
              tickFormatter={(value) => formatDuration(value)}
              stroke="#A3A3A3"
              fontSize={12}
            />

            <YAxis
              domain={[-1.2, 1.2]}
              ticks={[-1, -0.5, 0, 0.5, 1]}
              stroke="#A3A3A3"
              fontSize={12}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1C1C1C',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '12px',
              }}
              labelStyle={{ color: '#A3A3A3', fontSize: '12px' }}
              formatter={(value: any, _name: string, props: any) => {
                const score = value as number;
                const sentiment = score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
                const color = score > 0 ? '#4ADE80' : score < 0 ? '#EF4444' : '#A3A3A3';

                return [
                  <div key="sentiment" className="space-y-1">
                    <div style={{ color }} className="font-semibold">
                      {sentiment} ({score.toFixed(2)})
                    </div>
                    <div className="text-xs text-text-secondary">
                      {props.payload.speaker === 'agent' ? 'Agent' : 'Customer'}
                    </div>
                    <div className="text-xs text-white mt-1">{props.payload.text}</div>
                  </div>,
                  '',
                ];
              }}
              labelFormatter={(value) => `Time: ${formatDuration(value)}`}
            />

            <ReferenceLine y={0} stroke="rgba(255, 255, 255, 0.2)" strokeDasharray="3 3" />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#4ADE80"
              strokeWidth={2}
              fill="url(#sentimentPositive)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-accent-green" />
          <span className="text-text-secondary">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-text-secondary">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-text-secondary">Negative</span>
        </div>
      </div>
    </div>
  );
}
