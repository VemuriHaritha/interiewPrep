import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Play, Pause, SkipForward, Clock } from 'lucide-react';
import { InterviewConfig, Question, Answer, InterviewResult } from '../types/interview';
import { generateQuestions } from '../utils/questionGenerator';
import { evaluateAnswer } from '../utils/answerEvaluator';
import { VoiceRecorder } from './VoiceRecorder';
import { TranscriptionDisplay } from './TranscriptionDisplay';

interface InterviewSessionProps {
  config: InterviewConfig;
  onComplete: (results: InterviewResult) => void;
}

export const InterviewSession: React.FC<InterviewSessionProps> = ({ config, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(config.duration ? config.duration * 60 : null);
  const [sessionStartTime] = useState(Date.now());
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout>();
  const speechSynthRef = useRef<SpeechSynthesisUtterance>();

  useEffect(() => {
    // Generate questions when component mounts
    const generatedQuestions = generateQuestions(config);
    setQuestions(generatedQuestions);
    
    // Start timer for timed mode
    if (config.mode === 'timed' && timeRemaining) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev && prev <= 1) {
            handleCompleteInterview();
            return 0;
          }
          return prev ? prev - 1 : null;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (speechSynthRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-play first question
    if (questions.length > 0 && currentQuestionIndex === 0) {
      speakQuestion(questions[0].text);
    }
  }, [questions]);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsQuestionPlaying(true);
      utterance.onend = () => setIsQuestionPlaying(false);
      
      speechSynthRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentTranscript('');
  };

  const handleStopRecording = (transcript: string, audioBlob?: Blob) => {
    setIsRecording(false);
    
    if (transcript.trim()) {
      const currentQuestion = questions[currentQuestionIndex];
      const evaluation = evaluateAnswer(transcript, currentQuestion);
      
      const answer: Answer = {
        questionId: currentQuestion.id,
        transcript,
        audioBlob,
        duration: 0, // Will be calculated by VoiceRecorder
        confidence: evaluation.confidence,
        keywordScore: evaluation.keywordScore,
        fluencyScore: evaluation.fluencyScore,
        timestamp: new Date(),
      };
      
      setAnswers(prev => [...prev, answer]);
      setCurrentTranscript(transcript);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentTranscript('');
      speakQuestion(questions[nextIndex].text);
    } else {
      handleCompleteInterview();
    }
  };

  const handleCompleteInterview = () => {
    const sessionDuration = Date.now() - sessionStartTime;
    
    // Calculate overall performance
    const overallScore = answers.length > 0 
      ? answers.reduce((sum, answer) => sum + (answer.confidence + answer.keywordScore + answer.fluencyScore) / 3, 0) / answers.length
      : 0;

    // Calculate category scores
    const categoryScores: Record<string, number> = {};
    questions.forEach(question => {
      const answer = answers.find(a => a.questionId === question.id);
      if (answer) {
        const score = (answer.confidence + answer.keywordScore + answer.fluencyScore) / 3;
        categoryScores[question.category] = (categoryScores[question.category] || 0) + score;
      }
    });

    // Generate insights
    const strengths: string[] = [];
    const improvements: string[] = [];
    
    if (overallScore > 0.7) strengths.push('Strong overall performance');
    if (answers.some(a => a.keywordScore > 0.8)) strengths.push('Good technical knowledge');
    if (answers.some(a => a.fluencyScore > 0.8)) strengths.push('Clear communication');
    
    if (overallScore < 0.6) improvements.push('Work on overall interview confidence');
    if (answers.some(a => a.keywordScore < 0.5)) improvements.push('Strengthen technical knowledge');
    if (answers.some(a => a.fluencyScore < 0.5)) improvements.push('Practice speaking more fluently');

    const results: InterviewResult = {
      config,
      questions,
      answers,
      overallScore,
      categoryScores,
      strengths,
      improvements,
      duration: sessionDuration,
      completedAt: new Date(),
    };

    onComplete(results);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating personalized questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with Progress */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {currentQuestion?.category} • {config.difficulty}
            </p>
          </div>
          
          {timeRemaining !== null && (
            <div className="flex items-center space-x-2 text-lg font-mono">
              <Clock className="w-5 h-5 text-indigo-600" />
              <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-700'}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Display */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {currentQuestion?.text}
            </h3>
          </div>
          
          <button
            onClick={() => speakQuestion(currentQuestion?.text || '')}
            disabled={isQuestionPlaying}
            className="ml-4 p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors disabled:opacity-50"
          >
            {isQuestionPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Voice Recorder */}
        <VoiceRecorder
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
        />

        {/* Transcription Display */}
        <TranscriptionDisplay
          transcript={currentTranscript}
          isRecording={isRecording}
        />

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <div className="text-sm text-gray-500">
            {isRecording ? 'Recording your answer...' : 'Click the microphone to start recording'}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleNextQuestion}
              disabled={isRecording}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>

      {/* Answer History */}
      {answers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Previous Answers ({answers.length})
          </h3>
          <div className="space-y-3">
            {answers.slice(-3).map((answer, index) => (
              <div key={answer.questionId} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Q{answers.length - 2 + index}: {questions.find(q => q.id === answer.questionId)?.text.substring(0, 60)}...
                  </p>
                  <div className="flex space-x-2 text-xs">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Confidence: {Math.round(answer.confidence * 100)}%
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                      Keywords: {Math.round(answer.keywordScore * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {answer.transcript}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};