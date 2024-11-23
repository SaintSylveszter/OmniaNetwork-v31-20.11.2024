import React from 'react';

interface AdvertisingBlockProps {
  title: string;
  buttonText: string;
  affiliateUrl: string;
  className?: string;
}

const AdvertisingBlock: React.FC<AdvertisingBlockProps> = ({
  title,
  buttonText,
  affiliateUrl,
  className = ''
}) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <a
        href={affiliateUrl}
        target="_blank"
        rel="nofollow noopener noreferrer"
        className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        {buttonText}
      </a>
    </div>
  );
};

export default AdvertisingBlock;