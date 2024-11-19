import React, { useState, useEffect } from 'react';
import { getConnection } from '../../../lib/db/connections';
import sql from '../../../lib/db/neon';
import { availableModels, generateAuthorContent, type AIModel } from '../../../lib/ai/openrouter';
import { createArticle } from '../../../lib/api/articles';

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  parent_name: string | null;
}

interface Author {
  id: string;
  name: string;
}

interface FormData {
  title: string;
  url: string;
  alternativeTitle: string;
  subtitle: string;
  category_id: string;
  author_id: string;
  disclosure: string;
  best_of: string;
  product_type: string;
  affiliate_button_text: string;
  show_reviews: boolean;
  status: 'published' | 'scheduled' | 'paused';
  introduction: string;
  additionalContent: string;
  faq: string;
  conclusion: string;
}

type ToneType = 'benefits' | 'expertise' | 'urgency';

interface ArticleDataTabProps {
  onSubmit: (data: any) => void;
  initialData?: FormData;
}

const ArticleDataTab: React.FC<ArticleDataTabProps> = ({ onSubmit, initialData }) => {
  // Funcție creată extern cu claude.ai
  console.log('ArticleDataTab received initialData:', initialData);
  const organizeCategories = (categoriesList: Category[]) => {
    // Separăm categoriile părinte (parent_id == null)
    const parentCategories = categoriesList
      .filter(cat => !cat.parent_id)
      .sort((a, b) => a.name.localeCompare(b.name));
    // Creăm structura finală
    return parentCategories.map(parent => ({
      ...parent,
      subcategories: categoriesList
        .filter(cat => cat.parent_id === parent.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    }));
  };
  const [connectionString, setConnectionString] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [siteLanguage, setSiteLanguage] = useState<'EN' | 'RO'>('EN');
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0].id);
  const [selectedTone, setSelectedTone] = useState<ToneType>('benefits');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    url: '',
    alternativeTitle: '',
    subtitle: '',
    category_id: '',
    author_id: '',
    disclosure: '',
    best_of: '',
    product_type: '',
    affiliate_button_text: '',
    show_reviews: true,
    status: 'scheduled',
    introduction: '',
    additionalContent: '',
    faq: '',
    conclusion: ''
  });

  useEffect(() => {
    loadFormData();
  }, []);

  // Add effect to update URL slug when title changes
  useEffect(() => {
    if (formData.title) {
      const slug = generateSlug(formData.title, siteLanguage);
      setFormData(prev => ({ ...prev, url: slug }));
    }
  }, [formData.title, siteLanguage]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
      setConnectionString(admin.connection_string);

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

      const [siteInfo] = await siteDb`
        SELECT language FROM basic_info LIMIT 1
      `;
      const language = siteInfo?.language || 'EN';
      setSiteLanguage(language as 'EN' | 'RO');

      setFormData(prev => ({
        ...prev,
        disclosure: language === 'RO'
          ? 'Efectuăm verificări zilnice ale pieței pentru a monitoriza disponibilitatea, lansările de modele noi și promoțiile de preț.'
          : 'We conduct daily market checks to monitor availability, new model launches and price promotions.',
        best_of: language === 'RO' ? 'Cel mai bun' : 'The best',
        affiliate_button_text: language === 'RO' ? 'Vezi detalii produs' : 'Check Price',
        show_reviews: true,
        status: 'scheduled'
      }));
    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const generateSlug = (title: string, language: 'EN' | 'RO'): string => {
    let cleanTitle = title;
    if (language === 'RO') {
      cleanTitle = cleanTitle.replace(/(?:din|în)\s+\d{4}/gi, '');
    } else {
      cleanTitle = cleanTitle.replace(/(?:in|from)\s+\d{4}/gi, '');
    }

    return cleanTitle
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
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
      const titleResponse = await generateAuthorContent(getTitlePrompt(), selectedModel);
      setFormData(prev => ({ ...prev, alternativeTitle: titleResponse.description.trim() }));

      const subtitleResponse = await generateAuthorContent(getSubtitlePrompt(), selectedModel);
      setFormData(prev => ({ ...prev, subtitle: subtitleResponse.description.trim() }));
    } catch (error) {
      console.error('Error generating title/subtitle:', error);
    }
  };

  const getIntroPrompt = () => {
    const basePrompt = siteLanguage === 'RO'
      ? `Vreau să generezi un paragraf introductiv (maxim 400 caractere). Folosește acest model: După o analiză amănunțită a ${Math.floor(Math.random() * 23) + 23} modele și peste ${Math.floor(Math.random() * 241) + 160} recenzii, am creat ghidul complet al ${formData.product_type} din ${new Date().getFullYear()}. Află acum care sunt cele mai bune produse și alege în cunoștință de cauză.`
      : `I want you to generate an introductory paragraph (maximum 400 characters). Use this model: After a thorough analysis of ${Math.floor(Math.random() * 23) + 23} models and over ${Math.floor(Math.random() * 241) + 160} reviews, we have created the complete guide of ${formData.product_type} from ${new Date().getFullYear()}. Find out now which are the best products and choose wisely.`;

    return basePrompt;
  };

  const handleGenerateIntro = async () => {
    try {
      setFormData(prev => ({ ...prev, introduction: 'Generating...' }));
      const result = await generateAuthorContent(getIntroPrompt(), selectedModel);
      setFormData(prev => ({ ...prev, introduction: result.description }));
    } catch (error) {
      console.error('Error generating introduction:', error);
      setFormData(prev => ({ ...prev, introduction: '' }));
    }
  };

  const getAdditionalContentPrompt = () => {
    const basePrompt = siteLanguage === 'RO'
      ? `Vreau să generezi o secțiune formată din mai multe paragrafe, care să prezinte "Principalele criterii de alegere pentru ${formData.product_type}". Vreau ca textul generat să fie generat cu tag-uri HTML și să aibă forma: <h2>Titlu</h2> <h3>Subtitlu1</h3><p>Paragraf1</p> <h3>Subtitlu2</h3><p>Paragraf2</p> etc.`
      : `I want you to generate a section consisting of several paragraphs, which presents "The main criteria for choosing ${formData.product_type}". I want the text generated by AI to be generated with HTML tags and to have the form: <h2>Title</h2> <h3>Subtitle1</h3><p>Paragraph1</p> <h3>Subtitle2</h3><p>Paragraph2</p> etc.`;

    return basePrompt;
  };

  const handleGenerateAdditionalContent = async () => {
    try {
      setFormData(prev => ({ ...prev, additionalContent: 'Generating...' }));
      const result = await generateAuthorContent(getAdditionalContentPrompt(), selectedModel);
      setFormData(prev => ({ ...prev, additionalContent: result.description }));
    } catch (error) {
      console.error('Error generating additional content:', error);
      setFormData(prev => ({ ...prev, additionalContent: '' }));
    }
  };

  const getFaqPrompt = () => {
    const basePrompt = siteLanguage === 'RO'
      ? `Vreau să generezi o secțiune formată din mai multe paragrafe scurte, care să prezinte "Întrebări frecvente despre ${formData.product_type}". Vreau ca textul generat să fie generat cu tag-uri HTML și să aibă forma: <h2>Întrebări frecvente</h2> <h3>Întrebare1</h3><p>Răspuns1</p> <h3>Întrebare2</h3><p>Răspuns2</p> etc.`
      : `I want you to generate a section consisting of several short paragraphs, which presents "Frequently asked questions about ${formData.product_type}". I want the text generated by AI to be generated with HTML tags and to have the form: <h2>FAQ</h2> <h3>Question1</h3><p>Answer1</p> <h3>Question2</h3><p>Answer2</p> etc.`;

    return basePrompt;
  };

  const handleGenerateFaq = async () => {
    try {
      setFormData(prev => ({ ...prev, faq: 'Generating...' }));
      const result = await generateAuthorContent(getFaqPrompt(), selectedModel);
      setFormData(prev => ({ ...prev, faq: result.description }));
    } catch (error) {
      console.error('Error generating FAQ:', error);
      setFormData(prev => ({ ...prev, faq: '' }));
    }
  };

  const getConclusionPrompt = () => {
    const basePrompt = siteLanguage === 'RO'
      ? `Vreau să generezi o secțiune formată dintr-un paragraf, care să prezinte "Concluzia despre topul creat cu ${formData.product_type}". Vreau ca textul generat să fie generat cu tag-uri HTML și să aibă forma: <h2>Concluzie</h2> <p>ParagrafConcluzie</p>`
      : `I want you to generate a section consisting of a single paragraph, which presents "Conclusions regarding ranking created with ${formData.product_type}". I want the text generated by AI to be generated with HTML tags and to have the form: <h2>Conclusion</h2> <p>ConclusionParagraph</p>`;

    return basePrompt;
  };

  const handleGenerateConclusion = async () => {
    try {
      setFormData(prev => ({ ...prev, conclusion: 'Generating...' }));
      const result = await generateAuthorContent(getConclusionPrompt(), selectedModel);
      setFormData(prev => ({ ...prev, conclusion: result.description }));
    } catch (error) {
      console.error('Error generating conclusion:', error);
      setFormData(prev => ({ ...prev, conclusion: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!connectionString) {
        throw new Error('No database connection found');
      }

      const urlSlug = formData.url || generateSlug(formData.title, siteLanguage);

      await createArticle(connectionString, {
        type_id: 'MP_T10', // Get this from your article_types table
        category_id: formData.category_id,
        author_id: formData.author_id,
        title: formData.title,
        slug: urlSlug,
        subtitle: formData.subtitle,
        intro_text: formData.introduction,
        additional_content: formData.additionalContent,
        faq: formData.faq,
        conclusion: formData.conclusion,
        status: formData.status,
        show_reviews: formData.show_reviews,
        affiliate_button_text: formData.affiliate_button_text,
        best_of_prefix: formData.best_of,
        product_type: formData.product_type,
        disclosure: formData.disclosure
      });

      // Close modal or redirect
      onSubmit(formData);
    } catch (error) {
      console.error('Error saving article:', error);
      // Show error message to user
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Article Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Article URL
        </label>
        <input
          type="text"
          name="url"
          value={formData.url}
          onChange={handleInputChange}
          placeholder="Leave empty to generate from title"
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Title/Subtitle Generator */}
      <div className="space-y-4 border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-white">Generate Title & Subtitle</h3>

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
            onClick={handleGenerateTitleSubtitle}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Generate
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Article Title (alternative)
          </label>
          <input
            type="text"
            name="alternativeTitle"
            value={formData.alternativeTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Article Subtitle
          </label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            <option value="">Select category</option>
            {organizeCategories(categories).map(parent => (
              <React.Fragment key={parent.id}>
                <option
                  value={parent.id}
                  disabled
                  className="bg-gray-600 text-gray-200 border-b border-gray-900"
                >
                  {parent.name}
                </option>
                {parent.subcategories.map(sub => (
                  <option
                    key={sub.id}
                    value={sub.id}
                    className="pl-4 border-b border-gray-900"
                  >
                    {`:: ${sub.name}`}
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
            name="author_id"
            value={formData.author_id}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Best of
          </label>
          <select
            name="best_of"
            value={formData.best_of}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          >
            {siteLanguage === 'RO' ? (
              <>
                <option value="Cel mai bun">Cel mai bun</option>
                <option value="Cea mai bună">Cea mai bună</option>
              </>
            ) : (
              <option value="The best">The best</option>
            )}
          </select>
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
          onChange={(e) => setFormData(prev => ({ ...prev, show_reviews: e.target.value === 'Yes' }))}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Publication Status
      </label>
      <select
        name="status"
        value={formData.status}
        onChange={handleInputChange}
        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        required
      >
        <option value="published">Published</option>
        <option value="scheduled">Scheduled</option>
        <option value="paused">Paused</option>
      </select>
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
          Generate Additional Content
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
      <h3 className="text-lg font-medium text-white">Generate FAQ</h3>

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
          FAQ
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
      <h3 className="text-lg font-medium text-white">Generate Conclusion</h3>

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
          Conclusion
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

    <div className="flex justify-end pt-6">
      <button
        type="submit"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Save Article
      </button>
    </div>
  </form>
);
};

export default ArticleDataTab;
