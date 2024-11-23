import React, { useState } from 'react';
import { Wand } from 'lucide-react';
import { availableModels, generateAuthorContent, type AIModel } from '../../../lib/ai/openrouter';

interface AIGenerationProps {
  title: string;
  onSubtitleGenerated: (subtitle: string) => void;
  onAlternativeTitleGenerated: (title: string) => void;
  siteLanguage: 'EN' | 'RO';
}

const AIGeneration: React.FC<AIGenerationProps> = ({
  title,
  onSubtitleGenerated,
  onAlternativeTitleGenerated,
  siteLanguage
}) => {
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateContent = async () => {
    if (!title.trim()) {
      setError('Please enter an article title first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate alternative title
      const titlePrompt = `Create a single SEO-optimized title for an article about ${title}. ${siteLanguage === 'RO' ? 'Write in Romanian.' : ''} Return only the title text without quotes or any other text.`;
      const titleResponse = await generateAuthorContent(titlePrompt, selectedModel);
      onAlternativeTitleGenerated(titleResponse.name.replace(/^["']|["']$/g, '').trim());

      // Generate subtitle
      const subtitlePrompt = `Create a single engaging subtitle for an article about ${title}. ${siteLanguage === 'RO' ? 'Write in Romanian.' : ''} Focus on benefits and affiliate value. Return only the subtitle text without quotes or any other text.`;
      const subtitleResponse = await generateAuthorContent(subtitlePrompt, selectedModel);
      onSubtitleGenerated(subtitleResponse.description.replace(/^["']|["']$/g, '').trim());

    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="border-t border-gray-700 pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Generate Content with AI</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AIModel)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={generateContent}
            disabled={isGenerating || !title.trim()}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wand className="w-5 h-5 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-2 p-3 bg-red-900/30 text-red-400 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIGeneration;