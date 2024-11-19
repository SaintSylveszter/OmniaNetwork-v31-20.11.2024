import React, { useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
}

const initialArticles: Article[] = [
  { id: '1', title: 'Top 10 Gadgets of 2023', author: 'John Doe', category: 'Technology', date: '2023-05-15' },
  { id: '2', title: 'The Future of Smart Homes', author: 'Jane Smith', category: 'Home Automation', date: '2023-05-10' },
  { id: '3', title: 'Best Budget Smartphones', author: 'Mike Johnson', category: 'Smartphones', date: '2023-05-05' },
];

const ArticleList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const deleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Articles</h2>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
          <Plus className="mr-2" size={20} />
          Add New Article
        </button>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap">{article.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{article.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">{article.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{article.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                    <Edit className="inline-block" size={18} />
                  </button>
                  <button onClick={() => deleteArticle(article.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="inline-block" size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleList;