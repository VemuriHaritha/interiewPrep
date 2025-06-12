import React, { useState } from 'react';
import { Brain, Mic, FileText, BarChart3 } from 'lucide-react';
import { Header } from './components/Header';
import { InterviewSetup } from './components/InterviewSetup';
import { InterviewSession } from './components/InterviewSession';
import { ResultsDashboard } from './components/ResultsDashboard';
import { InterviewConfig, InterviewResult } from './types/interview';

type AppState = 'setup' | 'interview' | 'results';

function App() {
  const [state, setState] = useState<AppState>('setup');
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [results, setResults] = useState<InterviewResult | null>(null);

  const handleStartInterview = (interviewConfig: InterviewConfig) => {
    setConfig(interviewConfig);
    setState('interview');
  };

  const handleInterviewComplete = (interviewResults: InterviewResult) => {
    setResults(interviewResults);
    setState('results');
  };

  const handleNewInterview = () => {
    setConfig(null);
    setResults(null);
    setState('setup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <Header onNewInterview={handleNewInterview} showNewButton={state !== 'setup'} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state === 'setup' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl">
                  <Brain className="w-12 h-12 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Master Your Next Interview
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Practice with our AI-powered voice assistant, get real-time feedback, 
                and receive personalized performance reports to ace your interviews.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Voice Assistant</h3>
                <p className="text-gray-600">
                  Interactive voice-based interviews with speech-to-text transcription 
                  and natural conversation flow.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Questions</h3>
                <p className="text-gray-600">
                  AI-generated questions tailored to your domain, experience level, 
                  and uploaded resume content.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Analytics</h3>
                <p className="text-gray-600">
                  Detailed feedback on confidence, fluency, keyword matching, 
                  and areas for improvement.
                </p>
              </div>
            </div>

            <InterviewSetup onStartInterview={handleStartInterview} />
          </div>
        )}

        {state === 'interview' && config && (
          <InterviewSession 
            config={config} 
            onComplete={handleInterviewComplete}
          />
        )}

        {state === 'results' && results && (
          <ResultsDashboard 
            results={results} 
            onNewInterview={handleNewInterview}
          />
        )}
      </main>
    </div>
  );
}

export default App;