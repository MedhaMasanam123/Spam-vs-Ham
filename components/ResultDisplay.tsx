import React, { useState, useCallback } from 'react';
import type { ClassificationResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { InfoIcon } from './icons/InfoIcon';
import { CopyIcon } from './icons/CopyIcon';
import { ShareIcon } from './icons/ShareIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { ReferencesDisplay } from './ReferencesDisplay';

interface ResultDisplayProps {
  result: ClassificationResult;
  onCopy: () => void;
  onShare: () => void;
  isShareSupported: boolean;
  onFeedback: () => void;
  feedbackGiven: boolean;
}

const DonutChart: React.FC<{ probability: number; color: string }> = ({ probability, color }) => {
  const percentage = Math.round(probability * 100);
  const data = [
    { name: 'Probability', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];

  return (
    <ResponsiveContainer width="100%" height={150}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={70}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
        >
          <Cell key="cell-0" fill={color} stroke={color} />
          <Cell key="cell-1" fill="#e5e7eb" stroke="#e5e7eb" />
          <Label
            value={`${percentage}%`}
            position="center"
            fill={color}
            className="text-3xl font-bold"
          />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};


const Tooltip: React.FC = () => (
    <div className="relative group flex items-center">
      <InfoIcon />
      <div className="absolute bottom-full mb-2 w-64 bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2 shadow-lg z-10">
        <span className="font-bold">Spam:</span> Unsolicited ads, promotions, or phishing attempts.
        <br />
        <span className="font-bold">Ham:</span> Legitimate, personal, or expected messages.
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
      </div>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, onCopy, onShare, isShareSupported, onFeedback, feedbackGiven }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isSpam = result.classification === 'Spam';
  const color = isSpam ? '#ef4444' : '#22c55e';
  const textColor = isSpam ? 'text-red-500' : 'text-green-500';
  const bgColor = isSpam ? 'bg-red-50' : 'bg-green-50';
  const actionButtonClasses = "flex items-center justify-center gap-2 w-full sm:w-auto text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200";
  const copyButtonColor = isCopied ? "bg-green-100 text-green-700" : "bg-gray-100 hover:bg-gray-200 text-gray-700";

  const handleCopy = useCallback(() => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  }, [onCopy]);

  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-lg ${bgColor} border ${isSpam ? 'border-red-200' : 'border-green-200'} flex flex-col md:flex-row items-center justify-between`}>
        <div className="flex flex-col items-center md:items-start text-center md:text-left mb-4 md:mb-0">
          <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-700">Result</h2>
              <Tooltip />
          </div>
          <p className={`text-5xl font-bold ${textColor}`}>{result.classification}</p>
          <p className="text-gray-500 mt-1">Confidence Score</p>
        </div>
        <div className="w-40 h-40">
          <DonutChart probability={result.probability} color={color} />
        </div>
      </div>
      
      {result.references && result.references.length > 0 && (
          <ReferencesDisplay references={result.references} />
      )}
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button onClick={handleCopy} className={`${actionButtonClasses} ${copyButtonColor}`}>
            {isCopied ? <CheckIcon /> : <CopyIcon />}
            <span>{isCopied ? 'Copied!' : 'Copy Result'}</span>
        </button>
        {isShareSupported && (
            <button onClick={onShare} className={`${actionButtonClasses} bg-gray-100 hover:bg-gray-200 text-gray-700`}>
                <ShareIcon />
                <span>Share</span>
            </button>
        )}
      </div>

      <div className="text-center pt-2 border-t border-gray-200">
        {feedbackGiven ? (
            <p className="text-gray-600 text-sm font-medium fade-in">Thanks for your feedback!</p>
        ) : (
            <>
                <p className="text-sm text-gray-600 mb-2">Was this classification helpful?</p>
                <div className="flex items-center justify-center gap-3">
                    <button onClick={onFeedback} className="p-2 rounded-full text-gray-400 hover:text-green-600 hover:bg-green-100 transition-colors" aria-label="Good classification">
                        <ThumbsUpIcon />
                    </button>
                    <button onClick={onFeedback} className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 transition-colors" aria-label="Bad classification">
                        <ThumbsDownIcon />
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};
