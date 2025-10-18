import React from 'react';
import type { HistoryItem } from '../types';

interface HistoryLogProps {
  history: HistoryItem[];
}

const HistoryItemCard: React.FC<{ item: HistoryItem }> = ({ item }) => {
    const isSpam = item.classification === 'Spam';
    const borderColor = isSpam ? 'border-l-red-400' : 'border-l-green-400';
    const textColor = isSpam ? 'text-red-600' : 'text-green-600';
    const probability = Math.round(item.probability * 100);
    const formattedTime = new Date(item.id).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <li className={`p-4 bg-gray-50 rounded-md border-l-4 ${borderColor} fade-in`}>
            <p className="text-gray-700 italic">"{item.message}"</p>
            <div className="flex justify-between items-center mt-2 text-sm">
                <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-base ${textColor}`}>{item.classification}</span>
                    <span className="text-gray-500">({probability}% confident)</span>
                </div>
                <span className="text-gray-400">{formattedTime}</span>
            </div>
        </li>
    );
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ history }) => {
  return (
    <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
      {history.map(item => (
        <HistoryItemCard key={item.id} item={item} />
      ))}
    </ul>
  );
};