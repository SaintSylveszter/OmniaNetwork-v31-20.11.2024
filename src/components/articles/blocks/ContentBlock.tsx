import React from 'react';

interface ContentBlockProps {
  content: string;
  className?: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ content, className = '' }) => {
  return (
    <div 
      className={`prose prose-lg dark:prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ContentBlock;