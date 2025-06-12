import React, { useState } from 'react';
import { Upload, Clock, Target, BookOpen, FileText } from 'lucide-react';
import { InterviewConfig } from '../types/interview';

interface InterviewSetupProps {
  onStartInterview: (config: InterviewConfig) => void;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ onStartInterview }) => {
  const [domain, setDomain] = useState('web-development');
  const [mode, setMode] = useState<'practice' | 'timed'>('practice');
  const [duration, setDuration] = useState(30);
  const [questionCount, setQuestionCount] = useState(10);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [resume, setResume] = useState<File | null>(null);

  const domains = [
    { id: 'web-development', name: 'Web Development', icon: '💻' },
    { id: 'data-structures', name: 'Data Structures & Algorithms', icon: '🔢' },
    { id: 'system-design', name: 'System Design', icon: '🏗️' },
    { id: 'behavioral', name: 'Behavioral & HR', icon: '👥' },
    { id: 'machine-learning', name: 'Machine Learning', icon: '🤖' },
    { id: 'mobile-development', name: 'Mobile Development', icon: '📱' },
  ];

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    }
  };

  const handleStartInterview = () => {
    const config: InterviewConfig = {
      domain,
      mode,
      duration: mode === 'timed' ? duration : undefined,
      questionCount,
      difficulty,
      resume: resume || undefined,
    };
    onStartInterview(config);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Configure Your Interview Session
        </h2>

        <div className="space-y-8">
          {/* Domain Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              <BookOpen className="w-4 h-4 inline mr-2" />
              Interview Domain
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDomain(d.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                    domain === d.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{d.icon}</div>
                  <div className="font-medium text-sm">{d.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              <Target className="w-4 h-4 inline mr-2" />
              Interview Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setMode('practice')}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  mode === 'practice'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="font-semibold">Practice Mode</div>
                <div className="text-sm text-gray-600 mt-1">Unlimited time, focus on learning</div>
              </button>
              <button
                onClick={() => setMode('timed')}
                className={`p-6 rounded-xl border-2 text-center transition-all ${
                  mode === 'timed'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">⏱️</div>
                <div className="font-semibold">Timed Mock</div>
                <div className="text-sm text-gray-600 mt-1">Real interview simulation</div>
              </button>
            </div>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mode === 'timed' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Duration (minutes)
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value={5}>5 questions</option>
                <option value={10}>10 questions</option>
                <option value={15}>15 questions</option>
                <option value={20}>20 questions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              <FileText className="w-4 h-4 inline mr-2" />
              Upload Resume (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-sm text-gray-600 mb-2">
                Upload your resume for personalized questions
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
              >
                Choose PDF File
              </label>
              {resume && (
                <div className="mt-2 text-sm text-green-600">
                  ✓ {resume.name} uploaded
                </div>
              )}
            </div>
          </div>

          {/* Start Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleStartInterview}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Start Interview Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};