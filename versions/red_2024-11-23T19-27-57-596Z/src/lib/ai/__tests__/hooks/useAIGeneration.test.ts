import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import { generateAuthorContent } from '../../openrouter';

// Mock the openrouter module
vi.mock('../../openrouter', () => ({
  generateAuthorContent: vi.fn(),
  availableModels: [
    { id: 'model1', name: 'Model 1' },
    { id: 'model2', name: 'Model 2' }
  ]
}));

describe('useAIGeneration Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAIGeneration());

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.selectedModel).toBeDefined();
    expect(result.current.selectedTone).toBe('benefits');
  });

  it('should generate title and subtitle successfully', async () => {
    const mockGenerateResponse = {
      description: 'Generated content'
    };

    (generateAuthorContent as jest.Mock).mockResolvedValueOnce(mockGenerateResponse)
      .mockResolvedValueOnce(mockGenerateResponse);

    const { result } = renderHook(() => useAIGeneration());

    await act(async () => {
      const response = await result.current.generateTitleAndSubtitle({
        title: 'Test Title',
        model: 'model1',
        tone: 'benefits',
        language: 'EN'
      });

      expect(response).toEqual({
        title: 'Generated content',
        subtitle: 'Generated content'
      });
    });

    expect(generateAuthorContent).toHaveBeenCalledTimes(2);
  });

  it('should handle generation errors', async () => {
    (generateAuthorContent as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useAIGeneration());

    await act(async () => {
      try {
        await result.current.generateTitleAndSubtitle({
          title: 'Test Title',
          model: 'model1',
          tone: 'benefits',
          language: 'EN'
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  it('should handle language-specific prompts', async () => {
    const mockGenerateResponse = {
      description: 'Generated content'
    };

    (generateAuthorContent as jest.Mock).mockResolvedValueOnce(mockGenerateResponse)
      .mockResolvedValueOnce(mockGenerateResponse);

    // Test Romanian language
    const { result: roResult } = renderHook(() => useAIGeneration('RO'));

    await act(async () => {
      await roResult.current.generateTitleAndSubtitle({
        title: 'Test Title',
        model: 'model1',
        tone: 'benefits',
        language: 'RO'
      });
    });

    // Verify Romanian prompt was used
    expect(generateAuthorContent).toHaveBeenCalledWith(
      expect.stringContaining('limba română'),
      expect.any(String)
    );

    // Clear mocks
    vi.clearAllMocks();

    // Test English language
    const { result: enResult } = renderHook(() => useAIGeneration('EN'));

    await act(async () => {
      await enResult.current.generateTitleAndSubtitle({
        title: 'Test Title',
        model: 'model1',
        tone: 'benefits',
        language: 'EN'
      });
    });

    // Verify English prompt was used
    expect(generateAuthorContent).toHaveBeenCalledWith(
      expect.not.stringContaining('limba română'),
      expect.any(String)
    );
  });

  it('should handle different tone selections', async () => {
    const mockGenerateResponse = {
      description: 'Generated content'
    };

    (generateAuthorContent as jest.Mock).mockResolvedValueOnce(mockGenerateResponse)
      .mockResolvedValueOnce(mockGenerateResponse);

    const { result } = renderHook(() => useAIGeneration());

    // Test with expertise tone
    await act(async () => {
      await result.current.generateTitleAndSubtitle({
        title: 'Test Title',
        model: 'model1',
        tone: 'expertise',
        language: 'EN'
      });
    });

    expect(generateAuthorContent).toHaveBeenCalledWith(
      expect.stringContaining('expertise'),
      expect.any(String)
    );
  });

  it('should update isGenerating state correctly', async () => {
    const mockGenerateResponse = {
      description: 'Generated content'
    };

    (generateAuthorContent as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockGenerateResponse), 100))
    );

    const { result } = renderHook(() => useAIGeneration());

    await act(async () => {
      const generatePromise = result.current.generateTitleAndSubtitle({
        title: 'Test Title',
        model: 'model1',
        tone: 'benefits',
        language: 'EN'
      });

      // Check if isGenerating is true during generation
      expect(result.current.isGenerating).toBe(true);

      await generatePromise;

      // Check if isGenerating is false after completion
      expect(result.current.isGenerating).toBe(false);
    });
  });
});