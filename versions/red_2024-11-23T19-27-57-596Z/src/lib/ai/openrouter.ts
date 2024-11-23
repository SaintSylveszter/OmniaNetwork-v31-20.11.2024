import axios from 'axios';

export const availableModels = [
  { id: "perplexity/llama-3.1-sonar-large-128k-online", name: "Perplexity Llama 3.1 Sonar 8B Large (1/1)" },
  { id: "perplexity/llama-3.1-sonar-small-128k-chat", name: "Perplexity Llama 3.1 Sonar 8B Small (0.2/0.2)" },
  { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet (3/15)" },
  { id: "anthropic/claude-3-5-haiku", name: "Claude 3.5 Haiku (1/5)" },
  { id: "openai/gpt-4o", name: "ChatGPT-4o (2.5/10)" },
  { id: "openai/gpt-4o-mini", name: "ChatGPT-4o Mini (0.15/0.6)" },
  { id: "google/gemini-flash-1.5", name: "Google Gemini Flash 1.5 (0.075/0.3)" },
  { id: "google/gemini-pro-1.5", name: "Google Gemini Pro 1.5 (1.25/5)" },
  { id: "google/gemini-pro-1.5-exp", name: "Google Gemini Pro 1.5 Experimental (free)" },
  { id: "mistralai/mistral-large", name: "Mistral Large (2/6)" }
] as const;

export type AIModel = typeof availableModels[number]['id'];

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateAuthorContent(
  prompt: string,
  model: AIModel
): Promise<{ name: string; description: string }> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  try {
    const response = await axios.post<AIResponse>(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [
          {
            role: "system",
            content: "You are an expert at creating engaging and SEO-optimized content. Generate content based on the given prompt. Keep the response concise and focused."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin
        }
      }
    );

    if (!response.data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from AI service');
    }

    const content = response.data.choices[0].message.content.trim();

    return {
      name: content,      // Now using the content for both name and description
      description: content
    };
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error?.message || 'Failed to generate content');
    }
    throw error;
  }
}