import React from 'react';

interface SeoSocialTabProps {
  initialData?: any;
}

const SeoSocialTab: React.FC<SeoSocialTabProps> = ({ initialData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">SEO & Social Media</h3>
    </div>
  );
};

export default SeoSocialTab;