import { useState } from 'react';
import { generateAuthorContent, type AIModel } from '../../../../lib/ai/openrouter';
import type { ToneType } from '../components/ToneSelector';

interface GenerateContentParams {
  title: string;
  model: AIModel;
  tone: ToneType;
  language: 'EN' | 'RO';
}

export const useAIGeneration = (language: 'EN' | 'RO' = 'EN') => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTitleAndSubtitle = async ({ title, model, tone }: GenerateContentParams) => {
    try {
      setIsGenerating(true);
      const titlePrompt = language === 'RO'
        ? `Generează un titlu SEO optimizat pentru un articol despre ${title}. Scrie în limba română. Returnează doar textul titlului, fără ghilimele sau alt text.`
        : `Create a single SEO-optimized title for an article about ${title}. Return only the title text without quotes or any other text.`;

      const subtitlePrompt = language === 'RO'
        ? `Generează un subtitlu atractiv pentru un articol despre ${title}. Scrie în limba română. Concentrează-te pe ${tone === 'benefits' ? 'beneficii și valoare' : tone === 'expertise' ? 'expertiză și detalii tehnice' : 'urgență și emoție'}. Returnează doar textul subtitlului, fără ghilimele sau alt text.`
        : `Create a single engaging subtitle for an article about ${title}. Focus on ${tone === 'benefits' ? 'benefits and value' : tone === 'expertise' ? 'expertise and technical details' : 'urgency and emotion'}. Return only the subtitle text without quotes or any other text.`;

      const [titleResponse, subtitleResponse] = await Promise.all([
        generateAuthorContent(titlePrompt, model),
        generateAuthorContent(subtitlePrompt, model)
      ]);

      return {
        title: titleResponse.description.trim(),
        subtitle: subtitleResponse.description.trim()
      };
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateTitleAndSubtitle
  };
};