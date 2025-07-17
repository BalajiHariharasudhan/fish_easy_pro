import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoadingSpinner: React.FC = () => {
  const { isLoading } = useAuth();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;