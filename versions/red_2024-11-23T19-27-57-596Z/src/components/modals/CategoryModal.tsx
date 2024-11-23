import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Switch } from '@headlessui/react';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  category?: any;
  parentCategory?: any;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  category,
  parentCategory
}) => {
  const [formData, setFormData] = useState({
    parent_id: '',
    name: '',
    url_slug: '',
    subtitle: '',
    description: '',
    meta_description: '',
    is_active: true
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        parent_id: category?.parent_id || '',
        name: category?.name || '',
        url_slug: category?.url_slug || '',
        subtitle: category?.subtitle || '',
        description: category?.description || '',
        meta_description: category?.meta_description || '',
        is_active: category?.is_active ?? true
      });
    }
  }, [category, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      parent_id: parentCategory?.id || null
    });
  };

  if (!isOpen) return null;

  const inputClasses = "col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white";
  const labelClasses = "text-sm font-medium text-gray-700 dark:text-gray-300";
  const textareaClasses = `${inputClasses} min-h-[100px] resize-y`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {category ? 'Edit Category' : parentCategory ? 'Add Subcategory' : 'Add New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {parentCategory && (
              <div className="grid grid-cols-4 gap-4 items-center mb-6">
                <label className={labelClasses}>Parent Category</label>
                <div className="col-span-3 text-lg font-medium text-gray-900 dark:text-white">
                  {parentCategory.name}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="name" className={labelClasses}>
                Category Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className={inputClasses}
                required
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="url_slug" className={labelClasses}>
                URL Slug
              </label>
              <input
                type="text"
                id="url_slug"
                value={formData.url_slug}
                onChange={(e) => setFormData(prev => ({ ...prev, url_slug: e.target.value }))}
                className={inputClasses}
                placeholder="Leave empty to auto-generate from name"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="subtitle" className={labelClasses}>
                Subtitle
              </label>
              <input
                type="text"
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                className={inputClasses}
                maxLength={300}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-start">
              <label htmlFor="description" className={`${labelClasses} pt-2`}>
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={textareaClasses}
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-start">
              <label htmlFor="meta_description" className={`${labelClasses} pt-2`}>
                Meta Description
              </label>
              <textarea
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                className={`${textareaClasses} ${
                  formData.meta_description.length < 120 || formData.meta_description.length > 158
                    ? 'border-red-300 dark:border-red-500'
                    : ''
                }`}
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-start-2 col-span-3">
                <p className={`text-sm ${
                  formData.meta_description.length < 120 || formData.meta_description.length > 158
                    ? 'text-red-500'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {formData.meta_description.length} characters (ideal: 120-158)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label className={labelClasses}>
                Status
              </label>
              <div className="col-span-3 flex items-center">
                <Switch
                  checked={formData.is_active}
                  onChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  className={`${
                    formData.is_active ? 'bg-green-600' : 'bg-red-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-3`}
                >
                  <span
                    className={`${
                      formData.is_active ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {category ? 'Save Changes' : parentCategory ? 'Add Subcategory' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;