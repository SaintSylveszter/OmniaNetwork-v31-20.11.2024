import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getConnection } from '../../lib/db/connections';
import sql from '../../lib/db/neon';
import ArticleModal from '../modals/ArticleModal';

interface Article {
  id: string;
  type_id: string;
  type_code: string;
  category_id: string;
  author_id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  show_reviews: boolean;
  affiliate_button_text: string;
  best_of_prefix: string;
  product_type: string;
  disclosure: string;
  meta_title: string;
  meta_description: string;
  og_title: string;
  og_description: string;
  published_at: string | null;
}

const EditArticle: React.FC = () => {
  const { adminName, articleId } = useParams<{ adminName: string; articleId: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (adminName && articleId) {
      loadArticle();
    }
  }, [adminName, articleId]);

  const loadArticle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get connection string for the site
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string 
        FROM admins 
        WHERE username = ${adminName}
        AND status = 'active'
        LIMIT 1
      `;

      if (!admin?.connection_string) {
        throw new Error('No database connection found for this site');
      }

      // Get article data
      const siteDb = getConnection(admin.connection_string);
      const [article] = await siteDb<Article[]>`
        SELECT 
          a.*,
          at.code as type_code
        FROM articles a
        JOIN article_types at ON a.type_id = at.id
        WHERE a.id = ${articleId}
      `;

      if (!article) {
        throw new Error('Article not found');
      }

      setArticle(article);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error loading article:', err);
      setError(err instanceof Error ? err.message : 'Failed to load article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      // Update article logic will be handled by the modal
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error updating article:', err);
      setError(err instanceof Error ? err.message : 'Failed to update article');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-4 rounded-lg">
          Article not found
        </div>
      </div>
    );
  }

  return (
    <>
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Edit Article"
        article={article}
        selectedType={article.type_code}
      />
    </>
  );
};

export default EditArticle;