import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { generateAuthorContent, availableModels } from '../openrouter';

// Mock axios
vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OpenRouter AI Integration', () => {
  const mockApiKey = 'test-api-key';
  const originalEnv = process.env;

  beforeEach(() => {
    // Setup environment
    process.env.VITE_OPENROUTER_API_KEY = mockApiKey;
    // Clear mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore environment
    process.env = originalEnv;
  });

  describe('generateAuthorContent', () => {
    it('should successfully generate content', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Generated content'
              }
            }
          ]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const prompt = 'Generate a test content';
      const model = availableModels[0].id;
      const result = await generateAuthorContent(prompt, model);

      expect(result).toEqual({
        name: 'Generated content',
        description: 'Generated content'
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
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
            'Authorization': `Bearer ${mockApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': expect.any(String)
          }
        }
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'API rate limit exceeded';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      const prompt = 'Generate a test content';
      const model = availableModels[0].id;

      await expect(generateAuthorContent(prompt, model))
        .rejects
        .toThrow('Failed to generate content');
    });

    it('should handle invalid API responses', async () => {
      const mockResponse = {
        data: {
          choices: [] // Empty choices array
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const prompt = 'Generate a test content';
      const model = availableModels[0].id;

      await expect(generateAuthorContent(prompt, model))
        .rejects
        .toThrow('Invalid response from AI service');
    });

    it('should validate required API key', async () => {
      process.env.VITE_OPENROUTER_API_KEY = '';

      const prompt = 'Generate a test content';
      const model = availableModels[0].id;

      await expect(generateAuthorContent(prompt, model))
        .rejects
        .toThrow('OpenRouter API key not configured');
    });

    it('should handle different model selections', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Generated content'
              }
            }
          ]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      // Test with a different model
      const prompt = 'Generate a test content';
      const model = availableModels[1].id; // Use second available model
      const result = await generateAuthorContent(prompt, model);

      expect(result).toEqual({
        name: 'Generated content',
        description: 'Generated content'
      });

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          model: model
        }),
        expect.any(Object)
      );
    });

    it('should trim whitespace from generated content', async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: '  Generated content with whitespace  '
              }
            }
          ]
        }
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const prompt = 'Generate a test content';
      const model = availableModels[0].id;
      const result = await generateAuthorContent(prompt, model);

      expect(result).toEqual({
        name: 'Generated content with whitespace',
        description: 'Generated content with whitespace'
      });
    });
  });

  describe('availableModels', () => {
    it('should have valid model configurations', () => {
      availableModels.forEach(model => {
        expect(model).toHaveProperty('id');
        expect(model).toHaveProperty('name');
        expect(typeof model.id).toBe('string');
        expect(typeof model.name).toBe('string');
      });
    });
  });
});