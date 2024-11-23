import React from 'react';
import { useAIGeneration } from '../ai/hooks/useAIGeneration';
import type { ToneType, Language } from '../ai/hooks/useAIGeneration';

interface ProductsTop10FormData {
  disclosure: string;
  best_of: string;
  product_type: string;
  affiliate_button_text: string;
  show_reviews: boolean;
  introduction: string;
  additionalContent: string;
  faq: string;
  conclusion: string;
}

interface SpecificInfoTabProps {
  formData: ProductsTop10FormData;
  onChange: (data: Partial<ProductsTop10FormData>) => void;
  initialData?: ProductsTop10FormData;
  siteLanguage: Language;
}

const SpecificInfoTab: React.FC<SpecificInfoTabProps> = ({
  formData,
  onChange,
  initialData,
  siteLanguage
}) => {
  const {
    selectedModel,
    setSelectedModel,
    selectedTone,
    setSelectedTone,
    isGenerating,
    generateContent,
    generateIntroduction,
    generateConclusion,
    availableModels
  } = useAIGeneration(siteLanguage);

  // Generic handler pentru input-uri
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  // Handlere pentru generare conținut
  const handleGenerateIntro = async () => {
    try {
      onChange({ introduction: 'Generating...' });
      const content = await generateIntroduction(formData.product_type);
      onChange({ introduction: content });
    } catch (error) {
      console.error('Error generating introduction:', error);
      onChange({ introduction: '' });
    }
  };

  const handleGenerateAdditionalContent = async () => {
    try {
      onChange({ additionalContent: 'Generating...' });
      const prompt = `Vreau să generezi o secțiune formată din mai multe paragrafe, care să prezinte "Principalele criterii de alegere pentru ${formData.product_type}". Vreau ca textul generat să fie generat cu tag-uri HTML și să aibă forma: <h2>Titlu</h2> <h3>Subtitlu1</h3><p>Paragraf1</p> <h3>Subtitlu2</h3><p>Paragraf2</p> etc.`;
      const content = await generateContent(prompt);
      onChange({ additionalContent: content });
    } catch (error) {
      console.error('Error generating additional content:', error);
      onChange({ additionalContent: '' });
    }
  };

  const handleGenerateFaq = async () => {
    try {
      onChange({ faq: 'Generating...' });
      const prompt = `Vreau să generezi o secțiune formată din mai multe paragrafe scurte, care să prezinte "Întrebări frecvente despre ${formData.product_type}". Vreau ca textul generat să fie generat cu tag-uri HTML și să aibă forma: <h2>Întrebări frecvente</h2> <h3>Întrebare1</h3><p>Răspuns1</p> <h3>Întrebare2</h3><p>Răspuns2</p> etc.`;
      const content = await generateContent(prompt);
      onChange({ faq: content });
    } catch (error) {
      console.error('Error generating FAQ:', error);
      onChange({ faq: '' });
    }
  };

  const handleGenerateConclusion = async () => {
    try {
      onChange({ conclusion: 'Generating...' });
      const content = await generateConclusion(formData.product_type);
      onChange({ conclusion: content });
    } catch (error) {
      console.error('Error generating conclusion:', error);
      onChange({ conclusion: '' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Info Section */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Disclosure
          </label>
          <textarea
            name="disclosure"
            value={formData.disclosure}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Best of
            </label>
            <input
              type="text"
              name="best_of"
              value={formData.best_of}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Product Type
            </label>
            <input
              type="text"
              name="product_type"
              value={formData.product_type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Affiliate Button Text
          </label>
          <input
            type="text"
            name="affiliate_button_text"
            value={formData.affiliate_button_text}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Show Reviews
          </label>
          <select
            name="show_reviews"
            value={formData.show_reviews ? 'Yes' : 'No'}
            onChange={(e) => onChange({ show_reviews: e.target.value === 'Yes' })}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
      </div>

      {/* Introduction Generator */}
      <div className="space-y-4 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white">Generate Introduction</h3>

        <div className="flex items-center space-x-4 mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AIModel)}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>

          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value as ToneType)}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="benefits">Emphasis on user benefits</option>
            <option value="expertise">Focus on expertise and details</option>
            <option value="urgency">Appeal to emotion and urgency</option>
          </select>

          <button
            type="button"
            onClick={handleGenerateIntro}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>

        <textarea
          value={getIntroPrompt()}
          readOnly
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Article Introduction
          </label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={4}
          />
        </div>
      </div>

      {/* Additional Content Generator */}
      <div className="space-y-4 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white">Additional Content</h3>

        <div className="flex items-center space-x-4 mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AIModel)}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGenerateAdditionalContent}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>

        <textarea
          value={getAdditionalContentPrompt()}
          readOnly
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Additional Content
          </label>
          <textarea
            name="additionalContent"
            value={formData.additionalContent}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={8}
          />
        </div>
      </div>

      {/* FAQ Generator */}
      <div className="space-y-4 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white">FAQ</h3>

        <div className="flex items-center space-x-4 mb-4">
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AIModel)}
            className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>{model.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleGenerateFaq}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>

        <textarea
          value={getFaqPrompt()}
          readOnly
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          rows={3}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            FAQ Content
          </label>
          <textarea
            name="faq"
            value={formData.faq}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={8}
          />
        </div>
      </div>

      {/* Conclusion Generator */}
     <div className="space-y-4 border-t border-gray-700 pt-6">
       <h3 className="text-lg font-medium text-white">Conclusion</h3>

       <div className="flex items-center space-x-4 mb-4">
         <select
           value={selectedModel}
           onChange={(e) => setSelectedModel(e.target.value as AIModel)}
           className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
         >
           {availableModels.map(model => (
             <option key={model.id} value={model.id}>{model.name}</option>
           ))}
         </select>

         <button
           type="button"
           onClick={handleGenerateConclusion}
           className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
         >
           Generate
         </button>
       </div>

       <textarea
         value={getConclusionPrompt()}
         readOnly
         className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
         rows={3}
       />

       <div>
         <label className="block text-sm font-medium text-gray-300 mb-2">
           Conclusion Content
         </label>
         <textarea
           name="conclusion"
           value={formData.conclusion}
           onChange={handleInputChange}
           className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
           rows={8}
         />
       </div>
     </div>
   </div>
 );
};

export default SpecificInfo;