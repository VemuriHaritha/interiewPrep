import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { InterviewResult } from '../types/interview';
import { generatePDFReport } from '../utils/reportGenerator';

interface ResultsDashboardProps {
  results: InterviewResult;
  onNewInterview: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ results, onNewInterview }) => {
  const { answers, questions, overallScore, categoryScores, strengths, improvements } = results;

  // Prepare chart data
  const categoryData = Object.entries(categoryScores).map(([category, score]) => ({
    category: category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    score: Math.round(score * 100),
  }));

  const performanceData = [
    { name: 'Confidence', score: Math.round(answers.reduce((sum, a) => sum + a.confidence, 0) / answers.length * 100) },
    { name: 'Keywords', score: Math.round(answers.reduce((sum, a) => sum + a.keywordScore, 0) / answers.length * 100) },
    { name: 'Fluency', score: Math.round(answers.reduce((sum, a) => sum + a.fluencyScore, 0) / answers.length * 100) },
  ];

  const passFailData = [
    { name: 'Strong Answers', value: answers.filter(a => (a.confidence + a.keywordScore + a.fluencyScore) / 3 > 0.7).length, color: '#10B981' },
    { name: 'Good Answers', value: answers.filter(a => {
      const avg = (a.confidence + a.keywordScore + a.fluencyScore) / 3;
      return avg > 0.5 && avg <= 0.7;
    }).length, color: '#F59E0B' },
    { name: 'Needs Work', value: answers.filter(a => (a.confidence + a.keywordScore + a.fluencyScore) / 3 <= 0.5).length, color: '#EF4444' },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const handleDownloadReport = () => {
    generatePDFReport(results);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={`p-4 rounded-2xl ${getScoreBg(overallScore * 100)}`}>
            <Award className={`w-12 h-12 ${getScoreColor(overallScore * 100)}`} />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Interview Complete!</h1>
        <p className="text-lg text-gray-600">
          You answered {answers.length} of {questions.length} questions
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Performance</h2>
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#E5E7EB"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={overallScore >= 0.8 ? '#10B981' : overallScore >= 0.6 ? '#F59E0B' : '#EF4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${overallScore * 314} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(overallScore * 100)}`}>
                {Math.round(overallScore * 100)}%
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600">
          {overallScore >= 0.8 ? 'Excellent performance!' : 
           overallScore >= 0.6 ? 'Good job, with room for improvement' : 
           'Keep practicing to improve your skills'}
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceData.map((metric) => (
          <div key={metric.name} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{metric.name}</h3>
              <span className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                {metric.score}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  metric.score >= 80 ? 'bg-green-500' : 
                  metric.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${metric.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        {categoryData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                <Bar dataKey="score" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Answer Quality Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Quality Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {passFailData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Question Analysis</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Keywords</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fluency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overall</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {questions.map((question, index) => {
                const answer = answers.find(a => a.questionId === question.id);
                const overall = answer ? Math.round((answer.confidence + answer.keywordScore + answer.fluencyScore) / 3 * 100) : 0;
                
                return (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {question.text}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                      {question.category.replace('-', ' ')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${answer ? getScoreColor(answer.confidence * 100) : 'text-gray-400'}`}>
                        {answer ? Math.round(answer.confidence * 100) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${answer ? getScoreColor(answer.keywordScore * 100) : 'text-gray-400'}`}>
                        {answer ? Math.round(answer.keywordScore * 100) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${answer ? getScoreColor(answer.fluencyScore * 100) : 'text-gray-400'}`}>
                        {answer ? Math.round(answer.fluencyScore * 100) : 0}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-bold ${getScoreColor(overall)}`}>
                        {overall}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={handleDownloadReport}
          className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Download className="w-5 h-5 mr-2" />
          Download PDF Report
        </button>
        
        <button
          onClick={onNewInterview}
          className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <TrendingUp className="w-5 h-5 mr-2" />
          Start New Interview
        </button>
      </div>
    </div>
  );
};