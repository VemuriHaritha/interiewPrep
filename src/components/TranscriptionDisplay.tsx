import React from 'react';
import { MessageSquare } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcript: string;
  isRecording: boolean;
}

export const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcript,
  isRecording,
}) => {
  if (!transcript && !isRecording) {
    return null;
  }

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center mb-3">
        <MessageSquare className="w-5 h-5 text-gray-600 mr-2" />
        <h4 className="text-sm font-semibold text-gray-700">
          {isRecording ? 'Live Transcription' : 'Your Answer'}
        </h4>
        {isRecording && (
          <div className="ml-2 flex space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
      
      <div className="min-h-[100px] max-h-[200px] overflow-y-auto">
        {transcript ? (
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {transcript}
          </p>
        ) : (
          <p className="text-gray-500 italic">
            Start speaking to see your words appear here...
          </p>
        )}
      </div>
      
      {transcript && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Word count: {transcript.split(/\s+/).filter(word => word.length > 0).length}
          </p>
        </div>
      )}
    </div>
  );
};