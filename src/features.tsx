import React from 'react';
import { BarChart2, Anchor, Clock, Box } from 'lucide-react';
import FeatureCard from './featurecard'; // Adjust path as needed


const Features: React.FC = () => {
  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          icon={BarChart2} 
          title="Dual SKU Forecasting" 
          description="Predict demand for two SKUs simultaneously, allowing for comprehensive inventory management."
        />
        <FeatureCard 
          icon={Anchor} 
          title="Sailing Time Integration" 
          description="Factor in actual shipping durations for more accurate lead time predictions."
        />
        <FeatureCard 
          icon={Clock} 
          title="Port Delay Adjustment" 
          description="Account for potential delays at ports to refine your supply chain expectations."
        />
        <FeatureCard 
          icon={Box} 
          title="Flexible Forecasting" 
          description="Choose your forecast period to align with your specific business needs and planning cycles."
        />
      </div>
    </section>
  );
};

export default Features;