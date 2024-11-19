import React from 'react';

interface ImagesTabProps {
  initialData?: any;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ initialData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Images</h3>
    </div>
  );
};

export default ImagesTab;