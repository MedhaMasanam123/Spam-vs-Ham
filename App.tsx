import React, { useState, useCallback } from 'react';
import { classifyMessage } from './services/geminiService';
import type { ClassificationResult, HistoryItem } from './types';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { HistoryLog } from './components/HistoryLog';
import { ResetIcon } from './components/icons/ResetIcon';
import { ExampleMessages } from './components/ExampleMessages';

const MAX_MESSAGE_LENGTH = 500;

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState<string>('');
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  // Check for Web Share API support
  const isShareSupported = typeof navigator !== 'undefined' && !!navigator.share;

  const handleSubmit = useCallback(async (sms: string) => {
    if (!sms.trim()) {
      setError('Message cannot be empty. Please enter a message.');
      return;
    }
    if (sms.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long. Please limit it to ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedbackGiven(false);
    setLastSubmittedMessage(sms);

    try {
      const classificationResult = await classifyMessage(sms);
      setResult(classificationResult);
      setShowResult(true);
      setHistory(prevHistory => [
        { ...classificationResult, message: sms, id: new Date().toISOString() },
        ...prevHistory,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setShowResult(false);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleClearHistory = () => {
    setHistory([]);
    setResult(null);
    setShowResult(false);
    setError(null);
  };
  
  const handleCopy = useCallback(() => {
    if (!result) return;
    const textToCopy = `SMS Message: "${lastSubmittedMessage}"\nResult: ${result.classification} (${Math.round(result.probability * 100)}% Confident)`;
    navigator.clipboard.writeText(textToCopy).catch(err => console.error('Failed to copy text: ', err));
  }, [result, lastSubmittedMessage]);
  
  const handleShare = useCallback(async () => {
    if (!result || !isShareSupported) return;
    const shareData = {
      title: 'SMS Spam Classification Result',
      text: `SMS Message: "${lastSubmittedMessage}"\nResult: ${result.classification} (${Math.round(result.probability * 100)}% Confident)`,
    };
    try {
      await navigator.share(shareData);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, [result, lastSubmittedMessage, isShareSupported]);
  
  const handleExampleClick = (exampleMessage: string) => {
    setMessage(exampleMessage);
  };

  const handleFeedback = () => {
    setFeedbackGiven(true);
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">SMS Spam Classifier</h1>
          <p className="text-lg text-gray-500 mt-3">
            Use the power of AI to instantly detect spam messages.
          </p>
        </header>

        <main className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 space-y-6 transition-all duration-300">
          <InputForm
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            maxLength={MAX_MESSAGE_LENGTH}
          />
          
          <ExampleMessages onExampleClick={handleExampleClick} />

          {error && <div className="text-center text-red-600 bg-red-100 border border-red-200 p-3 rounded-lg fade-in">{error}</div>}
          
          <div className={`transition-all duration-500 ease-in-out ${showResult ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            {result && (
              <ResultDisplay 
                result={result}
                onCopy={handleCopy}
                onShare={handleShare}
                isShareSupported={isShareSupported}
                onFeedback={handleFeedback}
                feedbackGiven={feedbackGiven}
              />
            )}
          </div>
        </main>
        
        {history.length > 0 && (
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 fade-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700">History</h2>
                <button
                    onClick={handleClearHistory}
                    className="flex items-center space-x-2 text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 bg-gray-100 hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium"
                    title="Clear history"
                >
                    <ResetIcon />
                    <span>Clear History</span>
                </button>
              </div>
            <HistoryLog history={history} />
          </div>
        )}
      </div>
       <footer className="text-center mt-12 text-gray-500/80 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;