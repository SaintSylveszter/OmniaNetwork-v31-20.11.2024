import React from 'react';

interface Reference {
  id: string;
  title: string;
  url: string;
  author?: string;
  date?: string;
}

interface ReferencesBlockProps {
  references: Reference[];
  className?: string;
}

const ReferencesBlock: React.FC<ReferencesBlockProps> = ({ references, className = '' }) => {
  if (references.length === 0) return null;

  return (
    <div className={`border-t border-gray-700 pt-6 mt-8 ${className}`}>
      <h2 className="text-2xl font-bold text-white mb-4">References</h2>
      <ul className="space-y-3">
        {references.map((ref) => (
          <li key={ref.id} className="text-gray-300">
            <a
              href={ref.url}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {ref.title}
            </a>
            {(ref.author || ref.date) && (
              <span className="text-gray-500 text-sm">
                {ref.author && <span> by {ref.author}</span>}
                {ref.date && <span> ({ref.date})</span>}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferencesBlock;