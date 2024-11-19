import React from 'react';
import { availableModels, type AIModel } from '../../../../lib/ai/openrouter';

interface AIModelSelectorProps {
  selectedModel: AIModel;
  onChange: (model: AIModel) => void;
  className?: string;
}

const AIModelSelector: React.FC<AIModelSelectorProps> = ({
  selectedModel,
  onChange,
  className = ''
}) => {
  return (
    <select
      value={selectedModel}
      onChange={(e) => onChange(e.target.value as AIModel)}
      className={`px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${className}`}
    >
      {availableModels.map(model => (
        <option key={model.id} value={model.id}>
          {model.name}
        </option>
      ))}
    </select>
  );
};

export default AIModelSelector;