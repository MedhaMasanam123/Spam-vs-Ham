import React from 'react';
import type { Reference } from '../types';

interface ReferencesDisplayProps {
  references: Reference[];
}

export const ReferencesDisplay: React.FC<ReferencesDisplayProps> = ({ references }) => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg fade-in">
        <h3 className="font-semibold text-gray-700 mb-2">References</h3>
        <ul className="space-y-2">
            {references.map((ref, index) => (
                <li key={index} className="text-sm">
                    <a 
                        href={ref.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline hover:text-blue-800 transition-colors truncate"
                        title={ref.title}
                    >
                       [{index + 1}] {ref.title}
                    </a>
                </li>
            ))}
        </ul>
    </div>
  )
};
