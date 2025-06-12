export interface InterviewConfig {
  domain: string;
  mode: 'practice' | 'timed';
  duration?: number; // in minutes
  questionCount: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  resume?: File;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  expectedKeywords: string[];
  timeLimit?: number;
}

export interface Answer {
  questionId: string;
  transcript: string;
  audioBlob?: Blob;
  duration: number;
  confidence: number;
  keywordScore: number;
  fluencyScore: number;
  timestamp: Date;
}

export interface InterviewResult {
  config: InterviewConfig;
  questions: Question[];
  answers: Answer[];
  overallScore: number;
  categoryScores: Record<string, number>;
  strengths: string[];
  improvements: string[];
  duration: number;
  completedAt: Date;
}

export interface PerformanceMetrics {
  totalQuestions: number;
  answeredQuestions: number;
  averageConfidence: number;
  averageKeywordScore: number;
  averageFluency: number;
  topicBreakdown: Record<string, { score: number; count: number }>;
}