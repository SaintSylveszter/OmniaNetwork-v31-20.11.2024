import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import OldArticleModal from './modals/ArticleModal';
import ArticleModal from './articles/common/modals/ArticleModal';
import ArticleTypeSelectorModal from "./articles/common/modals/ArticleTypeSelectorModal";
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import type { Article } from '../types/database';

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
  try {
    setIsLoading(true);
    const adminName = window.location.pathname.split('/')[1];
    const [admin] = await sql<[{ connection_string: string }]>`
      SELECT connection_string
      FROM admins
      WHERE username = ${adminName}
      AND status = 'active'
    `;

    if (!admin?.connection_string) {
      setIsLoading(false);
      return;
    }

    setConnectionString(admin.connection_string);
    const siteDb = getConnection(admin.connection_string);

    const articles = await siteDb<Article[]>`
      SELECT
        a.id,
        a.title,
        a.article_type_id,
        at.article_type as type_name,
        a.status,
        c.name as category_name,
        au.name as author_name
      FROM articles a
      LEFT JOIN categories c ON c.id = a.category_id
      LEFT JOIN article_types at ON at.id = a.article_type_id
      LEFT JOIN authors au ON au.id = a.author_id
      ORDER BY a.created_at DESC
    `;

      // Group sections and products by article
      const processedArticles = articles.reduce((acc, article) => {
        const existingArticle = acc.find(a => a.id === article.id);
        if (!existingArticle) {
          // Create new article entry
          acc.push({
            ...article,
            sections: article.section_content ? [{
              title: article.subtitle,
              content: article.section_content
            }] : [],
            products: article.product_name ? [{
              name: article.product_name,
              image_url: article.product_image,
              description: article.product_description,
              pros: article.pros,
              cons: article.cons,
              affiliate_url: article.affiliate_url,
              brand_affiliate_url: article.brand_affiliate_url,
              rating: article.rating,
              display_order: article.display_order
            }] : []
          });
        } else {
          // Add to existing article
          if (article.section_content) {
            existingArticle.sections.push({
              title: article.subtitle,
              content: article.section_content
            });
          }
          if (article.product_name) {
            existingArticle.products.push({
              name: article.product_name,
              image_url: article.product_image,
              description: article.product_description,
              pros: article.pros,
              cons: article.cons,
              affiliate_url: article.affiliate_url,
              brand_affiliate_url: article.brand_affiliate_url,
              rating: article.rating,
              display_order: article.display_order
            });
          }
        }
        return acc;
      }, [] as Article[]);

      setArticles(processedArticles);
      setError(null);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (data: any) => {
    try {
      if (!connectionString) {
        throw new Error('No database connection');
      }

      const siteDb = getConnection(connectionString);

      // Create the article
      const [newArticle] = await siteDb`
        INSERT INTO articles ${siteDb(data, [
          'article_type_id',
          'category_id',
          'author_id',
          'title',
          'slug',
          'subtitle',
          'content',
          'status',
          'show_reviews',
          'affiliate_button_text',
          'best_of_prefix',
          'product_type',
          'disclosure'
        ])} RETURNING *
      `;

      // Add sections if any
      if (data.sections?.length) {
        await Promise.all(data.sections.map((section: any, index: number) =>
          siteDb`
            INSERT INTO article_mp_t10_sections (
              article_id,
              title,
              content,
              display_order
            ) VALUES (
              ${newArticle.id},
              ${section.title},
              ${section.content},
              ${index * 10}
            )
          `
        ));
      }

      // Add products if any
      if (data.products?.length) {
        await Promise.all(data.products.map((product: any, index: number) =>
          siteDb`
            INSERT INTO article_mp_t10_products (
              article_id,
              name,
              image_url,
              description,
              pros,
              cons,
              affiliate_url,
              brand_affiliate_url,
              rating,
              display_order
            ) VALUES (
              ${newArticle.id},
              ${product.name},
              ${product.image_url},
              ${product.description},
              ${JSON.stringify(product.pros)}::jsonb,
              ${JSON.stringify(product.cons)}::jsonb,
              ${product.affiliate_url},
              ${product.brand_affiliate_url},
              ${product.rating},
              ${index * 10}
            )
          `
        ));
      }

      await loadArticles();
      setIsAddModalOpen(false);
      setSelectedArticleType('');
    } catch (err) {
      console.error('Error adding article:', err);
      setError('Failed to add article');
    }
  };

  const handleEdit = async (data: any) => {
    try {
      if (!connectionString || !selectedArticle) {
        throw new Error('Missing required data');
      }

      const siteDb = getConnection(connectionString);

      // Update the article
      await siteDb`
        UPDATE articles SET ${siteDb(data, [
          'article_type_id',
          'category_id',
          'author_id',
          'title',
          'slug',
          'subtitle',
          'content',
          'status',
          'show_reviews',
          'affiliate_button_text',
          'best_of_prefix',
          'product_type',
          'disclosure'
        ])}
        WHERE id = ${selectedArticle.id}
      `;

      // Update sections
      if (data.sections?.length) {
        // Delete existing sections
        await siteDb`
          DELETE FROM article_mp_t10_sections
          WHERE article_id = ${selectedArticle.id}
        `;

        // Insert new sections
        await Promise.all(data.sections.map((section: any, index: number) =>
          siteDb`
            INSERT INTO article_mp_t10_sections (
              article_id,
              title,
              content,
              display_order
            ) VALUES (
              ${selectedArticle.id},
              ${section.title},
              ${section.content},
              ${index * 10}
            )
          `
        ));
      }

      // Update products
      if (data.products?.length) {
        // Delete existing products
        await siteDb`
          DELETE FROM article_mp_t10_products
          WHERE article_id = ${selectedArticle.id}
        `;

        // Insert new products
        await Promise.all(data.products.map((product: any, index: number) =>
          siteDb`
            INSERT INTO article_mp_t10_products (
              article_id,
              name,
              image_url,
              description,
              pros,
              cons,
              affiliate_url,
              brand_affiliate_url,
              rating,
              display_order
            ) VALUES (
              ${selectedArticle.id},
              ${product.name},
              ${product.image_url},
              ${product.description},
              ${JSON.stringify(product.pros)}::jsonb,
              ${JSON.stringify(product.cons)}::jsonb,
              ${product.affiliate_url},
              ${product.brand_affiliate_url},
              ${product.rating},
              ${index * 10}
            )
          `
        ));
      }

      await loadArticles();
      setIsEditModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      console.error('Error updating article:', err);
      setError('Failed to update article');
    }
  };

  const handleDelete = async () => {
    try {
      if (!connectionString || !selectedArticle) {
        throw new Error('No article selected');
      }

      const siteDb = getConnection(connectionString);
      await siteDb`DELETE FROM articles WHERE id = ${selectedArticle.id}`;

      await loadArticles();
      setIsDeleteModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading articles...</div>
      </div>
    );
  }

  return (
    <div>  {/* Div părinte care învelește tot */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Articles</h2>
      <button
        onClick={() => setIsTypeSelectorOpen(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
        <Plus size={20} />
        <span>Add Article</span>
      </button>
      <button
        onClick={() => setIsNewArticleModalOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
        <Plus size={20} />
        <span>Add New Article</span>
      </button>
    </div>

    {error && (
      <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
        {error}
      </div>
    )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No articles found. Add your first article using the button above.
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{article.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{article.type_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{article.category_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{article.author_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{article.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        console.log('Selected article data:', article); // Log înainte de setare
                        setSelectedArticle(article);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedArticle(article);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ArticleTypeSelectorModal
        isOpen={isTypeSelectorOpen}
        onClose={() => setIsTypeSelectorOpen(false)}
        onSelect={(typeId: number) => {
          console.log('Type ID received in Articles:', typeId, typeof typeId);
          setSelectedType(typeId);
          setIsAddModalOpen(true);
        }}
        connectionString={connectionString}
      />

      <ArticleModal
        isOpen={isNewArticleModalOpen}
        onClose={() => setIsNewArticleModalOpen(false)}
        onSubmit={async (data) => {
          try {
            console.log('New article data:', data);
            await loadArticles(); // Reîncărcăm lista după adăugare
            setIsNewArticleModalOpen(false); // Închidem modalul
          } catch (error) {
            console.error('Error handling new article:', error);
          }
        }}
        title="Add New Article"
        connectionString={connectionString}
      />

      {selectedArticle && (
        <>
          <ArticleModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedArticle(null);
            }}
            onSubmit={handleEdit}
            title="Edit Article"
            article={selectedArticle}
            connectionString={connectionString}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedArticle(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedArticle.title}
            type="article"
          />
        </>
      )}

    </div>
  );
};

export default Articles;
