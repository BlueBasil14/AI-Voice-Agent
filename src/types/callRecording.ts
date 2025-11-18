export interface TranscriptSegment {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number; // seconds from start
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
}

export interface CallInsight {
  type: 'booking' | 'complaint' | 'question' | 'praise' | 'objection';
  timestamp: number;
  description: string;
  severity?: 'low' | 'medium' | 'high';
}

export interface CallRecording {
  id: string;
  caller: string;
  phone: string;
  date: Date;
  duration: number; // total seconds
  status: 'completed' | 'missed' | 'voicemail';
  outcome: 'booked' | 'follow-up' | 'not-interested' | 'information';
  transcript: TranscriptSegment[];
  insights: CallInsight[];
  sentimentScore: number; // -1 to 1
  tags: string[];
  notes?: string;
  audioUrl?: string;
}

export interface SentimentData {
  timestamp: number;
  score: number; // -1 to 1
  label: 'positive' | 'neutral' | 'negative';
}

export interface CallAnalytics {
  totalCalls: number;
  averageDuration: number;
  bookingRate: number;
  averageSentiment: number;
  commonKeywords: { keyword: string; count: number }[];
  peakCallTimes: { hour: number; count: number }[];
}
