import { availableModels, generateAuthorContent, type AIModel } from '../../../../lib/ai/openrouter';
import type { ToneType } from '../components/ToneSelector';

export { availableModels, generateAuthorContent, type AIModel };

export function getPromptForLanguage(
  basePrompt: string,
  language: 'EN' | 'RO'
): string {
  return language === 'RO'
    ? `${basePrompt} Scrie în limba română.`
    : basePrompt;
}

export function getTitlePrompt(
  title: string,
  language: 'EN' | 'RO',
  tone: ToneType
): string {
  const basePrompt = `Create a single SEO-optimized title for an article about ${title}. ${
    tone === 'benefits'
      ? 'Focus on user benefits.'
      : tone === 'expertise'
      ? 'Emphasize expertise and authority.'
      : 'Create a sense of urgency.'
  } Return only the title text without quotes or any other text.`;
  return getPromptForLanguage(basePrompt, language);
}

export function getSubtitlePrompt(
  title: string,
  language: 'EN' | 'RO',
  tone: ToneType
): string {
  const basePrompt = `Create a single engaging subtitle for an article about ${title}. ${
    tone === 'benefits'
      ? 'Focus on key benefits for the reader.'
      : tone === 'expertise'
      ? 'Highlight research and expertise.'
      : 'Emphasize time-sensitive value.'
  } Return only the subtitle text without quotes or any other text.`;
  return getPromptForLanguage(basePrompt, language);
}

export function getIntroPrompt(
  productType: string,
  language: 'EN' | 'RO',
  tone: ToneType
): string {
  const reviewCount = Math.floor(Math.random() * 241) + 160;
  const modelCount = Math.floor(Math.random() * 23) + 23;
  const year = new Date().getFullYear();
  const basePrompt = `Generate an introductory paragraph (maximum 400 characters) for a ${productType} buying guide. Include that we analyzed ${modelCount} models and ${reviewCount} reviews in ${year}. ${
    tone === 'benefits'
      ? 'Focus on how this will help readers make better choices.'
      : tone === 'expertise'
      ? 'Emphasize our thorough research process.'
      : 'Create urgency about making the right choice now.'
  }`;
  return getPromptForLanguage(basePrompt, language);
}

export function getConclusionPrompt(
  productType: string,
  language: 'EN' | 'RO',
  tone: ToneType
): string {
  const basePrompt = `Generate a conclusion paragraph for an article about ${productType}. ${
    tone === 'benefits'
      ? 'Summarize the key benefits for readers.'
      : tone === 'expertise'
      ? 'Reinforce our expert recommendations.'
      : 'Encourage immediate action.'
  } Include HTML tags: <h2>Conclusion</h2> <p>ConclusionText</p>`;
  return getPromptForLanguage(basePrompt, language);
}