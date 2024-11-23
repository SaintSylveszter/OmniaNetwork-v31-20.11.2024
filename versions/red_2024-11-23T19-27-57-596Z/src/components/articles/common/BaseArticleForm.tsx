import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import ArticleDataTab from '../MP_T10/ArticleDataTab';
import ProductsTab from '../MP_T10/ProductsTab';
import ImagesTab from '../MP_T10/ImagesTab';
import SeoSocialTab from '../MP_T10/SeoSocialTab';

interface ArticleFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  initialData?: any;
}

const BaseArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [selectedTab, setSelectedTab] = useState(0);

const tabs = [
    { name: 'Article', component: <ArticleDataTab onSubmit={onSubmit} /> },
    { name: 'Images', component: <ImagesTab /> },
    { name: 'SEO & Social Media', component: <SeoSocialTab /> },
    { name: 'Products', component: <ProductsTab /> },
];

  return (
    <div className="space-y-6">
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
            <Tab.Panel key={idx}>
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BaseArticleForm;