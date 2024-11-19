import React from 'react';

interface ReviewPublishTabProps {
  initialData?: any;
}

const ReviewPublishTab: React.FC<ReviewPublishTabProps> = ({ initialData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Review & Publish</h3>
    </div>
  );
};

export default ReviewPublishTab;