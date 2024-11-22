import React, { useState, useEffect } from 'react';
import { getConnection } from '../../../../lib/db/connections';
import sql from '../../../../lib/db/neon';
import AIGenerationForm from '../../ai/components/AIGenerationForm';
import type { ToneType } from '../../ai/components/ToneSelector';
import { availableModels, type AIModel } from '../../../../lib/ai/openrouter';
import { useAIGeneration } from '../../ai/hooks/useAIGeneration';

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  parent_name: string | null;
}

interface Author {
  id: number;
  name: string;
}

interface FormData {
  article_type_id: number | null;
  title: string;
  slug: string;
  subtitle: string;
  alternative_title: string;
  category_id: number | null;
  author_id: number | null;
}

interface GeneralInfoTabProps {
  siteLanguage?: 'EN' | 'RO';
  formData: FormData;
  onUpdateForm: (field: keyof FormData, value: string | number) => void;
}

const GeneralInfoTab: React.FC<GeneralInfoTabProps> = ({ 
  siteLanguage = 'EN',
  formData,
  onUpdateForm
}) => {
  const { isGenerating, generateTitleAndSubtitle } = useAIGeneration(siteLanguage);
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0].id);
  const [selectedTone, setSelectedTone] = useState<ToneType>('benefits');
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Funcție pentru generarea slug-ului
  const generateSlug = (title: string): string => {
    let cleanTitle = title;
    if (siteLanguage === 'RO') {
      cleanTitle = cleanTitle.replace(/(?:din|în)\s+\d{4}/gi, '');
    } else {
      cleanTitle = cleanTitle.replace(/(?:in|from)\s+\d{4}/gi, '');
    }

    return cleanTitle
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-z0-9]+/g, '-')     // replace spaces and other chars with hyphen
      .replace(/^-+|-+$/g, '')         // remove leading/trailing hyphens
      .replace(/[^a-z0-9\-]/g, '');    // remove any remaining invalid chars
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newSlug = generateSlug(newTitle);
    
    // Actualizăm simultan titlul și slug-ul
    onUpdateForm('title', newTitle);
    onUpdateForm('slug', newSlug);
  };

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const adminName = window.location.pathname.split('/')[1];
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string
        FROM admins
        WHERE username = ${adminName}
        AND status = 'active'
      `;

      if (!admin?.connection_string) return;
      const siteDb = getConnection(admin.connection_string);

      const cats = await siteDb`
        SELECT c.*, p.name as parent_name
        FROM categories c
        LEFT JOIN categories p ON c.parent_id = p.id
        ORDER BY COALESCE(p.name, c.name), c.name
      `;
      setCategories(cats);

      const auths = await siteDb`
        SELECT * FROM authors ORDER BY name
      `;
      setAuthors(auths);
    } catch (error) {
      console.error('Error loading form data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const organizeCategories = (categoriesList: Category[]) => {
    const parentCategories = categoriesList
      .filter(cat => !cat.parent_id)
      .sort((a, b) => a.name.localeCompare(b.name));
    
    return parentCategories.map(parent => ({
      ...parent,
      subcategories: categoriesList
        .filter(cat => cat.parent_id === parent.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    }));
  };

  const getTitlePrompt = () => {
    return siteLanguage === 'RO'
      ? `Generează un titlu SEO optimizat pentru un articol despre ${formData.title}. Scrie în limba română. Returnează doar textul titlului, fără ghilimele sau alt text.`
      : `Create a single SEO-optimized title for an article about ${formData.title}. Return only the title text without quotes or any other text.`;
  };

  const getSubtitlePrompt = () => {
    return siteLanguage === 'RO'
      ? `Generează un subtitlu atractiv pentru un articol despre ${formData.title}. Scrie în limba română. Concentrează-te pe beneficii și valoare. Returnează doar textul subtitlului, fără ghilimele sau alt text.`
      : `Create a single engaging subtitle for an article about ${formData.title}. Focus on benefits and affiliate value. Return only the subtitle text without quotes or any other text.`;
  };

  const handleGenerateTitleSubtitle = async () => {
  try {
    const result = await generateTitleAndSubtitle({
      title: formData.title,
      model: selectedModel,
      tone: selectedTone,
      language: siteLanguage
    });
    
    onUpdateForm('alternative_title', result.title); // adăugat aici
    onUpdateForm('subtitle', result.subtitle);
  } catch (error) {
    console.error('Error generating title/subtitle:', error);
  }
};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Article Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          URL Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => onUpdateForm('slug', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="article-url-slug"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            value={formData.category_id?.toString() || ''}
            onChange={(e) => onUpdateForm('category_id', Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {organizeCategories(categories).map(parent => (
              <React.Fragment key={parent.id}>
                <option value={parent.id}>{parent.name}</option>
                {parent.subcategories?.map(sub => (
                  <option key={sub.id} value={sub.id}>
                    {`- ${sub.name}`}
                  </option>
                ))}
              </React.Fragment>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Author
          </label>
          <select
            value={formData.author_id?.toString() || ''}
            onChange={(e) => onUpdateForm('author_id', Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select author</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white">Generate Title & Subtitle</h3>
        
        <AIGenerationForm
          onGenerate={handleGenerateTitleSubtitle}
          prompt={getTitlePrompt()}
          isGenerating={isGenerating}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          selectedTone={selectedTone}
          onToneChange={setSelectedTone}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alternative Title
          </label>
          <input
            type="text"
            value={formData.alternative_title}
            onChange={(e) => onUpdateForm('alternative_title', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Article Subtitle
          </label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => onUpdateForm('subtitle', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      
    </div>
  );
};

export default GeneralInfoTab;