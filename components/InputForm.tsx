import React from 'react';
import { ClearIcon } from './icons/ClearIcon';

interface InputFormProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (message: string) => void;
  isLoading: boolean;
  maxLength: number;
}

export const InputForm: React.FC<InputFormProps> = ({ message, setMessage, onSubmit, isLoading, maxLength }) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && message.length <= maxLength) {
      onSubmit(message);
    }
  };

  const isOverLimit = message.length > maxLength;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type or paste your SMS message here..."
            className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
              isOverLimit ? 'border-red-500 ring-red-300' : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isLoading}
            aria-invalid={isOverLimit}
            aria-describedby="char-count"
          />
          {message && !isLoading && (
              <button
                  type="button"
                  onClick={() => setMessage('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear input"
              >
                  <ClearIcon />
              </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isLoading || !message.trim() || isOverLimit}
          className="w-full sm:w-36 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:bg-gray-400 disabled:saturate-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            'Classify'
          )}
        </button>
      </div>
      <div id="char-count" className="text-right text-xs pr-1">
        <span className={isOverLimit ? 'text-red-600 font-semibold' : 'text-gray-500'}>
          {message.length}
        </span>
        <span className="text-gray-500">/{maxLength}</span>
      </div>
    </form>
  );
};