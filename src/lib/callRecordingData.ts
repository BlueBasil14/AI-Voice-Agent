import type { CallRecording, TranscriptSegment, CallInsight, CallAnalytics } from '../types/callRecording';

const SAMPLE_TRANSCRIPTS: { [key: string]: TranscriptSegment[] } = {
  booking_success: [
    {
      id: 's1',
      speaker: 'agent',
      text: "Good morning! Thank you for calling Green Thumb Landscaping. This is Alex, how can I help you today?",
      timestamp: 0,
      duration: 6,
      sentiment: 'positive',
      confidence: 0.95,
      keywords: ['greeting', 'professional'],
    },
    {
      id: 's2',
      speaker: 'customer',
      text: "Hi! I'm interested in getting my lawn mowed and maybe some hedge trimming. Do you have availability this week?",
      timestamp: 6,
      duration: 7,
      sentiment: 'positive',
      confidence: 0.92,
      keywords: ['lawn', 'hedge', 'availability'],
    },
    {
      id: 's3',
      speaker: 'agent',
      text: "Absolutely! We'd be happy to help with that. Let me check our schedule. Can you tell me your address?",
      timestamp: 13,
      duration: 6,
      sentiment: 'positive',
      confidence: 0.94,
      keywords: ['helpful', 'scheduling'],
    },
    {
      id: 's4',
      speaker: 'customer',
      text: "Sure, it's 123 Oak Street. The lawn is about 2,000 square feet and I have four large hedges in the front.",
      timestamp: 19,
      duration: 8,
      sentiment: 'neutral',
      confidence: 0.90,
      keywords: ['address', 'details'],
    },
    {
      id: 's5',
      speaker: 'agent',
      text: "Perfect! I can get you scheduled for Thursday at 10 AM. The service will be $85 for the lawn and $45 for hedge trimming. Does that work for you?",
      timestamp: 27,
      duration: 9,
      sentiment: 'positive',
      confidence: 0.93,
      keywords: ['scheduling', 'pricing', 'confirmation'],
    },
    {
      id: 's6',
      speaker: 'customer',
      text: "That sounds great! Thursday at 10 works perfectly. Should I pay when you arrive or do you take payment in advance?",
      timestamp: 36,
      duration: 7,
      sentiment: 'positive',
      confidence: 0.96,
      keywords: ['confirmation', 'payment'],
    },
    {
      id: 's7',
      speaker: 'agent',
      text: "We can take payment when we arrive, either card or cash. I'll send you a confirmation text with all the details. Is this the best number to reach you?",
      timestamp: 43,
      duration: 8,
      sentiment: 'positive',
      confidence: 0.94,
      keywords: ['payment', 'confirmation', 'contact'],
    },
    {
      id: 's8',
      speaker: 'customer',
      text: "Yes, this number is perfect. Thank you so much, I really appreciate it!",
      timestamp: 51,
      duration: 5,
      sentiment: 'positive',
      confidence: 0.98,
      keywords: ['gratitude', 'positive'],
    },
    {
      id: 's9',
      speaker: 'agent',
      text: "You're very welcome! We'll see you Thursday at 10. Have a wonderful day!",
      timestamp: 56,
      duration: 5,
      sentiment: 'positive',
      confidence: 0.97,
      keywords: ['closing', 'professional'],
    },
  ],

  follow_up: [
    {
      id: 'f1',
      speaker: 'agent',
      text: "Hello, this is Jordan from Green Thumb Landscaping. How can I assist you today?",
      timestamp: 0,
      duration: 5,
      sentiment: 'positive',
      confidence: 0.94,
      keywords: ['greeting'],
    },
    {
      id: 'f2',
      speaker: 'customer',
      text: "Hi, I'm looking to get a quote for a complete backyard makeover. It's a pretty big project though.",
      timestamp: 5,
      duration: 6,
      sentiment: 'neutral',
      confidence: 0.88,
      keywords: ['quote', 'backyard', 'project'],
    },
    {
      id: 'f3',
      speaker: 'agent',
      text: "We'd love to help with that! For larger projects, we typically schedule an on-site consultation. Can you tell me a bit more about what you're envisioning?",
      timestamp: 11,
      duration: 8,
      sentiment: 'positive',
      confidence: 0.92,
      keywords: ['consultation', 'project'],
    },
    {
      id: 'f4',
      speaker: 'customer',
      text: "Well, I'm thinking new sod, a patio area, maybe some flower beds. I'm not totally sure on the design yet though.",
      timestamp: 19,
      duration: 7,
      sentiment: 'neutral',
      confidence: 0.85,
      keywords: ['design', 'planning', 'uncertainty'],
    },
    {
      id: 'f5',
      speaker: 'agent',
      text: "That's completely fine! Our design team can help you with that. I can schedule a free consultation where we'll measure, discuss options, and provide a detailed quote. Would you prefer this week or next?",
      timestamp: 26,
      duration: 10,
      sentiment: 'positive',
      confidence: 0.93,
      keywords: ['consultation', 'design', 'scheduling'],
    },
    {
      id: 'f6',
      speaker: 'customer',
      text: "Hmm, next week would be better. But I need to check with my spouse first. Can I call you back tomorrow?",
      timestamp: 36,
      duration: 6,
      sentiment: 'neutral',
      confidence: 0.87,
      keywords: ['delay', 'decision'],
    },
    {
      id: 'f7',
      speaker: 'agent',
      text: "Absolutely! I'll send you an email with some photos of similar projects and our contact information. Take your time to discuss, and call us whenever you're ready!",
      timestamp: 42,
      duration: 9,
      sentiment: 'positive',
      confidence: 0.95,
      keywords: ['follow-up', 'materials', 'professional'],
    },
  ],
};

const SAMPLE_INSIGHTS: { [key: string]: CallInsight[] } = {
  booking_success: [
    {
      type: 'question',
      timestamp: 6,
      description: 'Customer inquired about service availability',
      severity: 'low',
    },
    {
      type: 'booking',
      timestamp: 36,
      description: 'Customer confirmed appointment for Thursday 10 AM',
      severity: 'low',
    },
    {
      type: 'praise',
      timestamp: 51,
      description: 'Customer expressed gratitude and satisfaction',
      severity: 'low',
    },
  ],
  follow_up: [
    {
      type: 'question',
      timestamp: 5,
      description: 'Customer requesting quote for large project',
      severity: 'medium',
    },
    {
      type: 'objection',
      timestamp: 36,
      description: 'Customer needs to consult spouse before deciding',
      severity: 'medium',
    },
  ],
};

function generateCallRecording(
  id: string,
  caller: string,
  transcriptKey: string,
  outcome: CallRecording['outcome'],
  date: Date
): CallRecording {
  const transcript = SAMPLE_TRANSCRIPTS[transcriptKey] || SAMPLE_TRANSCRIPTS.booking_success;
  const duration = transcript[transcript.length - 1]?.timestamp + transcript[transcript.length - 1]?.duration || 60;

  const sentiments = transcript.map(seg => seg.sentiment);
  const positiveCount = sentiments.filter(s => s === 'positive').length;
  const negativeCount = sentiments.filter(s => s === 'negative').length;
  const sentimentScore = (positiveCount - negativeCount) / sentiments.length;

  return {
    id,
    caller,
    phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    date,
    duration,
    status: 'completed',
    outcome,
    transcript,
    insights: SAMPLE_INSIGHTS[transcriptKey] || [],
    sentimentScore,
    tags: extractTags(transcript, outcome),
    notes: '',
  };
}

function extractTags(transcript: TranscriptSegment[], outcome: string): string[] {
  const tags: Set<string> = new Set();

  transcript.forEach(seg => {
    seg.keywords.forEach(keyword => {
      if (['booking', 'pricing', 'scheduling', 'complaint', 'praise'].includes(keyword)) {
        tags.add(keyword);
      }
    });
  });

  if (outcome === 'booked') tags.add('booked');
  if (transcript.some(s => s.sentiment === 'negative')) tags.add('concerns');
  if (transcript.length > 15) tags.add('long-call');

  return Array.from(tags);
}

export const mockCallRecordings: CallRecording[] = [
  generateCallRecording(
    'call-001',
    'Sarah Johnson',
    'booking_success',
    'booked',
    new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  ),
  generateCallRecording(
    'call-002',
    'Michael Chen',
    'follow_up',
    'follow-up',
    new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  ),
  generateCallRecording(
    'call-003',
    'Emily Rodriguez',
    'booking_success',
    'booked',
    new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  ),
  generateCallRecording(
    'call-004',
    'David Kim',
    'follow_up',
    'information',
    new Date(Date.now() - 36 * 60 * 60 * 1000) // 1.5 days ago
  ),
  generateCallRecording(
    'call-005',
    'Lisa Anderson',
    'booking_success',
    'booked',
    new Date(Date.now() - 48 * 60 * 60 * 1000) // 2 days ago
  ),
];

export function getCallAnalytics(recordings: CallRecording[]): CallAnalytics {
  const totalCalls = recordings.length;
  const averageDuration = recordings.reduce((sum, r) => sum + r.duration, 0) / totalCalls;
  const bookedCalls = recordings.filter(r => r.outcome === 'booked').length;
  const bookingRate = (bookedCalls / totalCalls) * 100;
  const averageSentiment = recordings.reduce((sum, r) => sum + r.sentimentScore, 0) / totalCalls;

  const keywordMap = new Map<string, number>();
  recordings.forEach(r => {
    r.transcript.forEach(seg => {
      seg.keywords.forEach(kw => {
        keywordMap.set(kw, (keywordMap.get(kw) || 0) + 1);
      });
    });
  });

  const commonKeywords = Array.from(keywordMap.entries())
    .map(([keyword, count]) => ({ keyword, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const hourMap = new Map<number, number>();
  recordings.forEach(r => {
    const hour = r.date.getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  const peakCallTimes = Array.from(hourMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalCalls,
    averageDuration,
    bookingRate,
    averageSentiment,
    commonKeywords,
    peakCallTimes,
  };
}

export function searchCallRecordings(
  recordings: CallRecording[],
  query: string
): CallRecording[] {
  const lowerQuery = query.toLowerCase();

  return recordings.filter(recording => {
    // Search in caller name
    if (recording.caller.toLowerCase().includes(lowerQuery)) return true;

    // Search in phone number
    if (recording.phone.includes(lowerQuery)) return true;

    // Search in transcript
    if (recording.transcript.some(seg => seg.text.toLowerCase().includes(lowerQuery))) return true;

    // Search in tags
    if (recording.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}

export function filterCallRecordings(
  recordings: CallRecording[],
  filters: {
    outcome?: CallRecording['outcome'][];
    sentiment?: 'positive' | 'neutral' | 'negative';
    dateRange?: { start: Date; end: Date };
    tags?: string[];
  }
): CallRecording[] {
  return recordings.filter(recording => {
    // Filter by outcome
    if (filters.outcome && !filters.outcome.includes(recording.outcome)) {
      return false;
    }

    // Filter by sentiment
    if (filters.sentiment) {
      if (filters.sentiment === 'positive' && recording.sentimentScore <= 0.2) return false;
      if (filters.sentiment === 'neutral' && (recording.sentimentScore < -0.2 || recording.sentimentScore > 0.2)) return false;
      if (filters.sentiment === 'negative' && recording.sentimentScore >= -0.2) return false;
    }

    // Filter by date range
    if (filters.dateRange) {
      if (recording.date < filters.dateRange.start || recording.date > filters.dateRange.end) {
        return false;
      }
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.some(tag => recording.tags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
}
