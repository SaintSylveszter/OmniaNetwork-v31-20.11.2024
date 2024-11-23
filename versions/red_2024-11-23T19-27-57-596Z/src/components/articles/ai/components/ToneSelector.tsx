import React from 'react';

export type ToneType = 'benefits' | 'expertise' | 'urgency';

interface ToneSelectorProps {
  selectedTone: ToneType;
  onChange: (tone: ToneType) => void;
  className?: string;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({
  selectedTone,
  onChange,
  className = ''
}) => {
  return (
    <select
      value={selectedTone}
      onChange={(e) => onChange(e.target.value as ToneType)}
      className={`px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    >
      <option value="benefits">Emphasis on user benefits</option>
      <option value="expertise">Focus on expertise and details</option>
      <option value="urgency">Appeal to emotion and urgency</option>
    </select>
  );
};

export default ToneSelector;