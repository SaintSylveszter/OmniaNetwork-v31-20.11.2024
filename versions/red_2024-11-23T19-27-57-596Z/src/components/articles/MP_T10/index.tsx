import React from 'react';
import BaseArticleForm from '../common/BaseArticleForm';

interface MP_T10Props {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
  initialData?: any;
}

const MP_T10: React.FC<MP_T10Props> = ({ onSubmit, onClose, initialData }) => {
  return <BaseArticleForm onSubmit={onSubmit} onClose={onClose} initialData={initialData} />;
};

export default MP_T10;