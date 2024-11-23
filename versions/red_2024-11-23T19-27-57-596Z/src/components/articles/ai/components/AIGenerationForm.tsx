import React, { useState } from 'react';
import { Wand } from 'lucide-react';
import AIModelSelector from './AIModelSelector';
import ToneSelector, { type ToneType } from './ToneSelector';
import { type AIModel } from '../../../../lib/ai/openrouter';

interface AIGenerationFormProps {
  onGenerate: () => Promise<void>;
  prompt: string;
  isGenerating: boolean;
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
  selectedTone: ToneType;
  onToneChange: (tone: ToneType) => void;
  className?: string;
}

const AIGenerationForm: React.FC<AIGenerationFormProps> = ({
  onGenerate,
  prompt,
  isGenerating,
  selectedModel,
  onModelChange,
  selectedTone,
  onToneChange,
  className = ''
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <AIModelSelector
          selectedModel={selectedModel}
          onChange={onModelChange}
          className="flex-1"
        />
        <ToneSelector
          selectedTone={selectedTone}
          onChange={onToneChange}
          className="flex-1"
        />
        <button
          type="button"
          onClick={onGenerate}
          disabled={isGenerating}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
        >
          <Wand className="w-5 h-5 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      <textarea
        value={prompt}
        readOnly
        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        rows={3}
      />
    </div>
  );
};

export default AIGenerationForm;