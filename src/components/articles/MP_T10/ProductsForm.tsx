import React, { useState } from 'react';

interface ProductsFormProps {
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

const ProductsForm: React.FC<ProductsFormProps> = ({ onSubmit, onClose }) => {
  // Products form implementation will be added in the next iteration
  return (
    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
      Products form coming soon...
    </div>
  );
};

export default ProductsForm;