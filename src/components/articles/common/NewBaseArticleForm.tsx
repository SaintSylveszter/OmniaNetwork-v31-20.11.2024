import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import toast from 'react-hot-toast';
import { createNewArticle } from '../../../lib/api/articlesNew';
import sql from '../../../lib/db/neon';
import GeneralInfoTab from './tabs/GeneralInfoTab';
import ImagesTab from './tabs/ImagesTab';
import SeoSocialTab from './tabs/SeoSocialTab';
import ReviewPublishTab from './tabs/ReviewPublishTab';

interface FormData {
  article_type_id: number | null;
  category_id: number | null;
  author_id: number | null;
  title: string;
  slug: string;
  subtitle: string;
  status: string;
  display_order: number;
}

interface NewArticleFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  initialData?: { 
    article_type_id: number
  };
}

const NewBaseArticleForm: React.FC<NewArticleFormProps> = ({ 
  onSubmit, 
  onClose, 
  initialData 
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
  article_type_id: initialData?.article_type_id || null,
  category_id: '',
  author_id: '',
  title: '',        // asigurăm valoare inițială goală
  slug: '',         // asigurăm valoare inițială goală
  subtitle: '',     // asigurăm valoare inițială goală
  status: 'SCH',
  display_order: 0
});

  type FormField = keyof FormData;
  
  const handleFormUpdate = (field: FormField, value: string | number) => {
    console.log('Updating form:', field, value);
    setFormData(prev => {
      const newState = { ...prev, [field]: value };
      console.log('New form state:', newState);
      return newState;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Saving article...');

      const adminName = window.location.pathname.split('/')[1];
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string
        FROM admins
        WHERE username = ${adminName}
        AND status = 'active'
      `;

      if (!admin?.connection_string) {
        throw new Error('No database connection found');
      }

      // Validări pentru câmpurile obligatorii
      if (!formData.article_type_id) {
        toast.error('Article type is required');
        return;
      }
      if (!formData.title) {
        toast.error('Title is required');
        return;
      }
      if (!formData.slug) {
        toast.error('URL slug is required');
        return;
      }
      if (!formData.category_id) {
        toast.error('Category is required');
        return;
      }
      if (!formData.author_id) {
        toast.error('Author is required');
        return;
      }

      const articleData = {
        article_type_id: Number(formData.article_type_id),
        category_id: Number(formData.category_id),
        author_id: Number(formData.author_id),
        title: formData.title,
        slug: formData.slug,
        subtitle: formData.subtitle,
        status: formData.status,
        display_order: formData.display_order
      };

      console.log('Submit Data Details:', articleData);

      const result = await createNewArticle(admin.connection_string, articleData);
      
      toast.dismiss(loadingToast);
      toast.success('Article saved successfully!');
      
      await onSubmit(result);
      onClose();
    } catch (error: any) {
      console.error('Error saving article:', error);
      toast.error(error.message || 'Error saving article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { 
      name: 'General Info', 
      component: <GeneralInfoTab 
        formData={formData}
        onUpdateForm={handleFormUpdate}
        siteLanguage="EN"
      /> 
    },
    { 
      name: 'Images', 
      component: <ImagesTab /> 
    },
    { 
      name: 'SEO & Social', 
      component: <SeoSocialTab /> 
    },
    { 
      name: 'Review & Publish', 
      component: <ReviewPublishTab /> 
    }
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
          <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                className={({ selected }) =>
                  `px-4 py-2 text-sm font-medium border-b-2 focus:outline-none ${
                    selected
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`
                }
              >
                {tab.name}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {tabs.map((tab, idx) => (
              <Tab.Panel key={idx} className="pt-4">
                {tab.component}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewBaseArticleForm;