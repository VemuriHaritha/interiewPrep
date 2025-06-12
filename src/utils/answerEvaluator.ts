import { Question } from '../types/interview';

export interface AnswerEvaluation {
  confidence: number;
  keywordScore: number;
  fluencyScore: number;
  feedback: string[];
}

export const evaluateAnswer = (transcript: string, question: Question): AnswerEvaluation => {
  const words = transcript.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Keyword Score - Check for relevant technical terms
  const keywordMatches = question.expectedKeywords.filter(keyword => 
    transcript.toLowerCase().includes(keyword.toLowerCase())
  );
  const keywordScore = Math.min(keywordMatches.length / Math.max(question.expectedKeywords.length * 0.3, 1), 1);

  // Fluency Score - Based on response length, sentence structure, and filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually'];
  const fillerCount = words.filter(word => fillerWords.includes(word)).length;
  const fillerRatio = fillerCount / Math.max(words.length, 1);
  
  const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
  const lengthScore = Math.min(words.length / 50, 1); // Optimal around 50+ words
  
  const fluencyScore = Math.max(0, (lengthScore * 0.4) + ((1 - fillerRatio) * 0.3) + (Math.min(avgWordsPerSentence / 10, 1) * 0.3));

  // Confidence Score - Based on response completeness and structure
  const hasIntroduction = transcript.length > 20;
  const hasExamples = /example|instance|case|situation|experience/i.test(transcript);
  const hasConclusion = sentences.length > 1;
  
  let confidenceScore = 0.3; // Base score
  if (hasIntroduction) confidenceScore += 0.2;
  if (hasExamples) confidenceScore += 0.3;
  if (hasConclusion) confidenceScore += 0.2;
  if (words.length > 30) confidenceScore += 0.1;

  // Generate feedback
  const feedback: string[] = [];
  
  if (keywordScore < 0.3) {
    feedback.push('Try to include more relevant technical terms in your answer');
  }
  if (fluencyScore < 0.5) {
    feedback.push('Work on reducing filler words and speaking more clearly');
  }
  if (confidenceScore < 0.5) {
    feedback.push('Provide more detailed examples and structure your answer better');
  }
  if (words.length < 20) {
    feedback.push('Try to provide more comprehensive answers');
  }

  // Add positive feedback
  if (keywordScore > 0.7) {
    feedback.push('Great use of technical terminology');
  }
  if (fluencyScore > 0.7) {
    feedback.push('Very clear and fluent delivery');
  }
  if (confidenceScore > 0.7) {
    feedback.push('Well-structured and confident response');
  }

  return {
    confidence: Math.min(confidenceScore, 1),
    keywordScore,
    fluencyScore,
    feedback,
  };
};

// Additional utility functions for more sophisticated evaluation
export const analyzeResponseStructure = (transcript: string) => {
  const sentences = transcript.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const hasSTARStructure = /situation|task|action|result/i.test(transcript);
  const hasLogicalFlow = sentences.length >= 3;
  
  return {
    sentenceCount: sentences.length,
    hasSTARStructure,
    hasLogicalFlow,
    avgSentenceLength: transcript.length / Math.max(sentences.length, 1),
  };
};

export const detectTechnicalAccuracy = (transcript: string, domain: string) => {
  const technicalTerms = {
    'web-development': ['HTML', 'CSS', 'JavaScript', 'DOM', 'API', 'HTTP', 'HTTPS', 'REST', 'JSON'],
    'data-structures': ['array', 'linked list', 'stack', 'queue', 'tree', 'graph', 'hash table', 'algorithm'],
    'system-design': ['scalability', 'load balancer', 'database', 'caching', 'microservices', 'distributed'],
    'machine-learning': ['model', 'training', 'validation', 'overfitting', 'neural network', 'algorithm'],
  };

  const domainTerms = technicalTerms[domain as keyof typeof technicalTerms] || [];
  const mentionedTerms = domainTerms.filter(term => 
    transcript.toLowerCase().includes(term.toLowerCase())
  );

  return {
    technicalTermsUsed: mentionedTerms,
    technicalAccuracyScore: mentionedTerms.length / Math.max(domainTerms.length * 0.2, 1),
  };
};