import React, { ReactNode } from 'react';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description?: string; // Optional, if you need it for other use cases
  children?: ReactNode; // This allows the component to accept children
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Icon className="w-8 h-8 text-blue-500 mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default FeatureCard;