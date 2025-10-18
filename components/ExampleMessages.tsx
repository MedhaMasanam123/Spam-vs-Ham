import React from 'react';

interface ExampleMessagesProps {
  onExampleClick: (message: string) => void;
}

const examples = {
  ham: [
    "Hey, are we still on for lunch tomorrow at 12?",
    "Your appointment with Dr. Smith is confirmed for June 5th at 2 PM.",
    "Your package has been delivered. Check your front porch.",
  ],
  spam: [
    "URGENT: You've won a $1000 gift card! Click here to claim now: [bit.ly/fake-link]",
    "Exclusive Offer! Get 50% off all designer sunglasses for a limited time.",
    "Your account has been compromised. Please verify your details immediately at [suspicious-url.com]",
  ],
};

export const ExampleMessages: React.FC<ExampleMessagesProps> = ({ onExampleClick }) => {
  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-3">Not sure what to test? Try an example:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {examples.ham.map((msg, idx) => (
          <button
            key={`ham-${idx}`}
            onClick={() => onExampleClick(msg)}
            className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
          >
            Ham Example
          </button>
        ))}
        {examples.spam.map((msg, idx) => (
          <button
            key={`spam-${idx}`}
            onClick={() => onExampleClick(msg)}
            className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
          >
            Spam Example
          </button>
        ))}
      </div>
    </div>
  );
};
